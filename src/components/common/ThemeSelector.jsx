import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { THEME_OPTIONS  } from '../../services/api/themeApi';
import { Moon, Sun, Monitor } from 'lucide-react';

const ThemeSelector = ({ className = '', showLabel = true, size = 'default' }) => {
  const { theme, setTheme, isLoading, error } = useTheme();

  const handleThemeChange = (newTheme) => {
    if (newTheme !== theme && setTheme) {
      setTheme(newTheme);
    }
  };

  const getThemeIcon = (themeType) => {
    switch (themeType) {
      case THEME_OPTIONS.DARK:
        return <Moon className="w-4 h-4" />;
      case THEME_OPTIONS.LIGHT:
        return <Sun className="w-4 h-4" />;
      case THEME_OPTIONS.DEVICE:
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getThemeLabel = (themeType) => {
    switch (themeType) {
      case THEME_OPTIONS.DARK:
        return 'Dark';
      case THEME_OPTIONS.LIGHT:
        return 'Light';
      case THEME_OPTIONS.DEVICE:
        return 'System';
      default:
        return 'System';
    }
  };

  const sizeClasses = {
    small: 'p-2 text-sm',
    default: 'p-3 text-base',
    large: 'p-4 text-lg'
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" data-testid="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm ${className}`}>
        Theme error: {error}
      </div>
    );
  }

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {showLabel && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme Preference
        </label>
      )}
      
      <div className="flex space-x-2">
        {Object.values(THEME_OPTIONS).map((themeOption) => (
          <button
            key={themeOption}
            onClick={() => handleThemeChange(themeOption)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
              ${theme === themeOption
                ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
              ${sizeClasses[size]}
            `}
            title={`Switch to ${getThemeLabel(themeOption)} theme`}
          >
            {getThemeIcon(themeOption)}
            <span className="hidden sm:inline">{getThemeLabel(themeOption)}</span>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Choose your preferred theme. "System" will automatically follow your device's theme setting.
      </p>
    </div>
  );
};

export default ThemeSelector;
