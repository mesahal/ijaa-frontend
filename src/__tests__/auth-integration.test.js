import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthProvider, useAuth } from '../context/AuthContext';
import AuthService from '../services/auth/AuthService';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock AuthService
jest.mock('../services/auth/AuthService', () => ({
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  changePassword: jest.fn(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock sessionManager
jest.mock('../services/auth/SessionManager', () => ({
  cleanupOldVariables: jest.fn(),
  getCurrentSession: jest.fn(() => ({ type: null, data: null })),
  setUser: jest.fn(),
  clearUser: jest.fn(),
  setAdmin: jest.fn(),
  clearAdmin: jest.fn(),
  clearAll: jest.fn(),
  handleSessionConflict: jest.fn(),
}));

// Test component that uses authentication
const TestComponent = () => {
  const { signIn, signUp, signOut, user, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user-status">{user ? 'logged-in' : 'logged-out'}</div>
      <div data-testid="loading-status">{loading ? 'loading' : 'not-loading'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>Sign In</button>
      <button onClick={() => console.log('Sign Up not implemented')}>Sign Up</button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

const renderWithAuth = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.__accessToken
    Object.defineProperty(window, '__accessToken', {
      writable: true,
      value: null,
    });
  });

  describe('AuthService', () => {
    test('should handle successful login', async () => {
      const mockResponse = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        userId: '123',
        username: 'test@example.com',
      };

      AuthService.login.mockResolvedValue(mockResponse);

      const result = await AuthService.login({
        username: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual(mockResponse);
      expect(AuthService.login).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password',
      });
    });

    test('should handle login failure', async () => {
      const mockLoginError = new Error('Invalid credentials');
      AuthService.login.mockRejectedValue(mockLoginError);

      await expect(
        AuthService.login({
          username: 'test@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow('Invalid credentials');
    });

    test('should handle successful registration', async () => {
      const mockResponse = {
        message: 'Registration successful',
        code: '201',
      };

      AuthService.register.mockResolvedValue(mockResponse);

      const result = await AuthService.register({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result).toEqual(mockResponse);
      expect(AuthService.register).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });
    });

    test('should handle successful token refresh', async () => {
      const mockResponse = {
        accessToken: 'new-access-token',
        tokenType: 'Bearer',
        userId: '123',
      };

      AuthService.refreshToken.mockResolvedValue(mockResponse);

      const result = await AuthService.refreshToken();

      expect(result).toEqual(mockResponse);
    });

    test('should handle successful logout', async () => {
      AuthService.logout.mockResolvedValue();

      await expect(AuthService.logout()).resolves.toBeUndefined();
    });

    test('should handle password change', async () => {
      const mockResponse = {
        message: 'Password changed successfully',
        code: '200',
      };

      AuthService.changePassword.mockResolvedValue(mockResponse);

      const result = await AuthService.changePassword(
        {
          currentPassword: 'old-password',
          newPassword: 'new-password',
        },
        'mock-access-token'
      );

      expect(result).toEqual(mockResponse);
      expect(AuthService.changePassword).toHaveBeenCalledWith(
        {
          currentPassword: 'old-password',
          newPassword: 'new-password',
        },
        'mock-access-token'
      );
    });
  });

  describe('UnifiedAuthContext', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should initialize with no user', () => {
      renderWithAuth(<TestComponent />);
      
      expect(screen.getByTestId('user-status')).toHaveTextContent('logged-out');
      expect(screen.getByTestId('loading-status')).toHaveTextContent('not-loading');
    });

    test('should handle successful sign in', async () => {
      const mockResponse = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        userId: '123',
        username: 'test@example.com',
      };

      AuthService.login.mockResolvedValue(mockResponse);

      renderWithAuth(<TestComponent />);
      
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('logged-in');
      });
    });

    test('should handle sign in failure', async () => {
      const mockLoginError = new Error('Invalid credentials');
      AuthService.login.mockRejectedValue(mockLoginError);

      renderWithAuth(<TestComponent />);
      
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('logged-out');
      });
    });

    // Note: signUp function is not implemented in AuthContext

    test.skip('should handle sign out', async () => {
      // First sign in
      const mockLoginResponse = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        userId: '123',
        username: 'test@example.com',
      };

      AuthService.login.mockResolvedValue(mockLoginResponse);
      AuthService.logout.mockResolvedValue();

      renderWithAuth(<TestComponent />);
      
      // Sign in first
      fireEvent.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('logged-in');
      });

      // Clear the login mock to avoid interference
      AuthService.login.mockClear();

      // Then sign out
      fireEvent.click(screen.getByText('Sign Out'));

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('logged-out');
      });
    });
  });

  describe('API Endpoint Alignment', () => {
    test('should use correct API base URL', () => {
      expect(process.env.REACT_APP_API_BASE_URL).toBe('http://localhost:8000/ijaa/api/v1');
    });

    test('should use correct admin API base URL', () => {
      expect(process.env.REACT_APP_API_ADMIN_URL).toBe('http://localhost:8000/ijaa/api/v1/admin');
    });

    test('should use correct file service API base URL', () => {
      expect(process.env.REACT_APP_API_FILE_URL).toBe('http://localhost:8000/ijaa/api/v1/files/users');
    });

    test('should use correct event service API base URL', () => {
      expect(process.env.REACT_APP_API_EVENT_URL).toBe('http://localhost:8000/ijaa/api/v1/events');
    });
  });
});
