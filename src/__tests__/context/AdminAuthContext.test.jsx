import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '../../context/AdminAuthContext';
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
  const { admin, loading, signIn, signOut } = useAdminAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="admin">{admin ? JSON.stringify(admin) : 'no-admin'}</div>
      <button data-testid="signin" onClick={() => signIn('admin@ijaa.com', 'admin123')}>
        Admin Sign In
      </button>
      <button data-testid="signout" onClick={signOut}>
        Admin Sign Out
      </button>
    </div>
  );
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AdminAuthProvider>{component}</AdminAuthProvider>
    </BrowserRouter>
  );
};

describe('AdminAuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Initialization', () => {
    test('should show loading state initially', () => {
      sessionManager.getAdminSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    });

    test('should load existing admin session from sessionManager', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
        expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      });
    });

    test('should clear invalid admin data', async () => {
      sessionManager.getAdminSession.mockReturnValue({ data: { email: 'admin@ijaa.com' } }); // Missing token
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });

    test('should handle session manager errors gracefully', async () => {
      sessionManager.getAdminSession.mockImplementation(() => {
        throw new Error('Session error');
      });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });
  });

  describe('Admin Sign In', () => {
    test('should successfully sign in admin', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: {
            token: 'mock-admin-jwt-token',
            admin: {
              email: 'admin@ijaa.com',
              name: 'Admin User',
              adminId: 1,
              role: 'ADMIN'
            }
          }
        })
      };
      
      fetch.mockResolvedValue(mockResponse);
      sessionManager.setAdminSession.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signin'));
      
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/admin/signin'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              email: 'admin@ijaa.com',
              password: 'admin123'
            })
          })
        );
      });
    });

    test('should handle admin sign in network errors', async () => {
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

    test('should handle admin sign in API errors', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          message: 'Invalid admin credentials',
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

    test('should handle malformed admin API responses', async () => {
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

    test('should handle admin authentication with missing required fields', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          message: 'Admin login successful',
          data: {
            token: 'mock-admin-jwt-token',
            admin: {
              email: 'admin@ijaa.com',
              // Missing adminId and role
            }
          }
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

  describe('Admin Sign Out', () => {
    test('should successfully sign out admin', async () => {
      sessionManager.getAdminSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      sessionManager.clearAdmin.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      fireEvent.click(screen.getByTestId('signout'));
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });
  });

  describe('Admin Permissions', () => {
    test('should handle admin with full permissions', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN',
        permissions: ['canManageUsers', 'canManageAnnouncements', 'canManageReports', 'canManageFeatureFlags']
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      });
    });

    test('should handle admin with limited permissions', async () => {
      const mockAdmin = {
        email: 'moderator@ijaa.com',
        token: 'mock-admin-token',
        name: 'Moderator User',
        adminId: 2,
        role: 'MODERATOR',
        permissions: ['canManageAnnouncements']
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      });
    });

    test('should handle admin without permissions array', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
        // No permissions array
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      });
    });
  });

  describe('Auto Logout', () => {
    test('should handle automatic admin logout events', async () => {
      sessionManager.getAdminSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
      });
      
      // Simulate auto logout event
      act(() => {
        window.dispatchEvent(new CustomEvent('admin:logout', {
          detail: { reason: 'token_expired' }
        }));
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });
  });

  describe('Storage Change Events', () => {
    test('should handle admin storage change events', async () => {
      sessionManager.getAdminSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      sessionManager.onStorageChange.mockReturnValue(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.onStorageChange).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle useAdminAuth hook outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAdminAuth must be used within an AdminAuthProvider');
      
      consoleSpy.mockRestore();
    });

    test('should handle admin session validation errors', async () => {
      sessionManager.getAdminSession.mockReturnValue({ data: { email: 'admin@ijaa.com' } }); // Missing required fields
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });
  });

  describe('API Base URL Configuration', () => {
    test('should use default API base URL for admin endpoints', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      delete process.env.REACT_APP_API_BASE_URL;
      
      sessionManager.getAdminSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      // Trigger admin sign in to check API call
      fireEvent.click(screen.getByTestId('signin'));
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('http://localhost:8000/ijaa/api/v1/user/admin/signin'),
        expect.any(Object)
      );
      
      // Restore environment variable
      if (originalEnv) {
        process.env.REACT_APP_API_BASE_URL = originalEnv;
      }
    });

    test('should use environment variable for admin API base URL', () => {
      const originalEnv = process.env.REACT_APP_API_BASE_URL;
      process.env.REACT_APP_API_BASE_URL = 'https://custom-api.com';
      
      sessionManager.getAdminSession.mockReturnValue(null);
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      // Trigger admin sign in to check API call
      fireEvent.click(screen.getByTestId('signin'));
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom-api.com/admin/signin'),
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

  describe('Admin Role Validation', () => {
    test('should validate admin role correctly', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      });
    });

    test('should handle invalid admin role', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1,
        role: 'INVALID_ROLE'
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });

    test('should handle missing admin role', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1
        // Missing role
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });
  });

  describe('Admin ID Validation', () => {
    test('should validate admin ID correctly', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 1,
        role: 'ADMIN'
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(screen.getByTestId('admin')).toHaveTextContent(JSON.stringify(mockAdmin));
      });
    });

    test('should handle missing admin ID', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        role: 'ADMIN'
        // Missing adminId
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });

    test('should handle invalid admin ID type', async () => {
      const mockAdmin = {
        email: 'admin@ijaa.com',
        token: 'mock-admin-token',
        name: 'Admin User',
        adminId: 'invalid-id', // Should be number
        role: 'ADMIN'
      };
      
      sessionManager.getAdminSession.mockReturnValue({ data: mockAdmin });
      sessionManager.cleanupOldVariables.mockImplementation(() => {});
      
      renderWithProviders(<TestComponent />);
      
      await waitFor(() => {
        expect(sessionManager.clearAdmin).toHaveBeenCalled();
        expect(screen.getByTestId('admin')).toHaveTextContent('no-admin');
      });
    });
  });
});
