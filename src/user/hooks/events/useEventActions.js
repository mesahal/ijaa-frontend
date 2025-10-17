import { useState, useCallback } from 'react';
import eventService from '../../../services/api/eventService';

/**
 * Custom hook for managing event actions (CRUD operations, RSVP, etc.)
 * Handles create, update, delete, and participation actions for Phase 1: Core Event Management
 */
export const useEventActions = (refreshEvents = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create or update an event (Phase 1.3 & 1.5)
   */
  const handleCreateEvent = useCallback(async (eventForm, selectedEvent = null) => {
    setLoading(true);
    setError(null);

    try {
      // Enhanced validation for Phase 1 requirements
      if (!eventForm.title || !eventForm.startDate || !eventForm.endDate) {
        throw new Error('Please fill in all required fields: title, start date, and end date');
      }

      if (new Date(eventForm.startDate) >= new Date(eventForm.endDate)) {
        throw new Error('Start date must be before end date');
      }

      // Validate max participants
      if (eventForm.maxParticipants && (eventForm.maxParticipants < 1 || eventForm.maxParticipants > 1000)) {
        throw new Error('Maximum participants must be between 1 and 1000');
      }

      let response;
      let result;

      if (selectedEvent) {
        // Update existing event (Phase 1.5)
        response = await eventService.updateEvent(selectedEvent.id, eventForm);
        result = response;
      } else {
        // Create new event (Phase 1.3)
        const eventData = {
          title: eventForm.title,
          description: eventForm.description || '',
          startDate: eventForm.startDate,
          endDate: eventForm.endDate,
          location: eventForm.isOnline ? eventForm.meetingLink : (eventForm.location || ''),
          category: eventForm.eventType || 'NETWORKING',
          maxParticipants: eventForm.maxParticipants || 50,
          isPublic: eventForm.privacy !== 'PRIVATE', // Default to true
          requiresApproval: false,
          organizerName: eventForm.organizerName || 'Event Organizer',
          organizerEmail: eventForm.organizerEmail || 'organizer@example.com',
          isOnline: eventForm.isOnline || false
        };
        
        console.log('Creating event with data:', eventData);
        response = await eventService.createEvent(eventData);
        result = response;
      }

      // Check if the response indicates success
      if (result && (result.success || result.message === 'Event created successfully' || result.status === 200)) {
        if (refreshEvents) {
          await refreshEvents();
        }
        return { success: true, data: result.data || result };
      } else {
        throw new Error(result?.message || 'Failed to save event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to save event');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [refreshEvents]);

  /**
   * Delete an event (Phase 1.6)
   */
  const handleDeleteEvent = useCallback(async (eventId) => {
    if (!eventId) {
      setError('Event ID is required');
      return { success: false, error: 'Event ID is required' };
    }

    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return { success: false, error: 'Cancelled by user' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.deleteEvent(eventId);
      const result = response;

      if (result && result.success) {
        await refreshEvents();
        return { success: true };
      } else {
        throw new Error(result?.message || 'Failed to delete event');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete event');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [refreshEvents]);

  /**
   * RSVP to an event
   */
  const handleRsvp = useCallback(async (eventId, status, message = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.rsvpToEvent(eventId, status, message);
      if (response && response.success) {
        await refreshEvents();
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to RSVP');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to RSVP');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [refreshEvents]);

  /**
   * Cancel RSVP for an event
   */
  const handleCancelRsvp = useCallback(async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your RSVP?')) {
      return { success: false, error: 'Cancelled by user' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.cancelRsvp(eventId);
      if (response && response.success) {
        await refreshEvents();
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to cancel RSVP');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to cancel RSVP');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [refreshEvents]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    
    // Actions
    handleCreateEvent,
    handleDeleteEvent,
    handleRsvp,
    handleCancelRsvp,
    clearError,
  };
};
