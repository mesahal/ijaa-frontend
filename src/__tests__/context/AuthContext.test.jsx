import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import sessionManager from '../../utils/sessionManager';

// Mock dependencies
jest.mock('../../utils/sessionManager');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Test component to access context
const TestComponent = () => {
  const { user, loading, signIn, signOut, signUp } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</div>
      <button data-testid="signin" onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button data-testid="signup" onClick={() => signUp({ email: 'test@example.com', password: 'password' })}>
        Sign Up
      </button>
      <button data-testid="signout" onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Initialization', () => {
    test('should show loading state initially', () => {
      sessionManager.getUserSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });

    test('should load existing user session from sessionManager', async () => {
      const mockUser = {
        email: 'test@example.com',
        token: 'mock-token',
        name: 'Test User'
      };
      
      sessionManager.getUserSession.mockReturnValue({ data: mockUser });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
        expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      });
    });

    test('should clear invalid user data', async () => {
      sessionManager.getUserSession.mockReturnValue({ data: { email: 'test@example.com' } }); // Missing token
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearUser).toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });

    test('should handle session manager errors gracefully', async () => {
      sessionManager.getUserSession.mockImplementation(() => {
        throw new Error('Session error');
      });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearUser).toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });
  });

  describe('Sign In', () => {
    test('should successfully sign in user', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          data: {
            token: 'mock-jwt-token',
            user: {
              email: 'test@example.com',
              name: 'Test User',
              userId: 'USER_123'
            }
          }
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      sessionManager.setUserSession.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/signin'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password'
            })
          })
        );
      });
    });

    test('should handle sign in network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });

    test('should handle sign in API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          message: 'Invalid credentials',
          code: '401'
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });

    test('should handle malformed API responses', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Success',
          // Missing data field
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Sign Up', () => {
    test('should successfully sign up user', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Registration successful',
          data: {
            token: 'mock-jwt-token',
            user: {
              email: 'test@example.com',
              name: 'Test User',
              userId: 'USER_123'
            }
          }
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      sessionManager.setUserSession.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signup'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/signup'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password'
            })
          })
        );
      });
    });

    test('should handle sign up validation errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          message: 'Validation failed',
          errors: ['Email is required', 'Password must be at least 8 characters']
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signup'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Sign Out', () => {
    test('should successfully sign out user', async () => {
      sessionManager.getUserSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      sessionManager.clearUser.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signout'));
      
      await waitFor(() => {
        expect(sessionManager.clearUser).toHaveBeenCalled();
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });
  });

  describe('Auto Logout', () => {
    test('should handle automatic logout events', async () => {
      sessionManager.getUserSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Simulate auto logout event
      act(() => {
        window.dispatchEvent(new CustomEvent('auth:logout', {
          detail: { reason: 'token_expired' }
        }));
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      });
    });
  });

  describe('Storage Change Events', () => {
    test('should handle storage change events', async () => {
      sessionManager.getUserSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      sessionManager.onStorageChange.mockReturnValue(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.onStorageChange).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle useAuth hook outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');
      
      consoleSpy.mockRestore();
    });
  });

  describe('API Base URL Configuration', () => {
    test('should use default API base URL when environment variable is not set', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      delete process.env.REACT_APP_API_BASE_URL;
      
      sessionManager.getUserSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      // Trigger sign in to check API call
      fireEvent.click(screen.getByTestId('signin'));
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8000/ijaa/api/v1/auth/login'),
        expect.any(Object)
      );
      
      // Restore environment variable
      if (originalEnv) {
        process.env.REACT_APP_API_BASE_URL = originalEnv;
      }
    });

    test('should use environment variable for API base URL', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      process.env.REACT_APP_API_BASE_URL = 'https://custom-api.com';
      
      sessionManager.getUserSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      // Trigger sign in to check API call
      fireEvent.click(screen.getByTestId('signin'));
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom-api.com/signin'),
        expect.any(Object)
      );
      
      // Restore environment variable
      if (originalEnv) {
        process.env.REACT_APP_API_BASE_URL = originalEnv;
      } else {
        delete process.env.REACT_APP_API_BASE_URL;
      }
    });
  });
}); 