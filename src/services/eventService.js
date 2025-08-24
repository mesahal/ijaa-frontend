import apiClient from '../utils/apiClient';

/**
 * Event Service - Handles all event-related API calls
 * Separates business logic from UI components
 */
class EventService {
  // ===== GROUP 1: BASIC EVENT MANAGEMENT =====

  /**
   * Get user's events
   * @returns {Promise<Object>} User's events data
   */
  async getMyEvents() {
    try {
      const response = await apiClient.get('/events/my-events');
      return response.data;
    } catch (error) {
      console.error('Error getting my events:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user's active events
   * @returns {Promise<Object>} User's active events data
   */
  async getMyActiveEvents() {
    try {
      const response = await apiClient.get('/events/my-events/active');
      return response.data;
    } catch (error) {
      console.error('Error getting my active events:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get all active events (public)
   * @returns {Promise<Object>} All active events data
   */
  async getAllActiveEvents() {
    try {
      const response = await apiClient.get('/events/all-events');
      return response.data;
    } catch (error) {
      console.error('Error getting all active events:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get event by ID (public)
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Event details
   */
  async getEventById(eventId) {
    try {
      const response = await apiClient.get(`/events/all-events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event by ID:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Create a new event (Group 2.1)
   * @param {Object} eventData - Event data to create
   * @returns {Promise<Object>} Created event data
   */
  async createEvent(eventData) {
    try {
      // Validate required fields for Group 2.1
      const requiredFields = ['title', 'startDate', 'endDate', 'organizerName', 'organizerEmail'];
      const missingFields = requiredFields.filter(field => !eventData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate dates
      if (new Date(eventData.startDate) >= new Date(eventData.endDate)) {
        throw new Error('Start date must be before end date');
      }

      // Validate online event requirements
      if (eventData.isOnline && !eventData.meetingLink) {
        throw new Error('Meeting link is required for online events');
      }

      const response = await apiClient.post('/events/create', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Update an existing event (Group 2.2)
   * @param {string} eventId - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise<Object>} Updated event data
   */
  async updateEvent(eventId, eventData) {
    try {
      // Validate required fields for Group 2.2
      const requiredFields = ['title', 'startDate', 'endDate', 'organizerName', 'organizerEmail'];
      const missingFields = requiredFields.filter(field => !eventData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate dates
      if (new Date(eventData.startDate) >= new Date(eventData.endDate)) {
        throw new Error('Start date must be before end date');
      }

      // Validate online event requirements
      if (eventData.isOnline && !eventData.meetingLink) {
        throw new Error('Meeting link is required for online events');
      }

      const response = await apiClient.put(`/events/my-events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Delete an event (Group 2.3)
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteEvent(eventId) {
    try {
      if (!eventId) {
        throw new Error('Event ID is required');
      }

      const response = await apiClient.delete(`/events/my-events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error.response?.data || error;
    }
  }

  // ===== LEGACY METHODS (for backward compatibility) =====

  /**
   * Get all events with pagination (legacy method)
   * @param {number} page - Page number (0-based)
   * @param {number} size - Page size
   * @param {string} sort - Sort criteria
   * @returns {Promise<Object>} Paginated events data
   */
  async getAllEvents(page = 0, size = 10, sort = 'eventDate,desc') {
    try {
      const response = await apiClient.get(`/events?page=${page}&size=${size}&sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error('Error getting all events:', error);
      throw error.response?.data || error;
    }
  }

  // ===== EVENT SEARCH =====

  /**
   * Search events with GET parameters (Group 3.1)
   * @param {Object} params - Search parameters for GET request
   * @returns {Promise<Object>} Search results
   */
  async searchEventsGet(params = {}) {
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
      throw error.response?.data || error;
    }
  }

  /**
   * Advanced event search with POST body (Group 3.2)
   * @param {Object} searchCriteria - Search criteria for POST request
   * @returns {Promise<Object>} Search results
   */
  async searchEventsPost(searchCriteria = {}) {
    try {
      const response = await apiClient.post('/events/search', searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Error searching events (POST):', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Unified search method that can handle both GET and POST
   * @param {Object} searchCriteria - Search criteria
   * @param {string} method - HTTP method ('GET' or 'POST')
   * @returns {Promise<Object>} Search results
   */
  async searchEvents(searchCriteria = {}, method = 'POST') {
    try {
      if (method === 'GET') {
        return await this.searchEventsGet(searchCriteria);
      } else {
        return await this.searchEventsPost(searchCriteria);
      }
    } catch (error) {
      console.error('Error searching events:', error);
      throw error.response?.data || error;
    }
  }

  // ===== EVENT PARTICIPATION (RSVP) =====

  /**
   * RSVP to an event
   * @param {string} eventId - Event ID
   * @param {string} status - Participation status
   * @param {string} message - Optional message
   * @returns {Promise<Object>} RSVP result
   */
  async rsvpToEvent(eventId, status, message = '') {
    try {
      const response = await apiClient.post('/events/participation/rsvp', {
        eventId,
        status,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Cancel RSVP for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelRsvp(eventId) {
    try {
      const response = await apiClient.delete(`/events/participation/${eventId}/rsvp`);
      return response.data;
    } catch (error) {
      console.error('Error canceling RSVP:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user's participation for a specific event
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Participation data
   */
  async getMyParticipation(eventId) {
    try {
      const response = await apiClient.get(`/events/participation/${eventId}/my-participation`);
      return response.data;
    } catch (error) {
      console.error('Error getting my participation:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get all participants for an event
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Participants data
   */
  async getEventParticipants(eventId) {
    try {
      const response = await apiClient.get(`/events/participation/${eventId}/participants`);
      return response.data;
    } catch (error) {
      console.error('Error getting event participants:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get all user's participations
   * @returns {Promise<Object>} User's participations data
   */
  async getMyParticipations() {
    try {
      const response = await apiClient.get('/events/participation/my-participations');
      return response.data;
    } catch (error) {
      console.error('Error getting my participations:', error);
      throw error.response?.data || error;
    }
  }

  // ===== EVENT INVITATIONS =====

  /**
   * Send invitations to an event
   * @param {string} eventId - Event ID
   * @param {Array<string>} usernames - Array of usernames to invite
   * @param {string} personalMessage - Personal message for invitation
   * @returns {Promise<Object>} Invitation result
   */
  async sendInvitations(eventId, usernames, personalMessage = '') {
    try {
      const response = await apiClient.post('/events/invitations/send', {
        eventId,
        usernames,
        personalMessage
      });
      return response.data;
    } catch (error) {
      console.error('Error sending invitations:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Accept an invitation
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Acceptance result
   */
  async acceptInvitation(eventId) {
    try {
      const response = await apiClient.post(`/events/invitations/${eventId}/accept`);
      return response.data;
    } catch (error) {
      console.error('Error accepting invitation:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Decline an invitation
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Decline result
   */
  async declineInvitation(eventId) {
    try {
      const response = await apiClient.post(`/events/invitations/${eventId}/decline`);
      return response.data;
    } catch (error) {
      console.error('Error declining invitation:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get user's invitations
   * @returns {Promise<Object>} User's invitations
   */
  async getMyInvitations() {
    try {
      const response = await apiClient.get('/events/invitations/my-invitations');
      return response.data;
    } catch (error) {
      console.error('Error getting my invitations:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get unread invitations
   * @returns {Promise<Object>} Unread invitations
   */
  async getUnreadInvitations() {
    try {
      const response = await apiClient.get('/events/invitations/my-invitations/unread');
      return response.data;
    } catch (error) {
      console.error('Error getting unread invitations:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get unresponded invitations
   * @returns {Promise<Object>} Unresponded invitations
   */
  async getUnrespondedInvitations() {
    try {
      const response = await apiClient.get('/events/invitations/my-invitations/unresponded');
      return response.data;
    } catch (error) {
      console.error('Error getting unresponded invitations:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Mark invitation as read
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Mark as read result
   */
  async markInvitationAsRead(eventId) {
    try {
      const response = await apiClient.post(`/events/invitations/${eventId}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking invitation as read:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get invitation counts
   * @returns {Promise<Object>} Invitation counts
   */
  async getInvitationCounts() {
    try {
      const response = await apiClient.get('/events/invitations/counts');
      return response.data;
    } catch (error) {
      console.error('Error getting invitation counts:', error);
      throw error.response?.data || error;
    }
  }

  // ===== EVENT TEMPLATES =====

  /**
   * Get all templates
   * @returns {Promise<Object>} All templates
   */
  async getAllTemplates() {
    try {
      const response = await apiClient.get('/event-templates');
      return response.data;
    } catch (error) {
      console.error('Error getting all templates:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get public templates
   * @returns {Promise<Object>} Public templates
   */
  async getPublicTemplates() {
    try {
      const response = await apiClient.get('/event-templates/public');
      return response.data;
    } catch (error) {
      console.error('Error getting public templates:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get template by ID
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} Template details
   */
  async getTemplateById(templateId) {
    try {
      const response = await apiClient.get(`/event-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting template by ID:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Create event from template
   * @param {string} templateId - Template ID
   * @param {Object} eventData - Event data to override template
   * @returns {Promise<Object>} Created event
   */
  async createEventFromTemplate(templateId, eventData = {}) {
    try {
      const response = await apiClient.post(`/event-templates/${templateId}/create-event`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event from template:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Search templates
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} Search results
   */
  async searchTemplates(searchParams = {}) {
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
      throw error.response?.data || error;
    }
  }

  /**
   * Create new template
   * @param {Object} templateData - Template data
   * @returns {Promise<Object>} Created template
   */
  async createTemplate(templateData) {
    try {
      const response = await apiClient.post('/event-templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Update template
   * @param {string} templateId - Template ID
   * @param {Object} templateData - Updated template data
   * @returns {Promise<Object>} Updated template
   */
  async updateTemplate(templateId, templateData) {
    try {
      const response = await apiClient.put(`/event-templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Delete template
   * @param {string} templateId - Template ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteTemplate(templateId) {
    try {
      const response = await apiClient.delete(`/event-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error.response?.data || error;
    }
  }

  // ===== EVENT COMMENTS =====

  /**
   * Add a comment to an event
   * @param {string} eventId - Event ID
   * @param {string} content - Comment content
   * @param {string} parentCommentId - Parent comment ID (optional)
   * @returns {Promise<Object>} Comment result
   */
  async addEventComment(eventId, content, parentCommentId = null) {
    try {
      const response = await apiClient.post('/events/comments', {
        eventId,
        content,
        parentCommentId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding event comment:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get event comments
   * @param {string} eventId - Event ID
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise<Object>} Comments data
   */
  async getEventComments(eventId, page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/events/comments/event/${eventId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event comments:', error);
      throw error.response?.data || error;
    }
  }

  // ===== EVENT MEDIA =====

  /**
   * Upload media for an event
   * @param {string} eventId - Event ID
   * @param {File} file - Media file
   * @param {string} caption - Media caption
   * @param {string} type - Media type (IMAGE, VIDEO, DOCUMENT)
   * @returns {Promise<Object>} Upload result
   */
  async uploadEventMedia(eventId, file, caption = '', type = 'IMAGE') {
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
      throw error.response?.data || error;
    }
  }

  /**
   * Get event media
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Media data
   */
  async getEventMedia(eventId) {
    try {
      const response = await apiClient.get(`/events/media/event/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting event media:', error);
      throw error.response?.data || error;
    }
  }

  // ===== PHASE 4: ENHANCED SOCIAL FEATURES =====

  /**
   * Update a comment
   * @param {string} commentId - Comment ID
   * @param {string} content - New comment content
   * @returns {Promise<Object>} Updated comment data
   */
  async updateEventComment(commentId, content) {
    try {
      const response = await apiClient.put(`/events/comments/${commentId}`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event comment:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Delete a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteEventComment(commentId) {
    try {
      const response = await apiClient.delete(`/events/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event comment:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Toggle like on a comment
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Like result with updated count
   */
  async toggleCommentLike(commentId) {
    try {
      const response = await apiClient.post(`/events/comments/${commentId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get comment replies
   * @param {string} commentId - Parent comment ID
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise<Object>} Replies data
   */
  async getCommentReplies(commentId, page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/events/comments/${commentId}/replies?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error getting comment replies:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Update media caption
   * @param {string} mediaId - Media ID
   * @param {string} caption - New caption
   * @returns {Promise<Object>} Updated media data
   */
  async updateMediaCaption(mediaId, caption) {
    try {
      const response = await apiClient.put(`/events/media/${mediaId}/caption`, {
        caption
      });
      return response.data;
    } catch (error) {
      console.error('Error updating media caption:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Delete media
   * @param {string} mediaId - Media ID
   * @returns {Promise<Object>} Deletion result
   */
  async deleteEventMedia(mediaId) {
    try {
      const response = await apiClient.delete(`/events/media/${mediaId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event media:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Toggle like on media
   * @param {string} mediaId - Media ID
   * @returns {Promise<Object>} Like result with updated count
   */
  async toggleMediaLike(mediaId) {
    try {
      const response = await apiClient.post(`/events/media/${mediaId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling media like:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get media by type
   * @param {string} eventId - Event ID
   * @param {string} mediaType - Media type (IMAGE, VIDEO, DOCUMENT)
   * @returns {Promise<Object>} Media data filtered by type
   */
  async getMediaByType(eventId, mediaType) {
    try {
      const response = await apiClient.get(`/events/media/event/${eventId}/type/${mediaType}`);
      return response.data;
    } catch (error) {
      console.error('Error getting media by type:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get media analytics
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Media analytics data
   */
  async getMediaAnalytics(eventId) {
    try {
      const response = await apiClient.get(`/events/media/event/${eventId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error getting media analytics:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Search comments by content
   * @param {string} eventId - Event ID
   * @param {string} searchTerm - Search term
   * @param {number} page - Page number
   * @param {number} size - Page size
   * @returns {Promise<Object>} Search results
   */
  async searchComments(eventId, searchTerm, page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/events/comments/event/${eventId}/search?q=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error searching comments:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Get comment statistics
   * @param {string} eventId - Event ID
   * @returns {Promise<Object>} Comment statistics
   */
  async getCommentStatistics(eventId) {
    try {
      const response = await apiClient.get(`/events/comments/event/${eventId}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error getting comment statistics:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Report inappropriate comment
   * @param {string} commentId - Comment ID
   * @param {string} reason - Reason for reporting
   * @returns {Promise<Object>} Report result
   */
  async reportComment(commentId, reason) {
    try {
      const response = await apiClient.post(`/events/comments/${commentId}/report`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error reporting comment:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Report inappropriate media
   * @param {string} mediaId - Media ID
   * @param {string} reason - Reason for reporting
   * @returns {Promise<Object>} Report result
   */
  async reportMedia(mediaId, reason) {
    try {
      const response = await apiClient.post(`/events/media/${mediaId}/report`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error reporting media:', error);
      throw error.response?.data || error;
    }
  }
}

// Create and export a singleton instance
const eventService = new EventService();
export default eventService;
