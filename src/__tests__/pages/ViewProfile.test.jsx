import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import ViewProfile from '../../pages/ViewProfile';
import { useParams, useNavigate } from 'react-router-dom';

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext');

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

const mockUseUnifiedAuth = useUnifiedAuth;
const mockUseParams = useParams;
const mockUseNavigate = useNavigate;

// Mock apiClient
jest.mock('../../utils/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import apiClient from '../../utils/apiClient';

describe('ViewProfile', () => {
  const mockUser = {
    userId: 'USER_123456',
    username: 'testuser',
    token: 'mock-token'
  };

  const mockProfileData = {
    userId: 'USER_789012',
    name: 'John Doe',
    profession: 'Software Engineer',
    location: 'New York, NY',
    bio: 'A passionate developer',
    phone: '+1-555-123-4567',
    linkedIn: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.dev',
    batch: '2020',
    facebook: 'https://facebook.com/johndoe',
    email: 'john@example.com',
    connections: 150,
    showPhone: true,
    showLinkedIn: true,
    showWebsite: true,
    showEmail: true,
    showFacebook: true
  };

  const mockExperiences = [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Corp',
      period: '2022-2024',
      description: 'Led development team'
    },
    {
      id: 2,
      title: 'Junior Developer',
      company: 'Startup Inc',
      period: '2020-2022',
      description: 'Full-stack development'
    }
  ];

  const mockInterests = [
    {
      id: 1,
      interest: 'Machine Learning'
    },
    {
      id: 2,
      interest: 'Web Development'
    }
  ];

  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockUseUnifiedAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true
    });

    mockUseParams.mockReturnValue({
      userId: 'USER_789012'
    });

    mockUseNavigate.mockReturnValue(mockNavigate);

    // Mock API responses
    apiClient.get.mockImplementation((url) => {
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: {
            data: mockProfileData
          }
        });
      } else if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      } else if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    apiClient.post.mockResolvedValue({
      data: {
        code: "200"
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile with user information', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
      expect(screen.getByText('Batch 2020')).toBeInTheDocument();
      expect(screen.getByText('150 connections')).toBeInTheDocument();
    });
  });

  test('displays experiences correctly', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('2022-2024')).toBeInTheDocument();
      expect(screen.getByText('Led development team')).toBeInTheDocument();
      
      expect(screen.getByText('Junior Developer')).toBeInTheDocument();
      expect(screen.getByText('Startup Inc')).toBeInTheDocument();
      expect(screen.getByText('2020-2022')).toBeInTheDocument();
      expect(screen.getByText('Full-stack development')).toBeInTheDocument();
    });
  });

  test('displays interests correctly', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Web Development')).toBeInTheDocument();
    });
  });

  test('handles single experience object response', async () => {
    const singleExperience = {
      id: 1,
      title: 'Single Experience',
      company: 'Single Company',
      period: '2023-2024',
      description: 'Single description'
    };

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: singleExperience
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockProfileData
        }
      });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('Single Experience')).toBeInTheDocument();
      expect(screen.getByText('Single Company')).toBeInTheDocument();
    });
  });

  test('handles single interest object response', async () => {
    const singleInterest = {
      id: 1,
      interest: 'Single Interest'
    };

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: singleInterest
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockProfileData
        }
      });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('Single Interest')).toBeInTheDocument();
    });
  });

  test('handles empty experiences array', async () => {
    apiClient.get.mockImplementation((url) => {
      if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockProfileData
        }
      });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('No experience information available')).toBeInTheDocument();
    });
  });

  test('handles empty interests array', async () => {
    apiClient.get.mockImplementation((url) => {
      if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockProfileData
        }
      });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('No interests information available')).toBeInTheDocument();
    });
  });

  test('displays contact information based on visibility settings', async () => {
    const profileWithHiddenContacts = {
      ...mockProfileData,
      showPhone: false,
      showEmail: false,
      showLinkedIn: true,
      showWebsite: false,
      showFacebook: false
    };

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: {
            data: profileWithHiddenContacts
          }
        });
      }
      return Promise.resolve({
        data: {
          data: []
        }
      });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      // Should show LinkedIn (visible)
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      
      // Should not show other contact fields (hidden)
      expect(screen.queryByText('Email')).not.toBeInTheDocument();
      expect(screen.queryByText('Phone')).not.toBeInTheDocument();
      expect(screen.queryByText('Website')).not.toBeInTheDocument();
      expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    });
  });

  test('shows "Contact information is private" when all contacts are hidden', async () => {
    const profileWithAllHiddenContacts = {
      ...mockProfileData,
      showPhone: false,
      showEmail: false,
      showLinkedIn: false,
      showWebsite: false,
      showFacebook: false
    };

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: {
            data: profileWithAllHiddenContacts
          }
        });
      }
      return Promise.resolve({
        data: {
          data: []
        }
      });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('Contact information is private')).toBeInTheDocument();
    });
  });

  test('handles connect button click', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      const connectButton = screen.getByText('Connect');
      fireEvent.click(connectButton);
    });

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/connections/request', {
        recipientUsername: 'USER_789012'
      });
    });
  });

  test('handles back button click', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      const backButton = screen.getByText('Back to Search');
      fireEvent.click(backButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('handles API errors gracefully', async () => {
    apiClient.get.mockRejectedValue(new Error('API Error'));

    render(<ViewProfile />);

    await waitFor(() => {
      // Should still render the component even with API errors
      expect(screen.getByText('Back to Search')).toBeInTheDocument();
    });
  });

  test('handles 404 profile error by redirecting', async () => {
    const error = new Error('Not Found');
    error.response = { status: 404 };
    
    apiClient.get.mockRejectedValue(error);

    render(<ViewProfile />);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  test('renders with consistent cover image width', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      const container = screen.getByText('John Doe').closest('.max-w-4xl');
      expect(container).toBeInTheDocument();
    });
  });
});
