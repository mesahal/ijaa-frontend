import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FeatureFlagStatus from '../../components/FeatureFlagStatus';

// Mock the featureFlagApi
vi.mock('../../utils/featureFlagApi', () => ({
  featureFlagApi: {
    getAllFeatureFlags: vi.fn()
  }
}));

import { featureFlagApi  } from '../../../utils/featureFlagApi';

describe('FeatureFlagStatus', () => {
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

  describe('Initial Rendering', () => {
    it('should show loading state initially', () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      expect(screen.getByText('Feature Flag Status')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should fetch feature flags on mount', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Feature Flags Display', () => {
    it('should display all feature flags after loading', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('new-ui')).toBeInTheDocument();
        expect(screen.getByText('beta-features')).toBeInTheDocument();
        expect(screen.getByText('dark-mode')).toBeInTheDocument();
      });
    });

    it('should show correct status indicators', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument(); // Enabled flag
        expect(screen.getByText('✗')).toBeInTheDocument(); // Disabled flag
      });
    });

    it('should show status badges correctly', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('Enabled')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();
      });
    });

    it('should show descriptions when available', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('(New user interface)')).toBeInTheDocument();
        expect(screen.getByText('(Beta testing features)')).toBeInTheDocument();
        expect(screen.getByText('(Dark theme support)')).toBeInTheDocument();
      });
    });
  });

  describe('Detailed View', () => {
    it('should show additional details when showDetails is true', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus showDetails={true} />);

      await waitFor(() => {
        expect(screen.getByText('ID: 1')).toBeInTheDocument();
        expect(screen.getByText('ID: 2')).toBeInTheDocument();
        expect(screen.getByText('ID: 3')).toBeInTheDocument();
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
        expect(screen.getByText(/Updated:/)).toBeInTheDocument();
      });
    });

    it('should not show details when showDetails is false', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus showDetails={false} />);

      await waitFor(() => {
        expect(screen.queryByText('ID: 1')).not.toBeInTheDocument();
        expect(screen.queryByText(/Created:/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Auto-refresh Functionality', () => {
    it('should auto-refresh at specified interval', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus refreshInterval={5000} />);

      await waitFor(() => {
        expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);
      });

      // Advance timer by refresh interval
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(2);
      });
    });

    it('should not auto-refresh when autoRefresh is false', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus autoRefresh={false} refreshInterval={5000} />);

      await waitFor(() => {
        expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);
      });

      // Advance timer by refresh interval
      vi.advanceTimersByTime(5000);

      await waitFor(() => {
        expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Manual Refresh', () => {
    it('should refresh when refresh button is clicked', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      expect(screen.getByText('Refreshing...')).toBeInTheDocument();
      expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(2);
    });

    it('should disable refresh button while refreshing', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      expect(refreshButton).toBeDisabled();
      expect(screen.getByText('Refreshing...')).toBeInTheDocument();
    });
  });

  describe('Auto-refresh Toggle', () => {
    it('should toggle auto-refresh state', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByText('Auto-refresh ON');
      fireEvent.click(toggleButton);

      expect(screen.getByText('Auto-refresh OFF')).toBeInTheDocument();
    });

    it('should stop auto-refresh when toggled off', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const toggleButton = screen.getByText('Auto-refresh ON');
      fireEvent.click(toggleButton);

      // Advance timer
      vi.advanceTimersByTime(30000);

      await waitFor(() => {
        expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API call fails', async () => {
      const errorMessage = 'Failed to fetch feature flags';
      featureFlagApi.getAllFeatureFlags.mockRejectedValue(new Error(errorMessage));

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
    });

    it('should clear error on successful refresh', async () => {
      // First call fails
      featureFlagApi.getAllFeatureFlags.mockRejectedValueOnce(new Error('API Error'));
      // Second call succeeds
      featureFlagApi.getAllFeatureFlags.mockResolvedValueOnce(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('Error: API Error')).toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.queryByText('Error: API Error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Last Updated Display', () => {
    it('should show last updated timestamp', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
      });
    });
  });

  describe('Summary Information', () => {
    it('should show correct summary counts', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('Total Flags: 3')).toBeInTheDocument();
        expect(screen.getByText('Enabled: 2 | Disabled: 1')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no feature flags', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue([]);

      render(<FeatureFlagStatus />);

      await waitFor(() => {
        expect(screen.getByText('No feature flags found')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      const { container } = render(<FeatureFlagStatus className="custom-class" />);

      await waitFor(() => {
        expect(container.firstChild).toHaveClass('custom-class');
      });
    });
  });
});
