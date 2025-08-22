import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UnifiedAuthProvider, useUnifiedAuth } from '../../context/UnifiedAuthContext';
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
  const { 
    user, 
    admin, 
    loading, 
    signIn, 
    signUp, 
    signOut, 
    adminSignIn, 
    adminSignOut,
    isAuthenticated,
    isUser,
    isAdmin,
    getCurrentUser,
    getCurrentUserType
  } = useUnifiedAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no-user'}</div>
      <div data-testid="admin">{admin ? JSON.stringify(admin) : 'no-admin'}</div>
      <div data-testid="is-authenticated">{isAuthenticated() ? 'authenticated' : 'not-authenticated'}</div>
      <div data-testid="is-user">{isUser() ? 'is-user' : 'not-user'}</div>
      <div data-testid="is-admin">{isAdmin() ? 'is-admin' : 'not-admin'}</div>
      <div data-testid="current-user">{getCurrentUser() ? JSON.stringify(getCurrentUser()) : 'no-current-user'}</div>
      <div data-testid="user-type">{getCurrentUserType() || 'no-type'}</div>
      <button data-testid="signin" onClick={() => signIn('user@test.com', 'password123')}>
        User Sign In
      </button>
      <button data-testid="signup" onClick={() => signUp({ email: 'newuser@test.com', password: 'password123' })}>
        User Sign Up
      </button>
      <button data-testid="signout" onClick={signOut}>
        Sign Out
      </button>
      <button data-testid="admin-signin" onClick={() => adminSignIn('admin@test.com', 'admin123')}>
        Admin Sign In
      </button>
      <button data-testid="admin-signout" onClick={adminSignOut}>
        Admin Sign Out
      </button>
    </div>
  );
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <UnifiedAuthProvider>{component}</UnifiedAuthProvider>
    </BrowserRouter>
  );
};

describe('UnifiedAuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock sessionManager methods
    sessionManager.cleanupOldVariables.mockImplementation(() => {});
    sessionManager.getCurrentSession.mockReturnValue({ type: null, data: null });
    sessionManager.setUser.mockImplementation(() => {});
    sessionManager.setAdmin.mockImplementation(() => {});
    sessionManager.clearUser.mockImplementation(() => {});
    sessionManager.clearAdmin.mockImplementation(() => {});
    sessionManager.clearAll.mockImplementation(() => {});
    sessionManager.handleSessionConflict.mockImplementation(() => {});
    sessionManager.onStorageChange.mockReturnValue(() => {});
  });

  describe('Initialization', () => {
    test('should start with loading state and no user/admin', () => {
      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('is-user')).toHaveTextContent('not-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
    });

    test('should load existing user session on initialization', async () => {
      const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
      sessionManager.getCurrentSession.mockReturnValue({ type: 'user', data: mockUser });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('is-user')).toHaveTextContent('is-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
      expect(screen.getByTestId('user-type')).toHaveTextContent('user');
    });

    test('should load existing admin session on initialization', async () => {
      const mockAdmin = { 
        email: 'admin@test.com', 
        token: 'admin-token', 
        adminId: '456',
        role: 'ADMIN',
        active: true
      };
      sessionManager.getCurrentSession.mockReturnValue({ type: 'admin', data: mockAdmin });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('is-user')).toHaveTextContent('not-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('is-admin');
      expect(screen.getByTestId('user-type')).toHaveTextContent('admin');
    });

    test('should handle invalid session data gracefully', async () => {
      sessionManager.getCurrentSession.mockReturnValue({ type: 'user', data: { email: 'user@test.com' } }); // Missing token
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(sessionManager.clearUser).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
    });
  });

  describe('User Authentication', () => {
    test('should handle successful user sign in', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          data: { token: 'user-token', userId: '123' }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(sessionManager.handleSessionConflict).toHaveBeenCalledWith('user');
        expect(sessionManager.setUser).toHaveBeenCalledWith({
          email: 'user@test.com',
          token: 'user-token',
          userId: '123'
        });
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify({
        email: 'user@test.com',
        token: 'user-token',
        userId: '123'
      }));
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('is-user')).toHaveTextContent('is-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
    });

    test('should handle user sign in error', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: 'Invalid credentials' })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      await expect(async () => {
        fireEvent.click(screen.getByTestId('signin'));
        await waitFor(() => {});
      }).rejects.toThrow('Invalid credentials');
    });

    test('should handle successful user sign up', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Registration successful',
          data: { token: 'user-token', userId: '123' }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signup'));
      
      await waitFor(() => {
        expect(sessionManager.handleSessionConflict).toHaveBeenCalledWith('user');
        expect(sessionManager.setUser).toHaveBeenCalledWith({
          email: 'newuser@test.com',
          token: 'user-token',
          userId: '123'
        });
      });
    });

    test('should handle user sign out', async () => {
      // First sign in a user
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          data: { token: 'user-token', userId: '123' }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(screen.getByTestId('is-user')).toHaveTextContent('is-user');
      });
      
      // Then sign out
      fireEvent.click(screen.getByTestId('signout'));
      
      expect(sessionManager.clearAll).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated');
    });
  });

  describe('Admin Authentication', () => {
    test('should handle successful admin sign in', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: { 
            token: 'admin-token', 
            adminId: '456',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            active: true
          }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('admin-signin'));
      
      await waitFor(() => {
        expect(sessionManager.handleSessionConflict).toHaveBeenCalledWith('admin');
        expect(sessionManager.setAdmin).toHaveBeenCalledWith({
          email: 'admin@test.com',
          name: 'Admin User',
          token: 'admin-token',
          adminId: '456',
          role: 'ADMIN',
          active: true
        });
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify({
        email: 'admin@test.com',
        name: 'Admin User',
        token: 'admin-token',
        adminId: '456',
        role: 'ADMIN',
        active: true
      }));
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('is-user')).toHaveTextContent('not-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('is-admin');
    });

    test('should handle admin sign in with invalid role', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: { 
            token: 'admin-token', 
            adminId: '456',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'USER', // Invalid role
            active: true
          }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      await expect(async () => {
        fireEvent.click(screen.getByTestId('admin-signin'));
        await waitFor(() => {});
      }).rejects.toThrow('Invalid admin role. Only ADMIN role is supported.');
    });

    test('should handle admin sign out', async () => {
      // First sign in an admin
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: { 
            token: 'admin-token', 
            adminId: '456',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            active: true
          }
        })
      };
      global.fetch.mockResolvedValue(mockResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('admin-signin'));
      
      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('is-admin');
      });
      
      // Then sign out
      fireEvent.click(screen.getByTestId('admin-signout'));
      
      expect(sessionManager.clearAll).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated');
    });
  });

  describe('Session Conflict Resolution', () => {
    test('should clear admin session when user signs in', async () => {
      // First sign in an admin
      const adminResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: { 
            token: 'admin-token', 
            adminId: '456',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            active: true
          }
        })
      };
      
      // Then sign in a user
      const userResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          data: { token: 'user-token', userId: '123' }
        })
      };
      
      global.fetch
        .mockResolvedValueOnce(adminResponse)
        .mockResolvedValueOnce(userResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Sign in admin first
      fireEvent.click(screen.getByTestId('admin-signin'));
      
      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('is-admin');
      });
      
      // Then sign in user
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(screen.getByTestId('is-user')).toHaveTextContent('is-user');
        expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify({
        email: 'user@test.com',
        token: 'user-token',
        userId: '123'
      }));
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
    });

    test('should clear user session when admin signs in', async () => {
      // First sign in a user
      const userResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Login successful',
          data: { token: 'user-token', userId: '123' }
        })
      };
      
      // Then sign in an admin
      const adminResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: { 
            token: 'admin-token', 
            adminId: '456',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            active: true
          }
        })
      };
      
      global.fetch
        .mockResolvedValueOnce(userResponse)
        .mockResolvedValueOnce(adminResponse);
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Sign in user first
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(screen.getByTestId('is-user')).toHaveTextContent('is-user');
      });
      
      // Then sign in admin
      fireEvent.click(screen.getByTestId('admin-signin'));
      
      await waitFor(() => {
        expect(screen.getByTestId('is-admin')).toHaveTextContent('is-admin');
        expect(screen.getByTestId('is-user')).toHaveTextContent('not-user');
      });
      
      expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify({
        email: 'admin@test.com',
        name: 'Admin User',
        token: 'admin-token',
        adminId: '456',
        role: 'ADMIN',
        active: true
      }));
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    });
  });

  describe('Storage Change Handling', () => {
    test('should handle storage changes for user session', async () => {
      let storageCallback;
      sessionManager.onStorageChange.mockImplementation((callback) => {
        storageCallback = callback;
        return () => {};
      });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Simulate storage change for user session
      const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
      act(() => {
        storageCallback({ type: 'user', data: mockUser });
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-user')).toHaveTextContent('is-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
    });

    test('should handle storage changes for admin session', async () => {
      let storageCallback;
      sessionManager.onStorageChange.mockImplementation((callback) => {
        storageCallback = callback;
        return () => {};
      });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Simulate storage change for admin session
      const mockAdmin = { 
        email: 'admin@test.com', 
        token: 'admin-token', 
        adminId: '456',
        role: 'ADMIN',
        active: true
      };
      act(() => {
        storageCallback({ type: 'admin', data: mockAdmin });
      });
      
      expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('is-admin');
      expect(screen.getByTestId('is-user')).toHaveTextContent('not-user');
    });

    test('should handle storage changes for logout', async () => {
      let storageCallback;
      sessionManager.onStorageChange.mockImplementation((callback) => {
        storageCallback = callback;
        return () => {};
      });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Simulate storage change for logout
      act(() => {
        storageCallback({ type: null, data: null });
      });
      
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated');
    });
  });

  describe('Helper Methods', () => {
    test('should return correct authentication status', async () => {
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Initially not authenticated
      expect(screen.getByTestId('is-authenticated')).toHaveTextContent('not-authenticated');
      expect(screen.getByTestId('is-user')).toHaveTextContent('not-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('not-admin');
      expect(screen.getByTestId('current-user')).toHaveTextContent('no-current-user');
      expect(screen.getByTestId('user-type')).toHaveTextContent('no-type');
    });

    test('should return correct current user when user is logged in', async () => {
      const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
      sessionManager.getCurrentSession.mockReturnValue({ type: 'user', data: mockUser });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(screen.getByTestId('current-user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('user-type')).toHaveTextContent('user');
    });

    test('should return correct current user when admin is logged in', async () => {
      const mockAdmin = { 
        email: 'admin@test.com', 
        token: 'admin-token', 
        adminId: '456',
        role: 'ADMIN',
        active: true
      };
      sessionManager.getCurrentSession.mockReturnValue({ type: 'admin', data: mockAdmin });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(screen.getByTestId('current-user')).toHaveTextContent(JSON.stringify(mockAdmin));
      expect(screen.getByTestId('user-type')).toHaveTextContent('admin');
    });
  });

  describe('Error Handling', () => {
    test('should handle useUnifiedAuth hook outside provider', () => {
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useUnifiedAuth must be used within a UnifiedAuthProvider');
    });

    test('should handle initialization errors gracefully', async () => {
      sessionManager.getCurrentSession.mockImplementation(() => {
        throw new Error('Session error');
      });
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      expect(sessionManager.clearAll).toHaveBeenCalled();
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
    });
  });
});
