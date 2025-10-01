import axiosInstance from '../../utils/api/axiosInstance';

// Theme API base URL - using the settings endpoint
const THEME_API_BASE = process.env.REACT_APP_THEME_API_BASE_URL || 'http://localhost:8000/ijaa/api/v1/users';

// Use the main axiosInstance directly to ensure authentication interceptor is included
const themeApiClient = axiosInstance;

// Theme API utilities
export const themeApi = {
  // Get user settings including theme
  getUserSettings: async (userId) => {
    try {
      const response = await themeApiClient.get(`${THEME_API_BASE}/${userId}/settings`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user theme preference (with automatic userId detection)
  getUserTheme: async (userId = null) => {
    try {
      // If no userId provided, try to get it from localStorage
      if (!userId) {
        const userData = localStorage.getItem('alumni_user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          userId = parsedUserData?.userId;
        }
      }
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Use the general settings endpoint directly since theme-specific endpoint might not exist
      console.log('🎨 [ThemeAPI] Fetching theme via settings endpoint...');
      const response = await themeApiClient.get(`${THEME_API_BASE}/${userId}/settings`);
      return {
        code: '200',
        data: response.data?.data?.theme || response.data?.theme || 'LIGHT'
      };
    } catch (error) {
      throw error;
    }
  },

  // Update user settings including theme
  updateUserSettings: async (userId, settings) => {
    try {
      const response = await themeApiClient.put(`${THEME_API_BASE}/${userId}/settings`, settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user theme preference (with automatic userId detection)
  updateUserTheme: async (userId = null, theme) => {
    try {
      // If no userId provided, try to get it from localStorage
      if (!userId) {
        const userData = localStorage.getItem('alumni_user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          userId = parsedUserData?.userId;
        }
      }
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Use the general settings endpoint directly since theme-specific endpoint doesn't exist
      console.log('🎨 [ThemeAPI] Updating theme via settings endpoint...');
      const response = await themeApiClient.put(`${THEME_API_BASE}/${userId}/settings`, { theme });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get available theme options (with automatic userId detection)
  getAvailableThemes: async (userId = null) => {
    try {
      // If no userId provided, try to get it from localStorage
      if (!userId) {
        const userData = localStorage.getItem('alumni_user');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          userId = parsedUserData?.userId;
        }
      }
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      // Try the themes endpoint first
      try {
        const response = await themeApiClient.get(`${THEME_API_BASE}/${userId}/settings/themes`);
        return response.data;
      } catch (themesError) {
        // If themes endpoint doesn't exist or returns 403/404, return fallback themes
        if (themesError.response?.status === 404 || themesError.response?.status === 403) {
          console.log('🎨 [ThemeAPI] Themes endpoint not available (403/404), using fallback themes...');
          return {
            message: 'Using fallback themes',
            code: '200',
            data: Object.values(THEME_OPTIONS)
          };
        }
        throw themesError;
      }
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


