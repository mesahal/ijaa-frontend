import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FeatureFlagDebugPanel from '../../components/FeatureFlagDebugPanel';

// Mock the featureFlagApi
vi.mock('../../utils/featureFlagApi', () => ({
  featureFlagApi: {
    getAllFeatureFlags: vi.fn(),
    updateFeatureFlag: vi.fn()
  }
}));

import { featureFlagApi  } from '../../../utils/featureFlagApi';

describe('FeatureFlagDebugPanel', () => {
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

  describe('Toggle Button', () => {
    it('should render toggle button when panel is closed', () => {
      render(<FeatureFlagDebugPanel />);

      expect(screen.getByRole('button', { name: /toggle feature flag debug panel/i })).toBeInTheDocument();
      expect(screen.getByText('🚩')).toBeInTheDocument();
    });

    it('should toggle panel when button is clicked', () => {
      render(<FeatureFlagDebugPanel />);

      const toggleButton = screen.getByRole('button', { name: /toggle feature flag debug panel/i });
      fireEvent.click(toggleButton);

      expect(screen.getByText('Feature Flag Debug Panel')).toBeInTheDocument();
    });

    it('should call onToggle callback when provided', () => {
      const onToggle = vi.fn();
      render(<FeatureFlagDebugPanel onToggle={onToggle} />);

      const toggleButton = screen.getByRole('button', { name: /toggle feature flag debug panel/i });
      fireEvent.click(toggleButton);

      expect(onToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('Panel Header', () => {
    it('should display panel title', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagDebugPanel isVisible={true} />);

      expect(screen.getByText('Feature Flag Debug Panel')).toBeInTheDocument();
    });

    it('should close panel when close button is clicked', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagDebugPanel isVisible={true} />);

      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Feature Flag Debug Panel')).not.toBeInTheDocument();
    });
  });

  describe('Controls Section', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should have search input', () => {
      expect(screen.getByPlaceholderText('Search flags...')).toBeInTheDocument();
    });

    it('should have status filter dropdown', () => {
      expect(screen.getByDisplayValue('All')).toBeInTheDocument();
    });

    it('should have sort dropdown', () => {
      expect(screen.getByDisplayValue('Name')).toBeInTheDocument();
    });

    it('should have auto-refresh controls', () => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      expect(screen.getByText('ON')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should filter flags by name', () => {
      const searchInput = screen.getByPlaceholderText('Search flags...');
      fireEvent.change(searchInput, { target: { value: 'new-ui' } });

      expect(screen.getByText('new-ui')).toBeInTheDocument();
      expect(screen.queryByText('beta-features')).not.toBeInTheDocument();
      expect(screen.queryByText('dark-mode')).not.toBeInTheDocument();
    });

    it('should filter flags by description', () => {
      const searchInput = screen.getByPlaceholderText('Search flags...');
      fireEvent.change(searchInput, { target: { value: 'interface' } });

      expect(screen.getByText('new-ui')).toBeInTheDocument();
      expect(screen.queryByText('beta-features')).not.toBeInTheDocument();
    });

    it('should show all flags when search is cleared', () => {
      const searchInput = screen.getByPlaceholderText('Search flags...');
      fireEvent.change(searchInput, { target: { value: 'new-ui' } });
      fireEvent.change(searchInput, { target: { value: '' } });

      expect(screen.getByText('new-ui')).toBeInTheDocument();
      expect(screen.getByText('beta-features')).toBeInTheDocument();
      expect(screen.getByText('dark-mode')).toBeInTheDocument();
    });
  });

  describe('Status Filtering', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should filter by enabled flags', () => {
      const statusFilter = screen.getByDisplayValue('All');
      fireEvent.change(statusFilter, { target: { value: 'enabled' } });

      expect(screen.getByText('new-ui')).toBeInTheDocument();
      expect(screen.getByText('dark-mode')).toBeInTheDocument();
      expect(screen.queryByText('beta-features')).not.toBeInTheDocument();
    });

    it('should filter by disabled flags', () => {
      const statusFilter = screen.getByDisplayValue('All');
      fireEvent.change(statusFilter, { target: { value: 'disabled' } });

      expect(screen.getByText('beta-features')).toBeInTheDocument();
      expect(screen.queryByText('new-ui')).not.toBeInTheDocument();
      expect(screen.queryByText('dark-mode')).not.toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should sort by name in ascending order by default', () => {
      const rows = screen.getAllByRole('row');
      // Skip header row
      const dataRows = rows.slice(1);
      
      expect(dataRows[0]).toHaveTextContent('beta-features');
      expect(dataRows[1]).toHaveTextContent('dark-mode');
      expect(dataRows[2]).toHaveTextContent('new-ui');
    });

    it('should sort by status when status column is clicked', () => {
      const statusHeader = screen.getByText('Status ↑');
      fireEvent.click(statusHeader);

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1);
      
      // Disabled flags should come first (false < true)
      expect(dataRows[0]).toHaveTextContent('beta-features');
    });

    it('should sort by last updated when updated column is clicked', () => {
      const updatedHeader = screen.getByText('Last Updated');
      fireEvent.click(updatedHeader);

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1);
      
      // Should sort by updated_at, with null values last
      expect(dataRows[0]).toHaveTextContent('dark-mode'); // 2024-01-03
      expect(dataRows[1]).toHaveTextContent('new-ui');    // 2024-01-02
      expect(dataRows[2]).toHaveTextContent('beta-features'); // null
    });
  });

  describe('Auto-refresh Controls', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should toggle auto-refresh checkbox', () => {
      const autoRefreshCheckbox = screen.getByRole('checkbox');
      expect(autoRefreshCheckbox).toBeChecked();

      fireEvent.click(autoRefreshCheckbox);
      expect(autoRefreshCheckbox).not.toBeChecked();
    });

    it('should change refresh interval', () => {
      const intervalInput = screen.getByDisplayValue('10');
      fireEvent.change(intervalInput, { target: { value: '20' } });

      expect(intervalInput).toHaveValue(20);
    });
  });

  describe('Manual Refresh', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should refresh when refresh button is clicked', () => {
      const refreshButton = screen.getByText('Refresh Now');
      fireEvent.click(refreshButton);

      expect(screen.getByText('Refreshing...')).toBeInTheDocument();
      expect(featureFlagApi.getAllFeatureFlags).toHaveBeenCalledTimes(2);
    });

    it('should show flag count', () => {
      expect(screen.getByText('3 of 3 flags shown')).toBeInTheDocument();
    });
  });

  describe('Feature Flag Table', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should display all feature flags in table', () => {
      expect(screen.getByText('new-ui')).toBeInTheDocument();
      expect(screen.getByText('beta-features')).toBeInTheDocument();
      expect(screen.getByText('dark-mode')).toBeInTheDocument();
    });

    it('should show status badges correctly', () => {
      expect(screen.getByText('✓ Enabled')).toBeInTheDocument();
      expect(screen.getByText('✗ Disabled')).toBeInTheDocument();
    });

    it('should show descriptions', () => {
      expect(screen.getByText('New user interface')).toBeInTheDocument();
      expect(screen.getByText('Beta testing features')).toBeInTheDocument();
      expect(screen.getByText('Dark theme support')).toBeInTheDocument();
    });

    it('should show timestamps', () => {
      expect(screen.getByText(/2024-01-02/)).toBeInTheDocument();
      expect(screen.getByText(/2024-01-03/)).toBeInTheDocument();
    });
  });

  describe('Toggle Feature Flags', () => {
    beforeEach(async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      featureFlagApi.updateFeatureFlag.mockResolvedValue({ success: true });
      render(<FeatureFlagDebugPanel isVisible={true} />);
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });
    });

    it('should enable disabled feature flag', async () => {
      const enableButton = screen.getByText('Enable');
      fireEvent.click(enableButton);

      expect(featureFlagApi.updateFeatureFlag).toHaveBeenCalledWith(2, { enabled: true });
    });

    it('should disable enabled feature flag', async () => {
      const disableButton = screen.getByText('Disable');
      fireEvent.click(disableButton);

      expect(featureFlagApi.updateFeatureFlag).toHaveBeenCalledWith(1, { enabled: false });
    });

    it('should update local state after successful toggle', async () => {
      const enableButton = screen.getByText('Enable');
      fireEvent.click(enableButton);

      await waitFor(() => {
        expect(screen.getByText('✓ Enabled')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API call fails', async () => {
      const errorMessage = 'Failed to fetch feature flags';
      featureFlagApi.getAllFeatureFlags.mockRejectedValue(new Error(errorMessage));

      render(<FeatureFlagDebugPanel isVisible={true} />);

      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
    });

    it('should handle toggle errors gracefully', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);
      featureFlagApi.updateFeatureFlag.mockRejectedValue(new Error('Toggle failed'));

      render(<FeatureFlagDebugPanel isVisible={true} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const enableButton = screen.getByText('Enable');
      fireEvent.click(enableButton);

      await waitFor(() => {
        expect(screen.getByText('Error: Toggle failed')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no flags match filters', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagDebugPanel isVisible={true} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search flags...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByText('No flags match your filters')).toBeInTheDocument();
    });

    it('should show empty state when no feature flags exist', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue([]);

      render(<FeatureFlagDebugPanel isVisible={true} />);

      await waitFor(() => {
        expect(screen.getByText('No feature flags found')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-refresh Timer', () => {
    it('should auto-refresh at specified interval', async () => {
      featureFlagApi.getAllFeatureFlags.mockResolvedValue(mockFeatureFlags);

      render(<FeatureFlagDebugPanel isVisible={true} refreshInterval={5000} />);

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

      render(<FeatureFlagDebugPanel isVisible={true} autoRefresh={false} refreshInterval={5000} />);

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

  describe('Custom Styling', () => {
    it('should apply custom className to toggle button', () => {
      const { container } = render(<FeatureFlagDebugPanel className="custom-class" />);
      
      const toggleButton = container.querySelector('button');
      expect(toggleButton).toHaveClass('custom-class');
    });
  });
});
