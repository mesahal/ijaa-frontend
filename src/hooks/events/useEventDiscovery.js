import { useState, useCallback } from 'react';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import eventService from '../../services/eventService';
import { EVENT_CATEGORIES } from '../../utils/eventApi';

/**
 * Custom hook for Phase 2: Event Discovery & Search
 * Handles upcoming events, trending events, and advanced search functionality
 */
export const useEventDiscovery = () => {
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

  // State for upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [upcomingLoading, setUpcomingLoading] = useState(false);
  const [upcomingError, setUpcomingError] = useState(null);
  const [upcomingPagination, setUpcomingPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });

  // State for trending events
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(false);
  const [trendingError, setTrendingError] = useState(null);

  // State for search results
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchPagination, setSearchPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true
  });

  /**
   * Load upcoming events
   */
  const loadUpcomingEvents = useCallback(async (days = 30, page = 0, size = 10) => {
    if (!user?.token) {
      setUpcomingEvents([]);
      setUpcomingLoading(false);
      return;
    }

    setUpcomingLoading(true);
    setUpcomingError(null);

    try {
      const response = await eventService.getUpcomingEvents(days, page, size);
      
      if (response && (response.success || response.code === "200")) {
        const eventData = response.data;
        
        if (eventData && eventData.content && Array.isArray(eventData.content)) {
          // Map API event types to frontend categories
          const mappedEvents = eventData.content.map(event => ({
            ...event,
            category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
          }));
          
          setUpcomingEvents(mappedEvents);
          setUpcomingPagination({
            page: eventData.number || 0,
            size: eventData.size || 10,
            totalElements: eventData.totalElements || 0,
            totalPages: eventData.totalPages || 0,
            first: eventData.first !== false,
            last: eventData.last !== false
          });
        } else if (Array.isArray(eventData)) {
          // Handle direct array response
          const mappedEvents = eventData.map(event => ({
            ...event,
            category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
          }));
          
          setUpcomingEvents(mappedEvents);
          setUpcomingPagination({
            page: 0,
            size: mappedEvents.length,
            totalElements: mappedEvents.length,
            totalPages: 1,
            first: true,
            last: true
          });
        } else {
          setUpcomingEvents([]);
          setUpcomingPagination({
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
          });
        }
      } else {
        setUpcomingEvents([]);
        setUpcomingPagination({
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true
        });
      }
    } catch (err) {
      console.error('Error loading upcoming events:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load upcoming events';
      setUpcomingError(errorMessage);
      setUpcomingEvents([]);
    } finally {
      setUpcomingLoading(false);
    }
  }, [user?.token, mapApiEventTypeToCategory]);

  /**
   * Load trending events
   */
  const loadTrendingEvents = useCallback(async (limit = 10) => {
    if (!user?.token) {
      setTrendingEvents([]);
      setTrendingLoading(false);
      return;
    }

    setTrendingLoading(true);
    setTrendingError(null);

    try {
      const response = await eventService.getTrendingEvents(limit);
      
      if (response && (response.success || response.code === "200")) {
        const eventData = response.data;
        
        if (Array.isArray(eventData)) {
          // Map API event types to frontend categories
          const mappedEvents = eventData.map(event => ({
            ...event,
            category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
          }));
          
          setTrendingEvents(mappedEvents);
        } else {
          setTrendingEvents([]);
        }
      } else {
        setTrendingEvents([]);
      }
    } catch (err) {
      console.error('Error loading trending events:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load trending events';
      setTrendingError(errorMessage);
      setTrendingEvents([]);
    } finally {
      setTrendingLoading(false);
    }
  }, [user?.token, mapApiEventTypeToCategory]);

  /**
   * Search events with advanced filters
   */
  const searchEvents = useCallback(async (searchParams = {}, page = 0, size = 10) => {
    if (!user?.token) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    try {
      const response = await eventService.searchEventsPhase2({
        ...searchParams,
        page,
        size
      });
      
      if (response && (response.success || response.code === "200")) {
        const eventData = response.data;
        
        if (eventData && eventData.content && Array.isArray(eventData.content)) {
          // Map API event types to frontend categories
          const mappedEvents = eventData.content.map(event => ({
            ...event,
            category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
          }));
          
          setSearchResults(mappedEvents);
          setSearchPagination({
            page: eventData.number || 0,
            size: eventData.size || 10,
            totalElements: eventData.totalElements || 0,
            totalPages: eventData.totalPages || 0,
            first: eventData.first !== false,
            last: eventData.last !== false
          });
        } else if (Array.isArray(eventData)) {
          // Handle direct array response
          const mappedEvents = eventData.map(event => ({
            ...event,
            category: event.eventType ? mapApiEventTypeToCategory(event.eventType) : event.category
          }));
          
          setSearchResults(mappedEvents);
          setSearchPagination({
            page: 0,
            size: mappedEvents.length,
            totalElements: mappedEvents.length,
            totalPages: 1,
            first: true,
            last: true
          });
        } else {
          setSearchResults([]);
          setSearchPagination({
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            first: true,
            last: true
          });
        }
      } else {
        setSearchResults([]);
        setSearchPagination({
          page: 0,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true
        });
      }
    } catch (err) {
      console.error('Error searching events:', err);
      const errorMessage = err.message || err.response?.data?.message || 'Failed to search events';
      setSearchError(errorMessage);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [user?.token, mapApiEventTypeToCategory]);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
    setSearchPagination({
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true
    });
  }, []);

  /**
   * Load next page of upcoming events
   */
  const loadNextUpcomingPage = useCallback(() => {
    if (!upcomingPagination.last) {
      loadUpcomingEvents(30, upcomingPagination.page + 1, upcomingPagination.size);
    }
  }, [upcomingPagination, loadUpcomingEvents]);

  /**
   * Load previous page of upcoming events
   */
  const loadPreviousUpcomingPage = useCallback(() => {
    if (!upcomingPagination.first) {
      loadUpcomingEvents(30, upcomingPagination.page - 1, upcomingPagination.size);
    }
  }, [upcomingPagination, loadUpcomingEvents]);

  /**
   * Load next page of search results
   */
  const loadNextSearchPage = useCallback(() => {
    if (!searchPagination.last) {
      // Note: This would need the current search params to be stored
      // For now, we'll just increment the page
      setSearchPagination(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  }, [searchPagination]);

  /**
   * Load previous page of search results
   */
  const loadPreviousSearchPage = useCallback(() => {
    if (!searchPagination.first) {
      setSearchPagination(prev => ({
        ...prev,
        page: prev.page - 1
      }));
    }
  }, [searchPagination]);

  return {
    // Upcoming events
    upcomingEvents,
    upcomingLoading,
    upcomingError,
    upcomingPagination,
    loadUpcomingEvents,
    loadNextUpcomingPage,
    loadPreviousUpcomingPage,
    
    // Trending events
    trendingEvents,
    trendingLoading,
    trendingError,
    loadTrendingEvents,
    
    // Search functionality
    searchResults,
    searchLoading,
    searchError,
    searchPagination,
    searchEvents,
    clearSearch,
    loadNextSearchPage,
    loadPreviousSearchPage
  };
};

