import React from 'react';
import { render, screen  } from '../../../utils/test-utils';
import { useAuth } from '../../hooks/useAuth';
import AdminRoute from '../../components/AdminRoute';
import { MemoryRouter } from 'react-router-dom';

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext');

const mockUseUnifiedAuth = useUnifiedAuth;

describe('AdminRoute', () => {
  const TestComponent = () => <div>Admin Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user is admin', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: { 
        username: 'admin', 
        role: 'ADMIN',
        active: true
      },
      loading: false,
      isAdmin: () => true
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('shows loading spinner when authentication is loading', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: null,
      loading: true,
      isAdmin: () => false
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('redirects to signin when user is not authenticated', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: null,
      loading: false,
      isAdmin: () => false
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('redirects to dashboard when user is not admin', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: null,
      user: { 
        username: 'regularuser', 
        role: 'USER'
      },
      loading: false,
      isAdmin: () => false
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('handles user without role property', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: null,
      user: { 
        username: 'user'
        // No role property
      },
      loading: false,
      isAdmin: () => false
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('handles undefined user gracefully', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: null,
      user: undefined,
      loading: false,
      isAdmin: () => false
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('renders with custom loading component', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: null,
      loading: true,
      isAdmin: () => false
    });

    const CustomLoading = () => <div>Admin Loading...</div>;

    render(
      <MemoryRouter>
        <AdminRoute loadingComponent={<CustomLoading />}>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Loading...')).toBeInTheDocument();
  });

  test('calls useUnifiedAuth hook correctly', () => {
    mockUseUnifiedAuth.mockReturnValue({
      admin: { username: 'admin', role: 'ADMIN', active: true },
      loading: false,
      isAdmin: () => true
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(mockUseUnifiedAuth).toHaveBeenCalledTimes(1);
  });

  test('handles different admin role variations', () => {
    const adminRoles = ['ADMIN', 'admin', 'Admin'];
    
    adminRoles.forEach(role => {
      mockUseUnifiedAuth.mockReturnValue({
        admin: { 
          username: 'admin', 
          role: role,
          active: true
        },
        loading: false,
        isAdmin: () => true
      });

      const { unmount } = render(
        <MemoryRouter>
          <AdminRoute>
            <TestComponent />
          </AdminRoute>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      unmount();
    });
  });
}); 