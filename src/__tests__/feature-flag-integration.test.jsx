import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import { UnifiedAuthProvider } from '../context/UnifiedAuthContext';
import { ThemeProvider } from '../context/ThemeContext';

// Mock the useFeatureFlag hook
vi.mock('../hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn()
}));

import { useFeatureFlag } from '../hooks/useFeatureFlag';

// Mock session manager
vi.mock('../utils/sessionManager', () => ({
  getCurrentSession: vi.fn(() => ({ type: 'user', data: null })),
  cleanupOldVariables: vi.fn(),
  clearUser: vi.fn(),
  clearAdmin: vi.fn(),
  clearAll: vi.fn(),
  onStorageChange: vi.fn(() => vi.fn()),
}));

// Mock API client
vi.mock('../utils/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  },
  changeUserPassword: vi.fn()
}));

// Mock admin API
vi.mock('../utils/adminApi', () => ({
  adminApi: {
    getAdminProfile: vi.fn(),
    changePassword: vi.fn(),
    getDashboardStats: vi.fn(),
    getAllUsers: vi.fn(),
    getAllAdmins: vi.fn(),
    createAdmin: vi.fn(),
    activateAdmin: vi.fn(),
    deactivateAdmin: vi.fn(),
    getFeatureFlags: vi.fn(),
    createFeatureFlag: vi.fn(),
    updateFeatureFlag: vi.fn(),
    deleteFeatureFlag: vi.fn(),
    toggleFeatureFlag: vi.fn(),
    getAnnouncements: vi.fn(),
    createAnnouncement: vi.fn(),
    updateAnnouncement: vi.fn(),
    deleteAnnouncement: vi.fn(),
    getReports: vi.fn(),
    getSystemStats: vi.fn()
  }
}));

// Mock photo API
vi.mock('../utils/photoApi', () => ({
  uploadProfilePhoto: vi.fn(),
  uploadCoverPhoto: vi.fn(),
  getProfilePhotoUrl: vi.fn(),
  getCoverPhotoUrl: vi.fn(),
  deleteProfilePhoto: vi.fn(),
  deleteCoverPhoto: vi.fn(),
  validateImageFile: vi.fn(),
  handlePhotoApiError: vi.fn()
}));

// Mock feature flag API
vi.mock('../utils/featureFlagApi', () => ({
  featureFlagApi: {
    checkFeatureFlag: vi.fn(),
    checkMultipleFeatureFlags: vi.fn(),
    getUserFeatureFlags: vi.fn(),
    checkFeatureFlagHierarchical: vi.fn()
  },
  FEATURE_FLAGS: {
    USER_LOGIN: 'user.login',
    USER_REGISTRATION: 'user.registration',
    USER_PROFILE: 'user.profile',
    USER_EXPERIENCES: 'user.experiences',
    USER_INTERESTS: 'user.interests',
    USER_PASSWORD_CHANGE: 'user.password-change',
    EVENTS: 'events',
    ALUMNI_SEARCH: 'alumni.search',
    NOTIFICATIONS: 'notifications',
    REPORTS: 'reports',
    ADMIN_FEATURES: 'admin.features',
    ADMIN_USER_MANAGEMENT: 'admin.user-management',
    ADMIN_ANNOUNCEMENTS: 'admin.announcements',
    ADMIN_REPORTS: 'admin.reports',
    ADMIN_AUTH: 'admin.auth',
    FILE_UPLOAD_PROFILE_PHOTO: 'file-upload.profile-photo',
    FILE_UPLOAD_COVER_PHOTO: 'file-upload.cover-photo'
  }
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <UnifiedAuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </UnifiedAuthProvider>
    </BrowserRouter>
  );
};

describe('Feature Flag Integration Tests', () => {
  const mockUseFeatureFlag = useFeatureFlag;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default feature flag responses
    mockUseFeatureFlag.mockImplementation((featureName) => ({
      isEnabled: true,
      loading: false,
      error: null
    }));
  });

  describe('Page-Level Feature Flag Protection', () => {
    it('should show events page when events feature is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'events') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to events page
      window.history.pushState({}, '', '/events');
      
      await waitFor(() => {
        expect(screen.queryByText('Events Unavailable')).not.toBeInTheDocument();
      });
    });

    it('should show unavailable message when events feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'events') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to events page
      window.history.pushState({}, '', '/events');
      
      await waitFor(() => {
        expect(screen.getByText('Events Unavailable')).toBeInTheDocument();
        expect(screen.getByText('The events feature is currently disabled. Please check back later or contact support for assistance.')).toBeInTheDocument();
      });
    });

    it('should show search page when alumni search feature is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'alumni.search') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to search page
      window.history.pushState({}, '', '/search');
      
      await waitFor(() => {
        expect(screen.queryByText('Alumni Search Unavailable')).not.toBeInTheDocument();
      });
    });

    it('should show unavailable message when alumni search feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'alumni.search') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to search page
      window.history.pushState({}, '', '/search');
      
      await waitFor(() => {
        expect(screen.getByText('Alumni Search Unavailable')).toBeInTheDocument();
        expect(screen.getByText('The alumni search feature is currently disabled. Please check back later or contact support for assistance.')).toBeInTheDocument();
      });
    });
  });

  describe('Component-Level Feature Flag Protection', () => {
    it('should show password change section when feature is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.password-change') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      
      await waitFor(() => {
        expect(screen.queryByText('Change Password')).toBeInTheDocument();
      });
    });

    it('should hide password change section when feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.password-change') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      
      await waitFor(() => {
        expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
      });
    });

    it('should show experiences section when feature is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.experiences') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      
      await waitFor(() => {
        expect(screen.queryByText('Experience')).toBeInTheDocument();
      });
    });

    it('should hide experiences section when feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.experiences') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      
      await waitFor(() => {
        expect(screen.queryByText('Experience')).not.toBeInTheDocument();
      });
    });

    it('should show interests section when feature is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.interests') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      
      await waitFor(() => {
        expect(screen.queryByText('Interests')).toBeInTheDocument();
      });
    });

    it('should hide interests section when feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.interests') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to profile page
      window.history.pushState({}, '', '/profile');
      
      await waitFor(() => {
        expect(screen.queryByText('Interests')).not.toBeInTheDocument();
      });
    });
  });

  describe('Admin Feature Flag Protection', () => {
    it('should show admin dashboard when admin features are enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'admin.features') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to admin dashboard
      window.history.pushState({}, '', '/admin/dashboard');
      
      await waitFor(() => {
        expect(screen.queryByText('Admin Features Unavailable')).not.toBeInTheDocument();
      });
    });

    it('should show unavailable message when admin features are disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'admin.features') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to admin dashboard
      window.history.pushState({}, '', '/admin/dashboard');
      
      await waitFor(() => {
        expect(screen.getByText('Admin Features Unavailable')).toBeInTheDocument();
        expect(screen.getByText('Admin features are currently disabled. Please contact a super administrator for assistance.')).toBeInTheDocument();
      });
    });
  });

  describe('Public Route Feature Flag Protection', () => {
    it('should show signin page when user login is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.login') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to signin page
      window.history.pushState({}, '', '/signin');
      
      await waitFor(() => {
        expect(screen.queryByText('Login Unavailable')).not.toBeInTheDocument();
      });
    });

    it('should show unavailable message when user login is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.login') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to signin page
      window.history.pushState({}, '', '/signin');
      
      await waitFor(() => {
        expect(screen.getByText('Login Unavailable')).toBeInTheDocument();
        expect(screen.getByText('User login is currently disabled. Please contact support for assistance.')).toBeInTheDocument();
      });
    });

    it('should show signup page when user registration is enabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.registration') {
          return { isEnabled: true, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to signup page
      window.history.pushState({}, '', '/signup');
      
      await waitFor(() => {
        expect(screen.queryByText('Registration Unavailable')).not.toBeInTheDocument();
      });
    });

    it('should show unavailable message when user registration is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.registration') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to signup page
      window.history.pushState({}, '', '/signup');
      
      await waitFor(() => {
        expect(screen.getByText('Registration Unavailable')).toBeInTheDocument();
        expect(screen.getByText('User registration is currently disabled. Please contact support for assistance.')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while feature flag is loading', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'events') {
          return { isEnabled: false, loading: true, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to events page
      window.history.pushState({}, '', '/events');
      
      await waitFor(() => {
        expect(screen.getByText('Loading feature...')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle feature flag errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'events') {
          return { isEnabled: false, loading: false, error: new Error('API Error') };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to events page
      window.history.pushState({}, '', '/events');
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Feature flag error for events:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });
});
