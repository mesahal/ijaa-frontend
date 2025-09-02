import axios from 'axios';
import sessionManager from './sessionManager';

// Theme API base URL - using the settings endpoint
const THEME_API_BASE = process.env.REACT_APP_THEME_API_BASE_URL || "http://localhost:8000/ijaa/api/v1/user/settings";

// Create axios instance for theme operations
const themeApiClient = axios.create({
  baseURL: THEME_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
themeApiClient.interceptors.request.use(
  (config) => {
    // Get current session data
    const currentSession = sessionManager.getCurrentSession();
    
    if (currentSession.type === 'user' && currentSession.data?.token) {
      config.headers.Authorization = `Bearer ${currentSession.data.token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
themeApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid session and redirect to login
      sessionManager.clearAll();
      window.dispatchEvent(new CustomEvent('auth:logout', {
        detail: { reason: 'token_expired' }
      }));
    }
    return Promise.reject(error);
  }
);

// Theme API utilities
export const themeApi = {
  // Get user settings including theme
  getUserSettings: async () => {
    try {
      const response = await themeApiClient.get('');
      return response.data;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  },

  // Get user theme preference
  getUserTheme: async () => {
    try {
      const response = await themeApiClient.get('/theme');
      return response.data;
    } catch (error) {
      console.error('Error getting user theme:', error);
      throw error;
    }
  },

  // Update user settings including theme
  updateUserSettings: async (settings) => {
    try {
      const response = await themeApiClient.put('', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  },

  // Update user theme preference
  updateUserTheme: async (theme) => {
    try {
      const response = await themeApiClient.put('', { theme });
      return response.data;
    } catch (error) {
      console.error('Error updating user theme:', error);
      throw error;
    }
  },

  // Get available theme options
  getAvailableThemes: async () => {
    try {
      const response = await themeApiClient.get('/themes');
      return response.data;
    } catch (error) {
      console.error('Error getting available themes:', error);
      
      // Return fallback themes if API is not available or requires auth
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500 || error.response?.status === 401) {
        return {
          message: 'Using fallback themes',
          code: '200',
          data: Object.values(THEME_OPTIONS)
        };
      }
      
      throw error;
    }
  },
};

// Theme constants
export const THEME_OPTIONS = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
  DEVICE: 'DEVICE',
};

// Theme validation
export const isValidTheme = (theme) => {
  return Object.values(THEME_OPTIONS).includes(theme);
};

// Theme conversion utilities
export const convertThemeToCSSClass = (theme) => {
  if (theme === THEME_OPTIONS.DEVICE) {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  return theme.toLowerCase();
};

export const convertThemeToLocalStorage = (theme) => {
  if (theme === THEME_OPTIONS.DEVICE) {
    // For DEVICE theme, store the actual system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
  return theme.toLowerCase();
};

export default themeApi;


