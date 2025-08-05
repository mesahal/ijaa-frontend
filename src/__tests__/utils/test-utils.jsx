import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { AdminAuthProvider } from '../../context/AdminAuthContext';

// Custom render function that includes all providers
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Mock user data for testing
export const mockUser = {
  username: 'testuser',
  name: 'Test User',
  email: 'test@example.com',
  token: 'mock-jwt-token',
  userId: 'USER_123'
};

export const mockAdmin = {
  email: 'admin@ijaa.com',
  name: 'Admin User',
  token: 'mock-admin-jwt-token',
  adminId: 1,
  role: 'ADMIN'
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

// Re-export everything
export * from '@testing-library/react';
export { customRender as render }; 