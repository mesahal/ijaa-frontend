import { useState, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import eventService from '../../services/eventService';

/**
 * Custom hook for Phase 5: Advanced Event Features
 * Handles advanced search, recommendations, similar events, and analytics
 */
export const useEventAdvancedFeatures = () => {
  const { user } = useAuth();

  // Advanced Search State
  const [advancedSearchResults, setAdvancedSearchResults] = useState([]);
  const [advancedSearchLoading, setAdvancedSearchLoading] = useState(false);
  const [advancedSearchError, setAdvancedSearchError] = useState(null);
  const [advancedSearchPagination, setAdvancedSearchPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });

  // Recommendations State
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState(null);

  // Similar Events State
  const [similarEvents, setSimilarEvents] = useState([]);
  const [similarEventsLoading, setSimilarEventsLoading] = useState(false);
  const [similarEventsError, setSimilarEventsError] = useState(null);

  // High Engagement Events State
  const [highEngagementEvents, setHighEngagementEvents] = useState([]);
  const [highEngagementLoading, setHighEngagementLoading] = useState(false);
  const [highEngagementError, setHighEngagementError] = useState(null);
  const [highEngagementPagination, setHighEngagementPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });

  // Location Events State
  const [locationEvents, setLocationEvents] = useState([]);
  const [locationEventsLoading, setLocationEventsLoading] = useState(false);
  const [locationEventsError, setLocationEventsError] = useState(null);
  const [locationEventsPagination, setLocationEventsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });

  // Organizer Events State
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [organizerEventsLoading, setOrganizerEventsLoading] = useState(false);
  const [organizerEventsError, setOrganizerEventsError] = useState(null);
  const [organizerEventsPagination, setOrganizerEventsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });

  /**
   * Advanced Search
   */
  const performAdvancedSearch = useCallback(async (searchCriteria = {}, page = 0, size = 10) => {
    if (!user?.token) {
      setAdvancedSearchError('Authentication required');
      return;
    }

    setAdvancedSearchLoading(true);
    setAdvancedSearchError(null);

    try {
      const response = await eventService.advancedSearch({
        ...searchCriteria,
        page,
        size
      });

      if (response && (response.success || response.code === "200")) {
        const data = response.data;
        
        if (data && data.content && Array.isArray(data.content)) {
          setAdvancedSearchResults(data.content);
          setAdvancedSearchPagination({
            currentPage: data.number || 0,
            totalPages: data.totalPages || 0,
            totalElements: data.totalElements || 0,
            hasNext: !data.last,
            hasPrevious: !data.first
          });
        } else if (Array.isArray(data)) {
          setAdvancedSearchResults(data);
          setAdvancedSearchPagination({
            currentPage: 0,
            totalPages: 1,
            totalElements: data.length,
            hasNext: false,
            hasPrevious: false
          });
        } else {
          setAdvancedSearchResults([]);
          setAdvancedSearchPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false
          });
        }
      } else {
        throw new Error(response?.message || 'Advanced search failed');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Advanced search failed';
      setAdvancedSearchError(errorMessage);
      setAdvancedSearchResults([]);
    } finally {
      setAdvancedSearchLoading(false);
    }
  }, [user?.token]);

  /**
   * Get Event Recommendations
   */
  const loadRecommendations = useCallback(async (limit = 5) => {
    if (!user?.token) {
      setRecommendationsError('Authentication required');
      return;
    }

    setRecommendationsLoading(true);
    setRecommendationsError(null);

    try {
      const response = await eventService.getEventRecommendations(limit);

      if (response && (response.success || response.code === "200")) {
        const data = response.data;
        setRecommendations(Array.isArray(data) ? data : []);
      } else {
        throw new Error(response?.message || 'Failed to load recommendations');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load recommendations';
      setRecommendationsError(errorMessage);
      setRecommendations([]);
    } finally {
      setRecommendationsLoading(false);
    }
  }, [user?.token]);

  /**
   * Get Similar Events
   */
  const loadSimilarEvents = useCallback(async (eventId, limit = 5) => {
    if (!user?.token) {
      setSimilarEventsError('Authentication required');
      return;
    }

    if (!eventId) {
      setSimilarEventsError('Event ID is required');
      return;
    }

    setSimilarEventsLoading(true);
    setSimilarEventsError(null);

    try {
      const response = await eventService.getSimilarEvents(eventId, limit);

      if (response && (response.success || response.code === "200")) {
        const data = response.data;
        setSimilarEvents(Array.isArray(data) ? data : []);
      } else {
        throw new Error(response?.message || 'Failed to load similar events');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load similar events';
      setSimilarEventsError(errorMessage);
      setSimilarEvents([]);
    } finally {
      setSimilarEventsLoading(false);
    }
  }, [user?.token]);

  /**
   * Get High Engagement Events
   */
  const loadHighEngagementEvents = useCallback(async (threshold = 50, page = 0, size = 10) => {
    if (!user?.token) {
      setHighEngagementError('Authentication required');
      return;
    }

    setHighEngagementLoading(true);
    setHighEngagementError(null);

    try {
      const response = await eventService.getHighEngagementEvents(threshold, page, size);

      if (response && (response.success || response.code === "200")) {
        const data = response.data;
        
        if (data && data.content && Array.isArray(data.content)) {
          setHighEngagementEvents(data.content);
          setHighEngagementPagination({
            currentPage: data.number || 0,
            totalPages: data.totalPages || 0,
            totalElements: data.totalElements || 0,
            hasNext: !data.last,
            hasPrevious: !data.first
          });
        } else if (Array.isArray(data)) {
          setHighEngagementEvents(data);
          setHighEngagementPagination({
            currentPage: 0,
            totalPages: 1,
            totalElements: data.length,
            hasNext: false,
            hasPrevious: false
          });
        } else {
          setHighEngagementEvents([]);
          setHighEngagementPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false
          });
        }
      } else {
        throw new Error(response?.message || 'Failed to load high engagement events');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load high engagement events';
      setHighEngagementError(errorMessage);
      setHighEngagementEvents([]);
    } finally {
      setHighEngagementLoading(false);
    }
  }, [user?.token]);

  /**
   * Get Events by Location
   */
  const loadEventsByLocation = useCallback(async (location, page = 0, size = 10) => {
    if (!user?.token) {
      setLocationEventsError('Authentication required');
      return;
    }

    if (!location) {
      setLocationEventsError('Location is required');
      return;
    }

    setLocationEventsLoading(true);
    setLocationEventsError(null);

    try {
      const response = await eventService.getEventsByLocation(location, page, size);

      if (response && (response.success || response.code === "200")) {
        const data = response.data;
        
        if (data && data.content && Array.isArray(data.content)) {
          setLocationEvents(data.content);
          setLocationEventsPagination({
            currentPage: data.number || 0,
            totalPages: data.totalPages || 0,
            totalElements: data.totalElements || 0,
            hasNext: !data.last,
            hasPrevious: !data.first
          });
        } else if (Array.isArray(data)) {
          setLocationEvents(data);
          setLocationEventsPagination({
            currentPage: 0,
            totalPages: 1,
            totalElements: data.length,
            hasNext: false,
            hasPrevious: false
          });
        } else {
          setLocationEvents([]);
          setLocationEventsPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false
          });
        }
      } else {
        throw new Error(response?.message || 'Failed to load events by location');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load events by location';
      setLocationEventsError(errorMessage);
      setLocationEvents([]);
    } finally {
      setLocationEventsLoading(false);
    }
  }, [user?.token]);

  /**
   * Get Events by Organizer
   */
  const loadEventsByOrganizer = useCallback(async (organizerName, page = 0, size = 10) => {
    if (!user?.token) {
      setOrganizerEventsError('Authentication required');
      return;
    }

    if (!organizerName) {
      setOrganizerEventsError('Organizer name is required');
      return;
    }

    setOrganizerEventsLoading(true);
    setOrganizerEventsError(null);

    try {
      const response = await eventService.getEventsByOrganizer(organizerName, page, size);

      if (response && (response.success || response.code === "200")) {
        const data = response.data;
        
        if (data && data.content && Array.isArray(data.content)) {
          setOrganizerEvents(data.content);
          setOrganizerEventsPagination({
            currentPage: data.number || 0,
            totalPages: data.totalPages || 0,
            totalElements: data.totalElements || 0,
            hasNext: !data.last,
            hasPrevious: !data.first
          });
        } else if (Array.isArray(data)) {
          setOrganizerEvents(data);
          setOrganizerEventsPagination({
            currentPage: 0,
            totalPages: 1,
            totalElements: data.length,
            hasNext: false,
            hasPrevious: false
          });
        } else {
          setOrganizerEvents([]);
          setOrganizerEventsPagination({
            currentPage: 0,
            totalPages: 0,
            totalElements: 0,
            hasNext: false,
            hasPrevious: false
          });
        }
      } else {
        throw new Error(response?.message || 'Failed to load events by organizer');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load events by organizer';
      setOrganizerEventsError(errorMessage);
      setOrganizerEvents([]);
    } finally {
      setOrganizerEventsLoading(false);
    }
  }, [user?.token]);

  /**
   * Clear errors
   */
  const clearAdvancedSearchError = useCallback(() => {
    setAdvancedSearchError(null);
  }, []);

  const clearRecommendationsError = useCallback(() => {
    setRecommendationsError(null);
  }, []);

  const clearSimilarEventsError = useCallback(() => {
    setSimilarEventsError(null);
  }, []);

  const clearHighEngagementError = useCallback(() => {
    setHighEngagementError(null);
  }, []);

  const clearLocationEventsError = useCallback(() => {
    setLocationEventsError(null);
  }, []);

  const clearOrganizerEventsError = useCallback(() => {
    setOrganizerEventsError(null);
  }, []);

  return {
    // Advanced Search
    advancedSearchResults,
    advancedSearchLoading,
    advancedSearchError,
    advancedSearchPagination,
    performAdvancedSearch,
    clearAdvancedSearchError,

    // Recommendations
    recommendations,
    recommendationsLoading,
    recommendationsError,
    loadRecommendations,
    clearRecommendationsError,

    // Similar Events
    similarEvents,
    similarEventsLoading,
    similarEventsError,
    loadSimilarEvents,
    clearSimilarEventsError,

    // High Engagement Events
    highEngagementEvents,
    highEngagementLoading,
    highEngagementError,
    highEngagementPagination,
    loadHighEngagementEvents,
    clearHighEngagementError,

    // Location Events
    locationEvents,
    locationEventsLoading,
    locationEventsError,
    locationEventsPagination,
    loadEventsByLocation,
    clearLocationEventsError,

    // Organizer Events
    organizerEvents,
    organizerEventsLoading,
    organizerEventsError,
    organizerEventsPagination,
    loadEventsByOrganizer,
    clearOrganizerEventsError
  };
};



















