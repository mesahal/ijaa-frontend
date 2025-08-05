import React from 'react';
import { render, screen } from '../utils/test-utils';
import { useAuth } from '../../context/AuthContext';
import AdminRoute from '../../components/AdminRoute';
import { MemoryRouter } from 'react-router-dom';

// Mock the AuthContext
jest.mock('../../context/AuthContext');

const mockUseAuth = useAuth;

describe('AdminRoute', () => {
  const TestComponent = () => <div>Admin Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user is admin', () => {
    mockUseAuth.mockReturnValue({
      user: { 
        username: 'admin', 
        token: 'mock-token',
        role: 'ADMIN'
      },
      loading: false
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
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
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
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false
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
    mockUseAuth.mockReturnValue({
      user: { 
        username: 'regularuser', 
        token: 'mock-token',
        role: 'USER'
      },
      loading: false
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
    mockUseAuth.mockReturnValue({
      user: { 
        username: 'user', 
        token: 'mock-token'
        // No role property
      },
      loading: false
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
    mockUseAuth.mockReturnValue({
      user: undefined,
      loading: false
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
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
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

  test('calls useAuth hook correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { username: 'admin', role: 'ADMIN' },
      loading: false
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <TestComponent />
        </AdminRoute>
      </MemoryRouter>
    );

    expect(mockUseAuth).toHaveBeenCalledTimes(1);
  });

  test('handles different admin role variations', () => {
    const adminRoles = ['ADMIN', 'admin', 'Admin'];
    
    adminRoles.forEach(role => {
      mockUseAuth.mockReturnValue({
        user: { 
          username: 'admin', 
          token: 'mock-token',
          role: role
        },
        loading: false
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