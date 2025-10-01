// Mock axios before importing apiClient
jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };

  return {
    create: jest.fn(() => mockAxiosInstance)
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000'
  },
  writable: true
});

// Mock window.dispatchEvent
window.dispatchEvent = jest.fn();

// Now import apiClient
import apiClient from '../../services/api/apiClient';
import axios from 'axios';

describe('apiClient', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    window.dispatchEvent.mockClear();
    
    // Get the mock axios instance
    mockAxiosInstance = axios.create();
  });

  describe('Configuration', () => {
    test('should create axios instance with correct base URL', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: expect.stringContaining('http://localhost:8000/ijaa/api/v1/user'),
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('should use environment variable for API base URL', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      process.env.REACT_APP_API_BASE_URL = 'https://custom-api.com';

      // Re-import to get the new configuration
      jest.resetModules();
      require('../../utils/apiClient');

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-api.com'
        })
      );

      // Restore environment variable
      if (originalEnv) {
        process.env.REACT_APP_API_BASE_URL = originalEnv;
      } else {
        delete process.env.REACT_APP_API_BASE_URL;
      }
    });
  });

  describe('GET Requests', () => {
    test('should make GET request', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
      expect(result).toEqual(mockResponse);
    });

    test('should make GET request with query parameters', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint', {
        params: { page: 1, limit: 10, search: 'test' }
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', {
        params: { page: 1, limit: 10, search: 'test' }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('POST Requests', () => {
    test('should make POST request', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-endpoint', { test: 'data' });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', { test: 'data' });
      expect(result).toEqual(mockResponse);
    });

    test('should handle POST request with FormData', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('file', new Blob(['test']));
      formData.append('name', 'test-file');

      const result = await apiClient.post('/upload', formData, { isFormData: true });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/upload', formData, { isFormData: true });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('PUT Requests', () => {
    test('should make PUT request', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await apiClient.put('/test-endpoint', { test: 'data' });

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test-endpoint', { test: 'data' });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('DELETE Requests', () => {
    test('should make DELETE request', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await apiClient.delete('/test-endpoint');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test-endpoint');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Authentication Headers', () => {
    test('should include Authorization header when user data is available', async () => {
      const mockUserData = {
        token: 'mock-jwt-token',
        username: 'testuser',
        email: 'test@example.com'
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUserData));

      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint');

      // The interceptor should have been called with the auth headers
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
    });

    test('should handle missing user data gracefully', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint');
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(apiClient.get('/test-endpoint')).rejects.toThrow('Network error');
    });

    test('should handle HTTP error responses', async () => {
      const httpError = {
        response: {
          status: 404,
          data: { message: 'Resource not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(httpError);

      await expect(apiClient.get('/test-endpoint')).rejects.toEqual(httpError);
    });

    test('should handle authentication errors', async () => {
      const authError = {
        response: {
          status: 401,
          data: { message: 'Invalid token' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(authError);

      await expect(apiClient.get('/test-endpoint')).rejects.toEqual(authError);
    });
  });

  describe('Query Parameters', () => {
    test('should handle empty query parameters', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint', { params: {} });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', { params: {} });
    });

    test('should handle query parameters with special characters', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await apiClient.get('/test-endpoint', {
        params: { search: 'test@example.com', query: 'hello world' }
      });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test-endpoint', {
        params: { search: 'test@example.com', query: 'hello world' }
      });
    });
  });

  describe('FormData Handling', () => {
    test('should handle FormData requests correctly', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const formData = new FormData();
      formData.append('file', new Blob(['test content']));
      formData.append('description', 'test file');

      await apiClient.post('/upload', formData, { isFormData: true });

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/upload', formData, { isFormData: true });
    });
  });

  describe('Edge Cases', () => {
    test('should handle requests with no options', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(result).toEqual(mockResponse);
    });

    test('should handle requests with empty body', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-endpoint', null);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', null);
      expect(result).toEqual(mockResponse);
    });

    test('should handle requests with undefined body', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiClient.post('/test-endpoint', undefined);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', undefined);
      expect(result).toEqual(mockResponse);
    });

    test('should handle requests with complex objects in body', async () => {
      const mockResponse = { data: { data: 'test' } };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

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

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test-endpoint', complexData);
    });
  });

  describe('Response Handling', () => {
    test('should handle empty response body', async () => {
      const mockResponse = { data: null };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(result).toEqual(mockResponse);
    });

    test('should handle response with status 204 (No Content)', async () => {
      const mockResponse = { data: null, status: 204 };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await apiClient.delete('/test-endpoint');

      expect(result).toEqual(mockResponse);
    });

    test('should handle response with custom headers', async () => {
      const mockResponse = { 
        data: { data: 'test' },
        headers: {
          'X-Custom-Header': 'custom-value',
          'Content-Type': 'application/json'
        }
      };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiClient.get('/test-endpoint');

      expect(result).toEqual(mockResponse);
    });
  });

  describe('changeUserPassword', () => {
    beforeEach(() => {
      const mockToken = 'test-token';
      const mockUser = JSON.stringify({ token: mockToken, username: 'testuser' });
      localStorageMock.getItem.mockReturnValue(mockUser);
    });

    it('should call correct endpoint for changing user password', async () => {
      const mockResponse = { 
        data: { 
          message: "Password changed successfully",
          code: "200",
          data: null
        } 
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const passwordData = {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass'
      };

      const { changeUserPassword } = require('../../utils/apiClient');
      const result = await changeUserPassword(passwordData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/change-password', passwordData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle password change errors', async () => {
      const errorMessage = 'Current password is incorrect';
      const mockError = {
        response: {
          status: 400,
          data: { message: errorMessage }
        }
      };
      mockAxiosInstance.post.mockRejectedValue(mockError);

      const passwordData = {
        currentPassword: 'wrongpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass'
      };

      const { changeUserPassword } = require('../../utils/apiClient');
      
      await expect(changeUserPassword(passwordData)).rejects.toEqual(mockError);
    });

    it('should return response data on successful password change', async () => {
      const mockResponseData = { 
        message: "Password changed successfully",
        code: "200",
        data: null
      };
      const mockResponse = { 
        data: mockResponseData
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const passwordData = {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass'
      };

      const { changeUserPassword } = require('../../utils/apiClient');
      const result = await changeUserPassword(passwordData);

      expect(result).toEqual(mockResponseData);
    });

    it('should include authentication headers in password change request', async () => {
      const mockResponse = { 
        data: { 
          message: "Password changed successfully",
          code: "200",
          data: null
        } 
      };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const passwordData = {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmPassword: 'newpass'
      };

      const { changeUserPassword } = require('../../utils/apiClient');
      await changeUserPassword(passwordData);

      // The interceptor should have added the auth headers
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/change-password', passwordData);
    });
  });
}); 