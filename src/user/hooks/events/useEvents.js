import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import eventService from '../../../services/api/eventService';
import { EVENT_CATEGORIES  } from '../../../services/api/eventApi';

/**
 * Custom hook for managing events state and data fetching
 * Handles loading, error states, and event data management for Phase 1: Core Event Management
 */
export const useEvents = () => {
  const { user } = useAuth();

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
    size: 6,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false
  });

  /**
   * Load events based on active tab
   */
  const loadEvents = useCallback(async (page = 0, size = 6) => {
    if (!user) {
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
              size: eventData.size || 6,
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
            const totalElements = mappedEvents.length;
            const totalPages = Math.max(1, Math.ceil(totalElements / size));
            const currentPage = Math.min(page, totalPages - 1);
            const startIdx = currentPage * size;
            const endIdx = Math.min(startIdx + size, totalElements);
            setEvents(mappedEvents.slice(startIdx, endIdx));
            setPagination({
              page: currentPage,
              size: size,
              totalElements: totalElements,
              totalPages: totalPages,
              first: currentPage === 0,
              last: currentPage === totalPages - 1
            });
          } else {
            // Empty response
            setEvents([]);
            setPagination({
              page: 0,
              size: 6,
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
            // Paginate my events similarly to 'all'
            const totalElements = mappedEventsArray.length;
            const totalPages = Math.max(1, Math.ceil(totalElements / size));
            const currentPage = Math.min(page, totalPages - 1);
            const startIdx = currentPage * size;
            const endIdx = Math.min(startIdx + size, totalElements);
            setMyEvents(mappedEventsArray.slice(startIdx, endIdx));
            setPagination({
              page: currentPage,
              size: size,
              totalElements,
              totalPages,
              first: currentPage === 0,
              last: currentPage === totalPages - 1
            });
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
          // Paginate 'all' if needed
          const totalElements = mappedResponse.length;
          const totalPages = Math.max(1, Math.ceil(totalElements / size));
          const currentPage = Math.min(page, totalPages - 1);
          const startIdx = currentPage * size;
          const endIdx = Math.min(startIdx + size, totalElements);
          setEvents(mappedResponse.slice(startIdx, endIdx));
          setPagination({
            page: currentPage,
            size: size,
            totalElements,
            totalPages,
            first: currentPage === 0,
            last: currentPage === totalPages - 1
          });
        } else if (activeTab === 'my-events' || activeTab === 'my-active-events') {
          const totalElements = mappedResponse.length;
          const totalPages = Math.max(1, Math.ceil(totalElements / size));
          const currentPage = Math.min(page, totalPages - 1);
          const startIdx = currentPage * size;
          const endIdx = Math.min(startIdx + size, totalElements);
          setMyEvents(mappedResponse.slice(startIdx, endIdx));
          setPagination({
            page: currentPage,
            size: size,
            totalElements,
            totalPages,
            first: currentPage === 0,
            last: currentPage === totalPages - 1
          });
        } else {
          setEvents(mappedResponse);
        }
      } else {
        // Handle empty or invalid response gracefully
        if (activeTab === 'all') {
          setEvents([]);
          setPagination({
            page: 0,
            size: 6,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
          });
        } else {
          if (activeTab === 'my-events' || activeTab === 'my-active-events') {
            setMyEvents([]);
            setPagination({
              page: 0,
              size: 6,
              totalElements: 0,
              totalPages: 0,
              first: true,
              last: true
            });
          } else {
            setEvents([]);
          }
        }
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load events';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [activeTab, user, mapApiEventTypeToCategory]);

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
      size: 6,
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
    if (!user) {
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
      throw err;
    }
  }, [user]);

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
