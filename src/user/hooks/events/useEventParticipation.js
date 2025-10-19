import { useState, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import eventService from '../../../services/api/eventService';

/**
 * Custom hook for Phase 3: Event Participation
 * Handles RSVP functionality, participation management, and status updates
 */
export const useEventParticipation = () => {
  const { user } = useAuth();

  // State for user's participations
  const [participations, setParticipations] = useState([]);
  const [participationsLoading, setParticipationsLoading] = useState(false);
  const [participationsError, setParticipationsError] = useState(null);
  const [participationsPagination, setParticipationsPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });

  // State for RSVP operations
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState(null);

  // State for participation updates
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  /**
   * Load user's event participations
   */
  const loadMyParticipations = useCallback(async (status = null, page = 0, size = 10) => {
    if (!user?.userId) {
      setParticipations([]);
      setParticipationsLoading(false);
      return;
    }

    setParticipationsLoading(true);
    setParticipationsError(null);

    try {
      const response = await eventService.getMyParticipations(status, page, size);
      
      if (response && (response.success || response.code === "200")) {
        const participationData = response.data;
        
        if (participationData && participationData.content && Array.isArray(participationData.content)) {
          setParticipations(participationData.content);
          setParticipationsPagination({
            page: participationData.number || 0,
            size: participationData.size || 10,
            totalElements: participationData.totalElements || 0,
            totalPages: participationData.totalPages || 0,
            first: participationData.first !== false,
            last: participationData.last !== false
          });
        } else if (Array.isArray(participationData)) {
          // Handle direct array response
          setParticipations(participationData);
          setParticipationsPagination({
            page: 0,
            size: participationData.length,
            totalElements: participationData.length,
            totalPages: 1,
            first: true,
            last: true
          });
        } else {
          setParticipations([]);
          setParticipationsPagination({
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
          });
        }
      } else {
        setParticipations([]);
        setParticipationsPagination({
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true
        });
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load participations';
      setParticipationsError(errorMessage);
      setParticipations([]);
    } finally {
      setParticipationsLoading(false);
    }
  }, [user?.userId]);

  /**
   * RSVP to an event
   */
  const rsvpToEvent = useCallback(async (eventId, status, message = '') => {
    if (!user?.userId) {
      setRsvpError('Authentication required');
      return null;
    }

    setRsvpLoading(true);
    setRsvpError(null);

    try {
      const response = await eventService.rsvpToEvent(eventId, status, message);
      await loadMyParticipations();
      return response?.data ?? response;
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to RSVP to event';
      setRsvpError(errorMessage);
      return null;
    } finally {
      setRsvpLoading(false);
    }
  }, [user?.userId, loadMyParticipations]);

  /**
   * Update participation status
   */
  const updateParticipation = useCallback(async (eventId, status, message = '') => {
    if (!user?.userId) {
      setUpdateError('Authentication required');
      return null;
    }

    setUpdateLoading(true);
    setUpdateError(null);

    try {
      const response = await eventService.updateRsvp(eventId, status, message);
      await loadMyParticipations();
      return response?.data ?? response;
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to update participation';
      setUpdateError(errorMessage);
      return null;
    } finally {
      setUpdateLoading(false);
    }
  }, [user?.userId, loadMyParticipations]);

  /**
   * Cancel RSVP (set status to DECLINED)
   */
  const cancelRsvp = useCallback(async (eventId, message = '') => {
    if (!user?.userId) {
      setRsvpError('Authentication required');
      return null;
    }
    setRsvpLoading(true);
    setRsvpError(null);
    try {
      const response = await eventService.cancelRsvp(eventId);
      await loadMyParticipations();
      return response?.data || response;
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to cancel RSVP';
      setRsvpError(errorMessage);
      return null;
    } finally {
      setRsvpLoading(false);
    }
  }, [user?.userId, loadMyParticipations]);

  /**
   * Join event (set status to CONFIRMED)
   */
  const joinEvent = useCallback(async (eventId, message = '') => {
    return await rsvpToEvent(eventId, 'CONFIRMED', message);
  }, [rsvpToEvent]);

  /**
   * Maybe attend event (set status to MAYBE)
   */
  const maybeAttendEvent = useCallback(async (eventId, message = '') => {
    return await rsvpToEvent(eventId, 'MAYBE', message);
  }, [rsvpToEvent]);

  /**
   * Get participation status for a specific event
   */
  const getParticipationStatus = useCallback((eventId) => {
    const targetId = String(eventId);
    const participation = participations.find(p => String(p.eventId) === targetId);
    return participation ? participation.status : null;
  }, [participations]);

  /**
   * Get participation for a specific event
   */
  const getParticipation = useCallback((eventId) => {
    const targetId = String(eventId);
    return participations.find(p => String(p.eventId) === targetId) || null;
  }, [participations]);

  /**
   * Check if user is participating in an event
   */
  const isParticipating = useCallback((eventId) => {
    const participation = getParticipation(eventId);
    return participation ? participation.status === 'CONFIRMED' : false;
  }, [getParticipation]);

  /**
   * Check if user has maybe RSVP'd to an event
   */
  const isMaybeAttending = useCallback((eventId) => {
    const participation = getParticipation(eventId);
    return participation ? participation.status === 'MAYBE' : false;
  }, [getParticipation]);

  /**
   * Check if user has declined an event
   */
  const hasDeclined = useCallback((eventId) => {
    const participation = getParticipation(eventId);
    return participation ? participation.status === 'DECLINED' : false;
  }, [getParticipation]);

  /**
   * Load next page of participations
   */
  const loadNextParticipationsPage = useCallback(() => {
    if (!participationsPagination.last) {
      loadMyParticipations(null, participationsPagination.page + 1, participationsPagination.size);
    }
  }, [participationsPagination, loadMyParticipations]);

  /**
   * Load previous page of participations
   */
  const loadPreviousParticipationsPage = useCallback(() => {
    if (!participationsPagination.first) {
      loadMyParticipations(null, participationsPagination.page - 1, participationsPagination.size);
    }
  }, [participationsPagination, loadMyParticipations]);

  /**
   * Clear RSVP error
   */
  const clearRsvpError = useCallback(() => {
    setRsvpError(null);
  }, []);

  /**
   * Clear update error
   */
  const clearUpdateError = useCallback(() => {
    setUpdateError(null);
  }, []);

  /**
   * Clear participations error
   */
  const clearParticipationsError = useCallback(() => {
    setParticipationsError(null);
  }, []);

  return {
    // Participations state
    participations,
    participationsLoading,
    participationsError,
    participationsPagination,
    loadMyParticipations,
    loadNextParticipationsPage,
    loadPreviousParticipationsPage,
    clearParticipationsError,
    
    // RSVP operations
    rsvpLoading,
    rsvpError,
    rsvpToEvent,
    clearRsvpError,
    
    // Update operations
    updateLoading,
    updateError,
    updateParticipation,
    clearUpdateError,
    
    // Convenience methods
    joinEvent,
    maybeAttendEvent,
    cancelRsvp,
    
    // Status checking methods
    getParticipationStatus,
    getParticipation,
    isParticipating,
    isMaybeAttending,
    hasDeclined
  };
};
