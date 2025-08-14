import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

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

// Mock matchMedia for system theme detection
const matchMediaMock = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: matchMediaMock,
});

// Test component to access context
const TestComponent = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="theme-status">{isDark ? 'dark' : 'light'}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

const renderWithThemeProvider = (component) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    matchMediaMock.mockClear();
  });

  describe('Initialization', () => {
    test('should initialize with light theme by default', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should load saved theme from localStorage', () => {
      localStorage.getItem.mockReturnValue('dark');
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });

    test('should detect system dark mode preference', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: true });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });

    test('should prioritize localStorage over system preference', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: true });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle invalid localStorage theme value', () => {
      localStorage.getItem.mockReturnValue('invalid-theme');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle localStorage errors gracefully', () => {
      localStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });
  });

  describe('Theme Toggle', () => {
    test('should toggle from light to dark theme', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
      
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should toggle from dark to light theme', () => {
      localStorage.getItem.mockReturnValue('dark');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
      
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    test('should handle localStorage errors during toggle', () => {
      localStorage.getItem.mockReturnValue('light');
      localStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      // Theme should still toggle even if localStorage fails
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });
  });

  describe('System Theme Detection', () => {
    test('should detect system dark mode preference', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: true });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });

    test('should detect system light mode preference', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle matchMedia not supported', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue(null);
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle matchMedia errors', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockImplementation(() => {
        throw new Error('matchMedia error');
      });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });
  });

  describe('Theme Persistence', () => {
    test('should save theme preference to localStorage', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should load theme preference on component mount', () => {
      localStorage.getItem.mockReturnValue('dark');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(localStorage.getItem).toHaveBeenCalledWith('theme');
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });

    test('should handle localStorage being unavailable', () => {
      // Mock localStorage as undefined
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true,
      });
      
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
      
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });
  });

  describe('Error Handling', () => {
    test('should handle useTheme hook outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    test('should handle multiple theme toggles rapidly', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      const toggleButton = screen.getByTestId('toggle-theme');
      
      // Rapidly click the toggle button
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      fireEvent.click(toggleButton);
      
      // Should end up in a consistent state
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });
  });

  describe('DOM Class Management', () => {
    test('should add dark class to document when theme is dark', () => {
      localStorage.getItem.mockReturnValue('dark');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    test('should remove dark class from document when theme is light', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    test('should update document class when theme toggles', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
  });

  describe('Performance', () => {
    test('should not cause unnecessary re-renders', () => {
      localStorage.getItem.mockReturnValue('light');
      matchMediaMock.mockReturnValue({ matches: false });
      
      const renderSpy = jest.fn();
      const TestComponentWithSpy = () => {
        renderSpy();
        const { isDark, toggleTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme-status">{isDark ? 'dark' : 'light'}</div>
            <button data-testid="toggle-theme" onClick={toggleTheme}>
              Toggle Theme
            </button>
          </div>
        );
      };
      
      renderWithThemeProvider(<TestComponentWithSpy />);
      
      const initialRenderCount = renderSpy.mock.calls.length;
      
      // Toggle theme
      fireEvent.click(screen.getByTestId('toggle-theme'));
      
      // Should only re-render once for the theme change
      expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null localStorage.getItem return', () => {
      localStorage.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle empty string localStorage.getItem return', () => {
      localStorage.getItem.mockReturnValue('');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle whitespace-only localStorage.getItem return', () => {
      localStorage.getItem.mockReturnValue('   ');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('light');
    });

    test('should handle case-insensitive theme values', () => {
      localStorage.getItem.mockReturnValue('DARK');
      matchMediaMock.mockReturnValue({ matches: false });
      
      renderWithThemeProvider(<TestComponent />);
      
      expect(screen.getByTestId('theme-status')).toHaveTextContent('dark');
    });
  });
}); 