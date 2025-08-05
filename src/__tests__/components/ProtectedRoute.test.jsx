import React from 'react';
import { render, screen } from '../utils/test-utils';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import { MemoryRouter } from 'react-router-dom';

// Mock the AuthContext
jest.mock('../../context/AuthContext');

const mockUseAuth = useAuth;

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { username: 'testuser', token: 'mock-token' },
      loading: false
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('shows loading spinner when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to signin when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false
    });

    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should redirect to signin page
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('handles undefined user gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: undefined,
      loading: false
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('handles null user gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders with custom loading component', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
    });

    const CustomLoading = () => <div>Custom Loading...</div>;

    render(
      <MemoryRouter>
        <ProtectedRoute loadingComponent={<CustomLoading />}>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });

  test('calls useAuth hook correctly', () => {
    mockUseAuth.mockReturnValue({
      user: { username: 'testuser' },
      loading: false
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(mockUseAuth).toHaveBeenCalledTimes(1);
  });
}); 