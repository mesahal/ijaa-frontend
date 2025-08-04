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
  
  // Feature Flags
  getFeatureFlags: () => adminApiCall('/feature-flags'),
  updateFeatureFlag: (featureName, enabled) => adminApiCall(`/feature-flags/${featureName}?enabled=${enabled}`, {
    method: 'PUT'
  }),
  
  // Admin Profile
  getAdminProfile: () => adminApiCall('/profile'),
}; 