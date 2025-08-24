import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';

// Simple mock for UnifiedAuthContext
const mockUseUnifiedAuth = {
  user: {
    userId: 'USER_123456',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
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
  },
  isAuthenticated: true,
  loading: false,
  signOut: jest.fn()
};

// Mock the context
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => mockUseUnifiedAuth
}));

// Mock apiClient
jest.mock('../../utils/apiClient', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// Mock UI components
jest.mock('../../components/ui', () => ({
  Card: ({ children, ...props }) => <div data-testid="card" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 data-testid="card-title" {...props}>{children}</h3>,
  CardContent: ({ children, ...props }) => <div data-testid="card-content" {...props}>{children}</div>,
  Button: ({ children, ...props }) => <button data-testid="button" {...props}>{children}</button>,
  Avatar: ({ src, alt, ...props }) => <img data-testid="avatar" src={src} alt={alt} {...props} />,
  Badge: ({ children, ...props }) => <span data-testid="badge" {...props}>{children}</span>,
  Input: ({ label, ...props }) => <input data-testid="input" placeholder={label} {...props} />
}));

describe('Profile Component - Simple Test', () => {
  let apiClient;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the mocked apiClient
    apiClient = require('../../utils/apiClient');
    
    // Mock successful API responses
    apiClient.get.mockImplementation((url) => {
      if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: {
              userId: 'USER_123456',
              name: 'Test User',
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
            }
          }
        });
      } else if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: [
              {
                id: 1,
                title: 'Senior Developer',
                company: 'Tech Corp',
                period: '2022-2024',
                description: 'Led development team'
              }
            ]
          }
        });
      } else if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: [
              {
                id: 1,
                interest: 'Machine Learning'
              }
            ]
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });
  });

  test('renders profile with user information', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Check that profile information is displayed
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('A passionate developer')).toBeInTheDocument();
    expect(screen.getByText('Batch 2020')).toBeInTheDocument();
  });

  test('displays experiences and interests', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
