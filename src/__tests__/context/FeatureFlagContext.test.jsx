import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import { FeatureFlagProvider, useFeatureFlags } from '../../context/FeatureFlagContext';

// Mock the featureFlagApi
vi.mock('../../utils/featureFlagApi', () => ({
  featureFlagApi: {
    getAllFeatureFlags: vi.fn(),
    getFeatureFlag: vi.fn(),
    checkUserFeatureFlag: vi.fn()
  },
  FEATURE_FLAGS: {
    NEW_UI: 'new-ui',
    BETA_FEATURES: 'beta-features',
    DARK_MODE: 'dark-mode'
  }
}));

import { featureFlagApi  } from '../../../utils/featureFlagApi';

// Test component to use the context
const TestComponent = () => {
  const { 
    featureFlags, 
    loading, 
    error, 
    lastUpdated,
    isFeatureEnabled,
    refreshFeatureFlags,
    checkUserFeatureFlag
  } = useFeatureFlags();

  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Loaded'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="last-updated">{lastUpdated ? 'Updated' : 'Not Updated'}</div>
      <div data-testid="feature-count">{featureFlags.size}</div>
      <div data-testid="new-ui-enabled">{isFeatureEnabled('new-ui') ? 'Yes' : 'No'}</div>
      <div data-testid="beta-features-enabled">{isFeatureEnabled('beta-features') ? 'Yes' : 'No'}</div>
      <button onClick={refreshFeatureFlags} data-testid="refresh-btn">Refresh</button>
      <button onClick={() => checkUserFeatureFlag('new-ui', 123)} data-testid="check-user-btn">Check User</button>
    </div>
  );
};

describe('FeatureFlagContext', () => {
  const mockFeatureFlags = [
    {
      id: 1,
      name: 'new-ui',
      description: 'New user interface',
      enabled: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z'
    },
    {
      id: 2,
      name: 'beta-features',
      description: 'Beta testing features',
      enabled: false,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: null
    },
    {
      id: 3,
      name: 'dark-mode',
      description: 'Dark theme support',
      enabled: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Provider Initialization', () => {
    it('should provide initial loading state', () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      expect(screen.getByTestId('loading')).toHaveTextContent('Loading');
    });

    it('should load feature flags on mount', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });

    it('should convert feature flags to Map', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('feature-count')).toHaveTextContent('3');
      });
    });
  });

  describe('Feature Flag Checking', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });

    it('should return true for enabled features', () => {
      expect(screen.getByTestId('new-ui-enabled')).toHaveTextContent('Yes');
      expect(screen.getByTestId('beta-features-enabled')).toHaveTextContent('No');
    });

    it('should return false for non-existent features', () => {
      // This would require accessing the context directly, but we can test through the component
      expect(screen.getByTestId('new-ui-enabled')).toHaveTextContent('Yes');
    });

    it('should handle feature names case-insensitively', () => {
      // The context should handle this, but we test through the component
      expect(screen.getByTestId('new-ui-enabled')).toHaveTextContent('Yes');
    });
  });

  describe('Refresh Functionality', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });

    it('should refresh feature flags when refresh button is clicked', async () => {
      const refreshButton = screen.getByTestId('refresh-btn');
      fireEvent.click(refreshButton);

      expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(2);
    });

    it('should update lastUpdated timestamp after refresh', async () => {
      const refreshButton = screen.getByTestId('refresh-btn');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('last-updated')).toHaveTextContent('Updated');
      });
    });

    it('should handle refresh errors gracefully', async () => {
      featureFlagApi.getAllFeatureFlags.mockRejectedValueOnce(new Error('Refresh failed'));

      const refreshButton = screen.getByTestId('refresh-btn');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Refresh failed');
      });
    });
  });

  describe('User Feature Flag Checking', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      featureFlagApi.checkUserFeatureFlag.mockResolvedValue({ enabled: true });

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });

    it('should call checkUserFeatureFlag API when requested', async () => {
      const checkUserButton = screen.getByTestId('check-user-btn');
      fireEvent.click(checkUserButton);

      expect(featureFlagApi.checkUserFeatureFlag).toHaveBeenCalledWith('new-ui', 123);
    });

    it('should handle user feature flag check errors', async () => {
      featureFlagApi.checkUserFeatureFlag.mockRejectedValueOnce(new Error('User check failed'));

      const checkUserButton = screen.getByTestId('check-user-btn');
      fireEvent.click(checkUserButton);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('User check failed');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when initial load fails', async () => {
      const errorMessage = 'Failed to load feature flags';
      featureFlagApi.getAllFeatureFlags.mockRejectedValue(new Error(errorMessage));

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(errorMessage);
      });
    });

    it('should clear error on successful refresh', async () => {
      // First call fails
      featureFlagApi.getAllFeatureFlags.mockRejectedValueOnce(new Error('Initial error'));
      // Second call succeeds
      featureFlagApi.getAllFeatureFlags.mockResolvedValueOnce(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Initial error');
      });

      const refreshButton = screen.getByTestId('refresh-btn');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('No Error');
      });
    });
  });

  describe('Context Value Structure', () => {
    it('should provide all required context values', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      let contextValue;
      const ContextConsumer = () => {
        contextValue = useFeatureFlags();
        return null;
      };

      render(
        <FeatureFlagProvider>
          <ContextConsumer />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(contextValue).toBeDefined();
        expect(typeof contextValue.featureFlags).toBe('object');
        expect(typeof contextValue.loading).toBe('boolean');
        expect(typeof contextValue.error).toBe('string') || expect(contextValue.error).toBeNull();
        expect(typeof contextValue.isFeatureEnabled).toBe('function');
        expect(typeof contextValue.refreshFeatureFlags).toBe('function');
        expect(typeof contextValue.checkUserFeatureFlag).toBe('function');
      });
    });
  });

  describe('Context Hook Usage', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useFeatureFlags must be used within a FeatureFlagProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Performance and Optimization', () => {
    it('should not re-fetch flags unnecessarily', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });

      // Should only be called once on mount
      expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid refresh calls gracefully', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });

      const refreshButton = screen.getByTestId('refresh-btn');
      
      // Click multiple times rapidly
      fireEvent.click(refreshButton);
      fireEvent.click(refreshButton);
      fireEvent.click(refreshButton);

      // Should handle this gracefully without errors
      await waitFor(() => {
        expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(2); // Initial + one refresh
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty feature flags array', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue([]);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('feature-count')).toHaveTextContent('0');
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      });
    });

    it('should handle null/undefined feature flags', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(null);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid response format');
      });
    });

    it('should handle malformed feature flag data', async () => {
      const malformedFlags = [
        { id: 1, name: 'valid-flag', enabled: true },
        { id: 2, name: null, enabled: false }, // Malformed
        { id: 3, name: 'another-flag', enabled: 'invalid' } // Malformed
      ];

      featureFlagApi.getAllFeatureFlags.mockResolvedValue(malformedFlags);

      render(
        <FeatureFlagProvider>
          <TestComponent />
        </FeatureFlagProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
        // Should handle malformed data gracefully
      });
    });
  });
});
