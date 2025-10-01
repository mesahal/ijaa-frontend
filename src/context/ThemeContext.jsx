import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { themeApi, THEME_OPTIONS, convertThemeToCSSClass, convertThemeToLocalStorage } from "../services/api/themeApi";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated, isUser } = useAuth();
  const [theme, setThemeState] = useState(THEME_OPTIONS.LIGHT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Apply theme to document
  const applyTheme = useCallback((selectedTheme) => {
    const actualTheme = convertThemeToCSSClass(selectedTheme);
    
    // Update document classes
    if (document && document.documentElement) {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(actualTheme);
    }
    
    // Update localStorage for backward compatibility
    try {
      const localStorageTheme = convertThemeToLocalStorage(selectedTheme);
      localStorage.setItem("theme", localStorageTheme);
    } catch (storageError) {
    }
  }, []);

  // Get theme from local storage or system preference (for admin users or fallback)
  const getLocalTheme = useCallback(() => {
    let savedTheme = null;
    let prefersDark = false;
    
    try {
      savedTheme = localStorage.getItem("theme");
    } catch (storageError) {
    }
    
    try {
      if (window.matchMedia) {
        prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    } catch (matchError) {
    }

    // Determine the actual theme to use
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      return THEME_OPTIONS.DARK;
    } else {
      return THEME_OPTIONS.LIGHT;
    }
  }, []);

  // Fetch user theme from API (only for regular users)
  const fetchUserTheme = useCallback(async () => {
    if (!isAuthenticated()) {
      // Not authenticated: default to LIGHT site-wide
      setThemeState(THEME_OPTIONS.LIGHT);
      applyTheme(THEME_OPTIONS.LIGHT);
      setIsLoading(false);
      return;
    }

    // For admin users, use local storage or system preference only
    if (!isUser()) {
      const localTheme = getLocalTheme();
      setThemeState(localTheme);
      applyTheme(localTheme);
      setIsLoading(false);
      return;
    }

    // Only regular users get their theme from API
    try {
      setError(null);
      console.log('🎨 [ThemeContext] Fetching user theme from API...');
      // Get userId from localStorage to pass explicitly
      const userData = localStorage.getItem('alumni_user');
      const userId = userData ? JSON.parse(userData)?.userId : null;
      const response = await themeApi.getUserTheme(userId);
      
      if (response && response.code === "200" && response.data) {
        const userTheme = response.data;
        console.log('🎨 [ThemeContext] API theme received:', userTheme);
        if (Object.values(THEME_OPTIONS).includes(userTheme)) {
          setThemeState(userTheme);
          applyTheme(userTheme);
          console.log('✅ [ThemeContext] Theme applied from API:', userTheme);
        } else {
          // Invalid theme from API, fallback to local theme
          console.warn('⚠️ [ThemeContext] Invalid theme from API, using fallback');
          const fallbackTheme = getLocalTheme();
          setThemeState(fallbackTheme);
          applyTheme(fallbackTheme);
        }
      } else {
        // API error or invalid response, fallback to local theme
        console.warn('⚠️ [ThemeContext] API response invalid, using fallback');
        const fallbackTheme = getLocalTheme();
        setThemeState(fallbackTheme);
        applyTheme(fallbackTheme);
      }
    } catch (error) {
      console.error('❌ [ThemeContext] Failed to fetch theme from API:', error);
      console.log('🎨 [ThemeContext] Falling back to local theme...');
      
      // Fallback to local theme without setting error (this is expected behavior)
      const fallbackTheme = getLocalTheme();
      setThemeState(fallbackTheme);
      applyTheme(fallbackTheme);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isUser, applyTheme, getLocalTheme]);

  // Update theme (both local state and API)
  const setTheme = useCallback(async (newTheme) => {
    if (!Object.values(THEME_OPTIONS).includes(newTheme)) {
      console.warn('⚠️ [ThemeContext] Invalid theme provided:', newTheme);
      return;
    }

    try {
      setError(null);
      console.log('🎨 [ThemeContext] Updating theme to:', newTheme);
      
      // Update local state immediately for responsive UI
      setThemeState(newTheme);
      applyTheme(newTheme);

      // Update API only for regular users, not for admin users
      if (isAuthenticated() && isUser()) {
        console.log('🎨 [ThemeContext] Updating theme via API...');
        try {
          // Get userId from localStorage to pass explicitly
          const userData = localStorage.getItem('alumni_user');
          const userId = userData ? JSON.parse(userData)?.userId : null;
          await themeApi.updateUserTheme(userId, newTheme);
          console.log('✅ [ThemeContext] Theme updated via API successfully');
        } catch (apiError) {
          console.warn('⚠️ [ThemeContext] API update failed, but theme applied locally:', apiError.message);
          // Don't revert the theme if API fails - keep the local change
        }
        
        // Trigger cross-tab synchronization
        const event = new CustomEvent('theme:changed', {
          detail: { theme: newTheme, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      } else {
        console.log('🎨 [ThemeContext] User not authenticated or admin user, theme stored locally only');
        
        // Trigger cross-tab synchronization for local-only changes
        const event = new CustomEvent('theme:changed', {
          detail: { theme: newTheme, timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error('❌ [ThemeContext] Failed to update theme:', error);
      setError(error.message || 'Failed to update theme preference');
      
      // Revert to previous theme on error
      setThemeState(theme);
      applyTheme(theme);
    }
  }, [theme, isAuthenticated, isUser, applyTheme]);

  // Toggle between light and dark themes (for backward compatibility)
  const toggleTheme = useCallback(() => {
    const newTheme = theme === THEME_OPTIONS.LIGHT ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Listen for system theme changes when using DEVICE theme
  useEffect(() => {
    if (theme === THEME_OPTIONS.DEVICE) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e) => {
          const newTheme = e.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
          applyTheme(THEME_OPTIONS.DEVICE); // This will resolve to the new system preference
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
          // Fallback for older browsers
          mediaQuery.addListener(handleChange);
          return () => mediaQuery.removeListener(handleChange);
        }
      } catch (matchError) {
      }
    }
  }, [theme, applyTheme]);

  // Fetch theme when authentication state changes
  useEffect(() => {
    fetchUserTheme();
  }, [isAuthenticated, isUser]);

  // Listen for cross-tab theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      console.log('🔄 [ThemeContext] Cross-tab theme change detected:', event.detail);
      if (event.detail && event.detail.theme) {
        const newTheme = event.detail.theme;
        if (Object.values(THEME_OPTIONS).includes(newTheme) && newTheme !== theme) {
          console.log('🎨 [ThemeContext] Applying cross-tab theme change:', newTheme);
          setThemeState(newTheme);
          applyTheme(newTheme);
        }
      }
    };

    const handleStorageChange = (event) => {
      // Only respond to theme changes in localStorage
      if (event.key === 'theme') {
        console.log('🔄 [ThemeContext] localStorage theme change detected:', {
          key: event.key,
          newValue: event.newValue,
          oldValue: event.oldValue
        });
        
        if (event.newValue) {
          const newTheme = event.newValue.toUpperCase();
          if (Object.values(THEME_OPTIONS).includes(newTheme) && newTheme !== theme) {
            console.log('🎨 [ThemeContext] Applying localStorage theme change:', newTheme);
            setThemeState(newTheme);
            applyTheme(newTheme);
          }
        }
      }
    };

    // Listen for custom theme change events
    window.addEventListener('theme:changed', handleThemeChange);
    
    // Listen for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('theme:changed', handleThemeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme, applyTheme]);

  // Get current theme status for backward compatibility
  const isDark = theme === THEME_OPTIONS.DARK || 
    (theme === THEME_OPTIONS.DEVICE && 
     window.matchMedia && 
     (() => {
       try {
         return window.matchMedia('(prefers-color-scheme: dark)').matches;
       } catch (error) {
         return false;
       }
     })());

  const value = {
    // New API
    theme,
    setTheme,
    isLoading,
    error,
    
    // Backward compatibility
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
