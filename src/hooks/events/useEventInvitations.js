import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';

/**
 * Custom hook for managing event invitations and participation
 * Handles invitations, RSVP, and participation status
 * Enhanced with Phase 5: Advanced Invitation Management
 */
export const useEventInvitations = () => {
  const { user } = useAuth();
  
  // State management
  const [myParticipations, setMyParticipations] = useState([]);
  const [myInvitations, setMyInvitations] = useState([]);
  const [unreadInvitations, setUnreadInvitations] = useState([]);
  const [unrespondedInvitations, setUnrespondedInvitations] = useState([]);
  const [invitationCounts, setInvitationCounts] = useState({ 
    totalCount: 0, 
    unreadCount: 0, 
    unrespondedCount: 0,
    acceptedCount: 0,
    declinedCount: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load user's participations and invitations
   */
  const loadUserData = useCallback(async () => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);

    try {
      const [participationsResponse, invitationsResponse, countsResponse, unreadResponse, unrespondedResponse] = await Promise.all([
        eventService.getMyParticipations(),
        eventService.getMyInvitations(),
        eventService.getInvitationCounts(),
        eventService.getUnreadInvitations(),
        eventService.getUnrespondedInvitations()
      ]);

      if (participationsResponse.data) setMyParticipations(participationsResponse.data);
      if (invitationsResponse.data) setMyInvitations(invitationsResponse.data);
      if (countsResponse.data) setInvitationCounts(countsResponse.data);
      if (unreadResponse.data) setUnreadInvitations(unreadResponse.data);
      if (unrespondedResponse.data) setUnrespondedInvitations(unrespondedResponse.data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  /**
   * Send invitations to users
   */
  const sendInvitations = useCallback(async (eventId, usernames, personalMessage = '') => {
    setLoading(true);
    setError(null);

    try {
      const usernamesList = usernames.split(',').map(u => u.trim()).filter(u => u);
      if (usernamesList.length === 0) {
        throw new Error('Please enter at least one username');
      }

      const response = await eventService.sendInvitations(eventId, usernamesList, personalMessage);
      if ((response.code === '200' || response.code === 200)) {
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to send invitations');
      }
    } catch (err) {
      console.error('Error sending invitations:', err);
      setError(err.response?.data?.message || err.message || 'Failed to send invitations');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Accept an invitation
   */
  const acceptInvitation = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.acceptInvitation(eventId);
      if ((response.code === '200' || response.code === 200)) {
        // Refresh invitations and participations
        await loadUserData();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to accept invitation');
      }
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err.response?.data?.message || err.message || 'Failed to accept invitation');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadUserData]);

  /**
   * Decline an invitation
   */
  const declineInvitation = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.declineInvitation(eventId);
      if ((response.code === '200' || response.code === 200)) {
        // Refresh invitations
        await loadUserData();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to decline invitation');
      }
    } catch (err) {
      console.error('Error declining invitation:', err);
      setError(err.response?.data?.message || err.message || 'Failed to decline invitation');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadUserData]);

  /**
   * Mark invitation as read
   */
  const markInvitationAsRead = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.markInvitationAsRead(eventId);
      if ((response.code === '200' || response.code === 200)) {
        // Refresh invitations
        await loadUserData();
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to mark invitation as read');
      }
    } catch (err) {
      console.error('Error marking invitation as read:', err);
      setError(err.response?.data?.message || err.message || 'Failed to mark invitation as read');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadUserData]);

  /**
   * Get user's participation status for an event
   */
  const getMyParticipationStatus = useCallback((eventId) => {
    const participation = myParticipations.find(p => p.eventId === eventId);
    return participation ? participation.status : null;
  }, [myParticipations]);

  /**
   * Check if user has been invited to an event
   */
  const getMyInvitationStatus = useCallback((eventId) => {
    const invitation = myInvitations.find(i => i.eventId === eventId);
    return invitation ? { 
      isInvited: true, 
      isRead: invitation.isRead, 
      isResponded: invitation.isResponded 
    } : null;
  }, [myInvitations]);

  /**
   * Get event participants
   */
  const getEventParticipants = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.getEventParticipants(eventId);
      if ((response.code === '200' || response.code === 200) && response.data) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to load participants');
      }
    } catch (err) {
      console.error('Error loading participants:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load participants');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return {
    // State
    myParticipations,
    myInvitations,
    unreadInvitations,
    unrespondedInvitations,
    invitationCounts,
    loading,
    error,
    
    // Actions
    loadUserData,
    sendInvitations,
    acceptInvitation,
    declineInvitation,
    markInvitationAsRead,
    getEventParticipants,
    clearError,
    
    // Utilities
    getMyParticipationStatus,
    getMyInvitationStatus,
    
    // Computed properties
    hasUnreadInvitations: invitationCounts.unreadCount > 0,
    hasUnrespondedInvitations: invitationCounts.unrespondedCount > 0,
    totalInvitations: invitationCounts.totalCount,
  };
};
