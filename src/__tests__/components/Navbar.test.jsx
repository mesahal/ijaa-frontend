import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import Navbar from '../../components/Navbar';
import { mockUser } from '../utils/test-utils';

// Mock the useUnifiedAuth hook
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => ({
    user: mockUser,
    signOut: jest.fn()
  })
}));

// Mock the useTheme hook
jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn()
  })
}));

// Mock the useCurrentUserPhoto hook
jest.mock('../../hooks/useCurrentUserPhoto', () => ({
  useCurrentUserPhoto: () => ({
    profilePhotoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg',
    loading: false,
    error: null,
    hasPhoto: true
  })
}));

// Mock the useCurrentUserProfile hook
jest.mock('../../hooks/useCurrentUserProfile', () => ({
  useCurrentUserProfile: () => ({
    profileData: {
      name: 'Test User',
      email: 'test@example.com',
      userId: 'USER_123456'
    },
    loading: false,
    error: null
  })
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders navbar with logo and brand name', () => {
    render(<Navbar />);
    
    expect(screen.getByText('IIT Alumni Association')).toBeInTheDocument();
    expect(screen.getByText('Jahangirnagar University')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('renders user profile section with profile photo', () => {
    render(<Navbar />);
    
    const avatar = screen.getByAltText('Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg');
  });

  test('renders theme toggle button', () => {
    render(<Navbar />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders notifications button', () => {
    render(<Navbar />);
    
    const notificationsButton = screen.getByRole('button', { name: /notifications/i });
    expect(notificationsButton).toBeInTheDocument();
  });

  test('shows notification badge', () => {
    render(<Navbar />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('opens profile menu when profile button is clicked', async () => {
    render(<Navbar />);
    
    const profileButton = screen.getByRole('button', { name: /test user/i });
    fireEvent.click(profileButton);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Help')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  test('navigates to dashboard when logo is clicked', () => {
    render(<Navbar />);
    
    const logoLink = screen.getByRole('link', { name: /iit ju alumni/i });
    expect(logoLink).toHaveAttribute('href', '/dashboard');
  });

  test('navigation links have correct href attributes', () => {
    render(<Navbar />);
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const eventsLink = screen.getByRole('link', { name: /events/i });
    const searchLink = screen.getByRole('link', { name: /search/i });
    
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    expect(eventsLink).toHaveAttribute('href', '/events');
    expect(searchLink).toHaveAttribute('href', '/search');
  });

  test('mobile menu button is present on mobile screens', () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  test('navigation links have correct styling classes', () => {
    render(<Navbar />);
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('flex', 'items-center', 'space-x-2');
  });

  test('profile menu contains sign out option', async () => {
    render(<Navbar />);
    
    const profileButton = screen.getByRole('button', { name: /test user/i });
    fireEvent.click(profileButton);
    
    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  test('theme toggle button is present', () => {
    render(<Navbar />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders without user data gracefully', () => {
    jest.doMock('../../context/UnifiedAuthContext', () => ({
      useUnifiedAuth: () => ({
        user: null,
        signOut: jest.fn()
      })
    }));
    
    render(<Navbar />);
    
    // Should still render the navbar without user-specific elements
    expect(screen.getByText('IIT Alumni Association')).toBeInTheDocument();
  });

  test('accessibility features are present', () => {
    render(<Navbar />);
    
    // Check for proper ARIA labels
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
    
    // Check for proper alt text on images
    const userAvatar = screen.getByAltText('Test User');
    expect(userAvatar).toBeInTheDocument();
  });
}); 