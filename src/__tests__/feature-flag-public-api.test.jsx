// Mock localStorage FIRST, before any other imports
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock axios before importing featureFlagApi
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
    create: jest.fn(() => mockAxiosInstance),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };
});

// Now import featureFlagApi
import { featureFlagApi } from '../utils/featureFlagApi';
import axios from 'axios';

describe('Feature Flag Public API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage mock before each test
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('checkFeatureFlag without authentication', () => {
    it('should work without user token for public routes', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            name: "user.login",
            enabled: true
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);

      // Call the API without any user data in localStorage
      const result = await featureFlagApi.checkFeatureFlag('user.login');

      // Verify the API was called with correct headers (no Authorization)
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8000/ijaa/api/v1/admin/feature-flags/user.login/enabled',
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );

      // Verify the result
      expect(result).toEqual(mockResponse.data);
    });

    it('should work with user token when available', async () => {
      // Mock user data in localStorage
      const mockUser = {
        token: 'mock-user-token',
        userId: '123'
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Mock successful API response
      const mockResponse = {
        data: {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            name: "user.login",
            enabled: true
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);

      // Call the API
      const result = await featureFlagApi.checkFeatureFlag('user.login');

      // Verify the API was called (check that it was called at least once)
      expect(axios.get).toHaveBeenCalled();
      
      // Get the actual call arguments
      const callArgs = axios.get.mock.calls[0];
      expect(callArgs[0]).toContain('user.login');
      
      // Verify the result
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle invalid user data gracefully', async () => {
      // Mock invalid user data in localStorage
      localStorageMock.getItem.mockReturnValue('invalid-json');

      // Mock successful API response
      const mockResponse = {
        data: {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            name: "user.login",
            enabled: true
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);

      // Call the API
      const result = await featureFlagApi.checkFeatureFlag('user.login');

      // Verify the API was called without Authorization header (due to invalid JSON)
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8000/ijaa/api/v1/admin/feature-flags/user.login/enabled',
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );

      // Verify the result
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle user data without token gracefully', async () => {
      // Mock user data without token in localStorage
      const mockUser = {
        userId: '123'
        // No token
      };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Mock successful API response
      const mockResponse = {
        data: {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            name: "user.login",
            enabled: true
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);

      // Call the API
      const result = await featureFlagApi.checkFeatureFlag('user.login');

      // Verify the API was called without Authorization header
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8000/ijaa/api/v1/admin/feature-flags/user.login/enabled',
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );

      // Verify the result
      expect(result).toEqual(mockResponse.data);
    });

    it('should properly encode feature flag names with dots', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            name: "alumni.search",
            enabled: true
          }
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);

      // Call the API with a feature flag name containing dots
      const result = await featureFlagApi.checkFeatureFlag('alumni.search');

      // Verify the API was called (check that it was called at least once)
      expect(axios.get).toHaveBeenCalled();
      
      // Get the actual call arguments
      const callArgs = axios.get.mock.calls[0];
      expect(callArgs[0]).toContain('alumni.search');
      expect(callArgs[1].headers).toEqual({
        'Content-Type': 'application/json',
        'accept': 'application/json'
      });

      // Verify the result
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      const mockError = new Error('Network error');
      axios.get.mockRejectedValue(mockError);

      // Call the API
      await expect(featureFlagApi.checkFeatureFlag('user.login')).rejects.toThrow('Network error');

      // Verify the API was called
      expect(axios.get).toHaveBeenCalledWith(
        'http://localhost:8000/ijaa/api/v1/admin/feature-flags/user.login/enabled',
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
    });
  });

  describe('checkMultipleFeatureFlags', () => {
    it('should work without authentication for multiple flags', async () => {
      // Mock successful API responses
      const mockResponses = [
        {
          data: {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: {
              name: "user.login",
              enabled: true
            }
          }
        },
        {
          data: {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: {
              name: "user.registration",
              enabled: false
            }
          }
        }
      ];
      
      axios.get
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1]);

      // Call the API
      const result = await featureFlagApi.checkMultipleFeatureFlags(['user.login', 'user.registration']);

      // Verify the results
      expect(result).toEqual({
        'user.login': true,
        'user.registration': false
      });

      // Verify the API was called twice
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it('should handle partial failures gracefully', async () => {
      // Mock one success and one failure
      const mockSuccessResponse = {
        data: {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            name: "user.login",
            enabled: true
          }
        }
      };
      
      const mockError = new Error('Network error');
      
      axios.get
        .mockResolvedValueOnce(mockSuccessResponse)
        .mockRejectedValueOnce(mockError);

      // Call the API
      const result = await featureFlagApi.checkMultipleFeatureFlags(['user.login', 'user.registration']);

      // Verify the results (should only include successful calls)
      expect(result).toEqual({
        'user.login': true
      });

      // Verify the API was called twice
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});
