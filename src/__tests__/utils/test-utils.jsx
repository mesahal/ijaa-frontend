import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    dismiss: jest.fn(),
    isActive: jest.fn(),
    update: jest.fn(),
    done: jest.fn(),
    onChange: jest.fn(),
    configure: jest.fn(),
    POSITION: {
      TOP_LEFT: 'top-left',
      TOP_RIGHT: 'top-right',
      TOP_CENTER: 'top-center',
      BOTTOM_LEFT: 'bottom-left',
      BOTTOM_RIGHT: 'bottom-right',
      BOTTOM_CENTER: 'bottom-center'
    },
    TYPE: {
      SUCCESS: 'success',
      ERROR: 'error',
      WARNING: 'warning',
      INFO: 'info'
    }
  },
  ToastContainer: () => null
}));

// Mock sessionManager
jest.mock('../../utils/sessionManager', () => ({
  getCurrentSession: jest.fn(() => ({ type: 'user', data: null })),
  cleanupOldVariables: jest.fn(),
  clearUser: jest.fn(),
  clearAdmin: jest.fn(),
  clearAll: jest.fn(),
  onStorageChange: jest.fn(() => jest.fn())
}));

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => ({
    user: null,
    admin: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    adminSignIn: jest.fn(),
    adminSignOut: jest.fn(),
    isAuthenticated: () => false,
    isUser: () => false,
    isAdmin: () => false,
    getCurrentUser: () => null,
    getCurrentUserType: () => null,
  }),
  UnifiedAuthProvider: ({ children }) => <>{children}</>
}));

// Mock the ThemeContext
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }) => <>{children}</>
}));

// Custom render function that includes all providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock user data for testing
export const mockUser = {
  userId: 'USER_123456',
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token',
  profession: 'Software Engineer',
  location: 'New York, NY',
  bio: 'A passionate developer',
  phone: '+1-555-123-4567',
  linkedIn: 'https://linkedin.com/in/testuser',
  website: 'https://testuser.dev',
  batch: '2020',
  facebook: 'https://facebook.com/testuser',
  connections: 150,
  showPhone: true,
  showLinkedIn: true,
  showWebsite: true,
  showEmail: true,
  showFacebook: true
};

export const mockAdmin = {
  adminId: 'ADMIN_123456',
  name: 'Admin User',
  email: 'admin@example.com',
  token: 'mock-admin-jwt-token',
  role: 'ADMIN',
  active: true
};

// Mock API responses
export const mockApiResponses = {
  events: {
    success: {
      message: "Events retrieved successfully",
      code: "200",
      data: [
        {
          id: 1,
          title: "Test Event",
          description: "Test event description",
          startDate: "2025-08-15T18:00:00",
          endDate: "2025-08-15T22:00:00",
          location: "Test Location",
          eventType: "WORKSHOP",
          isOnline: false,
          meetingLink: null,
          maxParticipants: 50,
          currentParticipants: 0,
          organizerName: "Test Organizer",
          organizerEmail: "organizer@test.com"
        }
      ]
    }
  },
  profile: {
    success: {
      message: "Profile fetched successfully",
      code: "200",
      data: {
        username: "testuser",
        name: "Test User",
        profession: "Software Engineer",
        location: "Test City",
        bio: "Test bio",
        connections: 25
      }
    }
  },
  search: {
    success: {
      message: "Alumni search completed",
      code: "200",
      data: [
        {
          username: "testuser",
          name: "Test User",
          profession: "Software Engineer",
          location: "Test City",
          batch: "2020"
        }
      ]
    }
  }
};

// Helper function to mock localStorage
export const mockLocalStorage = (userData = null) => {
  if (userData) {
    localStorage.getItem.mockReturnValue(JSON.stringify(userData));
  } else {
    localStorage.getItem.mockReturnValue(null);
  }
};

// Helper function to simulate API calls
export const mockApiCall = (response, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(response), delay);
  });
};

// Helper function to wait for loading states
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render }; 