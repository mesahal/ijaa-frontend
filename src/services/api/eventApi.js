import apiClient from './apiClient';

// Event API utilities for all event-related operations
export const eventApi = {
  // ===== EVENT CREATION & MANAGEMENT APIs =====
  
  // Create event with privacy settings
  createEvent: async (eventData) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post('/create', eventData, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all events with pagination
  getAllEvents: async (page = 0, size = 10, sort = 'eventDate,desc') => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get(`/all-events?page=${page}&size=${size}&sort=${sort}`, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get event by ID with full details
  getEventById: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get(`/all-events/${eventId}`, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.put(`/my-events/${eventId}`, eventData, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.delete(`/my-events/${eventId}`, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EVENT SEARCH APIs =====

  // Search events with POST body (Group 3.2)
  searchEventsGet: async (params = {}) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post('/search', params, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Advanced event search with POST body (Group 3.2)
  searchEventsPost: async (searchCriteria = {}) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post('/search', searchCriteria, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unified search method that can handle both GET and POST
  searchEvents: async (searchCriteria = {}, method = 'POST') => {
    try {
      if (method === 'GET') {
        return await eventApi.searchEventsGet(searchCriteria);
      } else {
        return await eventApi.searchEventsPost(searchCriteria);
      }
    } catch (error) {
      throw error;
    }
  },

  // ===== EVENT PARTICIPATION (RSVP) APIs =====
  
  // RSVP to an event
  rsvpToEvent: async (eventId, status, message = '') => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post('/events/participation/rsvp', {
        eventId,
        status,
        message
      }, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel RSVP
  cancelRsvp: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.delete(`/events/participation/${eventId}/rsvp`, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's participation for a specific event
  getMyParticipation: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get(`/events/participation/${eventId}/my-participation`, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all participants for an event
  getEventParticipants: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get(`/events/participation/${eventId}/participants`, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all user's participations
  getMyParticipations: async () => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get('/events/participation/my-participations', {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EVENT INVITATION APIs =====

  // Send invitations to users
  sendInvitations: async (eventId, usernames, personalMessage = '') => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post('/events/invitations/send', {
        eventId,
        usernames,
        personalMessage
      }, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Accept invitation
  acceptInvitation: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post(`/events/invitations/${eventId}/accept`, {}, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Decline invitation
  declineInvitation: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post(`/events/invitations/${eventId}/decline`, {}, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's invitations
  getMyInvitations: async () => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get('/events/invitations/my-invitations', {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get unread invitations
  getUnreadInvitations: async () => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get('/events/invitations/my-invitations/unread', {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get unresponded invitations
  getUnrespondedInvitations: async () => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get('/events/invitations/my-invitations/unresponded', {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark invitation as read
  markInvitationAsRead: async (eventId) => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.post(`/events/invitations/${eventId}/mark-read`, {}, {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get invitation counts
  getInvitationCounts: async () => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get('/events/invitations/counts', {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EVENT TEMPLATES APIs =====

  // Get all templates
  getAllTemplates: async () => {
    try {
      const response = await apiClient.get('/event-templates');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get public templates
  getPublicTemplates: async () => {
    try {
      const response = await apiClient.get('/event-templates/public');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get template by ID
  getTemplateById: async (templateId) => {
    try {
      const response = await apiClient.get(`/event-templates/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create event from template
  createEventFromTemplate: async (templateId, eventData = {}) => {
    try {
      const response = await apiClient.post(`/event-templates/${templateId}/create-event`, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search templates
  searchTemplates: async (searchParams = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchParams.name) queryParams.append('name', searchParams.name);
      if (searchParams.eventType) queryParams.append('eventType', searchParams.eventType);
      if (searchParams.category) queryParams.append('category', searchParams.category);
      if (searchParams.isPublic !== undefined) queryParams.append('isPublic', searchParams.isPublic);

      const response = await apiClient.get(`/event-templates/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new template
  createTemplate: async (templateData) => {
    try {
      const response = await apiClient.post('/event-templates', templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update template
  updateTemplate: async (templateId, templateData) => {
    try {
      const response = await apiClient.put(`/event-templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete template
  deleteTemplate: async (templateId) => {
    try {
      const response = await apiClient.delete(`/event-templates/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EVENT COMMENTS APIs =====

  // Add event comment
  addEventComment: async (eventId, content) => {
    try {
      const response = await apiClient.post('/events/comments/', {
        eventId,
        content
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get event comments
  getEventComments: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/comments/event/${eventId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== EVENT MEDIA APIs =====

  // Upload event media
  uploadEventMedia: async (eventId, file, caption = '', type = 'IMAGE') => {
    try {
      const formData = new FormData();
      formData.append('eventId', eventId);
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('type', type);

      const response = await apiClient.post('/events/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get event media
  getEventMedia: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/media`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ===== LEGACY COMPATIBILITY APIs =====
  
  // Legacy methods for backward compatibility
  getMyEvents: async () => {
    try {
      const eventApiBase = process.env.REACT_APP_API_EVENT_URL || 'http://localhost:8000/ijaa/api/v1/events';
      const response = await apiClient.get('/my-events', {
        baseURL: eventApiBase
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Constants for event participation status
export const PARTICIPATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DECLINED: 'DECLINED',
  MAYBE: 'MAYBE',
  CANCELLED: 'CANCELLED',
  // Legacy compatibility
  GOING: 'CONFIRMED',
  NOT_GOING: 'DECLINED'
};

// Constants for event privacy levels
export const EVENT_PRIVACY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  ALUMNI_ONLY: 'ALUMNI_ONLY'
};

// Constants for event categories (Phase 1 API)
export const EVENT_CATEGORIES = {
  SOCIAL: 'SOCIAL',
  EDUCATIONAL: 'EDUCATIONAL',
  NETWORKING: 'NETWORKING',
  PROFESSIONAL: 'PROFESSIONAL'
};

// Constants for event types (legacy compatibility)
export const EVENT_TYPES = {
  NETWORKING: 'NETWORKING',
  WORKSHOP: 'WORKSHOP',
  CONFERENCE: 'CONFERENCE',
  SOCIAL: 'SOCIAL',
  CAREER: 'CAREER',
  MENTORSHIP: 'MENTORSHIP'
};

// Event status constants
export const EVENT_STATUS = {
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

// Helper function to format date for API
export const formatDateForAPI = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

// Helper function to check if user can join event based on privacy
export const canUserJoinEvent = (event, user) => {
  if (!event || !user) return false;
  
  switch (event.privacy) {
    case EVENT_PRIVACY.PUBLIC:
      return true;
    case EVENT_PRIVACY.PRIVATE:
      return event.createdBy === user.id;
    case EVENT_PRIVACY.ALUMNI_ONLY:
      // This would need to check if user is verified alumni
      return true;
    default:
      return true;
  }
};

export default eventApi; 