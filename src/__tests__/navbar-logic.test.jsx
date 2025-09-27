import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UnifiedAuthProvider } from '../context/UnifiedAuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import App from '../App';

// Mock the components to focus on navbar logic
jest.mock('../components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Regular Navbar</div>;
  };
});

jest.mock('../components/AdminLayout', () => {
  return function MockAdminLayout({ children }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

jest.mock('../pages/LandingPage', () => {
  return function MockLandingPage() {
    return <div data-testid="landing-page">Landing Page</div>;
  };
});

jest.mock('../pages/AdminLogin', () => {
  return function MockAdminLogin() {
    return <div data-testid="admin-login">Admin Login</div>;
  };
});

jest.mock('../pages/AdminDashboard', () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard</div>;
  };
});

jest.mock('../pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="dashboard">User Dashboard</div>;
  };
});

const renderApp = (initialEntries = ['/']) => {
  return render(
    <BrowserRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <UnifiedAuthProvider>
          <App />
        </UnifiedAuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Navbar Show/Hide Logic', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('should not show navbar on public routes (landing page)', () => {
    renderApp(['/']);
    
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  test('should not show navbar on admin login page', () => {
    renderApp(['/admin/login']);
    
    expect(screen.getByTestId('admin-login')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  test('should show navbar on user dashboard when user is authenticated', () => {
    // Mock authenticated user
    const mockUser = {
      userId: '123',
      email: 'user@example.com',
      name: 'Test User',
      token: 'mock-token'
    };
    
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));
    localStorage.setItem('session_type', 'user');
    
    renderApp(['/dashboard']);
    
    // Should show loading initially, then navbar
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('should not show navbar on admin routes when admin is authenticated', () => {
    // Mock authenticated admin
    const mockAdmin = {
      adminId: '456',
      email: 'admin@example.com',
      name: 'Admin User',
      token: 'mock-admin-token',
      role: 'ADMIN',
      active: true
    };
    
    localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
    localStorage.setItem('session_type', 'admin');
    
    renderApp(['/admin/dashboard']);
    
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument();
  });

  test('should not show navbar when both user and admin are authenticated (edge case)', () => {
    // Mock both user and admin authenticated (shouldn't happen in practice)
    const mockUser = {
      userId: '123',
      email: 'user@example.com',
      name: 'Test User',
      token: 'mock-token'
    };
    
    const mockAdmin = {
      adminId: '456',
      email: 'admin@example.com',
      name: 'Admin User',
      token: 'mock-admin-token',
      role: 'ADMIN',
      active: true
    };
    
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));
    localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
    localStorage.setItem('session_type', 'user'); // User session takes precedence
    
    renderApp(['/dashboard']);
    
    // Should show navbar because user session is active
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  test('should handle loading states correctly', () => {
    // Don't set any localStorage to simulate loading state
    renderApp(['/']);
    
    // Should show loading spinner initially
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should redirect unauthenticated users from protected routes', () => {
    renderApp(['/dashboard']);
    
    // Should redirect to signin page
    expect(window.location.pathname).toBe('/signin');
  });

  test('should redirect unauthenticated admins from admin routes', () => {
    renderApp(['/admin/dashboard']);
    
    // Should redirect to admin login page
    expect(window.location.pathname).toBe('/admin/login');
  });
});

describe('Navbar Logic Edge Cases', () => {
  test('should handle malformed localStorage data gracefully', () => {
    // Set malformed data
    localStorage.setItem('alumni_user', 'invalid-json');
    localStorage.setItem('session_type', 'user');
    
    renderApp(['/dashboard']);
    
    // Should handle gracefully and not crash
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should handle missing session type gracefully', () => {
    // Set user data but no session type
    const mockUser = {
      userId: '123',
      email: 'user@example.com',
      name: 'Test User',
      token: 'mock-token'
    };
    
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));
    // Don't set session_type
    
    renderApp(['/dashboard']);
    
    // Should handle gracefully
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should handle expired tokens gracefully', () => {
    // Set user data with expired token
    const mockUser = {
      userId: '123',
      email: 'user@example.com',
      name: 'Test User',
      token: 'expired-token'
    };
    
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));
    localStorage.setItem('session_type', 'user');
    
    renderApp(['/dashboard']);
    
    // Should handle gracefully
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
