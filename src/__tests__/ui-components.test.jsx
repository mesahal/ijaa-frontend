import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, Input, Card, Avatar, Badge   } from '../../components/ui';

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader-icon">Loading...</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
  CheckCircle: () => <div data-testid="check-icon">Check</div>,
  X: () => <div data-testid="x-icon">X</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

describe('UI Components', () => {
  describe('Button Component', () => {
    it('renders with default props', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('renders with primary variant', () => {
      render(<Button variant="primary">Primary Button</Button>);
      const button = screen.getByRole('button', { name: /primary button/i });
      expect(button).toHaveClass('bg-primary-600', 'hover:bg-primary-700');
    });

    it('renders with loading state', () => {
      render(<Button loading>Loading Button</Button>);
      const button = screen.getByRole('button', { name: /loading button/i });
      expect(button).toBeDisabled();
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    });

    it('renders with icon', () => {
      render(<Button icon={<div>Icon</div>}>Icon Button</Button>);
      const button = screen.getByRole('button', { name: /icon button/i });
      expect(button).toHaveTextContent('Icon');
    });

    it('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);
      const button = screen.getByRole('button', { name: /clickable/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders as link when as prop is provided', () => {
      render(<Button as="a" href="/test">Link Button</Button>);
      const link = screen.getByRole('link', { name: /link button/i });
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('Input Component', () => {
    it('renders with label', () => {
      render(<Input label="Email" placeholder="Enter email" />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    });

    it('renders with error state', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toHaveClass('border-error-300');
    });

    it('renders with success state', () => {
      render(<Input label="Email" success="Valid email" />);
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toHaveClass('border-success-300');
    });

    it('renders with left icon', () => {
      render(<Input label="Email" leftIcon={<div>Mail</div>} />);
      expect(screen.getByText(/mail/i)).toBeInTheDocument();
    });

    it('renders password input with toggle', () => {
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText(/password/i);
      expect(input).toHaveAttribute('type', 'password');
      
      const toggleButton = screen.getByRole('button', { name: /show password/i });
      fireEvent.click(toggleButton);
      expect(input).toHaveAttribute('type', 'text');
    });

    it('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Input label="Email" onChange={handleChange} />);
      const input = screen.getByLabelText(/email/i);
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Card Component', () => {
    it('renders with default props', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Card variant="elevated">Elevated</Card>);
      expect(screen.getByText(/elevated/i).closest('div')).toHaveClass('shadow-lg');

      rerender(<Card variant="outline">Outline</Card>);
      expect(screen.getByText(/outline/i).closest('div')).toHaveClass('border-2');

      rerender(<Card variant="ghost">Ghost</Card>);
      expect(screen.getByText(/ghost/i).closest('div')).toHaveClass('bg-transparent');
    });

    it('renders with interactive state', () => {
      render(<Card interactive>Interactive Card</Card>);
      const card = screen.getByText(/interactive card/i).closest('div');
      expect(card).toHaveClass('cursor-pointer', 'hover:scale-[1.02]');
    });

    it('renders with different padding sizes', () => {
      const { rerender } = render(<Card padding="sm">Small Padding</Card>);
      expect(screen.getByText(/small padding/i).closest('div')).toHaveClass('p-3');

      rerender(<Card padding="lg">Large Padding</Card>);
      expect(screen.getByText(/large padding/i).closest('div')).toHaveClass('p-8');
    });

    it('renders sub-components correctly', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
            <Card.Subtitle>Card Subtitle</Card.Subtitle>
          </Card.Header>
          <Card.Content>Card Content</Card.Content>
          <Card.Footer>Card Footer</Card.Footer>
        </Card>
      );

      expect(screen.getByText(/card title/i)).toBeInTheDocument();
      expect(screen.getByText(/card subtitle/i)).toBeInTheDocument();
      expect(screen.getByText(/card content/i)).toBeInTheDocument();
      expect(screen.getByText(/card footer/i)).toBeInTheDocument();
    });
  });

  describe('Avatar Component', () => {
    it('renders with default props', () => {
      render(<Avatar alt="User" />);
      const avatar = screen.getByAltText(/user/i);
      expect(avatar).toBeInTheDocument();
    });

    it('renders with image', () => {
      render(<Avatar src="/test-image.jpg" alt="User" />);
      const avatar = screen.getByAltText(/user/i);
      expect(avatar).toHaveAttribute('src', '/test-image.jpg');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Avatar size="sm" alt="User" />);
      expect(screen.getByAltText(/user/i).closest('div')).toHaveClass('h-8', 'w-8');

      rerender(<Avatar size="lg" alt="User" />);
      expect(screen.getByAltText(/user/i).closest('div')).toHaveClass('h-12', 'w-12');

      rerender(<Avatar size="xl" alt="User" />);
      expect(screen.getByAltText(/user/i).closest('div')).toHaveClass('h-16', 'w-16');
    });

    it('renders with status indicator', () => {
      render(<Avatar alt="User" status="online" />);
      const statusIndicator = screen.getByLabelText(/status: online/i);
      expect(statusIndicator).toBeInTheDocument();
      expect(statusIndicator).toHaveClass('bg-success-500');
    });

    it('renders initials when no image and alt is provided', () => {
      render(<Avatar alt="John Doe" />);
      expect(screen.getByText(/jd/i)).toBeInTheDocument();
    });

    it('renders fallback icon when no image, alt, or fallback is provided', () => {
      render(<Avatar />);
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });
  });

  describe('Badge Component', () => {
    it('renders with default props', () => {
      render(<Badge>Default Badge</Badge>);
      expect(screen.getByText(/default badge/i)).toBeInTheDocument();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<Badge variant="primary">Primary</Badge>);
      expect(screen.getByText(/primary/i).closest('span')).toHaveClass('bg-primary-100');

      rerender(<Badge variant="success">Success</Badge>);
      expect(screen.getByText(/success/i).closest('span')).toHaveClass('bg-success-100');

      rerender(<Badge variant="error">Error</Badge>);
      expect(screen.getByText(/error/i).closest('span')).toHaveClass('bg-error-100');
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<Badge size="sm">Small</Badge>);
      expect(screen.getByText(/small/i).closest('span')).toHaveClass('px-2', 'py-0.5', 'text-xs');

      rerender(<Badge size="lg">Large</Badge>);
      expect(screen.getByText(/large/i).closest('span')).toHaveClass('px-3', 'py-1', 'text-sm');
    });

    it('renders with remove button when removable', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Removable</Badge>);
      
      const removeButton = screen.getByRole('button', { name: /remove badge/i });
      expect(removeButton).toBeInTheDocument();
      
      fireEvent.click(removeButton);
      expect(handleRemove).toHaveBeenCalledTimes(1);
    });

    it('handles remove button click', () => {
      const handleRemove = jest.fn();
      render(<Badge removable onRemove={handleRemove}>Test Badge</Badge>);
      
      const removeButton = screen.getByRole('button', { name: /remove badge/i });
      fireEvent.click(removeButton);
      
      expect(handleRemove).toHaveBeenCalled();
    });
  });

  describe('Component Integration', () => {
    it('works together in a form', () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Test Form</Card.Title>
          </Card.Header>
          <Card.Content>
            <Input label="Name" placeholder="Enter your name" />
            <Button variant="primary">Submit</Button>
          </Card.Content>
        </Card>
      );

      expect(screen.getByText(/test form/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('handles accessibility attributes', () => {
      render(
        <div>
          <Input label="Email" id="email" aria-describedby="email-help" />
          <div id="email-help">Help text</div>
          <Button aria-label="Submit form">Submit</Button>
        </div>
      );

      const input = screen.getByLabelText(/email/i);
      expect(input).toHaveAttribute('aria-describedby', 'email-help');
      
      const button = screen.getByRole('button', { name: /submit form/i });
      expect(button).toHaveAttribute('aria-label', 'Submit form');
    });
  });
});
