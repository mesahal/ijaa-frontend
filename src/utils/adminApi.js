// Admin API utility functions with error handling
import { roleErrorMessages } from './roleConstants';

const API_BASE = process.env.REACT_APP_API_ADMIN_URL || "http://localhost:8000/ijaa/api/v1/admin";

export const adminApiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem("admin_user") 
    ? JSON.parse(localStorage.getItem("admin_user")).token 
    : null;

  if (!token) {
    throw new Error("No admin token found");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();

  if (!response.ok) {
    // Handle specific error codes
    switch (response.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("admin_user");
        window.location.href = "/admin/login";
        throw new Error("Session expired. Please login again.");
      case 403:
        throw new Error(roleErrorMessages.insufficientPrivileges);
      case 404:
        throw new Error("Resource not found.");
      case 409:
        throw new Error(data.message || "Conflict occurred.");
      default:
        throw new Error(data.message || "An error occurred.");
    }
  }

  return data;
};

// Helper functions for common admin operations
export const adminApi = {
  // Dashboard
  getDashboardStats: () => adminApiCall('/dashboard'),
  
  // Users
  getUsers: () => adminApiCall('/users'),
  blockUser: (userId) => adminApiCall(`/users/${userId}/block`, { method: 'POST' }),
  unblockUser: (userId) => adminApiCall(`/users/${userId}/unblock`, { method: 'POST' }),
  deleteUser: (userId) => adminApiCall(`/users/${userId}`, { method: 'DELETE' }),
  
  // Events
  getEvents: () => adminApiCall('/events'),
  createEvent: (eventData) => adminApiCall('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),
  updateEvent: (eventId, eventData) => adminApiCall(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  }),
  deleteEvent: (eventId) => adminApiCall(`/events/${eventId}`, { method: 'DELETE' }),
  
  // Announcements
  getAnnouncements: () => adminApiCall('/announcements'),
  createAnnouncement: (announcementData) => adminApiCall('/announcements', {
    method: 'POST',
    body: JSON.stringify(announcementData)
  }),
  updateAnnouncement: (announcementId, announcementData) => adminApiCall(`/announcements/${announcementId}`, {
    method: 'PUT',
    body: JSON.stringify(announcementData)
  }),
  deleteAnnouncement: (announcementId) => adminApiCall(`/announcements/${announcementId}`, { method: 'DELETE' }),
  
  // Reports
  getReports: () => adminApiCall('/reports'),
  resolveReport: (reportId) => adminApiCall(`/reports/${reportId}/resolve`, { method: 'POST' }),
  
  // ===== FEATURE FLAGS (GROUP 1 & 2) =====
  
  // ===== GROUP 1: BASIC FEATURE FLAG MANAGEMENT =====
  
  // 1.1 Get all feature flags
  getFeatureFlags: () => adminApiCall('/feature-flags'),
  
  // 1.2 Get specific feature flag
  getFeatureFlag: (featureName) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`),
  
  // 1.2.1 Check if feature flag is enabled
  checkFeatureFlagEnabled: (featureName) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}/enabled`),
  
  // 1.3 Create feature flag
  createFeatureFlag: (featureFlagData) => adminApiCall('/feature-flags', {
    method: 'POST',
    body: JSON.stringify(featureFlagData)
  }),
  
  // 1.4 Update feature flag
  updateFeatureFlag: (featureName, featureFlagData) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`, {
    method: 'PUT',
    body: JSON.stringify(featureFlagData)
  }),
  
  // 1.5 Delete feature flag
  deleteFeatureFlag: (featureName) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`, { method: 'DELETE' }),
  
  // ===== GROUP 2: FEATURE FLAG STATUS MANAGEMENT =====
  
  // 2.1 Get enabled feature flags
  getEnabledFeatureFlags: () => adminApiCall('/feature-flags/enabled'),
  
  // 2.2 Get disabled feature flags
  getDisabledFeatureFlags: () => adminApiCall('/feature-flags/disabled'),
  
  // 2.3 Refresh feature flag cache
  refreshFeatureFlagCache: () => adminApiCall('/feature-flags/refresh-cache', { method: 'POST' }),
  
  // ===== GROUP 2 ADDITIONAL UTILITY METHODS =====
  
  // 2.3 Get feature flags by status (Utility method)
  getFeatureFlagsByStatus: (enabled) => adminApiCall(`/feature-flags/${enabled ? 'enabled' : 'disabled'}`),
  
  // 2.4 Get feature flags summary (Utility method)
  getFeatureFlagsSummary: async () => {
    try {
      const [enabledResponse, disabledResponse] = await Promise.all([
        adminApiCall('/feature-flags/enabled'),
        adminApiCall('/feature-flags/disabled')
      ]);

      return {
        enabled: enabledResponse.data || [],
        disabled: disabledResponse.data || [],
        total: (enabledResponse.data || []).length + (disabledResponse.data || []).length,
        enabledCount: (enabledResponse.data || []).length,
        disabledCount: (disabledResponse.data || []).length
      };
    } catch (error) {
      console.error('Error getting feature flags summary:', error);
      throw error;
    }
  },
  
  // Legacy method for backward compatibility
  toggleFeatureFlag: (featureName, enabled) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`, {
    method: 'PUT',
    body: JSON.stringify({ enabled })
  }),
  
  // ===== ADMIN PROFILE & PASSWORD MANAGEMENT =====
  
  // Get current admin profile
  getAdminProfile: () => adminApiCall('/profile'),
  
  // Change admin password
  changeAdminPassword: (passwordData) => adminApiCall('/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  }),
  
  // ===== ADMIN MANAGEMENT =====
  
  // Get all admins
  getAllAdmins: () => adminApiCall('/admins'),
  
  // Create new admin
  createAdmin: (adminData) => adminApiCall('/signup', {
    method: 'POST',
    body: JSON.stringify(adminData)
  }),
  
  // Activate admin
  activateAdmin: (adminId) => adminApiCall(`/admins/${adminId}/activate`, { method: 'POST' }),
  
  // Deactivate admin
  deactivateAdmin: (adminId) => adminApiCall(`/admins/${adminId}/deactivate`, { method: 'POST' }),
}; 