import { featureFlagApi, FEATURE_FLAGS, FEATURE_FLAG_DESCRIPTIONS, isFeatureEnabled, getFeatureFlagsStatus } from '../../utils/featureFlagApi';
import apiClient from '../../utils/apiClient';

// Mock the apiClient
jest.mock('../../utils/apiClient');

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('featureFlagApi - Complete Feature Flag System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Group 1: Basic Feature Flag Management (Admin)', () => {
    describe('1.1 Get All Feature Flags', () => {
      it('should get all feature flags successfully', async () => {
        const mockResponse = {
          data: {
            message: "Feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 1,
                featureName: "NEW_UI",
                enabled: true,
                description: "Enable new user interface with modern design",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              },
              {
                id: 2,
                featureName: "CHAT_FEATURE",
                enabled: false,
                description: "Enable real-time chat functionality between alumni",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getAllFeatureFlags();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when getting all feature flags', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(featureFlagApi.getAllFeatureFlags()).rejects.toThrow('Network error');
      });
    });

    describe('1.2 Get Feature Flag by Name', () => {
      it('should get a specific feature flag by name', async () => {
        const mockResponse = {
          data: {
            message: "Feature flag retrieved successfully",
            code: "200",
            data: {
              id: 1,
              featureName: "NEW_UI",
              enabled: true,
              description: "Enable new user interface with modern design",
              createdAt: "2024-12-01T10:00:00",
              updatedAt: "2024-12-01T10:00:00"
            }
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getFeatureFlag('NEW_UI');

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/NEW_UI');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when getting feature flag by name', async () => {
        const error = new Error('Feature flag not found');
        apiClient.get.mockRejectedValue(error);

        await expect(featureFlagApi.getFeatureFlag('NON_EXISTENT')).rejects.toThrow('Feature flag not found');
      });
    });

    describe('1.3 Create Feature Flag', () => {
      it('should create a new feature flag successfully', async () => {
        const featureFlagData = {
          featureName: "NEW_FEATURE",
          description: "Enable new feature for testing"
        };

        const mockResponse = {
          data: {
            message: "Feature flag created successfully",
            code: "201",
            data: {
              id: 3,
              featureName: "NEW_FEATURE",
              enabled: false,
              description: "Enable new feature for testing",
              createdAt: "2024-12-01T10:00:00",
              updatedAt: "2024-12-01T10:00:00"
            }
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.createFeatureFlag(featureFlagData);

        expect(apiClient.post).toHaveBeenCalledWith('/admin/feature-flags', featureFlagData);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when creating feature flag', async () => {
        const featureFlagData = {
          featureName: "NEW_FEATURE",
          description: "Enable new feature for testing"
        };

        const error = new Error('Feature flag already exists');
        apiClient.post.mockRejectedValue(error);

        await expect(featureFlagApi.createFeatureFlag(featureFlagData)).rejects.toThrow('Feature flag already exists');
      });
    });

    describe('1.4 Update Feature Flag', () => {
      it('should update a feature flag successfully', async () => {
        const featureFlagData = {
          enabled: true
        };

        const mockResponse = {
          data: {
            message: "Feature flag updated successfully",
            code: "200",
            data: {
              id: 1,
              featureName: "NEW_UI",
              enabled: true,
              description: "Enable new user interface with modern design",
              createdAt: "2024-12-01T10:00:00",
              updatedAt: "2024-12-01T11:00:00"
            }
          }
        };

        apiClient.put.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.updateFeatureFlag('NEW_UI', featureFlagData);

        expect(apiClient.put).toHaveBeenCalledWith('/admin/feature-flags/NEW_UI', featureFlagData);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when updating feature flag', async () => {
        const featureFlagData = {
          enabled: true
        };

        const error = new Error('Feature flag not found');
        apiClient.put.mockRejectedValue(error);

        await expect(featureFlagApi.updateFeatureFlag('NON_EXISTENT', featureFlagData)).rejects.toThrow('Feature flag not found');
      });
    });

    describe('1.5 Delete Feature Flag', () => {
      it('should delete a feature flag successfully', async () => {
        const mockResponse = {
          data: {
            message: "Feature flag deleted successfully",
            code: "200",
            data: null
          }
        };

        apiClient.delete.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.deleteFeatureFlag('NEW_UI');

        expect(apiClient.delete).toHaveBeenCalledWith('/admin/feature-flags/NEW_UI');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when deleting feature flag', async () => {
        const error = new Error('Feature flag not found');
        apiClient.delete.mockRejectedValue(error);

        await expect(featureFlagApi.deleteFeatureFlag('NON_EXISTENT')).rejects.toThrow('Feature flag not found');
      });
    });
  });

  describe('Group 2: Feature Flag Status Management (Admin)', () => {
    describe('2.1 Get Enabled Feature Flags', () => {
      it('should get enabled feature flags successfully', async () => {
        const mockResponse = {
          data: {
            message: "Enabled feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 1,
                featureName: "NEW_UI",
                enabled: true,
                description: "Enable new user interface with modern design",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getEnabledFeatureFlags();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/enabled');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when getting enabled feature flags', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(featureFlagApi.getEnabledFeatureFlags()).rejects.toThrow('Network error');
      });
    });

    describe('2.2 Get Disabled Feature Flags', () => {
      it('should get disabled feature flags successfully', async () => {
        const mockResponse = {
          data: {
            message: "Disabled feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 2,
                featureName: "CHAT_FEATURE",
                enabled: false,
                description: "Enable real-time chat functionality between alumni",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getDisabledFeatureFlags();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/disabled');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when getting disabled feature flags', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(featureFlagApi.getDisabledFeatureFlags()).rejects.toThrow('Network error');
      });
    });

    describe('2.3 Get Feature Flags by Status', () => {
      it('should get feature flags by enabled status', async () => {
        const mockResponse = {
          data: {
            message: "Enabled feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 1,
                featureName: "NEW_UI",
                enabled: true,
                description: "Enable new user interface with modern design",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getFeatureFlagsByStatus(true);

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/enabled');
        expect(result).toEqual(mockResponse.data);
      });

      it('should get feature flags by disabled status', async () => {
        const mockResponse = {
          data: {
            message: "Disabled feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 2,
                featureName: "CHAT_FEATURE",
                enabled: false,
                description: "Enable real-time chat functionality between alumni",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getFeatureFlagsByStatus(false);

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/disabled');
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe('2.4 Get Feature Flags Summary', () => {
      it('should get feature flags summary successfully', async () => {
        const enabledResponse = {
          data: {
            message: "Enabled feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 1,
                featureName: "NEW_UI",
                enabled: true,
                description: "Enable new user interface with modern design",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        const disabledResponse = {
          data: {
            message: "Disabled feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 2,
                featureName: "CHAT_FEATURE",
                enabled: false,
                description: "Enable real-time chat functionality between alumni",
                createdAt: "2024-12-01T10:00:00",
                updatedAt: "2024-12-01T10:00:00"
              }
            ]
          }
        };

        apiClient.get
          .mockResolvedValueOnce(enabledResponse)
          .mockResolvedValueOnce(disabledResponse);

        const result = await featureFlagApi.getFeatureFlagsSummary();

        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/enabled');
        expect(apiClient.get).toHaveBeenCalledWith('/admin/feature-flags/disabled');
        expect(result).toEqual({
          enabled: enabledResponse.data.data,
          disabled: disabledResponse.data.data,
          total: 2,
          enabledCount: 1,
          disabledCount: 1
        });
      });

      it('should handle errors when getting feature flags summary', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(featureFlagApi.getFeatureFlagsSummary()).rejects.toThrow('Network error');
      });
    });
  });

  describe('Group 3: Feature Flag Status Checking (User)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Mock localStorage to return a valid user token
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        token: 'test-token',
        username: 'testuser'
      }));
    });

    describe('3.1 Check Feature Flag Status', () => {
      it('should check feature flag status successfully (enabled)', async () => {
        const mockResponse = {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            featureName: "NEW_UI",
            enabled: true
          }
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const result = await featureFlagApi.checkFeatureFlag('NEW_UI');

        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/ijaa/api/v1/admin/feature-flags/check/NEW_UI',
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            }
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('should check feature flag status successfully (disabled)', async () => {
        const mockResponse = {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            featureName: "CHAT_FEATURE",
            enabled: false
          }
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const result = await featureFlagApi.checkFeatureFlag('CHAT_FEATURE');

        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8000/ijaa/api/v1/admin/feature-flags/check/CHAT_FEATURE',
          {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer test-token',
              'Content-Type': 'application/json'
            }
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle errors when checking feature flag status', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: false,
          status: 404
        });

        await expect(featureFlagApi.checkFeatureFlag('NON_EXISTENT')).rejects.toThrow('HTTP error! status: 404');
      });

      it('should throw error when no user token is found', async () => {
        localStorageMock.getItem.mockReturnValue(null);

        await expect(featureFlagApi.checkFeatureFlag('NEW_UI')).rejects.toThrow('No user token found');
      });
    });

    describe('3.2 Check if feature is enabled', () => {
      it('should return true when feature is enabled', async () => {
        const mockResponse = {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            featureName: "NEW_UI",
            enabled: true
          }
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const result = await featureFlagApi.isFeatureEnabled('NEW_UI');

        expect(result).toBe(true);
      });

      it('should return false when feature is disabled', async () => {
        const mockResponse = {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            featureName: "CHAT_FEATURE",
            enabled: false
          }
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const result = await featureFlagApi.isFeatureEnabled('CHAT_FEATURE');

        expect(result).toBe(false);
      });

      it('should return false when API call fails', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await featureFlagApi.isFeatureEnabled('NEW_UI');

        expect(result).toBe(false);
      });
    });

    describe('3.3 Check multiple feature flags status', () => {
      it('should check multiple feature flags successfully', async () => {
        const featureNames = ['NEW_UI', 'CHAT_FEATURE', 'DARK_MODE'];
        
        const mockResponses = [
          {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: { featureName: "NEW_UI", enabled: true }
          },
          {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: { featureName: "CHAT_FEATURE", enabled: false }
          },
          {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: { featureName: "DARK_MODE", enabled: true }
          }
        ];

        // Mock successful responses for all feature flags
        global.fetch
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponses[0]
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponses[1]
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponses[2]
          });

        const result = await featureFlagApi.checkMultipleFeatureFlags(featureNames);

        expect(result).toEqual({
          NEW_UI: true,
          CHAT_FEATURE: false,
          DARK_MODE: true
        });
        expect(global.fetch).toHaveBeenCalledTimes(3);
      });

      it('should handle partial failures gracefully', async () => {
        const featureNames = ['NEW_UI', 'CHAT_FEATURE'];
        
        // Mock one success and one failure
        global.fetch
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              message: "Feature flag status retrieved successfully",
              code: "200",
              data: { featureName: "NEW_UI", enabled: true }
            })
          })
          .mockRejectedValueOnce(new Error('Network error'));

        const result = await featureFlagApi.checkMultipleFeatureFlags(featureNames);

        expect(result).toEqual({
          NEW_UI: true,
          CHAT_FEATURE: false
        });
      });

      it('should return empty object for empty feature names array', async () => {
        const result = await featureFlagApi.checkMultipleFeatureFlags([]);

        expect(result).toEqual({});
        expect(global.fetch).not.toHaveBeenCalled();
      });

      it('should handle all failures gracefully', async () => {
        const featureNames = ['NEW_UI', 'CHAT_FEATURE'];
        
        global.fetch
          .mockRejectedValueOnce(new Error('Network error'))
          .mockRejectedValueOnce(new Error('Network error'));

        const result = await featureFlagApi.checkMultipleFeatureFlags(featureNames);

        expect(result).toEqual({
          NEW_UI: false,
          CHAT_FEATURE: false
        });
      });
    });

    describe('3.4 Get user-specific feature flags', () => {
      it('should get user feature flags successfully', async () => {
        const mockResponse = {
          data: {
            message: "User feature flags retrieved successfully",
            code: "200",
            data: [
              {
                id: 1,
                featureName: "NEW_UI",
                enabled: true,
                description: "Enable new user interface with modern design"
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await featureFlagApi.getUserFeatureFlags();

        expect(apiClient.get).toHaveBeenCalledWith('/feature-flags');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when getting user feature flags', async () => {
        const error = new Error('Network error');
        apiClient.get.mockRejectedValue(error);

        await expect(featureFlagApi.getUserFeatureFlags()).rejects.toThrow('Network error');
      });
    });
  });

  describe('Helper Functions', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        token: 'test-token',
        username: 'testuser'
      }));
    });

    describe('isFeatureEnabled helper', () => {
      it('should return true when feature is enabled', async () => {
        const mockResponse = {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            featureName: "NEW_UI",
            enabled: true
          }
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const result = await isFeatureEnabled('NEW_UI');

        expect(result).toBe(true);
      });

      it('should return false when feature is disabled', async () => {
        const mockResponse = {
          message: "Feature flag status retrieved successfully",
          code: "200",
          data: {
            featureName: "CHAT_FEATURE",
            enabled: false
          }
        };

        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse
        });

        const result = await isFeatureEnabled('CHAT_FEATURE');

        expect(result).toBe(false);
      });

      it('should return false when API call fails', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await isFeatureEnabled('NEW_UI');

        expect(result).toBe(false);
      });
    });

    describe('getFeatureFlagsStatus helper', () => {
      it('should get feature flags status for multiple flags', async () => {
        const featureNames = ['NEW_UI', 'CHAT_FEATURE'];
        
        const mockResponses = [
          {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: { featureName: "NEW_UI", enabled: true }
          },
          {
            message: "Feature flag status retrieved successfully",
            code: "200",
            data: { featureName: "CHAT_FEATURE", enabled: false }
          }
        ];

        global.fetch
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponses[0]
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponses[1]
          });

        const result = await getFeatureFlagsStatus(featureNames);

        expect(result).toEqual({
          NEW_UI: true,
          CHAT_FEATURE: false
        });
      });

      it('should handle errors gracefully', async () => {
        global.fetch.mockRejectedValue(new Error('Network error'));

        const result = await getFeatureFlagsStatus(['NEW_UI']);

        expect(result).toEqual({});
      });
    });
  });

  describe('Predefined Feature Flags', () => {
    it('should have all required feature flag constants', () => {
      expect(FEATURE_FLAGS).toHaveProperty('NEW_UI');
      expect(FEATURE_FLAGS).toHaveProperty('CHAT_FEATURE');
      expect(FEATURE_FLAGS).toHaveProperty('EVENT_REGISTRATION');
      expect(FEATURE_FLAGS).toHaveProperty('PAYMENT_INTEGRATION');
      expect(FEATURE_FLAGS).toHaveProperty('SOCIAL_LOGIN');
      expect(FEATURE_FLAGS).toHaveProperty('DARK_MODE');
      expect(FEATURE_FLAGS).toHaveProperty('NOTIFICATIONS');
      expect(FEATURE_FLAGS).toHaveProperty('ADVANCED_SEARCH');
      expect(FEATURE_FLAGS).toHaveProperty('ALUMNI_DIRECTORY');
      expect(FEATURE_FLAGS).toHaveProperty('MENTORSHIP_PROGRAM');
      expect(FEATURE_FLAGS).toHaveProperty('EVENT_ANALYTICS');
      expect(FEATURE_FLAGS).toHaveProperty('EVENT_TEMPLATES');
      expect(FEATURE_FLAGS).toHaveProperty('RECURRING_EVENTS');
      expect(FEATURE_FLAGS).toHaveProperty('EVENT_MEDIA');
      expect(FEATURE_FLAGS).toHaveProperty('EVENT_COMMENTS');
    });

    it('should have descriptions for all feature flags', () => {
      Object.values(FEATURE_FLAGS).forEach(flagName => {
        expect(FEATURE_FLAG_DESCRIPTIONS).toHaveProperty(flagName);
        expect(typeof FEATURE_FLAG_DESCRIPTIONS[flagName]).toBe('string');
        expect(FEATURE_FLAG_DESCRIPTIONS[flagName].length).toBeGreaterThan(0);
      });
    });
  });
});
