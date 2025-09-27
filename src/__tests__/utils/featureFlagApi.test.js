// Mock the API client and admin API
jest.mock('../../utils/apiClient', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

jest.mock('../../utils/adminApi', () => ({
  adminApi: {
    getFeatureFlags: jest.fn(),
    getFeatureFlag: jest.fn(),
    createFeatureFlag: jest.fn(),
    updateFeatureFlag: jest.fn(),
    deleteFeatureFlag: jest.fn(),
    getEnabledFeatureFlags: jest.fn(),
    getDisabledFeatureFlags: jest.fn(),
    refreshFeatureFlagCache: jest.fn()
  }
}));

// Mock axios for direct API calls
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));
import { featureFlagApi, FEATURE_FLAGS, FEATURE_FLAG_DESCRIPTIONS  } from '../../../utils/featureFlagApi';



import apiClient from '../../utils/apiClient';
import { adminApi  } from '../../../utils/adminApi';
import axios from 'axios';

describe('featureFlagApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Feature Flag Management (Admin)', () => {
    it('should get all feature flags', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: 'events',
            displayName: 'Events System',
            enabled: true,
            description: 'Event management system',
            parentId: null
          }
        ]
      };
      adminApi.getFeatureFlags.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.getAllFeatureFlags();
      expect(result).toEqual(mockResponse);
      expect(adminApi.getFeatureFlags).toHaveBeenCalled();
    });

    it('should get feature flag by name', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'events.creation',
          displayName: 'Event Creation',
          enabled: true,
          description: 'Event creation functionality',
          parentId: 1
        }
      };
      adminApi.getFeatureFlag.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.getFeatureFlag('events.creation');
      expect(result).toEqual(mockResponse);
      expect(adminApi.getFeatureFlag).toHaveBeenCalledWith('events.creation');
    });

    it('should create feature flag', async () => {
      const featureFlagData = {
        name: 'events.creation',
        displayName: 'Event Creation',
        description: 'Event creation functionality',
        parentId: 1,
        enabled: false
      };
      const mockResponse = { data: { ...featureFlagData, id: 1 } };
      adminApi.createFeatureFlag.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.createFeatureFlag(featureFlagData);
      expect(result).toEqual(mockResponse);
      expect(adminApi.createFeatureFlag).toHaveBeenCalledWith(featureFlagData);
    });

    it('should update feature flag', async () => {
      const updateData = { enabled: true };
      const mockResponse = { data: { name: 'events.creation', enabled: true } };
      adminApi.updateFeatureFlag.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.updateFeatureFlag('events.creation', updateData);
      expect(result).toEqual(mockResponse);
      expect(adminApi.updateFeatureFlag).toHaveBeenCalledWith('events.creation', updateData);
    });

    it('should delete feature flag', async () => {
      adminApi.deleteFeatureFlag.mockResolvedValue({ data: null });

      await featureFlagApi.deleteFeatureFlag('events.creation');
      expect(adminApi.deleteFeatureFlag).toHaveBeenCalledWith('events.creation');
    });
  });

  describe('Feature Flag Status Management (Admin)', () => {
    it('should get enabled feature flags', async () => {
      const mockResponse = {
        data: [
          { name: 'events', enabled: true },
          { name: 'events.creation', enabled: true }
        ]
      };
      adminApi.getEnabledFeatureFlags.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.getEnabledFeatureFlags();
      expect(result).toEqual(mockResponse);
      expect(adminApi.getEnabledFeatureFlags).toHaveBeenCalled();
    });

    it('should get disabled feature flags', async () => {
      const mockResponse = {
        data: [
          { name: 'events.creation', enabled: false }
        ]
      };
      adminApi.getDisabledFeatureFlags.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.getDisabledFeatureFlags();
      expect(result).toEqual(mockResponse);
      expect(adminApi.getDisabledFeatureFlags).toHaveBeenCalled();
    });

    it('should refresh feature flag cache', async () => {
      const mockResponse = { data: { message: 'Cache refreshed' } };
      adminApi.refreshFeatureFlagCache.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.refreshFeatureFlagCache();
      expect(result).toEqual(mockResponse);
      expect(adminApi.refreshFeatureFlagCache).toHaveBeenCalled();
    });
  });

  describe('Feature Flag Status Checking (User)', () => {
    it('should check feature flag status', async () => {
      const mockResponse = {
        data: {
          name: 'events.creation',
          enabled: true
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.checkFeatureFlag('events.creation');
      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/admin/feature-flags/events.creation/enabled`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'accept': 'application/json'
          })
        })
      );
    });

    it('should check multiple feature flags', async () => {
      const mockResponses = [
        { data: { name: 'events', enabled: true } },
        { data: { name: 'events.creation', enabled: false } }
      ];
      
      axios.get
        .mockResolvedValueOnce(mockResponses[0])
        .mockResolvedValueOnce(mockResponses[1]);

      const result = await featureFlagApi.checkMultipleFeatureFlags(['events', 'events.creation']);
      expect(result).toEqual({
        events: true,
        'events.creation': false
      });
    });

    it('should handle errors in multiple feature flag check', async () => {
      axios.get
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await featureFlagApi.checkMultipleFeatureFlags(['events', 'events.creation']);
      expect(result).toEqual({
        'events.creation': true
      });
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should check feature flag with caching', async () => {
      const mockResponse = {
        data: {
          name: 'events.creation',
          enabled: true
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      // First call should hit the API
      const result1 = await featureFlagApi.checkFeatureFlagCached('events.creation');
      expect(result1).toEqual(mockResponse.data);

      // Second call should use cache
      const result2 = await featureFlagApi.checkFeatureFlagCached('events.creation');
      expect(result2).toEqual(mockResponse.data);

      // API should only be called once
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should check feature flag with fallback', async () => {
      const mockResponse = {
        data: {
          name: 'events.creation',
          enabled: true
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.checkFeatureFlagWithFallback('events.creation', false);
      expect(result).toBe(true);
    });

    it('should return fallback value on error', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const result = await featureFlagApi.checkFeatureFlagWithFallback('events.creation', false);
      expect(result).toBe(false);
    });
  });

  describe('Hierarchical Feature Flag Utilities', () => {
    it('should check if parent feature is enabled', async () => {
      const mockResponse = {
        data: {
          name: 'events',
          enabled: true
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.isParentFeatureEnabled('events.creation');
      expect(result).toBe(true);
      expect(axios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/admin/feature-flags/events/enabled`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'accept': 'application/json'
          })
        })
      );
    });

    it('should return true for features without parent', async () => {
      const result = await featureFlagApi.isParentFeatureEnabled('events');
      expect(result).toBe(true);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should check feature flag with hierarchical validation', async () => {
      const parentResponse = {
        data: {
          name: 'events',
          enabled: true
        }
      };
      const featureResponse = {
        data: {
          name: 'events.creation',
          enabled: true
        }
      };
      
      axios.get
        .mockResolvedValueOnce(parentResponse)
        .mockResolvedValueOnce(featureResponse);

      const result = await featureFlagApi.checkFeatureFlagHierarchical('events.creation');
      expect(result).toEqual(featureResponse.data);
    });

    it('should return disabled when parent is disabled', async () => {
      const parentResponse = {
        data: {
          name: 'events',
          enabled: false
        }
      };
      
      axios.get.mockResolvedValue(parentResponse);

      const result = await featureFlagApi.checkFeatureFlagHierarchical('events.creation');
      expect(result.data).toEqual({
        name: 'events.creation',
        enabled: false,
        reason: 'Parent feature disabled'
      });
    });

    it('should get available feature flags', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: 'events',
            children: [
              {
                id: 2,
                name: 'events.creation'
              }
            ]
          }
        ]
      };
      adminApi.getFeatureFlags.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.getAvailableFeatureFlags();
      expect(result).toEqual(['events', 'events.creation']);
    });

    it('should extract flag names from hierarchical structure', () => {
      const flags = [
        {
          id: 1,
          name: 'events',
          children: [
            {
              id: 2,
              name: 'events.creation'
            }
          ]
        },
        {
          id: 3,
          name: 'user',
          children: [
            {
              id: 4,
              name: 'user.profile'
            }
          ]
        }
      ];

      const result = featureFlagApi.extractFlagNames(flags);
      expect(result).toEqual(['events', 'events.creation', 'user', 'user.profile']);
    });

    it('should validate if a feature flag exists', async () => {
      const mockResponse = {
        data: {
          name: 'events.creation',
          enabled: true
        }
      };
      axios.get.mockResolvedValue(mockResponse);

      const result = await featureFlagApi.validateFeatureFlag('events.creation');
      expect(result).toBe(true);
    });

    it('should return false for non-existent feature flag', async () => {
      axios.get.mockRejectedValue(new Error('Not found'));

      const result = await featureFlagApi.validateFeatureFlag('non.existent');
      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors in getAllFeatureFlags', async () => {
      adminApi.getFeatureFlags.mockRejectedValue(new Error('API Error'));

      await expect(featureFlagApi.getAllFeatureFlags()).rejects.toThrow('API Error');
    });

    it('should handle API errors in checkFeatureFlag', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(featureFlagApi.checkFeatureFlag('events.creation')).rejects.toThrow('API Error');
    });

    it('should handle API errors in hierarchical check', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const result = await featureFlagApi.isParentFeatureEnabled('events.creation');
      expect(result).toBe(false);
    });
  });
});

describe('FEATURE_FLAGS constants', () => {
  it('should contain hierarchical feature flags', () => {
    expect(FEATURE_FLAGS.USER_REGISTRATION).toBe('user.registration');
    expect(FEATURE_FLAGS.EVENTS).toBe('events');
    expect(FEATURE_FLAGS.EVENTS_CREATION).toBe('events.creation');
    expect(FEATURE_FLAGS.FILE_UPLOAD).toBe('file-upload');
    expect(FEATURE_FLAGS.FILE_UPLOAD_PROFILE_PHOTO).toBe('file-upload.profile-photo');
    expect(FEATURE_FLAGS.ADMIN_FEATURES).toBe('admin.features');
    expect(FEATURE_FLAGS.ALUMNI_SEARCH).toBe('alumni.search');
  });

  it('should contain legacy feature flags for backward compatibility', () => {
    expect(FEATURE_FLAGS.NEW_UI).toBe('NEW_UI');
    expect(FEATURE_FLAGS.CHAT_FEATURE).toBe('CHAT_FEATURE');
    expect(FEATURE_FLAGS.EVENT_REGISTRATION).toBe('EVENT_REGISTRATION');
  });
});

describe('FEATURE_FLAG_DESCRIPTIONS', () => {
  it('should contain descriptions for hierarchical feature flags', () => {
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.USER_REGISTRATION]).toBe('Enable user registration functionality');
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.EVENTS]).toBe('Enable event management functionality');
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.EVENTS_CREATION]).toBe('Enable event creation functionality');
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.FILE_UPLOAD]).toBe('Enable file upload functionality');
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.ADMIN_FEATURES]).toBe('Enable admin functionality');
  });

  it('should contain descriptions for legacy feature flags', () => {
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.NEW_UI]).toBe('Modern user interface with enhanced design');
    expect(FEATURE_FLAG_DESCRIPTIONS[FEATURE_FLAGS.CHAT_FEATURE]).toBe('Real-time chat functionality');
  });
});
