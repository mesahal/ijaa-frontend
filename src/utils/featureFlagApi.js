import apiClient from './apiClient';
import { adminApi } from './adminApi';
import axios from 'axios';

// Feature Flag API utilities - Updated to match backend hierarchical structure
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

  // 2.3 Refresh Feature Flag Cache
  refreshFeatureFlagCache: async () => {
    try {
      return await adminApi.refreshFeatureFlagCache();
    } catch (error) {
      console.error('Error refreshing feature flag cache:', error);
      throw error;
    }
  },

  // ===== GROUP 3: FEATURE FLAG STATUS CHECKING (USER) =====

  // 3.1 Check Feature Flag Status (Primary method) - Updated to use new endpoint
  checkFeatureFlag: async (featureName) => {
    try {
      // Use the admin endpoint with user token for feature flag status
      const encodedFeatureName = encodeURIComponent(featureName);
      
      // Get user token from localStorage
      const userData = localStorage.getItem('alumni_user');
      if (!userData) {
        throw new Error('No user data found');
      }
      
      const user = JSON.parse(userData);
      if (!user.token) {
        throw new Error('No user token found');
      }
      
      // Make direct request to admin endpoint with user token
      const response = await axios.get(
        `http://localhost:8000/ijaa/api/v1/admin/feature-flags/${encodedFeatureName}/enabled`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'accept': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error checking feature flag:', error);
      throw error;
    }
  },

  // 3.2 Check Multiple Feature Flags
  checkMultipleFeatureFlags: async (featureNames) => {
    try {
      const promises = featureNames.map(name => 
        featureFlagApi.checkFeatureFlag(name).catch(err => {
          console.warn(`Failed to check feature flag ${name}:`, err);
          return { name, enabled: false };
        })
      );
      
      const results = await Promise.all(promises);
      const status = {};
      
      results.forEach(result => {
        if (result && result.data) {
          status[result.data.name] = result.data.enabled;
        }
      });
      
      return status;
    } catch (error) {
      console.error('Error checking multiple feature flags:', error);
      throw error;
    }
  },

  // 3.3 Check feature flag with caching (Performance optimization)
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

  // 3.4 Clear feature flag cache
  clearFeatureFlagCache: () => {
    // Clear the cache map
    const cache = featureFlagApi.checkFeatureFlagCached.cache;
    if (cache) {
      cache.clear();
    }
    console.log('Feature flag cache cleared');
  },

  // 3.5 Check feature flag with fallback value
  checkFeatureFlagWithFallback: async (featureName, fallbackValue = false) => {
    try {
      const response = await featureFlagApi.checkFeatureFlag(featureName);
      return response.data?.enabled ?? fallbackValue;
    } catch (error) {
      console.error(`Error checking feature flag ${featureName}, using fallback:`, error);
      return fallbackValue;
    }
  },

  // ===== GROUP 4: HIERARCHICAL FEATURE FLAG UTILITIES =====

  // 4.1 Check if parent feature is enabled
  isParentFeatureEnabled: async (featureName) => {
    try {
      // Extract parent feature name (e.g., 'events.creation' -> 'events')
      const parentName = featureName.split('.')[0];
      if (parentName === featureName) {
        return true; // No parent
      }
      
      const response = await featureFlagApi.checkFeatureFlag(parentName);
      return response.data?.enabled || false;
    } catch (error) {
      console.error(`Error checking parent feature flag for ${featureName}:`, error);
      return false;
    }
  },

  // 4.2 Check feature flag with hierarchical validation
  checkFeatureFlagHierarchical: async (featureName) => {
    try {
      // First check if parent is enabled
      const parentEnabled = await featureFlagApi.isParentFeatureEnabled(featureName);
      if (!parentEnabled) {
        return { data: { name: featureName, enabled: false, reason: 'Parent feature disabled' } };
      }
      
      // Then check the feature itself
      const response = await featureFlagApi.checkFeatureFlag(featureName);
      return response;
    } catch (error) {
      console.error(`Error checking hierarchical feature flag ${featureName}:`, error);
      throw error;
    }
  },

  // 4.3 Get all available feature flag names
  getAvailableFeatureFlags: async () => {
    try {
      const response = await featureFlagApi.getAllFeatureFlags();
      return featureFlagApi.extractFlagNames(response.data || []);
    } catch (error) {
      console.error('Error getting available feature flags:', error);
      return [];
    }
  },

  // 4.4 Extract flag names from hierarchical structure
  extractFlagNames: (flags) => {
    const names = [];
    
    const extractNames = (flagList) => {
      flagList.forEach(flag => {
        names.push(flag.name);
        if (flag.children && flag.children.length > 0) {
          extractNames(flag.children);
        }
      });
    };
    
    extractNames(flags);
    return names;
  },

  // 4.5 Validate if a feature flag exists
  validateFeatureFlag: async (name) => {
    try {
      await featureFlagApi.checkFeatureFlag(name);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Predefined feature flag names (Updated to match exact database structure)
export const FEATURE_FLAGS = {
  // Admin Features
  ADMIN_FEATURES: 'admin.features',
  ADMIN_USER_MANAGEMENT: 'admin.user-management',
  ADMIN_ANNOUNCEMENTS: 'admin.announcements',
  ADMIN_REPORTS: 'admin.reports',
  ADMIN_AUTH: 'admin.auth',
  
  // Alumni Search
  ALUMNI_SEARCH: 'alumni.search',
  
  // Announcements
  ANNOUNCEMENTS: 'announcements',
  
  // Events System
  EVENTS: 'events',
  EVENTS_CREATION: 'events.creation',
  EVENTS_UPDATE: 'events.update',
  EVENTS_DELETE: 'events.delete',
  EVENTS_PARTICIPATION: 'events.participation',
  EVENTS_INVITATIONS: 'events.invitations',
  EVENTS_COMMENTS: 'events.comments',
  EVENTS_MEDIA: 'events.media',
  EVENTS_TEMPLATES: 'events.templates',
  EVENTS_RECURRING: 'events.recurring',
  EVENTS_ANALYTICS: 'events.analytics',
  EVENTS_REMINDERS: 'events.reminders',
  CALENDAR_INTEGRATION: 'calendar.integration',
  
  // File Management
  FILE: 'file',
  FILE_DOWNLOAD: 'file-download',
  FILE_DELETE: 'file-delete',
  FILE_UPLOAD: 'file-upload',
  FILE_UPLOAD_COVER_PHOTO: 'file-upload.cover-photo',
  FILE_UPLOAD_PROFILE_PHOTO: 'file-upload.profile-photo',
  
  // Reports
  REPORTS: 'reports',
  
  // User Profile Features
  USER_PROFILE: 'user.profile',
  USER_REGISTRATION: 'user.registration',
  USER_LOGIN: 'user.login',
  USER_EXPERIENCES: 'user.experiences',
  USER_INTERESTS: 'user.interests',
  USER_PASSWORD_CHANGE: 'user.password-change',
  
  // Legacy flags for backward compatibility
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

// Feature flag descriptions (Updated to match exact database structure)
export const FEATURE_FLAG_DESCRIPTIONS = {
  // Admin Features
  [FEATURE_FLAGS.ADMIN_FEATURES]: 'Enable admin functionality',
  [FEATURE_FLAGS.ADMIN_USER_MANAGEMENT]: 'Enable admin user management features',
  [FEATURE_FLAGS.ADMIN_ANNOUNCEMENTS]: 'Enable admin announcement management',
  [FEATURE_FLAGS.ADMIN_REPORTS]: 'Enable admin report management',
  [FEATURE_FLAGS.ADMIN_AUTH]: 'Enable admin authentication features',
  
  // Alumni Search
  [FEATURE_FLAGS.ALUMNI_SEARCH]: 'Enable alumni search functionality',
  
  // Announcements
  [FEATURE_FLAGS.ANNOUNCEMENTS]: 'Enable system-wide announcements',
  
  // Events System
  [FEATURE_FLAGS.EVENTS]: 'Enable event management functionality',
  [FEATURE_FLAGS.EVENTS_CREATION]: 'Enable event creation functionality',
  [FEATURE_FLAGS.EVENTS_UPDATE]: 'Enable event update functionality',
  [FEATURE_FLAGS.EVENTS_DELETE]: 'Enable event deletion functionality',
  [FEATURE_FLAGS.EVENTS_PARTICIPATION]: 'Enable event participation and RSVP functionality',
  [FEATURE_FLAGS.EVENTS_INVITATIONS]: 'Enable event invitation functionality',
  [FEATURE_FLAGS.EVENTS_COMMENTS]: 'Enable event commenting system',
  [FEATURE_FLAGS.EVENTS_MEDIA]: 'Enable media attachments for events',
  [FEATURE_FLAGS.EVENTS_TEMPLATES]: 'Enable reusable event templates',
  [FEATURE_FLAGS.EVENTS_RECURRING]: 'Enable recurring event patterns',
  [FEATURE_FLAGS.EVENTS_ANALYTICS]: 'Enable event analytics and reporting',
  [FEATURE_FLAGS.EVENTS_REMINDERS]: 'Enable event reminder notifications',
  [FEATURE_FLAGS.CALENDAR_INTEGRATION]: 'Enable external calendar synchronization',
  
  // File Management
  [FEATURE_FLAGS.FILE]: 'Enable file management functionality',
  [FEATURE_FLAGS.FILE_DOWNLOAD]: 'Enable file download functionality',
  [FEATURE_FLAGS.FILE_DELETE]: 'Enable file deletion functionality',
  [FEATURE_FLAGS.FILE_UPLOAD]: 'Enable file upload functionality',
  [FEATURE_FLAGS.FILE_UPLOAD_COVER_PHOTO]: 'Enable cover photo upload',
  [FEATURE_FLAGS.FILE_UPLOAD_PROFILE_PHOTO]: 'Enable profile photo upload',
  
  // Reports
  [FEATURE_FLAGS.REPORTS]: 'Enable user reporting system',
  
  // User Profile Features
  [FEATURE_FLAGS.USER_PROFILE]: 'Enable user profile management features',
  [FEATURE_FLAGS.USER_REGISTRATION]: 'Enable user registration functionality',
  [FEATURE_FLAGS.USER_LOGIN]: 'Enable user login functionality',
  [FEATURE_FLAGS.USER_EXPERIENCES]: 'Enable user experience management features',
  [FEATURE_FLAGS.USER_INTERESTS]: 'Enable user interest management features',
  [FEATURE_FLAGS.USER_PASSWORD_CHANGE]: 'Enable user password change functionality',
  
  // Legacy descriptions for backward compatibility
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
