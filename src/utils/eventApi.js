import apiClient from './apiClient';

// Event API utilities for all event-related operations
export const eventApi = {
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

  // Update RSVP status
  updateRsvpStatus: async (eventId, status, message = '') => {
    try {
      const response = await apiClient.put(`/events/participation/${eventId}/rsvp`, {
        status,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error updating RSVP status:', error);
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
      const response = await apiClient.get(`/events/participation/${eventId}/participants`);
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

  // Get invitations sent by user
  getSentInvitations: async () => {
    try {
      const response = await apiClient.get('/events/invitations/sent');
      return response.data;
    } catch (error) {
      console.error('Error getting sent invitations:', error);
      throw error;
    }
  },

  // ===== EVENT SEARCH APIs =====

  // Search events with GET parameters
  searchEventsGet: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add search parameters
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

  // Search events with POST body
  searchEventsPost: async (searchCriteria = {}) => {
    try {
      const response = await apiClient.post('/events/search', searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Error searching events (POST):', error);
      throw error;
    }
  },

  // ===== ENHANCED EVENT MANAGEMENT APIs =====

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

  // Update event with privacy settings
  updateEvent: async (eventId, eventData) => {
    try {
      const response = await apiClient.put(`/events/my-events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event
  deleteEvent: async (eventId) => {
    try {
      const response = await apiClient.delete(`/events/my-events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Get all events
  getAllEvents: async () => {
    try {
      const response = await apiClient.get('/events/all-events');
      return response.data;
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error;
    }
  },

  // Get my events
  getMyEvents: async () => {
    try {
      const response = await apiClient.get('/events/my-events');
      return response.data;
    } catch (error) {
      console.error('Error getting my events:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (eventId) => {
    try {
      const response = await apiClient.get(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw error;
    }
  }
};

// Constants for event participation status
export const PARTICIPATION_STATUS = {
  GOING: 'GOING',
  MAYBE: 'MAYBE',
  NOT_GOING: 'NOT_GOING',
  PENDING: 'PENDING'
};

// Constants for event privacy levels
export const EVENT_PRIVACY = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  INVITE_ONLY: 'INVITE_ONLY'
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
      return event.createdByUsername === user.username;
    case EVENT_PRIVACY.INVITE_ONLY:
      // This would need to check if user has been invited
      // For now, return true as the backend will handle this
      return true;
    default:
      return true;
  }
};

export default eventApi; 