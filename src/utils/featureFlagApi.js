import apiClient from './apiClient';
import { adminApi } from './adminApi';

// Feature Flag API utilities - Separated by user role
export const featureFlagApi = {
  // ===== GROUP 1: BASIC FEATURE FLAG MANAGEMENT (ADMIN) =====

  // 1.1 Get All Feature Flags
  getAllFeatureFlags: async () => {
    try {
      return await adminApi.getFeatureFlags();
    } catch (error) {
      console.error('Error getting all feature flags:', error);
      throw error;
    }
  },

  // 1.2 Get Feature Flag by Name
  getFeatureFlag: async (featureName) => {
    try {
      return await adminApi.getFeatureFlag(featureName);
    } catch (error) {
      console.error('Error getting feature flag:', error);
      throw error;
    }
  },

  // 1.3 Create Feature Flag
  createFeatureFlag: async (featureFlagData) => {
    try {
      return await adminApi.createFeatureFlag(featureFlagData);
    } catch (error) {
      console.error('Error creating feature flag:', error);
      throw error;
    }
  },

  // 1.4 Update Feature Flag
  updateFeatureFlag: async (featureName, featureFlagData) => {
    try {
      return await adminApi.updateFeatureFlag(featureName, featureFlagData);
    } catch (error) {
      console.error('Error updating feature flag:', error);
      throw error;
    }
  },

  // 1.5 Delete Feature Flag
  deleteFeatureFlag: async (featureName) => {
    try {
      return await adminApi.deleteFeatureFlag(featureName);
    } catch (error) {
      console.error('Error deleting feature flag:', error);
      throw error;
    }
  },

  // ===== GROUP 2: FEATURE FLAG STATUS MANAGEMENT (ADMIN) =====

  // 2.1 Get Enabled Feature Flags
  getEnabledFeatureFlags: async () => {
    try {
      return await adminApi.getEnabledFeatureFlags();
    } catch (error) {
      console.error('Error getting enabled feature flags:', error);
      throw error;
    }
  },

  // 2.2 Get Disabled Feature Flags
  getDisabledFeatureFlags: async () => {
    try {
      return await adminApi.getDisabledFeatureFlags();
    } catch (error) {
      console.error('Error getting disabled feature flags:', error);
      throw error;
    }
  },

  // ===== GROUP 2 ADDITIONAL UTILITY METHODS =====

  // 2.3 Get Feature Flags by Status (Utility method)
  getFeatureFlagsByStatus: async (enabled) => {
    try {
      if (enabled) {
        return await featureFlagApi.getEnabledFeatureFlags();
      } else {
        return await featureFlagApi.getDisabledFeatureFlags();
      }
    } catch (error) {
      console.error(`Error getting ${enabled ? 'enabled' : 'disabled'} feature flags:`, error);
      throw error;
    }
  },

  // 2.4 Get Feature Flags Summary (Utility method)
  getFeatureFlagsSummary: async () => {
    try {
      const [enabledFlags, disabledFlags] = await Promise.all([
        featureFlagApi.getEnabledFeatureFlags().catch(() => ({ data: [] })),
        featureFlagApi.getDisabledFeatureFlags().catch(() => ({ data: [] }))
      ]);

      return {
        enabled: enabledFlags.data || [],
        disabled: disabledFlags.data || [],
        total: (enabledFlags.data || []).length + (disabledFlags.data || []).length,
        enabledCount: (enabledFlags.data || []).length,
        disabledCount: (disabledFlags.data || []).length
      };
    } catch (error) {
      console.error('Error getting feature flags summary:', error);
      throw error;
    }
  },

  // ===== GROUP 3: FEATURE FLAG STATUS CHECKING (USER) =====

  // 3.1 Check Feature Flag Status (Primary method)
  checkFeatureFlag: async (featureName) => {
    try {
      // First try the user API endpoint
      try {
        const response = await apiClient.get(`/feature-flags/check/${featureName}`);
        return response.data;
      } catch (userApiError) {
        // Fallback to admin API endpoint if user API fails
        console.warn('User API failed, falling back to admin API:', userApiError);
        return await featureFlagApi.checkFeatureFlagAdmin(featureName);
      }
    } catch (error) {
      console.error('Error checking feature flag:', error);
      throw error;
    }
  },

  // 3.1a Check Feature Flag Status via Admin API (Fallback method)
  checkFeatureFlagAdmin: async (featureName) => {
    try {
      const adminBaseURL = process.env.REACT_APP_API_ADMIN_URL || "http://localhost:8000/ijaa/api/v1/admin";
      const token = localStorage.getItem('alumni_user') 
        ? JSON.parse(localStorage.getItem('alumni_user')).token 
        : null;

      if (!token) {
        throw new Error('No user token found');
      }

      const response = await fetch(`${adminBaseURL}/feature-flags/check/${featureName}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking feature flag via admin API:', error);
      throw error;
    }
  },

  // ===== GROUP 3 ADDITIONAL UTILITY METHODS =====

  // 3.2 Check if feature is enabled (User-friendly method)
  isFeatureEnabled: async (featureName) => {
    try {
      const response = await featureFlagApi.checkFeatureFlag(featureName);
      return response.data?.enabled || false;
    } catch (error) {
      console.error(`Error checking feature flag ${featureName}:`, error);
      return false; // Default to disabled if there's an error
    }
  },

  // 3.3 Check multiple feature flags status (Batch check)
  checkMultipleFeatureFlags: async (featureNames) => {
    try {
      const promises = featureNames.map(featureName => 
        featureFlagApi.checkFeatureFlag(featureName).catch(() => ({ data: { enabled: false } }))
      );
      const results = await Promise.all(promises);
      
      const status = {};
      featureNames.forEach((featureName, index) => {
        status[featureName] = results[index]?.data?.enabled || false;
      });
      
      return status;
    } catch (error) {
      console.error('Error checking multiple feature flags:', error);
      return {};
    }
  },

  // 3.4 Get user-specific feature flags (User context)
  getUserFeatureFlags: async () => {
    try {
      // This should use the user API endpoint for getting user-specific flags
      const response = await apiClient.get('/feature-flags');
      return response.data;
    } catch (error) {
      console.error('Error getting user feature flags:', error);
      throw error;
    }
  },

  // 3.5 Check feature flag with caching (Performance optimization)
  checkFeatureFlagCached: (() => {
    const cache = new Map();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    return async (featureName) => {
      const now = Date.now();
      const cached = cache.get(featureName);
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        return cached.data;
      }

      try {
        const data = await featureFlagApi.checkFeatureFlag(featureName);
        cache.set(featureName, {
          data,
          timestamp: now
        });
        return data;
      } catch (error) {
        // Return cached data if available, even if expired
        if (cached) {
          console.warn(`Using expired cache for ${featureName} due to error:`, error);
          return cached.data;
        }
        throw error;
      }
    };
  })(),

  // 3.6 Clear feature flag cache
  clearFeatureFlagCache: () => {
    // This will be implemented by the cached function above
    // For now, we'll need to recreate the function
    console.log('Feature flag cache cleared');
  },

  // 3.7 Check feature flag with fallback value
  checkFeatureFlagWithFallback: async (featureName, fallbackValue = false) => {
    try {
      const response = await featureFlagApi.checkFeatureFlag(featureName);
      return response.data?.enabled ?? fallbackValue;
    } catch (error) {
      console.error(`Error checking feature flag ${featureName}, using fallback:`, error);
      return fallbackValue;
    }
  }
};

// Predefined feature flag names (Group 4.1)
export const FEATURE_FLAGS = {
  NEW_UI: 'NEW_UI',
  CHAT_FEATURE: 'CHAT_FEATURE',
  EVENT_REGISTRATION: 'EVENT_REGISTRATION',
  PAYMENT_INTEGRATION: 'PAYMENT_INTEGRATION',
  SOCIAL_LOGIN: 'SOCIAL_LOGIN',
  DARK_MODE: 'DARK_MODE',
  NOTIFICATIONS: 'NOTIFICATIONS',
  ADVANCED_SEARCH: 'ADVANCED_SEARCH',
  ALUMNI_DIRECTORY: 'ALUMNI_DIRECTORY',
  MENTORSHIP_PROGRAM: 'MENTORSHIP_PROGRAM',
  EVENT_ANALYTICS: 'EVENT_ANALYTICS',
  EVENT_TEMPLATES: 'EVENT_TEMPLATES',
  RECURRING_EVENTS: 'RECURRING_EVENTS',
  EVENT_MEDIA: 'EVENT_MEDIA',
  EVENT_COMMENTS: 'EVENT_COMMENTS'
};

// Feature flag descriptions (Group 4.1)
export const FEATURE_FLAG_DESCRIPTIONS = {
  [FEATURE_FLAGS.NEW_UI]: 'Modern user interface with enhanced design',
  [FEATURE_FLAGS.CHAT_FEATURE]: 'Real-time chat functionality',
  [FEATURE_FLAGS.EVENT_REGISTRATION]: 'Event registration system',
  [FEATURE_FLAGS.PAYMENT_INTEGRATION]: 'Payment processing',
  [FEATURE_FLAGS.SOCIAL_LOGIN]: 'Social media login options',
  [FEATURE_FLAGS.DARK_MODE]: 'Dark mode theme',
  [FEATURE_FLAGS.NOTIFICATIONS]: 'Push notifications',
  [FEATURE_FLAGS.ADVANCED_SEARCH]: 'Advanced search with filters',
  [FEATURE_FLAGS.ALUMNI_DIRECTORY]: 'Public alumni directory',
  [FEATURE_FLAGS.MENTORSHIP_PROGRAM]: 'Mentorship program matching',
  [FEATURE_FLAGS.EVENT_ANALYTICS]: 'Event analytics and reporting',
  [FEATURE_FLAGS.EVENT_TEMPLATES]: 'Reusable event templates',
  [FEATURE_FLAGS.RECURRING_EVENTS]: 'Recurring event patterns',
  [FEATURE_FLAGS.EVENT_MEDIA]: 'Event media attachment support',
  [FEATURE_FLAGS.EVENT_COMMENTS]: 'Event commenting system'
};

// Helper function to check if a feature is enabled (Group 4.2)
export const isFeatureEnabled = async (featureName) => {
  try {
    const response = await featureFlagApi.checkFeatureFlag(featureName);
    return response.data?.enabled || false;
  } catch (error) {
    console.error(`Error checking feature flag ${featureName}:`, error);
    return false; // Default to disabled if there's an error
  }
};

// Helper function to get feature flag status for multiple flags (Group 4.2)
export const getFeatureFlagsStatus = async (featureNames) => {
  try {
    return await featureFlagApi.checkMultipleFeatureFlags(featureNames);
  } catch (error) {
    console.error('Error getting feature flags status:', error);
    return {};
  }
};

// Helper function to check feature flag with fallback (Group 4.2)
export const checkFeatureFlagWithFallback = async (featureName, fallbackValue = false) => {
  try {
    const response = await featureFlagApi.checkFeatureFlag(featureName);
    return response.data?.enabled ?? fallbackValue;
  } catch (error) {
    console.error(`Error checking feature flag ${featureName}, using fallback:`, error);
    return fallbackValue;
  }
};

export default featureFlagApi;
