import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../../components/ui/Button';

const renderButton = (props = {}) => {
  return render(
    <BrowserRouter>
      <Button {...props} />
    </BrowserRouter>
  );
};

describe('Button Component', () => {
  describe('Basic Functionality', () => {
    it('should render button with children', () => {
      renderButton({ children: 'Click me' });
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should handle click events', () => {
      const handleClick = jest.fn();
      renderButton({ children: 'Click me', onClick: handleClick });
      
      fireEvent.click(screen.getByText('Click me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when disabled prop is true', () => {
      renderButton({ children: 'Click me', disabled: true });
      expect(screen.getByText('Click me')).toBeDisabled();
    });

    it('should be disabled when loading prop is true', () => {
      renderButton({ children: 'Click me', loading: true });
      expect(screen.getByText('Click me')).toBeDisabled();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      renderButton({ children: 'Primary', variant: 'primary' });
      const button = screen.getByText('Primary');
      expect(button).toHaveClass('bg-primary-600');
    });

    it('should apply secondary variant styles', () => {
      renderButton({ children: 'Secondary', variant: 'secondary' });
      const button = screen.getByText('Secondary');
      expect(button).toHaveClass('bg-white');
    });

    it('should apply outline variant styles', () => {
      renderButton({ children: 'Outline', variant: 'outline' });
      const button = screen.getByText('Outline');
      expect(button).toHaveClass('border-2', 'border-primary-600');
    });

    it('should apply danger variant styles', () => {
      renderButton({ children: 'Danger', variant: 'danger' });
      const button = screen.getByText('Danger');
      expect(button).toHaveClass('bg-error-600');
    });

    it('should apply success variant styles', () => {
      renderButton({ children: 'Success', variant: 'success' });
      const button = screen.getByText('Success');
      expect(button).toHaveClass('bg-success-600');
    });

    it('should apply ghost variant styles', () => {
      renderButton({ children: 'Ghost', variant: 'ghost' });
      const button = screen.getByText('Ghost');
      expect(button).toHaveClass('text-gray-600');
    });

    it('should apply link variant styles', () => {
      renderButton({ children: 'Link', variant: 'link' });
      const button = screen.getByText('Link');
      expect(button).toHaveClass('text-primary-600');
    });
  });

  describe('Sizes', () => {
    it('should apply small size styles', () => {
      renderButton({ children: 'Small', size: 'sm' });
      const button = screen.getByText('Small');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should apply medium size styles', () => {
      renderButton({ children: 'Medium', size: 'md' });
      const button = screen.getByText('Medium');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('should apply large size styles', () => {
      renderButton({ children: 'Large', size: 'lg' });
      const button = screen.getByText('Large');
      expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('should apply extra large size styles', () => {
      renderButton({ children: 'XL', size: 'xl' });
      const button = screen.getByText('XL');
      expect(button).toHaveClass('px-8', 'py-4', 'text-lg');
    });
  });

  describe('Icons', () => {
    it('should render left icon', () => {
      const TestIcon = () => <span data-testid="test-icon">🚀</span>;
      renderButton({ 
        children: 'With Icon', 
        icon: <TestIcon />, 
        iconPosition: 'left' 
      });
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('should render right icon', () => {
      const TestIcon = () => <span data-testid="test-icon">🚀</span>;
      renderButton({ 
        children: 'With Icon', 
        icon: <TestIcon />, 
        iconPosition: 'right' 
      });
      
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });

    it('should not render icon when loading', () => {
      const TestIcon = () => <span data-testid="test-icon">🚀</span>;
      renderButton({ 
        children: 'Loading', 
        icon: <TestIcon />, 
        loading: true 
      });
      
      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading is true', () => {
      renderButton({ children: 'Loading', loading: true });
      
      // Check for loading spinner (Loader2 component)
      const loadingSpinner = screen.getByRole('button').querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should show loading text when loading is true', () => {
      renderButton({ children: 'Loading', loading: true });
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('should be disabled when loading is true', () => {
      renderButton({ children: 'Loading', loading: true });
      expect(screen.getByText('Loading')).toBeDisabled();
    });
  });

  describe('Full Width', () => {
    it('should apply full width styles when fullWidth is true', () => {
      renderButton({ children: 'Full Width', fullWidth: true });
      const button = screen.getByText('Full Width');
      expect(button).toHaveClass('w-full');
    });

    it('should not apply full width styles when fullWidth is false', () => {
      renderButton({ children: 'Not Full Width', fullWidth: false });
      const button = screen.getByText('Not Full Width');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('asChild Functionality', () => {
    it('should render as a link when asChild is true and children is a Link', () => {
      const { Link } = require('react-router-dom');
      renderButton({ 
        asChild: true,
        children: <Link to="/test">Link Button</Link>
      });
      
      const link = screen.getByText('Link Button');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should apply button styles to child element when asChild is true', () => {
      const { Link } = require('react-router-dom');
      renderButton({ 
        asChild: true,
        variant: 'primary',
        size: 'lg',
        children: <Link to="/test">Styled Link</Link>
      });
      
      const link = screen.getByText('Styled Link');
      expect(link).toHaveClass('bg-primary-600', 'px-6', 'py-3');
    });

    it('should pass disabled state to child element when asChild is true', () => {
      const { Link } = require('react-router-dom');
      renderButton({ 
        asChild: true,
        disabled: true,
        children: <Link to="/test">Disabled Link</Link>
      });
      
      const link = screen.getByText('Disabled Link');
      expect(link).toHaveAttribute('disabled');
    });

    it('should pass loading state to child element when asChild is true', () => {
      const { Link } = require('react-router-dom');
      renderButton({ 
        asChild: true,
        loading: true,
        children: <Link to="/test">Loading Link</Link>
      });
      
      const link = screen.getByText('Loading Link');
      expect(link).toHaveAttribute('disabled');
    });

    it('should pass additional props to child element when asChild is true', () => {
      const { Link } = require('react-router-dom');
      const handleClick = jest.fn();
      
      renderButton({ 
        asChild: true,
        onClick: handleClick,
        'data-testid': 'custom-button',
        children: <Link to="/test">Custom Link</Link>
      });
      
      const link = screen.getByText('Custom Link');
      expect(link).toHaveAttribute('data-testid', 'custom-button');
      
      fireEvent.click(link);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should render as regular button when asChild is false', () => {
      renderButton({ 
        asChild: false,
        children: 'Regular Button'
      });
      
      const button = screen.getByText('Regular Button');
      expect(button.tagName).toBe('BUTTON');
    });

    it('should render as regular button when asChild is not provided', () => {
      renderButton({ 
        children: 'Regular Button'
      });
      
      const button = screen.getByText('Regular Button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus styles', () => {
      renderButton({ children: 'Accessible' });
      const button = screen.getByText('Accessible');
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-primary-500');
    });

    it('should have proper disabled styles', () => {
      renderButton({ children: 'Disabled', disabled: true });
      const button = screen.getByText('Disabled');
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });
  });

  describe('Custom ClassName', () => {
    it('should apply custom className', () => {
      renderButton({ 
        children: 'Custom', 
        className: 'custom-class test-class' 
      });
      
      const button = screen.getByText('Custom');
      expect(button).toHaveClass('custom-class', 'test-class');
    });

    it('should merge custom className with default classes', () => {
      renderButton({ 
        children: 'Custom', 
        variant: 'primary',
        className: 'custom-class' 
      });
      
      const button = screen.getByText('Custom');
      expect(button).toHaveClass('custom-class', 'bg-primary-600');
    });
  });
});
