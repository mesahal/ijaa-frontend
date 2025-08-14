import apiClient from '../../utils/apiClient';
import sessionManager from '../../utils/sessionManager';

// Mock sessionManager
jest.mock('../../utils/sessionManager');

// Mock fetch
global.fetch = jest.fn();

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('Configuration', () => {
    test('should use default API base URL when environment variable is not set', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      delete process.env.REACT_APP_API_BASE_URL;

      expect(apiClient.getBaseUrl()).toBe('http://localhost:8000/ijaa/api/v1/user');

      // Restore environment variable
      if (originalEnv) {
        process.env.REACT_APP_API_BASE_URL = originalEnv;
      }
    });

    test('should use environment variable for API base URL', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      process.env.REACT_APP_API_BASE_URL = 'https://custom-api.com';

      expect(apiClient.getBaseUrl()).toBe('https://custom-api.com');

      // Restore environment variable
      if (originalEnv) {
        process.env.REACT_APP_API_BASE_URL = originalEnv;
      } else {
        delete process.env.REACT_APP_API_BASE_URL;
      }
    });
  });

  describe('GET Requests', () => {
    test('should make GET request without authentication', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should make GET request with authentication', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');

      const result = await apiClient.get('/test-endpoint', { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should include X-USER_ID header for authenticated requests', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');
      sessionManager.getUserEmail.mockReturnValue('test@example.com');

      const result = await apiClient.get('/test-endpoint', { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token',
            'X-USER_ID': expect.any(String)
          })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should handle GET request with query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint', {
        params: { page: 1, limit: 10, search: 'test' }
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint?page=1&limit=10&search=test'),
        expect.any(Object)
      );
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('POST Requests', () => {
    test('should make POST request without authentication', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-endpoint', { test: 'data' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ test: 'data' })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should make POST request with authentication', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');

      const result = await apiClient.post('/test-endpoint', { test: 'data' }, { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          }),
          body: JSON.stringify({ test: 'data' })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should handle POST request with FormData', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('file', new Blob(['test']));
      formData.append('name', 'test-file');

      const result = await apiClient.post('/upload', formData, { isFormData: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/upload'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.not.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: formData
        })
      );
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('PUT Requests', () => {
    test('should make PUT request', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.put('/test-endpoint', { test: 'data' });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ test: 'data' })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should make PUT request with authentication', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');

      const result = await apiClient.put('/test-endpoint', { test: 'data' }, { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          }),
          body: JSON.stringify({ test: 'data' })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('DELETE Requests', () => {
    test('should make DELETE request', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.delete('/test-endpoint');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should make DELETE request with authentication', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');

      const result = await apiClient.delete('/test-endpoint', { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
      expect(result).toEqual({ data: 'test' });
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Network error');
    });

    test('should handle HTTP error responses', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Resource not found' })
      };
      fetch.mockResolvedValue(mockResponse);

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('HTTP error! status: 404');
    });

    test('should handle authentication errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: () => Promise.resolve({ message: 'Invalid token' })
      };
      fetch.mockResolvedValue(mockResponse);

      await expect(apiClient.get('/test-endpoint', { requireAuth: true })).rejects.toThrow('HTTP error! status: 401');
    });

    test('should handle malformed JSON responses', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      };
      fetch.mockResolvedValue(mockResponse);

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Invalid JSON');
    });

    test('should handle missing token for authenticated requests', async () => {
      sessionManager.getUserToken.mockReturnValue(null);

      await expect(apiClient.get('/test-endpoint', { requireAuth: true })).rejects.toThrow('No authentication token available');
    });
  });

  describe('Authentication Headers', () => {
    test('should include Authorization header when token is available', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');

      await apiClient.get('/test-endpoint', { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
    });

    test('should include X-USER_ID header with base64 encoded user context', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');
      sessionManager.getUserEmail.mockReturnValue('test@example.com');

      await apiClient.get('/test-endpoint', { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-USER_ID': expect.any(String)
          })
        })
      );

      // Verify the X-USER_ID header is base64 encoded
      const callArgs = fetch.mock.calls[0];
      const headers = callArgs[1].headers;
      const xUserIdHeader = headers['X-USER_ID'];
      
      // Decode base64 and verify it contains the expected JSON
      const decoded = atob(xUserIdHeader);
      const userContext = JSON.parse(decoded);
      expect(userContext).toHaveProperty('username');
    });

    test('should handle missing user email for X-USER_ID header', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);
      sessionManager.getUserToken.mockReturnValue('mock-jwt-token');
      sessionManager.getUserEmail.mockReturnValue(null);

      await apiClient.get('/test-endpoint', { requireAuth: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      );
    });
  });

  describe('Query Parameters', () => {
    test('should handle empty query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint', { params: {} });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.any(Object)
      );
    });

    test('should handle query parameters with special characters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint', {
        params: { search: 'test@example.com', query: 'hello world' }
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint?search=test%40example.com&query=hello%20world'),
        expect.any(Object)
      );
    });

    test('should handle null and undefined query parameters', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint', {
        params: { valid: 'test', nullValue: null, undefinedValue: undefined }
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint?valid=test'),
        expect.any(Object)
      );
    });
  });

  describe('FormData Handling', () => {
    test('should handle FormData requests correctly', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('file', new Blob(['test content']));
      formData.append('description', 'test file');

      await apiClient.post('/upload', formData, { isFormData: true });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/upload'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.not.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: formData
        })
      );
    });

    test('should not set Content-Type header for FormData', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('test', 'value');

      await apiClient.post('/upload', formData, { isFormData: true });

      const callArgs = fetch.mock.calls[0];
      const headers = callArgs[1].headers;
      
      expect(headers).not.toHaveProperty('Content-Type');
    });
  });

  describe('Edge Cases', () => {
    test('should handle requests with no options', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(result).toEqual({ data: 'test' });
    });

    test('should handle requests with empty body', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-endpoint', null);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(null)
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should handle requests with undefined body', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-endpoint', undefined);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(undefined)
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    test('should handle requests with complex objects in body', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' })
      };
      fetch.mockResolvedValue(mockResponse);

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

      await apiClient.post('/test-endpoint', complexData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(complexData)
        })
      );
    });
  });

  describe('Response Handling', () => {
    test('should handle empty response body', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve(null)
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(result).toBeNull();
    });

    test('should handle response with status 204 (No Content)', async () => {
      const mockResponse = {
        ok: true,
        status: 204,
        json: () => Promise.resolve(null)
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.delete('/test-endpoint');

      expect(result).toBeNull();
    });

    test('should handle response with custom headers', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
        headers: new Headers({
          'X-Custom-Header': 'custom-value',
          'Content-Type': 'application/json'
        })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(result).toEqual({ data: 'test' });
    });
  });
}); 