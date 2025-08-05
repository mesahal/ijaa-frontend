import { getAuthHeaders, makeApiRequest } from '../../utils/apiClient';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-token');
  });

  describe('getAuthHeaders', () => {
    test('returns headers with token when user is authenticated', () => {
      const mockUser = {
        username: 'testuser',
        token: 'mock-token'
      };

      const headers = getAuthHeaders(mockUser);

      expect(headers).toEqual({
        'Authorization': 'Bearer mock-token',
        'Content-Type': 'application/json',
        'X-USER_ID': expect.any(String)
      });
    });

    test('returns headers without token when user is not authenticated', () => {
      const headers = getAuthHeaders(null);

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    test('returns headers without token when user has no token', () => {
      const mockUser = {
        username: 'testuser'
        // No token
      };

      const headers = getAuthHeaders(mockUser);

      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    test('includes X-USER_ID header with base64 encoded user context', () => {
      const mockUser = {
        username: 'testuser',
        token: 'mock-token'
      };

      const headers = getAuthHeaders(mockUser);

      expect(headers['X-USER_ID']).toBeDefined();
      
      // Decode the base64 string
      const decoded = JSON.parse(atob(headers['X-USER_ID']));
      expect(decoded).toEqual({ username: 'testuser' });
    });

    test('handles special characters in username', () => {
      const mockUser = {
        username: 'test.user@domain.com',
        token: 'mock-token'
      };

      const headers = getAuthHeaders(mockUser);

      const decoded = JSON.parse(atob(headers['X-USER_ID']));
      expect(decoded).toEqual({ username: 'test.user@domain.com' });
    });
  });

  describe('makeApiRequest', () => {
    test('makes successful GET request', async () => {
      const mockResponse = { data: 'test data' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await makeApiRequest('/test-endpoint', 'GET');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('makes successful POST request with data', async () => {
      const mockData = { name: 'test', email: 'test@example.com' };
      const mockResponse = { success: true };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await makeApiRequest('/test-endpoint', 'POST', mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mockData)
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('includes auth headers when user is provided', async () => {
      const mockUser = {
        username: 'testuser',
        token: 'mock-token'
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await makeApiRequest('/test-endpoint', 'GET', null, mockUser);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          headers: {
            'Authorization': 'Bearer mock-token',
            'Content-Type': 'application/json',
            'X-USER_ID': expect.any(String)
          }
        })
      );
    });

    test('handles network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(makeApiRequest('/test-endpoint', 'GET')).rejects.toThrow('Network error');
    });

    test('handles HTTP error responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Resource not found' })
      });

      await expect(makeApiRequest('/test-endpoint', 'GET')).rejects.toThrow('HTTP error! status: 404');
    });

    test('handles JSON parsing errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); }
      });

      await expect(makeApiRequest('/test-endpoint', 'GET')).rejects.toThrow('Invalid JSON');
    });

    test('uses correct base URL', async () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      process.env.REACT_APP_API_BASE_URL = 'http://localhost:8000';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await makeApiRequest('/test-endpoint', 'GET');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/test-endpoint',
        expect.any(Object)
      );

      process.env.REACT_APP_API_BASE_URL = originalEnv;
    });

    test('uses default base URL when environment variable is not set', async () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      delete process.env.REACT_APP_API_BASE_URL;

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await makeApiRequest('/test-endpoint', 'GET');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/ijaa/api/v1/user/test-endpoint',
        expect.any(Object)
      );

      process.env.REACT_APP_API_BASE_URL = originalEnv;
    });

    test('handles different HTTP methods', async () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      
      for (const method of methods) {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

        await makeApiRequest('/test-endpoint', method);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/test-endpoint'),
          expect.objectContaining({
            method: method
          })
        );
      }
    });

    test('handles null and undefined data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await makeApiRequest('/test-endpoint', 'POST', null);
      await makeApiRequest('/test-endpoint', 'POST', undefined);

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test('handles complex data objects', async () => {
      const complexData = {
        user: {
          name: 'Test User',
          email: 'test@example.com',
          preferences: {
            theme: 'dark',
            notifications: true
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await makeApiRequest('/test-endpoint', 'POST', complexData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          body: JSON.stringify(complexData)
        })
      );
    });
  });
}); 