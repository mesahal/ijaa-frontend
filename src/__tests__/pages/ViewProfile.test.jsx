import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import ViewProfile from '../../pages/ViewProfile';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useParams: () => ({ userId: 'USER_789012' }),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => ({
    user: {
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
    },
    admin: null,
    loading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    adminSignIn: jest.fn(),
    adminSignOut: jest.fn(),
    isAuthenticated: () => true,
    isUser: () => true,
    isAdmin: () => false,
    getCurrentUser: () => ({
      userId: 'USER_123456',
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com'
    }),
    getCurrentUserType: () => 'user',
  })
}));

// Mock API client
jest.mock('../../utils/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock photoApi functions
jest.mock('../../utils/photoApi', () => ({
  getProfilePhotoUrl: jest.fn(),
  getCoverPhotoUrl: jest.fn()
}));

import apiClient from '../../utils/apiClient';
import { getProfilePhotoUrl, getCoverPhotoUrl } from '../../utils/photoApi';

describe('ViewProfile', () => {
  const mockProfileData = {
    username: 'johndoe',
    name: 'John Doe',
    profession: 'Software Engineer',
    location: 'New York, NY',
    bio: 'A passionate software engineer with 5 years of experience.',
    batch: '2020',
    connections: 150,
    showPhone: true,
    showLinkedIn: true,
    showWebsite: true,
    showEmail: true,
    showFacebook: true,
    phone: '+1-555-123-4567',
    linkedIn: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.dev',
    email: 'john@example.com',
    facebook: 'https://facebook.com/johndoe'
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
      name: 'Machine Learning'
    },
    {
      id: 2,
      name: 'Web Development'
    }
  ];

  beforeEach(() => {
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

    // Mock photo API responses
    getProfilePhotoUrl.mockResolvedValue({
      photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg',
      hasPhoto: true,
      exists: true
    });

    getCoverPhotoUrl.mockResolvedValue({
      photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/def456.png',
      hasPhoto: true,
      exists: true
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
      return Promise.resolve({ data: { data: mockProfileData } });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText('Single Experience')).toBeInTheDocument();
      expect(screen.getByText('Single Company')).toBeInTheDocument();
      expect(screen.getByText('2023-2024')).toBeInTheDocument();
      expect(screen.getByText('Single description')).toBeInTheDocument();
    });
  });

  test('handles single interest object response', async () => {
    const singleInterest = {
      id: 1,
      name: 'Single Interest'
    };

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: singleInterest
          }
        });
      }
      return Promise.resolve({ data: { data: mockProfileData } });
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
      return Promise.resolve({ data: { data: mockProfileData } });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText(/no experiences found/i)).toBeInTheDocument();
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
      return Promise.resolve({ data: { data: mockProfileData } });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText(/no interests found/i)).toBeInTheDocument();
    });
  });

  test('displays contact information based on visibility settings', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      // Should show visible contact info
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('https://linkedin.com/in/johndoe')).toBeInTheDocument();
      expect(screen.getByText('https://johndoe.dev')).toBeInTheDocument();
      expect(screen.getByText('https://facebook.com/johndoe')).toBeInTheDocument();
    });
  });

  test('shows "Contact information is private" when all contacts are hidden', async () => {
    const privateProfileData = {
      ...mockProfileData,
      showPhone: false,
      showLinkedIn: false,
      showWebsite: false,
      showEmail: false,
      showFacebook: false
    };

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: {
            data: privateProfileData
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText(/contact information is private/i)).toBeInTheDocument();
    });
  });

  test('handles connect button click', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      const connectButton = screen.getByText(/connect/i);
      expect(connectButton).toBeInTheDocument();
    });

    const connectButton = screen.getByText(/connect/i);
    fireEvent.click(connectButton);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/connections/request', {
        receiverId: 'USER_789012'
      });
    });
  });

  test('handles back button click', async () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router-dom', () => ({
      useParams: () => ({ userId: 'USER_789012' }),
      useNavigate: () => mockNavigate,
      Link: ({ children, to }) => <a href={to}>{children}</a>
    }));

    render(<ViewProfile />);

    await waitFor(() => {
      const backButton = screen.getByText(/back/i);
      expect(backButton).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    apiClient.get.mockRejectedValue(new Error('API Error'));

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText(/error loading profile/i)).toBeInTheDocument();
    });
  });

  test('handles 404 profile error by redirecting', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        code: "404",
        message: "Profile not found"
      }
    });

    render(<ViewProfile />);

    await waitFor(() => {
      expect(screen.getByText(/profile not found/i)).toBeInTheDocument();
    });
  });

  test('renders with consistent cover image width', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      const coverImage = screen.getByAltText(/cover/i);
      expect(coverImage).toHaveClass('w-full', 'h-48', 'object-cover');
    });
  });

  test('loads and displays profile photo from API', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      expect(getProfilePhotoUrl).toHaveBeenCalledWith('USER_789012');
    });

    await waitFor(() => {
      const profilePhoto = screen.getByAltText('John Doe');
      expect(profilePhoto).toBeInTheDocument();
      expect(profilePhoto).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg');
    });
  });

  test('loads and displays cover photo from API', async () => {
    render(<ViewProfile />);

    await waitFor(() => {
      expect(getCoverPhotoUrl).toHaveBeenCalledWith('USER_789012');
    });

    await waitFor(() => {
      const coverPhoto = screen.getByAltText('Cover');
      expect(coverPhoto).toBeInTheDocument();
      expect(coverPhoto).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/def456.png');
    });
  });

  test('handles profile photo loading error gracefully', async () => {
    getProfilePhotoUrl.mockRejectedValue(new Error('Failed to load profile photo'));

    render(<ViewProfile />);

    await waitFor(() => {
      // Should not crash and should still display the profile
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles cover photo loading error gracefully', async () => {
    getCoverPhotoUrl.mockRejectedValue(new Error('Failed to load cover photo'));

    render(<ViewProfile />);

    await waitFor(() => {
      // Should not crash and should still display the profile
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles no profile photo available', async () => {
    getProfilePhotoUrl.mockResolvedValue({
      photoUrl: null,
      hasPhoto: false,
      exists: false
    });

    render(<ViewProfile />);

    await waitFor(() => {
      const profilePhoto = screen.getByAltText('John Doe');
      expect(profilePhoto).toBeInTheDocument();
      // Should use fallback image
      expect(profilePhoto).toHaveAttribute('src', '/dp.png');
    });
  });

  test('handles no cover photo available', async () => {
    getCoverPhotoUrl.mockResolvedValue({
      photoUrl: null,
      hasPhoto: false,
      exists: false
    });

    render(<ViewProfile />);

    await waitFor(() => {
      const coverPhoto = screen.getByAltText('Cover');
      expect(coverPhoto).toBeInTheDocument();
      // Should use fallback image
      expect(coverPhoto).toHaveAttribute('src', '/cover-image.jpg');
    });
  });
});
