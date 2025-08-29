import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UnifiedAuthProvider } from '../context/UnifiedAuthContext';
import { FeatureFlagProvider } from '../context/FeatureFlagContext';
import App from '../App';

// Mock the useFeatureFlag hook
jest.mock('../hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn()
}));

// Mock the useUnifiedAuth hook
jest.mock('../context/UnifiedAuthContext', () => ({
  ...jest.requireActual('../context/UnifiedAuthContext'),
  useUnifiedAuth: jest.fn()
}));

import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';

const mockUseFeatureFlag = useFeatureFlag;
const mockUseUnifiedAuth = useUnifiedAuth;

const renderApp = () => {
  return render(
    <BrowserRouter>
      <UnifiedAuthProvider>
        <FeatureFlagProvider>
          <App />
        </FeatureFlagProvider>
      </UnifiedAuthProvider>
    </BrowserRouter>
  );
};

describe('Feature Flag Integration Tests', () => {
  beforeEach(() => {
    // Default mock implementation
    mockUseFeatureFlag.mockImplementation((featureName) => ({
      isEnabled: true,
      loading: false,
      error: null
    }));

    // Default auth mock - not authenticated
    mockUseUnifiedAuth.mockImplementation(() => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      isUser: jest.fn(() => false),
      isAdmin: jest.fn(() => false),
      admin: null
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Page-Level Feature Flag Protection', () => {
    it('should show search page when feature is enabled', async () => {
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
        expect(screen.getByText('Search Alumni')).toBeInTheDocument();
      });
    });

    it('should show unavailable message when search feature is disabled', async () => {
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

    it('should show events page when feature is enabled', async () => {
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
        expect(screen.getByText('Events Unavailable')).not.toBeInTheDocument();
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
  });

  describe('Component-Level Feature Flag Protection', () => {
    it('should hide interests in UserCard when feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.interests') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to search page
      window.history.pushState({}, '', '/search');
      
      await waitFor(() => {
        // Check that interests are not displayed in user cards
        const interestElements = screen.queryAllByText(/interest/i);
        expect(interestElements.length).toBe(0);
      });
    });

    it('should hide experiences in ViewProfile when feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.experiences') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to a user profile page
      window.history.pushState({}, '', '/profile/USER_123456');
      
      await waitFor(() => {
        expect(screen.queryByText('Experience')).not.toBeInTheDocument();
      });
    });

    it('should hide interests in ViewProfile when feature is disabled', async () => {
      mockUseFeatureFlag.mockImplementation((featureName) => {
        if (featureName === 'user.interests') {
          return { isEnabled: false, loading: false, error: null };
        }
        return { isEnabled: true, loading: false, error: null };
      });

      renderApp();
      
      // Navigate to a user profile page
      window.history.pushState({}, '', '/profile/USER_123456');
      
      await waitFor(() => {
        expect(screen.queryByText('Interests')).not.toBeInTheDocument();
      });
    });
  });
});

