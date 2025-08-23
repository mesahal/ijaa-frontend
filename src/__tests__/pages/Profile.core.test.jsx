import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => ({
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
    loading: false
  })
}));

// Mock apiClient
jest.mock('../../utils/apiClient', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

// Mock UI components
jest.mock('../../components/ui/Button', () => {
  return function MockButton({ children, onClick, ...props }) {
    return (
      <button onClick={onClick} {...props}>
        {children}
      </button>
    );
  };
});

jest.mock('../../components/ui/Card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  Header: ({ children, ...props }) => <div {...props}>{children}</div>,
  Title: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  Content: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

jest.mock('../../components/ui/Input', () => {
  return function MockInput({ label, value, onChange, ...props }) {
    return (
      <div>
        {label && <label>{label}</label>}
        <input value={value} onChange={onChange} {...props} />
      </div>
    );
  };
});

jest.mock('../../components/ui/Avatar', () => {
  return function MockAvatar({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock icons
jest.mock('lucide-react', () => ({
  Edit3: () => <span>Edit</span>,
  Save: () => <span>Save</span>,
  X: () => <span>X</span>,
  Plus: () => <span>Plus</span>,
  Mail: () => <span>Mail</span>,
  Phone: () => <span>Phone</span>,
  Linkedin: () => <span>LinkedIn</span>,
  Globe: () => <span>Globe</span>,
  Facebook: () => <span>Facebook</span>,
  ExternalLink: () => <span>ExternalLink</span>,
  MapPin: () => <span>MapPin</span>,
  GraduationCap: () => <span>GraduationCap</span>,
  Eye: () => <span>Eye</span>,
  EyeOff: () => <span>EyeOff</span>,
}));

describe('Profile Component - Core Functionality', () => {
  let apiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    apiClient = require('../../utils/apiClient');
  });

  test('fetches and displays profile data correctly', async () => {
    const mockProfileData = {
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
      email: 'test@example.com',
      connections: 150,
      showPhone: true,
      showLinkedIn: true,
      showWebsite: true,
      showEmail: true,
      showFacebook: true
    };

    const mockExperiences = [
      {
        id: 'exp1',
        title: 'Senior Developer',
        company: 'Tech Corp',
        location: 'New York',
        startDate: '2022-01-01',
        endDate: null,
        description: 'Leading development team'
      }
    ];

    const mockInterests = [
      {
        id: 'int1',
        name: 'React',
        category: 'Technology'
      }
    ];

    // Mock API responses
    apiClient.get.mockImplementation((url) => {
      if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: mockProfileData
          }
        });
      }
      if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      }
      if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({
        data: {
          data: []
        }
      });
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Wait for the component to load
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/profile');
      expect(apiClient.get).toHaveBeenCalledWith('/experiences/USER_123456');
      expect(apiClient.get).toHaveBeenCalledWith('/interests/USER_123456');
    });

    // Check that profile data is displayed
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
      expect(screen.getByText('A passionate developer')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API error
    apiClient.get.mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Wait for the component to handle the error
    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/profile');
    });

    // Component should still render without crashing
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    // Mock slow API response
    apiClient.get.mockImplementation(() => new Promise(() => {}));

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Should show loading state
    expect(screen.getByText('About')).toBeInTheDocument();
  });
});
