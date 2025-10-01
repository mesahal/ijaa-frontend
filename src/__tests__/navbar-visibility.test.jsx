import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UnifiedAuthProvider, useUnifiedAuth } from '../context/UnifiedAuthContext';
import sessionManager from '../utils/sessionManager';

// Mock dependencies
jest.mock('../utils/sessionManager');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();

// Test component that simulates the App.jsx navbar visibility logic
const TestAppComponent = () => {
  const { user, admin, loading, isUser, isAdmin } = useAuth();
  const location = { pathname: '/dashboard' }; // Simulate being on a user page

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  // This is the same logic as in App.jsx
  const shouldShowNavbar = isUser() && !isAdmin() && !location.pathname.startsWith("/admin");

  return (
    <div>
      <div data-testid="user-state">{user ? 'user-logged-in' : 'no-user'}</div>
      <div data-testid="admin-state">{admin ? 'admin-logged-in' : 'no-admin'}</div>
      <div data-testid="is-user">{isUser() ? 'true' : 'false'}</div>
      <div data-testid="is-admin">{isAdmin() ? 'true' : 'false'}</div>
      <div data-testid="navbar-visible">{shouldShowNavbar ? 'visible' : 'hidden'}</div>
      <button data-testid="user-signin" onClick={() => signInUser()}>Sign In User</button>
      <button data-testid="admin-signin" onClick={() => signInAdmin()}>Sign In Admin</button>
      <button data-testid="signout" onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

// Helper functions to simulate authentication
const signInUser = async () => {
  const mockResponse = {
    ok: true,
    json: () => Promise.resolve({
      message: 'Login successful',
      data: { token: 'user-token', userId: '123' }
    })
  };
  global.fetch.mockResolvedValue(mockResponse);
  
  // Simulate the signIn call
  const response = await fetch('http://localhost:8000/ijaa/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'user@test.com', password: 'password123' })
  });
  
  const data = await response.json();
  const userData = {
    email: 'user@test.com',
    token: data.data.token,
    userId: data.data.userId,
  };
  
  sessionManager.handleSessionConflict('user');
  sessionManager.setUser(userData);
  
  // Trigger storage change event
  const storageCallback = sessionManager.onStorageChange.mock.calls[0][0];
  storageCallback({ type: 'user', data: userData });
};

const signInAdmin = async () => {
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
  
  // Simulate the adminSignIn call
  const response = await fetch(`${process.env.REACT_APP_API_ADMIN_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' })
  });
  
  const data = await response.json();
  const adminData = {
    email: data.data.email,
    name: data.data.name,
    token: data.data.token,
    adminId: data.data.adminId,
    role: data.data.role,
    active: data.data.active,
  };
  
  sessionManager.handleSessionConflict('admin');
  sessionManager.setAdmin(adminData);
  
  // Trigger storage change event
  const storageCallback = sessionManager.onStorageChange.mock.calls[0][0];
  storageCallback({ type: 'admin', data: adminData });
};

const signOut = () => {
  sessionManager.clearAll();
  
  // Trigger storage change event
  const storageCallback = sessionManager.onStorageChange.mock.calls[0][0];
  storageCallback({ type: null, data: null });
};

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <UnifiedAuthProvider>{component}</UnifiedAuthProvider>
    </BrowserRouter>
  );
};

describe('Navbar Visibility Issue Fix', () => {
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

  test('should show navbar immediately when user logs in after admin was logged in', async () => {
    let storageCallback;
    sessionManager.onStorageChange.mockImplementation((callback) => {
      storageCallback = callback;
      return () => {};
    });

    renderWithProviders(<TestAppComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // Simulate admin was previously logged in (this would be the case in the bug scenario)
    const mockAdmin = { 
      email: 'admin@test.com', 
      token: 'admin-token', 
      adminId: '456',
      role: 'ADMIN',
      active: true
    };
    
    // Simulate admin session from storage
    act(() => {
      storageCallback({ type: 'admin', data: mockAdmin });
    });

    await waitFor(() => {
      expect(screen.getByTestId('admin-state')).toHaveTextContent('admin-logged-in');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // Now simulate user logging in (this should clear admin and show navbar immediately)
    const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
    
    act(() => {
      storageCallback({ type: 'user', data: mockUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('user-logged-in');
      expect(screen.getByTestId('admin-state')).toHaveTextContent('no-admin');
      expect(screen.getByTestId('is-user')).toHaveTextContent('true');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('visible');
    });
  });

  test('should hide navbar immediately when admin logs in after user was logged in', async () => {
    let storageCallback;
    sessionManager.onStorageChange.mockImplementation((callback) => {
      storageCallback = callback;
      return () => {};
    });

    renderWithProviders(<TestAppComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // Simulate user was previously logged in
    const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
    
    act(() => {
      storageCallback({ type: 'user', data: mockUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-state')).toHaveTextContent('user-logged-in');
      expect(screen.getByTestId('is-user')).toHaveTextContent('true');
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('visible');
    });

    // Now simulate admin logging in (this should clear user and hide navbar immediately)
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

    await waitFor(() => {
      expect(screen.getByTestId('admin-state')).toHaveTextContent('admin-logged-in');
      expect(screen.getByTestId('user-state')).toHaveTextContent('no-user');
      expect(screen.getByTestId('is-admin')).toHaveTextContent('true');
      expect(screen.getByTestId('is-user')).toHaveTextContent('false');
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });
  });

  test('should handle cross-tab synchronization correctly', async () => {
    let storageCallback;
    sessionManager.onStorageChange.mockImplementation((callback) => {
      storageCallback = callback;
      return () => {};
    });

    renderWithProviders(<TestAppComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // Simulate user logging in from another tab
    const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
    
    act(() => {
      storageCallback({ type: 'user', data: mockUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('visible');
    });

    // Simulate admin logging in from another tab (should clear user and hide navbar)
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

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // Simulate logout from another tab
    act(() => {
      storageCallback({ type: null, data: null });
    });

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });
  });

  test('should maintain correct state during rapid authentication changes', async () => {
    let storageCallback;
    sessionManager.onStorageChange.mockImplementation((callback) => {
      storageCallback = callback;
      return () => {};
    });

    renderWithProviders(<TestAppComponent />);
    
    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // Rapidly change authentication states
    const mockUser = { email: 'user@test.com', token: 'user-token', userId: '123' };
    const mockAdmin = { 
      email: 'admin@test.com', 
      token: 'admin-token', 
      adminId: '456',
      role: 'ADMIN',
      active: true
    };

    // User login
    act(() => {
      storageCallback({ type: 'user', data: mockUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('visible');
    });

    // Admin login (should hide navbar)
    act(() => {
      storageCallback({ type: 'admin', data: mockAdmin });
    });

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });

    // User login again (should show navbar)
    act(() => {
      storageCallback({ type: 'user', data: mockUser });
    });

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('visible');
    });

    // Logout (should hide navbar)
    act(() => {
      storageCallback({ type: null, data: null });
    });

    await waitFor(() => {
      expect(screen.getByTestId('navbar-visible')).toHaveTextContent('hidden');
    });
  });
});
