import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUnifiedAuth } from "./UnifiedAuthContext";
import { themeApi, THEME_OPTIONS, convertThemeToCSSClass, convertThemeToLocalStorage } from "../utils/themeApi";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated, isUser } = useUnifiedAuth();
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
      console.warn("localStorage not available, skipping theme save");
    }
  }, []);

  // Fetch user theme from API
  const fetchUserTheme = useCallback(async () => {
    if (!isAuthenticated || !isUser) {
      // Not authenticated: default to LIGHT site-wide
      setThemeState(THEME_OPTIONS.LIGHT);
      applyTheme(THEME_OPTIONS.LIGHT);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await themeApi.getUserTheme();
      
      if (response && response.code === "200" && response.data) {
        const userTheme = response.data;
        if (Object.values(THEME_OPTIONS).includes(userTheme)) {
          setThemeState(userTheme);
          applyTheme(userTheme);
        } else {
          // Invalid theme from API, fallback to system preference
          let prefersDark = false;
          try {
            if (window.matchMedia) {
              prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            }
          } catch (matchError) {
            console.warn("matchMedia not available, defaulting to light mode");
          }
          
          const fallbackTheme = prefersDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
          setThemeState(fallbackTheme);
          applyTheme(fallbackTheme);
        }
      } else {
        // API error or invalid response, fallback to system preference
        let prefersDark = false;
        try {
          if (window.matchMedia) {
            prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          }
        } catch (matchError) {
          console.warn("matchMedia not available, defaulting to light mode");
        }
        
        const fallbackTheme = prefersDark ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT;
        setThemeState(fallbackTheme);
        applyTheme(fallbackTheme);
      }
    } catch (error) {
      console.error('Failed to fetch user theme:', error);
      setError(error.message || 'Failed to load theme preference');
      
      // Fallback to local storage or system preference
      let savedTheme = null;
      let prefersDark = false;
      
      try {
        savedTheme = localStorage.getItem("theme");
      } catch (storageError) {
        console.warn("localStorage not available, skipping saved theme");
      }
      
      try {
        if (window.matchMedia) {
          prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
      } catch (matchError) {
        console.warn("matchMedia not available, defaulting to light mode");
      }

      // Determine the actual theme to use
      let actualTheme;
      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        actualTheme = THEME_OPTIONS.DARK;
      } else {
        actualTheme = THEME_OPTIONS.LIGHT;
      }
      
      setThemeState(actualTheme);
      applyTheme(actualTheme);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, isUser, applyTheme]);

  // Update theme (both local state and API)
  const setTheme = useCallback(async (newTheme) => {
    if (!Object.values(THEME_OPTIONS).includes(newTheme)) {
      console.error('Invalid theme value:', newTheme);
      return;
    }

    try {
      setError(null);
      
      // Update local state immediately for responsive UI
      setThemeState(newTheme);
      applyTheme(newTheme);

      // Update API if authenticated
      if (isAuthenticated && isUser) {
        await themeApi.updateUserTheme(newTheme);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
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
        console.warn("matchMedia not available for system theme detection");
      }
    }
  }, [theme, applyTheme]);

  // Fetch theme when authentication state changes
  useEffect(() => {
    fetchUserTheme();
  }, [isAuthenticated, isUser]);

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
