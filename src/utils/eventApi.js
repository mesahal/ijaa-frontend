import apiClient from './apiClient';

// Event API utilities for all event-related operations
export const eventApi = {
  // ===== EVENT CREATION & MANAGEMENT APIs =====
  
  // Create event with privacy settings
  createEvent: async (eventData) => {
    try {
      const response = await apiClient.post('/events/create', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Get all events with pagination
  getAllEvents: async (page = 0, size = 10, sort = 'eventDate,desc') => {
    try {
      const response = await apiClient.get(`/events?page=${page}&size=${size}&sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error;
    }
  },

  // Get event by ID with full details
  getEventById: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw error;
    }
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await apiClient.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const response = await apiClient.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // ===== EVENT SEARCH APIs =====

  // Search events with GET parameters (Group 3.1)
  searchEventsGet: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters as specified in Group 3.1
      if (params.location) queryParams.append('location', params.location);
      if (params.eventType) queryParams.append('eventType', params.eventType);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.isOnline !== undefined) queryParams.append('isOnline', params.isOnline);
      if (params.organizerName) queryParams.append('organizerName', params.organizerName);
      if (params.title) queryParams.append('title', params.title);
      if (params.description) queryParams.append('description', params.description);

      const response = await apiClient.get(`/events/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching events (GET):', error);
      throw error;
    }
  },

  // Advanced event search with POST body (Group 3.2)
  searchEventsPost: async (searchCriteria = {}) => {
    try {
      const response = await apiClient.post('/events/search', searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Error searching events (POST):', error);
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
      console.error('Error searching events:', error);
      throw error;
    }
  },

  // ===== EVENT PARTICIPATION (RSVP) APIs =====
  
  // RSVP to an event
  rsvpToEvent: async (eventId, status, message = '') => {
    try {
      const response = await apiClient.post('/events/participation/rsvp', {
        eventId,
        status,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      throw error;
    }
  },

  // Cancel RSVP
  cancelRsvp: async (eventId) => {
    try {
      const response = await apiClient.delete(`/events/participation/${eventId}/rsvp`);
      return response.data;
    } catch (error) {
      console.error('Error canceling RSVP:', error);
      throw error;
    }
  },

  // Get user's participation for a specific event
  getMyParticipation: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/participation/${eventId}/my-participation`);
      return response.data;
    } catch (error) {
      console.error('Error getting my participation:', error);
      throw error;
    }
  },

  // Get all participants for an event
  getEventParticipants: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/participants`);
      return response.data;
    } catch (error) {
      console.error('Error getting event participants:', error);
      throw error;
    }
  },

  // Get all user's participations
  getMyParticipations: async () => {
    try {
      const response = await apiClient.get('/events/participation/my-participations');
      return response.data;
    } catch (error) {
      console.error('Error getting my participations:', error);
      throw error;
    }
  },

  // ===== EVENT INVITATION APIs =====

  // Send invitations to users
  sendInvitations: async (eventId, usernames, personalMessage = '') => {
    try {
      const response = await apiClient.post('/events/invitations/send', {
        eventId,
        usernames,
        personalMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error sending invitations:', error);
      throw error;
    }
  },

  // Accept invitation
  acceptInvitation: async (eventId) => {
    try {
      const response = await apiClient.post(`/events/invitations/${eventId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error;
    }
  },

  // Decline invitation
  declineInvitation: async (eventId) => {
    try {
      const response = await apiClient.post(`/events/invitations/${eventId}/decline`);
      return response.data;
    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error;
    }
  },

  // Get user's invitations
  getMyInvitations: async () => {
    try {
      const response = await apiClient.get('/events/invitations/my-invitations');
      return response.data;
    } catch (error) {
      console.error('Error getting my invitations:', error);
      throw error;
    }
  },

  // Get unread invitations
  getUnreadInvitations: async () => {
    try {
      const response = await apiClient.get('/events/invitations/my-invitations/unread');
      return response.data;
    } catch (error) {
      console.error('Error getting unread invitations:', error);
      throw error;
    }
  },

  // Get unresponded invitations
  getUnrespondedInvitations: async () => {
    try {
      const response = await apiClient.get('/events/invitations/my-invitations/unresponded');
      return response.data;
    } catch (error) {
      console.error('Error getting unresponded invitations:', error);
      throw error;
    }
  },

  // Mark invitation as read
  markInvitationAsRead: async (eventId) => {
    try {
      const response = await apiClient.post(`/events/invitations/${eventId}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking invitation as read:', error);
      throw error;
    }
  },

  // Get invitation counts
  getInvitationCounts: async () => {
    try {
      const response = await apiClient.get('/events/invitations/counts');
      return response.data;
    } catch (error) {
      console.error('Error getting invitation counts:', error);
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
      console.error('Error getting all templates:', error);
      throw error;
    }
  },

  // Get public templates
  getPublicTemplates: async () => {
    try {
      const response = await apiClient.get('/event-templates/public');
      return response.data;
    } catch (error) {
      console.error('Error getting public templates:', error);
      throw error;
    }
  },

  // Get template by ID
  getTemplateById: async (templateId) => {
    try {
      const response = await apiClient.get(`/event-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting template by ID:', error);
      throw error;
    }
  },

  // Create event from template
  createEventFromTemplate: async (templateId, eventData = {}) => {
    try {
      const response = await apiClient.post(`/event-templates/${templateId}/create-event`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event from template:', error);
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
      console.error('Error searching templates:', error);
      throw error;
    }
  },

  // Create new template
  createTemplate: async (templateData) => {
    try {
      const response = await apiClient.post('/event-templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  updateTemplate: async (templateId, templateData) => {
    try {
      const response = await apiClient.put(`/event-templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  deleteTemplate: async (templateId) => {
    try {
      const response = await apiClient.delete(`/event-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  // ===== EVENT COMMENTS APIs =====

  // Add event comment
  addEventComment: async (eventId, content) => {
    try {
      const response = await apiClient.post('/events/comments', {
        eventId,
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error adding event comment:', error);
      throw error;
    }
  },

  // Get event comments
  getEventComments: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error getting event comments:', error);
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
      console.error('Error uploading event media:', error);
      throw error;
    }
  },

  // Get event media
  getEventMedia: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}/media`);
      return response.data;
    } catch (error) {
      console.error('Error getting event media:', error);
      throw error;
    }
  },

  // ===== LEGACY COMPATIBILITY APIs =====
  
  // Legacy methods for backward compatibility
  getMyEvents: async () => {
    try {
      const response = await apiClient.get('/events/my-events');
      return response.data;
    } catch (error) {
      console.error('Error getting my events:', error);
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

// Constants for event types
export const EVENT_TYPES = {
  NETWORKING: 'NETWORKING',
  WORKSHOP: 'WORKSHOP',
  CONFERENCE: 'CONFERENCE',
  SOCIAL: 'SOCIAL',
  CAREER: 'CAREER',
  MENTORSHIP: 'MENTORSHIP'
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