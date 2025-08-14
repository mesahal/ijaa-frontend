import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';

// Mock the featureFlagApi module
jest.mock('../../utils/featureFlagApi', () => ({
  featureFlagApi: {
    checkFeatureFlag: jest.fn(),
    checkMultipleFeatureFlags: jest.fn(),
    getUserFeatureFlags: jest.fn()
  }
}));

import { useFeatureFlag, useFeatureFlags, useUserFeatureFlags, useFeatureEnabled } from '../../hooks/useFeatureFlag';
import { featureFlagApi } from '../../utils/featureFlagApi';

describe('Feature Flag Hooks - Group 3 Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useFeatureFlag', () => {
    it('should return feature flag status when enabled', async () => {
      const mockResponse = {
        data: {
          featureName: 'NEW_UI',
          enabled: true
        }
      };
      featureFlagApi.checkFeatureFlag.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFeatureFlag('NEW_UI'));

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.isEnabled).toBe(false);
      expect(result.current.error).toBe(null);

      // Wait for the effect to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true);
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkFeatureFlag).toHaveBeenCalledWith('NEW_UI');
    });

    it('should return feature flag status when disabled', async () => {
      const mockResponse = {
        data: {
          featureName: 'CHAT_FEATURE',
          enabled: false
        }
      };
      featureFlagApi.checkFeatureFlag.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFeatureFlag('CHAT_FEATURE'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkFeatureFlag).toHaveBeenCalledWith('CHAT_FEATURE');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error');
      featureFlagApi.checkFeatureFlag.mockRejectedValue(error);

      const { result } = renderHook(() => useFeatureFlag('NON_EXISTENT'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(false);
      expect(result.current.error).toBe('Network error');
    });

    it('should use default value when API call fails', async () => {
      const error = new Error('Network error');
      featureFlagApi.checkFeatureFlag.mockRejectedValue(error);

      const { result } = renderHook(() => useFeatureFlag('NON_EXISTENT', true));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.isEnabled).toBe(true); // Should use default value
      expect(result.current.error).toBe('Network error');
    });

    it('should re-fetch when featureName changes', async () => {
      const mockResponses = [
        {
          data: {
            featureName: 'NEW_UI',
            enabled: true
          }
        },
        {
          data: {
            featureName: 'CHAT_FEATURE',
            enabled: false
          }
        }
      ];

      featureFlagApi.checkFeatureFlag
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1]);

      const { result, rerender } = renderHook(
        ({ featureName }) => useFeatureFlag(featureName),
        { initialProps: { featureName: 'NEW_UI' } }
      );

      await waitFor(() => {
        expect(result.current.isEnabled).toBe(true);
      });

      // Change feature name
      rerender({ featureName: 'CHAT_FEATURE' });

      await waitFor(() => {
        expect(result.current.isEnabled).toBe(false);
      });

      expect(featureFlagApi.checkFeatureFlag).toHaveBeenCalledTimes(2);
    });

    it('should handle empty feature name', async () => {
      const { result } = renderHook(() => useFeatureFlag(''));

      expect(result.current.loading).toBe(false);
      expect(result.current.isEnabled).toBe(false);
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkFeatureFlag).not.toHaveBeenCalled();
    });

    it('should handle null feature name', async () => {
      const { result } = renderHook(() => useFeatureFlag(null));

      expect(result.current.loading).toBe(false);
      expect(result.current.isEnabled).toBe(false);
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkFeatureFlag).not.toHaveBeenCalled();
    });
  });

  describe('useFeatureFlags', () => {
    it('should return multiple feature flags status', async () => {
      const mockResponse = {
        NEW_UI: true,
        CHAT_FEATURE: false,
        DARK_MODE: true
      };
      featureFlagApi.checkMultipleFeatureFlags.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFeatureFlags(['NEW_UI', 'CHAT_FEATURE', 'DARK_MODE']));

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.flagsStatus).toEqual({});
      expect(result.current.error).toBe(null);

      // Wait for the effect to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.flagsStatus).toEqual(mockResponse);
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkMultipleFeatureFlags).toHaveBeenCalledWith(['NEW_UI', 'CHAT_FEATURE', 'DARK_MODE']);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Network error');
      featureFlagApi.checkMultipleFeatureFlags.mockRejectedValue(error);

      const { result } = renderHook(() => useFeatureFlags(['NEW_UI', 'CHAT_FEATURE']));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.flagsStatus).toEqual({});
      expect(result.current.error).toBe('Network error');
    });

    it('should handle empty feature names array', async () => {
      const { result } = renderHook(() => useFeatureFlags([]));

      expect(result.current.loading).toBe(false);
      expect(result.current.flagsStatus).toEqual({});
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkMultipleFeatureFlags).not.toHaveBeenCalled();
    });

    it('should handle null feature names', async () => {
      const { result } = renderHook(() => useFeatureFlags(null));

      expect(result.current.loading).toBe(false);
      expect(result.current.flagsStatus).toEqual({});
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.checkMultipleFeatureFlags).not.toHaveBeenCalled();
    });

    it('should re-fetch when feature names change', async () => {
      const mockResponses = [
        { NEW_UI: true, CHAT_FEATURE: false },
        { DARK_MODE: true, NOTIFICATIONS: false }
      ];

      featureFlagApi.checkMultipleFeatureFlags
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1]);

      const { result, rerender } = renderHook(
        ({ featureNames }) => useFeatureFlags(featureNames),
        { initialProps: { featureNames: ['NEW_UI', 'CHAT_FEATURE'] } }
      );

      await waitFor(() => {
        expect(result.current.flagsStatus).toEqual(mockResponses[0]);
      });

      // Change feature names
      rerender({ featureNames: ['DARK_MODE', 'NOTIFICATIONS'] });

      await waitFor(() => {
        expect(result.current.flagsStatus).toEqual(mockResponses[1]);
      });

      expect(featureFlagApi.checkMultipleFeatureFlags).toHaveBeenCalledTimes(2);
    });
  });

  describe('useUserFeatureFlags', () => {
    it('should return user feature flags', async () => {
      const mockResponse = [
        {
          featureName: 'NEW_UI',
          enabled: true
        },
        {
          featureName: 'CHAT_FEATURE',
          enabled: false
        }
      ];
      featureFlagApi.getUserFeatureFlags.mockResolvedValue({ data: mockResponse });

      const { result } = renderHook(() => useUserFeatureFlags());

      // Initially loading
      expect(result.current.loading).toBe(true);
      expect(result.current.userFlags).toEqual([]);
      expect(result.current.error).toBe(null);

      // Wait for the effect to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userFlags).toEqual(mockResponse);
      expect(result.current.error).toBe(null);
      expect(featureFlagApi.getUserFeatureFlags).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Failed to fetch user feature flags');
      featureFlagApi.getUserFeatureFlags.mockRejectedValue(error);

      const { result } = renderHook(() => useUserFeatureFlags());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userFlags).toEqual([]);
      expect(result.current.error).toBe('Failed to fetch user feature flags');
    });

    it('should handle empty response data', async () => {
      featureFlagApi.getUserFeatureFlags.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useUserFeatureFlags());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userFlags).toEqual([]);
      expect(result.current.error).toBe(null);
    });

    it('should handle response without data property', async () => {
      featureFlagApi.getUserFeatureFlags.mockResolvedValue({});

      const { result } = renderHook(() => useUserFeatureFlags());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userFlags).toEqual([]);
      expect(result.current.error).toBe(null);
    });
  });

  describe('useFeatureEnabled', () => {
    it('should return boolean value for enabled feature', async () => {
      const mockResponse = {
        data: {
          featureName: 'NEW_UI',
          enabled: true
        }
      };
      featureFlagApi.checkFeatureFlag.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFeatureEnabled('NEW_UI'));

      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it('should return boolean value for disabled feature', async () => {
      const mockResponse = {
        data: {
          featureName: 'CHAT_FEATURE',
          enabled: false
        }
      };
      featureFlagApi.checkFeatureFlag.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFeatureEnabled('CHAT_FEATURE'));

      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });

    it('should return default value when API call fails', async () => {
      const error = new Error('Network error');
      featureFlagApi.checkFeatureFlag.mockRejectedValue(error);

      const { result } = renderHook(() => useFeatureEnabled('NON_EXISTENT', true));

      await waitFor(() => {
        expect(result.current).toBe(true); // Should use default value
      });
    });

    it('should return false as default when no default is provided', async () => {
      const error = new Error('Network error');
      featureFlagApi.checkFeatureFlag.mockRejectedValue(error);

      const { result } = renderHook(() => useFeatureEnabled('NON_EXISTENT'));

      await waitFor(() => {
        expect(result.current).toBe(false); // Should use false as default
      });
    });
  });
});
