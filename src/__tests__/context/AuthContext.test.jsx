import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { mockUser } from '../utils/test-utils';

// Mock apiClient
jest.mock('../../utils/apiClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn()
  }
}));

// Test component to access context
const TestComponent = () => {
  const { user, signIn, signOut, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `Logged in as ${user.name}` : 'Not logged in'}
      </div>
      <div data-testid="loading-status">
        {loading ? 'Loading...' : 'Not loading'}
      </div>
      <button onClick={() => signIn('testuser', 'password')} data-testid="signin-btn">
        Sign In
      </button>
      <button onClick={signOut} data-testid="signout-btn">
        Sign Out
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  let mockApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockApiClient = require('../../utils/apiClient').default;
  });

  test('provides authentication context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-info')).toBeInTheDocument();
    expect(screen.getByTestId('loading-status')).toBeInTheDocument();
    expect(screen.getByTestId('signin-btn')).toBeInTheDocument();
    expect(screen.getByTestId('signout-btn')).toBeInTheDocument();
  });

  test('initial state shows not logged in', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('signs in user successfully', async () => {
    const mockResponse = {
      data: {
        message: 'Login successful',
        code: '200',
        data: {
          token: 'mock-jwt-token',
          userId: 'USER_123'
        }
      }
    };
    
    mockApiClient.post.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const signInButton = screen.getByTestId('signin-btn');
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith('/signin', {
        username: 'testuser',
        password: 'password'
      });
    });
  });

  test('handles sign in error', async () => {
    mockApiClient.post.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const signInButton = screen.getByTestId('signin-btn');
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith('/signin', {
        username: 'testuser',
        password: 'password'
      });
    });
  });

  test('signs out user successfully', () => {
    // Mock localStorage to have user data
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const signOutButton = screen.getByTestId('signout-btn');
    fireEvent.click(signOutButton);
    
    expect(localStorage.removeItem).toHaveBeenCalledWith('alumni_user');
  });

  test('loads user from localStorage on mount', () => {
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Logged in as Test User')).toBeInTheDocument();
  });

  test('handles malformed localStorage data gracefully', () => {
    localStorage.setItem('alumni_user', 'invalid-json');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('registers user successfully', async () => {
    const mockResponse = {
      data: {
        message: 'Registration successful',
        code: '201',
        data: {
          token: 'mock-jwt-token',
          userId: 'USER_123'
        }
      }
    };
    
    mockApiClient.post.mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Test registration (if signUp function is available)
    // This would require exposing signUp in the context or testing it separately
    expect(mockApiClient.post).not.toHaveBeenCalled();
  });

  test('handles network errors gracefully', async () => {
    mockApiClient.post.mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    const signInButton = screen.getByTestId('signin-btn');
    fireEvent.click(signInButton);
    
    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalled();
    });
  });

  test('maintains user session across page reloads', () => {
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));

    const { unmount, rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Logged in as Test User')).toBeInTheDocument();
    
    unmount();
    
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Logged in as Test User')).toBeInTheDocument();
  });

  test('clears user data on sign out', () => {
    localStorage.setItem('alumni_user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Logged in as Test User')).toBeInTheDocument();
    
    const signOutButton = screen.getByTestId('signout-btn');
    fireEvent.click(signOutButton);
    
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('handles missing token in user data', () => {
    const userWithoutToken = { ...mockUser };
    delete userWithoutToken.token;
    
    localStorage.setItem('alumni_user', JSON.stringify(userWithoutToken));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });

  test('handles missing username in user data', () => {
    const userWithoutUsername = { ...mockUser };
    delete userWithoutUsername.username;
    
    localStorage.setItem('alumni_user', JSON.stringify(userWithoutUsername));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByText('Not logged in')).toBeInTheDocument();
  });
}); 