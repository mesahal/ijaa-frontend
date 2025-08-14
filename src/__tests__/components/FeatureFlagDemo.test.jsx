import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock the hooks
jest.mock('../../hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn(),
  useFeatureFlags: jest.fn(),
  useUserFeatureFlags: jest.fn(),
  useFeatureEnabled: jest.fn()
}));

import FeatureFlagDemo from '../../components/FeatureFlagDemo';
import { useFeatureFlag, useFeatureFlags, useUserFeatureFlags, useFeatureEnabled } from '../../hooks/useFeatureFlag';

describe('FeatureFlagDemo Component - Group 3 Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Single Feature Flag Check', () => {
    it('should display enabled feature flag correctly', async () => {
      useFeatureFlag.mockReturnValue({
        isEnabled: true,
        loading: false,
        error: null
      });

      render(<FeatureFlagDemo />);

      await waitFor(() => {
        expect(screen.getByText('NEW_UI Feature:')).toBeInTheDocument();
        expect(screen.getByText('Enabled')).toBeInTheDocument();
      });
    });

    it('should display disabled feature flag correctly', async () => {
      useFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      render(<FeatureFlagDemo />);

      await waitFor(() => {
        expect(screen.getByText('NEW_UI Feature:')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();
      });
    });

    it('should display loading state', async () => {
      useFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: true,
        error: null
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state', async () => {
      useFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: 'Network error'
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  describe('Multiple Feature Flags Check', () => {
    it('should display multiple feature flags correctly', async () => {
      useFeatureFlags.mockReturnValue({
        flagsStatus: {
          CHAT_FEATURE: true,
          DARK_MODE: false,
          NOTIFICATIONS: true
        },
        loading: false,
        error: null
      });

      render(<FeatureFlagDemo />);

      await waitFor(() => {
        expect(screen.getByText('CHAT_FEATURE:')).toBeInTheDocument();
        expect(screen.getByText('DARK_MODE:')).toBeInTheDocument();
        expect(screen.getByText('NOTIFICATIONS:')).toBeInTheDocument();
        expect(screen.getAllByText('Enabled')).toHaveLength(2);
        expect(screen.getAllByText('Disabled')).toHaveLength(1);
      });
    });

    it('should display loading state for multiple flags', async () => {
      useFeatureFlags.mockReturnValue({
        flagsStatus: {},
        loading: true,
        error: null
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state for multiple flags', async () => {
      useFeatureFlags.mockReturnValue({
        flagsStatus: {},
        loading: false,
        error: 'Failed to fetch flags'
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Error: Failed to fetch flags')).toBeInTheDocument();
    });
  });

  describe('User Feature Flags', () => {
    it('should display user feature flags correctly', async () => {
      useUserFeatureFlags.mockReturnValue({
        userFlags: [
          { featureName: 'NEW_UI', enabled: true },
          { featureName: 'CHAT_FEATURE', enabled: false }
        ],
        loading: false,
        error: null
      });

      render(<FeatureFlagDemo />);

      await waitFor(() => {
        expect(screen.getByText('NEW_UI:')).toBeInTheDocument();
        expect(screen.getByText('CHAT_FEATURE:')).toBeInTheDocument();
        expect(screen.getAllByText('Enabled')).toHaveLength(2);
        expect(screen.getAllByText('Disabled')).toHaveLength(1);
      });
    });

    it('should display loading state for user flags', async () => {
      useUserFeatureFlags.mockReturnValue({
        userFlags: [],
        loading: true,
        error: null
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should display error state for user flags', async () => {
      useUserFeatureFlags.mockReturnValue({
        userFlags: [],
        loading: false,
        error: 'Failed to fetch user flags'
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Error: Failed to fetch user flags')).toBeInTheDocument();
    });

    it('should display no flags message when empty', async () => {
      useUserFeatureFlags.mockReturnValue({
        userFlags: [],
        loading: false,
        error: null
      });

      render(<FeatureFlagDemo />);

      expect(screen.getByText('No user feature flags found')).toBeInTheDocument();
    });
  });

  describe('Simple Boolean Check', () => {
    it('should display enabled payment integration', async () => {
      useFeatureEnabled.mockReturnValue(true);

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Payment Integration:')).toBeInTheDocument();
      expect(screen.getByText('Enabled')).toBeInTheDocument();
    });

    it('should display disabled payment integration', async () => {
      useFeatureEnabled.mockReturnValue(false);

      render(<FeatureFlagDemo />);

      expect(screen.getByText('Payment Integration:')).toBeInTheDocument();
      expect(screen.getByText('Disabled')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render all sections correctly', async () => {
      // Mock all hooks with default values
      useFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      useFeatureFlags.mockReturnValue({
        flagsStatus: {},
        loading: false,
        error: null
      });

      useUserFeatureFlags.mockReturnValue({
        userFlags: [],
        loading: false,
        error: null
      });

      useFeatureEnabled.mockReturnValue(false);

      render(<FeatureFlagDemo />);

      // Check main title
      expect(screen.getByText('Feature Flag Demo - Group 3 Implementation')).toBeInTheDocument();

      // Check section headers
      expect(screen.getByText('Single Feature Flag Check')).toBeInTheDocument();
      expect(screen.getByText('Multiple Feature Flags Check')).toBeInTheDocument();
      expect(screen.getByText('User Feature Flags')).toBeInTheDocument();
      expect(screen.getByText('Simple Boolean Check')).toBeInTheDocument();
      expect(screen.getByText('Usage Examples')).toBeInTheDocument();
    });

    it('should display usage examples correctly', async () => {
      // Mock all hooks with default values
      useFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      useFeatureFlags.mockReturnValue({
        flagsStatus: {},
        loading: false,
        error: null
      });

      useUserFeatureFlags.mockReturnValue({
        userFlags: [],
        loading: false,
        error: null
      });

      useFeatureEnabled.mockReturnValue(false);

      render(<FeatureFlagDemo />);

      // Check usage examples
      expect(screen.getByText('Single Feature Flag:')).toBeInTheDocument();
      expect(screen.getByText('Multiple Feature Flags:')).toBeInTheDocument();
      expect(screen.getByText('Simple Boolean Check:')).toBeInTheDocument();
    });
  });

  describe('Integration with Hooks', () => {
    it('should call hooks with correct parameters', async () => {
      // Mock all hooks
      useFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      useFeatureFlags.mockReturnValue({
        flagsStatus: {},
        loading: false,
        error: null
      });

      useUserFeatureFlags.mockReturnValue({
        userFlags: [],
        loading: false,
        error: null
      });

      useFeatureEnabled.mockReturnValue(false);

      render(<FeatureFlagDemo />);

      // Verify hooks are called with correct parameters
      expect(useFeatureFlag).toHaveBeenCalledWith('NEW_UI');
      expect(useFeatureFlags).toHaveBeenCalledWith(['CHAT_FEATURE', 'DARK_MODE', 'NOTIFICATIONS']);
      expect(useUserFeatureFlags).toHaveBeenCalledWith();
      expect(useFeatureEnabled).toHaveBeenCalledWith('PAYMENT_INTEGRATION', false);
    });
  });
});
