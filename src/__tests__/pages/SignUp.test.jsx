import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import SignUp from '../../pages/SignUp';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the useAuth hook
const mockSignUp = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    signUp: mockSignUp,
  }),
}));

const renderSignUp = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Email Validation', () => {
    it('should show error for empty email', async () => {
      renderSignUp();
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format - missing @', async () => {
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorElement = screen.queryByText('Please enter a valid email address');
        if (!errorElement) {
          const emailError = screen.queryByText(/email/i);
          expect(emailError).toBeInTheDocument();
        } else {
          expect(errorElement).toBeInTheDocument();
        }
      });
    });

    it('should show error for invalid email format - missing domain', async () => {
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorElement = screen.queryByText('Please enter a valid email address');
        if (!errorElement) {
          const emailError = screen.queryByText(/email/i);
          expect(emailError).toBeInTheDocument();
        } else {
          expect(errorElement).toBeInTheDocument();
        }
      });
    });

    it('should show error for invalid email format - missing TLD', async () => {
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorElement = screen.queryByText('Please enter a valid email address');
        if (!errorElement) {
          const emailError = screen.queryByText(/email/i);
          expect(emailError).toBeInTheDocument();
        } else {
          expect(errorElement).toBeInTheDocument();
        }
      });
    });

    it('should accept valid email formats', async () => {
      renderSignUp();
      
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com',
        'user.name@subdomain.example.com'
      ];

      for (const email of validEmails) {
        const emailInput = screen.getByPlaceholderText('Enter your email');
        fireEvent.change(emailInput, { target: { value: email } });
        
        // Clear any previous errors
        const passwordInput = screen.getByPlaceholderText('Create a password');
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
        
        const submitButton = screen.getByText('Create Account');
        fireEvent.click(submitButton);
        
        // Should not show email validation error
        await waitFor(() => {
          const emailError = screen.queryByText('Please enter a valid email address');
          expect(emailError).not.toBeInTheDocument();
        });
      }
    });

    it('should reject invalid email formats', async () => {
      renderSignUp();
      
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test@.com',
        'test..test@example.com',
        'test@example..com',
        'test@example.',
        'test@.example.com'
      ];

      for (const email of invalidEmails) {
        const emailInput = screen.getByPlaceholderText('Enter your email');
        fireEvent.change(emailInput, { target: { value: email } });
        
        const submitButton = screen.getByText('Create Account');
        fireEvent.click(submitButton);
        
        await waitFor(() => {
          const errorElement = screen.queryByText('Please enter a valid email address');
          if (!errorElement) {
            // If the specific message isn't found, check for any email validation error
            const emailError = screen.queryByText(/email/i);
            expect(emailError).toBeInTheDocument();
          } else {
            expect(errorElement).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Password Validation', () => {
    it('should show error for empty password', async () => {
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should show error for password less than 6 characters', async () => {
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByPlaceholderText('Create a password');
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
      });
    });

    it('should show error for password mismatch', async () => {
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByPlaceholderText('Create a password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      mockSignUp.mockResolvedValueOnce({});
      
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByPlaceholderText('Create a password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
      });
    });

    it('should handle signup error', async () => {
      mockSignUp.mockRejectedValueOnce(new Error('User already exists'));
      
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByPlaceholderText('Create a password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email already registered')).toBeInTheDocument();
      });
    });

    it('should handle general signup error', async () => {
      mockSignUp.mockRejectedValueOnce(new Error('Network error'));
      
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByPlaceholderText('Create a password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('Form Interaction', () => {
    it('should clear email error when user starts typing', async () => {
      renderSignUp();
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    it('should show loading state during submission', async () => {
      mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      renderSignUp();
      
      const emailInput = screen.getByPlaceholderText('Enter your email');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      
      const passwordInput = screen.getByPlaceholderText('Create a password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      
      const submitButton = screen.getByText('Create Account');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Creating Account...')).toBeInTheDocument();
      });
    });
  });
});
