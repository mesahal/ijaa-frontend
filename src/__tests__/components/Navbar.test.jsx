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

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders navbar with logo and brand name', () => {
    render(<Navbar />);
    
    expect(screen.getByText('IIT JU Alumni')).toBeInTheDocument();
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
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    const avatar = screen.getByAltText('Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg');
  });

  test('renders theme toggle button', () => {
    render(<Navbar />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  test('renders notifications link', () => {
    render(<Navbar />);
    
    const notificationsLink = screen.getByRole('link', { name: /notifications/i });
    expect(notificationsLink).toBeInTheDocument();
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
      expect(screen.getByText('View Profile')).toBeInTheDocument();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByText('Privacy Settings')).toBeInTheDocument();
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
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

  test('active navigation link has correct styling', () => {
    // Mock useLocation to return dashboard path
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: () => ({ pathname: '/dashboard' })
    }));
    
    render(<Navbar />);
    
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    expect(dashboardLink).toHaveClass('bg-blue-50');
  });

  test('handles sign out correctly', async () => {
    const mockSignOut = jest.fn();
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        signOut: mockSignOut
      })
    }));
    
    render(<Navbar />);
    
    const profileButton = screen.getByRole('button', { name: /test user/i });
    fireEvent.click(profileButton);
    
    await waitFor(() => {
      const signOutButton = screen.getByText('Sign Out');
      fireEvent.click(signOutButton);
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  test('theme toggle button calls toggleTheme function', () => {
    const mockToggleTheme = jest.fn();
    jest.doMock('../../context/ThemeContext', () => ({
      useTheme: () => ({
        isDark: false,
        toggleTheme: mockToggleTheme
      })
    }));
    
    render(<Navbar />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeToggle);
    
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  test('renders without user data gracefully', () => {
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        signOut: jest.fn()
      })
    }));
    
    render(<Navbar />);
    
    // Should still render the navbar without user-specific elements
    expect(screen.getByText('IIT JU Alumni')).toBeInTheDocument();
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