import { useState, useEffect, useCallback } from 'react';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import eventService from '../../services/eventService';
import { EVENT_CATEGORIES } from '../../utils/eventApi';

/**
 * Custom hook for managing events state and data fetching
 * Handles loading, error states, and event data management for Phase 1: Core Event Management
 */
export const useEvents = () => {
  const { user } = useUnifiedAuth();

  // Map API event types to frontend categories
  const mapApiEventTypeToCategory = useCallback((eventType) => {
    const typeToCategoryMap = {
      'TECHNICAL': EVENT_CATEGORIES.EDUCATIONAL,
      'WORKSHOP': EVENT_CATEGORIES.EDUCATIONAL,
      'NETWORKING': EVENT_CATEGORIES.NETWORKING,
      'SPORTS': EVENT_CATEGORIES.SOCIAL,
      'CAREER': EVENT_CATEGORIES.PROFESSIONAL,
      'SOCIAL': EVENT_CATEGORIES.SOCIAL,
      'CONFERENCE': EVENT_CATEGORIES.PROFESSIONAL,
      'MENTORSHIP': EVENT_CATEGORIES.PROFESSIONAL
    };
    return typeToCategoryMap[eventType] || EVENT_CATEGORIES.SOCIAL;
  }, []);
  
  // State management
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false
  });

  /**
   * Load events based on active tab
   */
  const loadEvents = useCallback(async (page = 0, size = 10) => {
    if (!user?.token) {
      // Don't set error for missing authentication - this is expected for unauthenticated users
      setEvents([]);
      setMyEvents([]);
      setLoading(false);
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
          response = await eventService.getAllActiveEvents(page, size, 'startDate,asc');
          break;
      }

      // Handle API response structure
      if (response && (response.success || response.code === "200")) {
        const eventData = response.data;
        
        if (activeTab === 'all') {
          // Handle paginated response for all events
          if (eventData && eventData.content && Array.isArray(eventData.content)) {
            setEvents(eventData.content);
            setPagination({
              page: eventData.number || 0,
              size: eventData.size || 10,
              totalElements: eventData.totalElements || 0,
              totalPages: eventData.totalPages || 0,
              first: eventData.first !== false,
              last: eventData.last !== false
            });
          } else if (Array.isArray(eventData)) {
            // Handle direct array response (current API structure)
            // Map API event types to frontend categories
            const mappedEvents = eventData.map(event => ({
              ...event,
              category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
            }));
            setEvents(mappedEvents);
            setPagination({
              page: 0,
              size: mappedEvents.length,
              totalElements: mappedEvents.length,
              totalPages: 1,
              first: true,
              last: true
            });
          } else {
            // Empty response
            setEvents([]);
            setPagination({
              page: 0,
              size: 10,
              totalElements: 0,
              totalPages: 0,
              first: true,
              last: true
            });
          }
        } else {
          // Handle non-paginated response for user events
          const eventsArray = Array.isArray(eventData) ? eventData : [];
          // Map API event types to frontend categories
          const mappedEventsArray = eventsArray.map(event => ({
            ...event,
            category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
          }));
          if (activeTab === 'my-events' || activeTab === 'my-active-events') {
            setMyEvents(mappedEventsArray);
          } else {
            setEvents(mappedEventsArray);
          }
        }
      } else if (response && Array.isArray(response)) {
        // Direct array response without wrapper
        // Map API event types to frontend categories
        const mappedResponse = response.map(event => ({
          ...event,
          category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
        }));
        if (activeTab === 'all') {
          setEvents(mappedResponse);
          setPagination({
            page: 0,
            size: mappedResponse.length,
            totalElements: mappedResponse.length,
            totalPages: 1,
            first: true,
            last: true
          });
        } else {
          if (activeTab === 'my-events' || activeTab === 'my-active-events') {
            setMyEvents(mappedResponse);
          } else {
            setEvents(mappedResponse);
          }
        }
      } else {
        // Handle empty or invalid response gracefully
        console.log('No events found or invalid response format');
        if (activeTab === 'all') {
          setEvents([]);
          setPagination({
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
          });
        } else {
          if (activeTab === 'my-events' || activeTab === 'my-active-events') {
            setMyEvents([]);
          } else {
            setEvents([]);
          }
        }
      }
    } catch (err) {
      console.error('Error loading events:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load events';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user?.token, mapApiEventTypeToCategory]);

  /**
   * Refresh events data
   */
  const refreshEvents = useCallback(() => {
    loadEvents(pagination.page, pagination.size);
  }, [loadEvents, pagination.page, pagination.size]);

  /**
   * Handle tab change
   */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    // Reset pagination when changing tabs
    setPagination({
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: false
    });
  }, []);

  /**
   * Load next page
   */
  const loadNextPage = useCallback(() => {
    if (!pagination.last && activeTab === 'all') {
      const nextPage = pagination.page + 1;
      loadEvents(nextPage, pagination.size);
    }
  }, [pagination, activeTab, loadEvents]);

  /**
   * Load previous page
   */
  const loadPreviousPage = useCallback(() => {
    if (!pagination.first && activeTab === 'all') {
      const prevPage = pagination.page - 1;
      loadEvents(prevPage, pagination.size);
    }
  }, [pagination, activeTab, loadEvents]);

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
      if (response && response.success) {
        return response.data;
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
    pagination,
    
    // Actions
    loadEvents,
    refreshEvents,
    handleTabChange,
    loadNextPage,
    loadPreviousPage,
    getCurrentEvents,
    getEventById,
    
    // Computed
    currentEvents: getCurrentEvents(),
  };
};
