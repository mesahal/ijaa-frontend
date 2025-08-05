import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('provides default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('light');
  });

  test('toggles theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    const toggleButton = screen.getByTestId('toggle-theme');

    expect(themeElement).toHaveTextContent('light');

    fireEvent.click(toggleButton);
    expect(themeElement).toHaveTextContent('dark');

    fireEvent.click(toggleButton);
    expect(themeElement).toHaveTextContent('light');
  });

  test('persists theme in localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('loads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('dark');
  });

  test('handles invalid localStorage theme value', () => {
    localStorage.setItem('theme', 'invalid-theme');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('light');
  });

  test('applies theme class to document', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement).toHaveClass('light');
  });

  test('updates document class when theme changes', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');

    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).not.toHaveClass('dark');

    fireEvent.click(toggleButton);

    expect(document.documentElement).toHaveClass('dark');
    expect(document.documentElement).not.toHaveClass('light');
  });

  test('handles system preference', () => {
    // Mock matchMedia to return dark mode preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('dark');
  });

  test('handles multiple theme toggles', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    const toggleButton = screen.getByTestId('toggle-theme');

    // Toggle multiple times
    fireEvent.click(toggleButton); // light -> dark
    expect(themeElement).toHaveTextContent('dark');

    fireEvent.click(toggleButton); // dark -> light
    expect(themeElement).toHaveTextContent('light');

    fireEvent.click(toggleButton); // light -> dark
    expect(themeElement).toHaveTextContent('dark');
  });

  test('provides theme context to multiple components', () => {
    const SecondComponent = () => {
      const { theme } = useTheme();
      return <span data-testid="second-theme">{theme}</span>;
    };

    render(
      <ThemeProvider>
        <TestComponent />
        <SecondComponent />
      </ThemeProvider>
    );

    const firstTheme = screen.getByTestId('current-theme');
    const secondTheme = screen.getByTestId('second-theme');

    expect(firstTheme).toHaveTextContent('light');
    expect(secondTheme).toHaveTextContent('light');

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    expect(firstTheme).toHaveTextContent('dark');
    expect(secondTheme).toHaveTextContent('dark');
  });

  test('handles theme context outside provider', () => {
    // This should not throw an error
    expect(() => {
      render(<TestComponent />);
    }).not.toThrow();
  });
}); 