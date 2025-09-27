import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// Mock the hooks
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: jest.fn()
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: jest.fn()
}));

jest.mock('../../hooks/useCurrentUserPhoto', () => ({
  useCurrentUserPhoto: jest.fn()
}));

jest.mock('../../hooks/useCurrentUserProfile', () => ({
  useCurrentUserProfile: jest.fn()
}));

jest.mock('../../hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn()
}));

import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useCurrentUserPhoto } from '../../hooks/useCurrentUserPhoto';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

describe('Navbar', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  beforeEach(() => {
    // Default mocks
    useUnifiedAuth.mockReturnValue({
      user: mockUser,
      signOut: jest.fn()
    });

    useTheme.mockReturnValue({
      isDark: false,
      toggleTheme: jest.fn()
    });

    useCurrentUserPhoto.mockReturnValue({
      profilePhotoUrl: '/test-photo.jpg'
    });

    useCurrentUserProfile.mockReturnValue({
      profileData: mockUser
    });

    useFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: false,
      error: null
    });
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  test('renders navbar with basic navigation', () => {
    renderWithRouter(<Navbar />);

    // Check for basic navigation items
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  test('shows Search link when alumni.search feature flag is enabled', () => {
    useFeatureFlag.mockReturnValue({
      isEnabled: true,
      loading: false,
      error: null
    });

    renderWithRouter(<Navbar />);

    // Check for Search link
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('hides Search link when alumni.search feature flag is disabled', () => {
    useFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: false,
      error: null
    });

    renderWithRouter(<Navbar />);

    // Search link should not be present
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });

  test('shows loading state when feature flag is loading', () => {
    useFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: true,
      error: null
    });

    renderWithRouter(<Navbar />);

    // Search link should not be present during loading
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });

  test('handles feature flag error gracefully', () => {
    useFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: false,
      error: 'Feature flag check failed'
    });

    renderWithRouter(<Navbar />);

    // Search link should not be present on error
    expect(screen.queryByText('Search')).not.toBeInTheDocument();
  });
}); 