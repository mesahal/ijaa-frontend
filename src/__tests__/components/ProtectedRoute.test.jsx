import React from 'react';
import { render, screen  } from '../../../utils/test-utils';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';

// Mock the UnifiedAuthContext
const mockUseUnifiedAuth = jest.fn();
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: mockUseUnifiedAuth
}));

describe('ProtectedRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders children when user is authenticated', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: false,
      isUser: () => true
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('shows loading spinner when authentication is loading', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: true,
      isUser: () => false
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('redirects to signin when user is not authenticated', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: false,
      isUser: () => false
    });

    const { container } = render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should redirect to signin page
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('handles undefined user gracefully', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: false,
      isUser: () => false
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('handles null user gracefully', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: false,
      isUser: () => false
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('renders with custom loading component', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: true,
      isUser: () => false
    });

    const CustomLoading = () => <div>Custom Loading...</div>;

    render(
      <ProtectedRoute loadingComponent={<CustomLoading />}>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });

  test('calls useUnifiedAuth hook correctly', () => {
    mockUseUnifiedAuth.mockReturnValue({
      loading: false,
      isUser: () => true
    });

    render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(mockUseUnifiedAuth).toHaveBeenCalledTimes(1);
  });
}); 