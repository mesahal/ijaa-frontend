import axios from 'axios';
import { themeApi, THEME_OPTIONS, isValidTheme, convertThemeToCSSClass, convertThemeToLocalStorage  } from '../../../utils/themeApi';
import sessionManager from '../../utils/sessionManager';

// Mock axios
jest.mock('axios');

// Mock sessionManager
jest.mock('../../utils/sessionManager');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.dispatchEvent
const mockDispatchEvent = jest.fn();
Object.defineProperty(window, 'dispatchEvent', {
  value: mockDispatchEvent,
});

describe('themeApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockDispatchEvent.mockClear();
    
    // Reset axios mocks
    axios.create.mockReturnValue({
      get: jest.fn(),
      put: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    });
  });

  describe('API Client Configuration', () => {
    test('should create axios instance with correct base URL', () => {
      // Reset environment variable
      delete process.env.REACT_APP_THEME_API_BASE_URL;
      
      // Re-import to trigger axios.create
      jest.resetModules();
      require('../../utils/themeApi');
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "http://localhost:8000/ijaa/api/v1/user/settings",
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    test('should use environment variable for base URL when available', () => {
      process.env.REACT_APP_THEME_API_BASE_URL = "https://custom-api.com/settings";
      
      // Re-import to trigger axios.create
      jest.resetModules();
      require('../../utils/themeApi');
      
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "https://custom-api.com/settings",
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('Request Interceptor', () => {
    let mockAxiosInstance;
    let requestInterceptor;

    beforeEach(() => {
      mockAxiosInstance = {
        get: jest.fn(),
        put: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      
      axios.create.mockReturnValue(mockAxiosInstance);
      
      // Capture the request interceptor
      mockAxiosInstance.interceptors.request.use.mockImplementation((fn) => {
        requestInterceptor = fn;
      });
      
      // Re-import to trigger interceptor setup
      jest.resetModules();
      require('../../utils/themeApi');
    });

    test('should add Authorization header when user is authenticated', () => {
      const mockSession = {
        type: 'user',
        data: { token: 'test-token' }
      };
      
      sessionManager.getCurrentSession.mockReturnValue(mockSession);
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBe('Bearer test-token');
      expect(sessionManager.getCurrentSession).toHaveBeenCalled();
    });

    test('should not add Authorization header when user is not authenticated', () => {
      const mockSession = {
        type: null,
        data: null
      };
      
      sessionManager.getCurrentSession.mockReturnValue(mockSession);
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    test('should not add Authorization header when session type is not user', () => {
      const mockSession = {
        type: 'admin',
        data: { token: 'admin-token' }
      };
      
      sessionManager.getCurrentSession.mockReturnValue(mockSession);
      
      const config = { headers: {} };
      const result = requestInterceptor(config);
      
      expect(result.headers.Authorization).toBeUndefined();
    });

    test('should handle request interceptor errors', () => {
      const config = { headers: {} };
      const error = new Error('Request error');
      
      expect(() => requestInterceptor(error)).toThrow('Request error');
    });
  });

  describe('Response Interceptor', () => {
    let mockAxiosInstance;
    let responseInterceptor;

    beforeEach(() => {
      mockAxiosInstance = {
        get: jest.fn(),
        put: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      
      axios.create.mockReturnValue(mockAxiosInstance);
      
      // Capture the response interceptor
      mockAxiosInstance.interceptors.response.use.mockImplementation((successFn, errorFn) => {
        responseInterceptor = { success: successFn, error: errorFn };
      });
      
      // Re-import to trigger interceptor setup
      jest.resetModules();
      require('../../utils/themeApi');
    });

    test('should pass through successful responses', () => {
      const response = { data: 'success' };
      const result = responseInterceptor.success(response);
      
      expect(result).toBe(response);
    });

    test('should handle 401 errors by clearing session and dispatching event', () => {
      const error = {
        response: { status: 401 }
      };
      
      responseInterceptor.error(error);
      
      expect(sessionManager.clearAll).toHaveBeenCalled();
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'auth:logout',
          detail: { reason: 'token_expired' }
        })
      );
    });

    test('should not handle non-401 errors', () => {
      const error = {
        response: { status: 500 }
      };
      
      // Should not throw or call session manager
      expect(() => responseInterceptor.error(error)).not.toThrow();
      expect(sessionManager.clearAll).not.toHaveBeenCalled();
    });

    test('should handle errors without response', () => {
      const error = new Error('Network error');
      
      // Should not throw
      expect(() => responseInterceptor.error(error)).not.toThrow();
      expect(sessionManager.clearAll).not.toHaveBeenCalled();
    });
  });

  describe('API Functions', () => {
    let mockAxiosInstance;

    beforeEach(() => {
      mockAxiosInstance = {
        get: jest.fn(),
        put: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      
      axios.create.mockReturnValue(mockAxiosInstance);
      
      // Re-import to get fresh instance
      jest.resetModules();
      const freshThemeApi = require('../../utils/themeApi');
      Object.assign(themeApi, freshThemeApi.themeApi);
    });

    describe('getUserSettings', () => {
      test('should call GET / endpoint', async () => {
        const mockResponse = { data: { code: '200', data: { theme: 'DARK' } } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        
        const result = await themeApi.getUserSettings();
        
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('');
        expect(result).toEqual(mockResponse.data);
      });

      test('should handle errors gracefully', async () => {
        const error = new Error('API Error');
        mockAxiosInstance.get.mockRejectedValue(error);
        
        await expect(themeApi.getUserSettings()).rejects.toThrow('API Error');
        expect(console.error).toHaveBeenCalledWith('Error getting user settings:', error);
      });
    });

    describe('getUserTheme', () => {
      test('should call GET /theme endpoint', async () => {
        const mockResponse = { data: { code: '200', data: 'DARK' } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        
        const result = await themeApi.getUserTheme();
        
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/theme');
        expect(result).toEqual(mockResponse.data);
      });

      test('should handle errors gracefully', async () => {
        const error = new Error('API Error');
        mockAxiosInstance.get.mockRejectedValue(error);
        
        await expect(themeApi.getUserTheme()).rejects.toThrow('API Error');
        expect(console.error).toHaveBeenCalledWith('Error getting user theme:', error);
      });
    });

    describe('updateUserSettings', () => {
      test('should call PUT / endpoint with settings data', async () => {
        const settings = { theme: 'LIGHT' };
        const mockResponse = { data: { code: '200', data: settings } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);
        
        const result = await themeApi.updateUserSettings(settings);
        
        expect(mockAxiosInstance.put).toHaveBeenCalledWith('', settings);
        expect(result).toEqual(mockResponse.data);
      });

      test('should handle errors gracefully', async () => {
        const settings = { theme: 'LIGHT' };
        const error = new Error('API Error');
        mockAxiosInstance.put.mockRejectedValue(error);
        
        await expect(themeApi.updateUserSettings(settings)).rejects.toThrow('API Error');
        expect(console.error).toHaveBeenCalledWith('Error updating user settings:', error);
      });
    });

    describe('updateUserTheme', () => {
      test('should call PUT / endpoint with theme data', async () => {
        const theme = 'DARK';
        const mockResponse = { data: { code: '200', data: { theme } } };
        mockAxiosInstance.put.mockResolvedValue(mockResponse);
        
        const result = await themeApi.updateUserTheme(theme);
        
        expect(mockAxiosInstance.put).toHaveBeenCalledWith('', { theme });
        expect(result).toEqual(mockResponse.data);
      });

      test('should handle errors gracefully', async () => {
        const theme = 'DARK';
        const error = new Error('API Error');
        mockAxiosInstance.put.mockRejectedValue(error);
        
        await expect(themeApi.updateUserTheme(theme)).rejects.toThrow('API Error');
        expect(console.error).toHaveBeenCalledWith('Error updating user theme:', error);
      });
    });

    describe('getAvailableThemes', () => {
      test('should call GET /themes endpoint', async () => {
        const mockResponse = { data: { code: '200', data: ['DARK', 'LIGHT', 'DEVICE'] } };
        mockAxiosInstance.get.mockResolvedValue(mockResponse);
        
        const result = await themeApi.getAvailableThemes();
        
        expect(mockAxiosInstance.get).toHaveBeenCalledWith('/themes');
        expect(result).toEqual(mockResponse.data);
      });

      test('should handle errors gracefully', async () => {
        const error = new Error('API Error');
        mockAxiosInstance.get.mockRejectedValue(error);
        
        await expect(themeApi.getAvailableThemes()).rejects.toThrow('API Error');
        expect(console.error).toHaveBeenCalledWith('Error getting available themes:', error);
      });
    });
  });

  describe('Theme Constants', () => {
    test('should export correct theme options', () => {
      expect(THEME_OPTIONS).toEqual({
        DARK: 'DARK',
        LIGHT: 'LIGHT',
        DEVICE: 'DEVICE',
      });
    });
  });

  describe('Theme Validation', () => {
    test('should validate correct theme values', () => {
      expect(isValidTheme('DARK')).toBe(true);
      expect(isValidTheme('LIGHT')).toBe(true);
      expect(isValidTheme('DEVICE')).toBe(true);
    });

    test('should reject invalid theme values', () => {
      expect(isValidTheme('INVALID')).toBe(false);
      expect(isValidTheme('dark')).toBe(false);
      expect(isValidTheme('')).toBe(false);
      expect(isValidTheme(null)).toBe(false);
      expect(isValidTheme(undefined)).toBe(false);
    });
  });

  describe('Theme Conversion Utilities', () => {
    beforeEach(() => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockReturnValue({ matches: false }),
      });
    });

    describe('convertThemeToCSSClass', () => {
      test('should convert DARK theme to dark class', () => {
        expect(convertThemeToCSSClass('DARK')).toBe('dark');
      });

      test('should convert LIGHT theme to light class', () => {
        expect(convertThemeToCSSClass('LIGHT')).toBe('light');
      });

      test('should convert DEVICE theme to system preference (dark)', () => {
        window.matchMedia.mockReturnValue({ matches: true }); // Dark mode
        
        expect(convertThemeToCSSClass('DEVICE')).toBe('dark');
      });

      test('should convert DEVICE theme to system preference (light)', () => {
        window.matchMedia.mockReturnValue({ matches: false }); // Light mode
        
        expect(convertThemeToCSSClass('DEVICE')).toBe('light');
      });

      test('should handle matchMedia not available', () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: undefined,
        });
        
        expect(convertThemeToCSSClass('DEVICE')).toBe('light');
      });
    });

    describe('convertThemeToLocalStorage', () => {
      test('should convert DARK theme to dark', () => {
        expect(convertThemeToLocalStorage('DARK')).toBe('dark');
      });

      test('should convert LIGHT theme to light', () => {
        expect(convertThemeToLocalStorage('LIGHT')).toBe('light');
      });

      test('should convert DEVICE theme to system preference (dark)', () => {
        window.matchMedia.mockReturnValue({ matches: true }); // Dark mode
        
        expect(convertThemeToLocalStorage('DEVICE')).toBe('dark');
      });

      test('should convert DEVICE theme to system preference (light)', () => {
        window.matchMedia.mockReturnValue({ matches: false }); // Light mode
        
        expect(convertThemeToLocalStorage('DEVICE')).toBe('light');
      });

      test('should handle matchMedia not available', () => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: undefined,
        });
        
        expect(convertThemeToLocalStorage('DEVICE')).toBe('light');
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle console.error calls', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Trigger an error by mocking axios to reject
      const mockAxiosInstance = {
        get: jest.fn().mockRejectedValue(new Error('Test error')),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      
      axios.create.mockReturnValue(mockAxiosInstance);
      
      // Re-import to get fresh instance
      jest.resetModules();
      const freshThemeApi = require('../../utils/themeApi');
      
      // Test that error is logged
      return freshThemeApi.themeApi.getUserTheme().catch(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error getting user theme:', expect.any(Error));
        consoleSpy.mockRestore();
      });
    });
  });

  describe('Integration', () => {
    test('should handle complete theme update flow', async () => {
      const mockAxiosInstance = {
        get: jest.fn(),
        put: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };
      
      axios.create.mockReturnValue(mockAxiosInstance);
      
      // Mock successful responses
      mockAxiosInstance.get.mockResolvedValue({
        data: { code: '200', data: 'DARK' }
      });
      mockAxiosInstance.put.mockResolvedValue({
        data: { code: '200', data: { theme: 'LIGHT' } }
      });
      
      // Re-import to get fresh instance
      jest.resetModules();
      const freshThemeApi = require('../../utils/themeApi');
      
      // Test the complete flow
      const currentTheme = await freshThemeApi.themeApi.getUserTheme();
      expect(currentTheme.data).toBe('DARK');
      
      const updateResult = await freshThemeApi.themeApi.updateUserTheme('LIGHT');
      expect(updateResult.data.theme).toBe('LIGHT');
    });
  });
});




