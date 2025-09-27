import axiosInstance from '../../utils/api/axiosInstance';

// Theme API base URL - using the settings endpoint
const THEME_API_BASE = process.env.REACT_APP_THEME_API_BASE_URL;

// Create axios instance for theme operations that extends the main instance
const themeApiClient = axiosInstance.create({
  baseURL: THEME_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// The main axiosInstance already has the auth interceptor, so we don't need to add it again

// Theme API utilities
export const themeApi = {
  // Get user settings including theme
  getUserSettings: async () => {
    try {
      const response = await themeApiClient.get('');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user theme preference
  getUserTheme: async () => {
    try {
      const response = await themeApiClient.get('/theme');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user settings including theme
  updateUserSettings: async (settings) => {
    try {
      const response = await themeApiClient.put('', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user theme preference
  updateUserTheme: async (theme) => {
    try {
      const response = await themeApiClient.put('', { theme });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get available theme options
  getAvailableThemes: async () => {
    try {
      const response = await themeApiClient.get('/themes');
      return response.data;
    } catch (error) {
      
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


