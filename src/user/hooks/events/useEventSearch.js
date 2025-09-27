import { useState, useCallback } from 'react';
import eventService from '../../../services/api/eventService';

/**
 * Custom hook for managing event search and filtering
 * Handles search queries, filters, and search results for Group 3 functionality
 */
export const useEventSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  /**
   * Handle basic search query change
   */
  const handleSearchQueryChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  /**
   * Handle filter type change
   */
  const handleFilterTypeChange = useCallback((type) => {
    setFilterType(type);
  }, []);

  /**
   * Filter events by search query
   */
  const filterBySearch = useCallback((events) => {
    if (!searchQuery.trim()) return events;
    
    const query = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        (event.title && event.title.toLowerCase().includes(query)) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  /**
   * Filter events by type
   */
  const filterByType = useCallback((events) => {
    if (filterType === 'all') return events;
    return events.filter((event) => event.category === filterType || event.eventType === filterType);
  }, [filterType]);

  /**
   * Get filtered events
   */
  const getFilteredEvents = useCallback((events) => {
    let filteredEvents = filterBySearch(events);
    return filterByType(filteredEvents);
  }, [filterBySearch, filterByType]);

  /**
   * Search events with GET parameters (Group 3.1)
   */
  const searchEventsGet = useCallback(async (searchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Filter out empty values
      const params = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await eventService.searchEventsGet(params);
      if ((response.code === '200' || response.code === 200) && response.data) {
        setSearchResults(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to search events');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to search events');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Advanced search with POST body (Group 3.2)
   */
  const searchEventsPost = useCallback(async (searchCriteria) => {
    setLoading(true);
    setError(null);

    try {
      // Filter out empty values
      const criteria = Object.fromEntries(
        Object.entries(searchCriteria).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await eventService.searchEventsPost(criteria);
      if ((response.code === '200' || response.code === 200) && response.data) {
        setSearchResults(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to search events');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to search events');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Unified search method that can handle both GET and POST
   */
  const searchEvents = useCallback(async (searchCriteria, method = 'POST') => {
    if (method === 'GET') {
      return await searchEventsGet(searchCriteria);
    } else {
      return await searchEventsPost(searchCriteria);
    }
  }, [searchEventsGet, searchEventsPost]);

  /**
   * Clear search and filters
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilterType('all');
    setError(null);
    setSearchResults([]);
  }, []);

  return {
    // State
    searchQuery,
    filterType,
    loading,
    error,
    searchResults,
    
    // Actions
    handleSearchQueryChange,
    handleFilterTypeChange,
    searchEvents,
    searchEventsGet,
    searchEventsPost,
    clearSearch,
    
    // Utilities
    filterBySearch,
    filterByType,
    getFilteredEvents,
  };
};
