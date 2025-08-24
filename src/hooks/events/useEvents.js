import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/eventService';

/**
 * Custom hook for managing events state and data fetching
 * Handles loading, error states, and event data management for Group 1: Basic Event Management
 */
export const useEvents = () => {
  const { user } = useAuth();
  
  // State management
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  /**
   * Load events based on active tab
   */
  const loadEvents = useCallback(async () => {
    if (!user?.token) {
      setError('Authentication required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (activeTab) {
        case 'my-events':
          response = await eventService.getMyEvents();
          break;
        case 'my-active-events':
          response = await eventService.getMyActiveEvents();
          break;
        case 'all':
        default:
          response = await eventService.getAllActiveEvents();
          break;
      }

      // Handle different response structures
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        const eventData = response.data || response;
        if (activeTab === 'my-events' || activeTab === 'my-active-events') {
          setMyEvents(Array.isArray(eventData) ? eventData : []);
        } else {
          setEvents(Array.isArray(eventData) ? eventData : []);
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch events');
      }
    } catch (err) {
      console.error('Error loading events:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load events';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user?.token]);

  /**
   * Refresh events data
   */
  const refreshEvents = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  /**
   * Get current events based on active tab
   */
  const getCurrentEvents = useCallback(() => {
    return activeTab === 'my-events' || activeTab === 'my-active-events' ? myEvents : events;
  }, [activeTab, myEvents, events]);

  /**
   * Get event by ID
   */
  const getEventById = useCallback(async (eventId) => {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await eventService.getEventById(eventId);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        return response.data || response;
      } else {
        throw new Error(response?.message || 'Failed to fetch event');
      }
    } catch (err) {
      console.error('Error getting event by ID:', err);
      throw err;
    }
  }, [user?.token]);

  // Load events on component mount and tab change
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    // State
    events,
    myEvents,
    loading,
    error,
    activeTab,
    
    // Actions
    loadEvents,
    refreshEvents,
    handleTabChange,
    getCurrentEvents,
    getEventById,
    
    // Computed
    currentEvents: getCurrentEvents(),
  };
};
