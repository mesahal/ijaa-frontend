import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from '../../components/ThemeSelector';
import { THEME_OPTIONS  } from '../../../utils/themeApi';

// Mock the useTheme hook
jest.mock('../../context/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Monitor: () => <div data-testid="monitor-icon">Monitor</div>,
}));

// Import the mocked hook
import { useTheme } from '../../context/ThemeContext';

const renderThemeSelector = (props = {}) => {
  return render(<ThemeSelector {...props} />);
};

describe('ThemeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render all theme options', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    test('should render theme icons', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
    });

    test('should show label by default', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByText('Theme Preference')).toBeInTheDocument();
    });

    test('should hide label when showLabel is false', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector({ showLabel: false });
      
      expect(screen.queryByText('Theme Preference')).not.toBeInTheDocument();
    });

    test('should show description text', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByText(/Choose your preferred theme/)).toBeInTheDocument();
      expect(screen.getByText(/System.*will automatically follow/)).toBeInTheDocument();
    });
  });

           describe('Theme Selection', () => {
           test('should call setTheme when dark theme is selected', () => {
             const mockSetTheme = jest.fn();
             useTheme.mockReturnValue({
               theme: THEME_OPTIONS.DEVICE,
               setTheme: mockSetTheme,
               isLoading: false,
               error: null,
             });

             renderThemeSelector();

             fireEvent.click(screen.getByText('Dark'));

             expect(mockSetTheme).toHaveBeenCalledWith(THEME_OPTIONS.DARK);
           });

           test('should call setTheme when light theme is selected', () => {
             const mockSetTheme = jest.fn();
             useTheme.mockReturnValue({
               theme: THEME_OPTIONS.DEVICE,
               setTheme: mockSetTheme,
               isLoading: false,
               error: null,
             });

             renderThemeSelector();

             fireEvent.click(screen.getByText('Light'));

             expect(mockSetTheme).toHaveBeenCalledWith(THEME_OPTIONS.LIGHT);
           });

           test('should call setTheme when system theme is selected', () => {
             const mockSetTheme = jest.fn();
             useTheme.mockReturnValue({
               theme: THEME_OPTIONS.LIGHT, // Use different theme to ensure change
               setTheme: mockSetTheme,
               isLoading: false,
               error: null,
             });

             renderThemeSelector();

             fireEvent.click(screen.getByText('System'));

             expect(mockSetTheme).toHaveBeenCalledWith(THEME_OPTIONS.DEVICE);
           });

           test('should not call setTheme when same theme is clicked', () => {
             const mockSetTheme = jest.fn();
             useTheme.mockReturnValue({
               theme: THEME_OPTIONS.DARK,
               setTheme: mockSetTheme,
               isLoading: false,
               error: null,
             });

             renderThemeSelector();

             fireEvent.click(screen.getByText('Dark'));

             expect(mockSetTheme).not.toHaveBeenCalled();
           });
         });

  describe('Active Theme Highlighting', () => {
    test('should highlight dark theme when active', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DARK,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const darkButton = screen.getByText('Dark').closest('button');
      expect(darkButton).toHaveClass('bg-blue-500', 'text-white');
    });

    test('should highlight light theme when active', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.LIGHT,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const lightButton = screen.getByText('Light').closest('button');
      expect(lightButton).toHaveClass('bg-blue-500', 'text-white');
    });

    test('should highlight system theme when active', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const systemButton = screen.getByText('System').closest('button');
      expect(systemButton).toHaveClass('bg-blue-500', 'text-white');
    });

    test('should not highlight inactive themes', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DARK,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const lightButton = screen.getByText('Light').closest('button');
      const systemButton = screen.getByText('System').closest('button');
      
      expect(lightButton).not.toHaveClass('bg-blue-500');
      expect(systemButton).not.toHaveClass('bg-blue-500');
    });
  });

  describe('Loading State', () => {
    test('should show loading spinner when isLoading is true', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: true,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByText('Dark')).not.toBeInTheDocument();
    });

    test('should not show loading spinner when isLoading is false', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    test('should show error message when error exists', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: 'Theme loading failed',
      });
      
      renderThemeSelector();
      
      expect(screen.getByText('Theme error: Theme loading failed')).toBeInTheDocument();
      expect(screen.queryByText('Dark')).not.toBeInTheDocument();
    });

    test('should not show error message when error is null', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.queryByText(/Theme error:/)).not.toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    test('should apply small size classes', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector({ size: 'small' });
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('p-2', 'text-sm');
      });
    });

    test('should apply default size classes', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector({ size: 'default' });
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('p-3', 'text-base');
      });
    });

    test('should apply large size classes', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector({ size: 'large' });
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('p-4', 'text-lg');
      });
    });
  });

  describe('Responsive Design', () => {
    test('should hide text labels on small screens', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const textSpan = button.querySelector('span');
        if (textSpan) {
          expect(textSpan).toHaveClass('hidden', 'sm:inline');
        }
      });
    });

    test('should always show icons', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.getByTestId('monitor-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('should have proper button titles', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const darkButton = screen.getByText('Dark').closest('button');
      const lightButton = screen.getByText('Light').closest('button');
      const systemButton = screen.getByText('System').closest('button');
      
      expect(darkButton).toHaveAttribute('title', 'Switch to Dark theme');
      expect(lightButton).toHaveAttribute('title', 'Switch to Light theme');
      expect(systemButton).toHaveAttribute('title', 'Switch to System theme');
    });

    test('should have proper button roles', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });

    test('should have proper button labels', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('System')).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    test('should apply custom className', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector({ className: 'custom-class' });
      
      const container = screen.getByText('Theme Preference').closest('div');
      expect(container).toHaveClass('custom-class');
    });

    test('should apply default styling when no custom className', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      const container = screen.getByText('Theme Preference').closest('div');
      expect(container).toHaveClass('flex', 'flex-col', 'space-y-2');
    });
  });

  describe('Theme Context Integration', () => {
    test('should use theme context values correctly', () => {
      const mockSetTheme = jest.fn();
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.LIGHT,
        setTheme: mockSetTheme,
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      expect(screen.getByText('Light').closest('button')).toHaveClass('bg-blue-500');
      expect(screen.getByText('Dark').closest('button')).not.toHaveClass('bg-blue-500');
    });

    test('should call context setTheme function', () => {
      const mockSetTheme = jest.fn();
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: mockSetTheme,
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      fireEvent.click(screen.getByText('Dark'));
      
      expect(mockSetTheme).toHaveBeenCalledWith(THEME_OPTIONS.DARK);
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing theme context gracefully', () => {
      useTheme.mockReturnValue({
        theme: undefined,
        setTheme: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      // Should still render without crashing
      expect(screen.getByText('Theme Preference')).toBeInTheDocument();
    });

    test('should handle null setTheme function', () => {
      useTheme.mockReturnValue({
        theme: THEME_OPTIONS.DEVICE,
        setTheme: null,
        isLoading: false,
        error: null,
      });
      
      renderThemeSelector();
      
      // Should not crash when clicking buttons
      expect(() => {
        fireEvent.click(screen.getByText('Dark'));
      }).not.toThrow();
    });
  });
});
