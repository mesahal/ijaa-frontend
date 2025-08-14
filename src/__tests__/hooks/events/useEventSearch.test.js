import { renderHook, act } from '@testing-library/react';
import { useEventSearch } from '../../../hooks/events/useEventSearch';

// Mock the eventService
jest.mock('../../../services/eventService', () => ({
  searchEventsGet: jest.fn(),
  searchEventsPost: jest.fn(),
  searchEvents: jest.fn()
}));

// Import the mocked service
import eventService from '../../../services/eventService';

describe('useEventSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Group 3: Event Search and Discovery', () => {
    describe('Initial state', () => {
      it('should initialize with default values', () => {
        const { result } = renderHook(() => useEventSearch());

        expect(result.current.searchQuery).toBe('');
        expect(result.current.filterType).toBe('all');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
        expect(result.current.searchResults).toEqual([]);
      });
    });

    describe('Basic search functionality', () => {
      it('should handle search query changes', () => {
        const { result } = renderHook(() => useEventSearch());

        act(() => {
          result.current.handleSearchQueryChange('test query');
        });

        expect(result.current.searchQuery).toBe('test query');
      });

      it('should handle filter type changes', () => {
        const { result } = renderHook(() => useEventSearch());

        act(() => {
          result.current.handleFilterTypeChange('MEETING');
        });

        expect(result.current.filterType).toBe('MEETING');
      });

      it('should filter events by search query', () => {
        const { result } = renderHook(() => useEventSearch());
        const events = [
          { title: 'Alumni Meet', description: 'Annual gathering', location: 'Campus' },
          { title: 'Workshop', description: 'Technical workshop', location: 'Lab' }
        ];

        act(() => {
          result.current.handleSearchQueryChange('alumni');
        });

        const filteredEvents = result.current.filterBySearch(events);
        expect(filteredEvents).toHaveLength(1);
        expect(filteredEvents[0].title).toBe('Alumni Meet');
      });

      it('should filter events by type', () => {
        const { result } = renderHook(() => useEventSearch());
        const events = [
          { eventType: 'MEETING', title: 'Alumni Meet' },
          { eventType: 'WORKSHOP', title: 'Technical Workshop' }
        ];

        act(() => {
          result.current.handleFilterTypeChange('MEETING');
        });

        const filteredEvents = result.current.filterByType(events);
        expect(filteredEvents).toHaveLength(1);
        expect(filteredEvents[0].eventType).toBe('MEETING');
      });

      it('should get filtered events combining search and type filters', () => {
        const { result } = renderHook(() => useEventSearch());
        const events = [
          { title: 'Alumni Meet', eventType: 'MEETING' },
          { title: 'Technical Workshop', eventType: 'WORKSHOP' },
          { title: 'Alumni Workshop', eventType: 'WORKSHOP' }
        ];

        act(() => {
          result.current.handleSearchQueryChange('alumni');
          result.current.handleFilterTypeChange('WORKSHOP');
        });

        const filteredEvents = result.current.getFilteredEvents(events);
        expect(filteredEvents).toHaveLength(1);
        expect(filteredEvents[0].title).toBe('Alumni Workshop');
      });
    });

    describe('Advanced search functionality', () => {
      it('should search events with GET parameters (Group 3.1)', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchParams = {
          location: 'IIT Campus',
          eventType: 'MEETING',
          startDate: '2024-12-01T00:00:00',
          endDate: '2024-12-31T23:59:59',
          isOnline: false,
          organizerName: 'John Doe',
          title: 'Alumni',
          description: 'gathering'
        };

        const mockResponse = {
          code: '200',
          data: [
            {
              id: 1,
              title: 'Alumni Meet 2024',
              description: 'Annual alumni gathering',
              startDate: '2024-12-25T18:00:00',
              endDate: '2024-12-25T22:00:00',
              location: 'IIT Campus',
              eventType: 'MEETING',
              active: true,
              isOnline: false,
              maxParticipants: 100,
              currentParticipants: 0,
              organizerName: 'John Doe',
              organizerEmail: 'john@example.com',
              privacy: 'PUBLIC'
            }
          ]
        };

        eventService.searchEventsGet.mockResolvedValue(mockResponse);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEventsGet(searchParams);
        });

        expect(eventService.searchEventsGet).toHaveBeenCalledWith(searchParams);
        expect(searchResult).toEqual({ success: true, data: mockResponse.data });
        expect(result.current.searchResults).toEqual(mockResponse.data);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      it('should search events with POST body (Group 3.2)', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchCriteria = {
          location: 'IIT',
          eventType: 'MEETING',
          startDate: '2024-12-01T00:00:00',
          endDate: '2024-12-31T23:59:59',
          isOnline: false,
          organizerName: 'John',
          title: 'Alumni',
          description: 'gathering'
        };

        const mockResponse = {
          code: '200',
          data: [
            {
              id: 1,
              title: 'Alumni Meet 2024',
              description: 'Annual alumni gathering and networking event',
              startDate: '2024-12-25T18:00:00',
              endDate: '2024-12-25T22:00:00',
              location: 'IIT Campus',
              eventType: 'MEETING',
              active: true,
              isOnline: false,
              maxParticipants: 100,
              currentParticipants: 0,
              organizerName: 'John Doe',
              organizerEmail: 'john@example.com',
              privacy: 'PUBLIC'
            }
          ]
        };

        eventService.searchEventsPost.mockResolvedValue(mockResponse);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEventsPost(searchCriteria);
        });

        expect(eventService.searchEventsPost).toHaveBeenCalledWith(searchCriteria);
        expect(searchResult).toEqual({ success: true, data: mockResponse.data });
        expect(result.current.searchResults).toEqual(mockResponse.data);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      it('should handle search errors', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchCriteria = { title: 'test' };

        const error = new Error('Search failed');
        eventService.searchEventsPost.mockRejectedValue(error);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEventsPost(searchCriteria);
        });

        expect(searchResult).toEqual({ success: false, error: 'Search failed' });
        expect(result.current.error).toBe('Search failed');
        expect(result.current.loading).toBe(false);
      });

      it('should handle API response errors', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchCriteria = { title: 'test' };

        const mockResponse = {
          code: '500',
          message: 'Internal server error'
        };

        eventService.searchEventsPost.mockResolvedValue(mockResponse);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEventsPost(searchCriteria);
        });

        expect(searchResult).toEqual({ success: false, error: 'Internal server error' });
        expect(result.current.error).toBe('Internal server error');
        expect(result.current.loading).toBe(false);
      });
    });

    describe('Unified search functionality', () => {
      it('should use GET method when specified', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchParams = { location: 'IIT Campus' };

        const mockResponse = {
          code: '200',
          data: []
        };

        eventService.searchEventsGet.mockResolvedValue(mockResponse);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEvents(searchParams, 'GET');
        });

        expect(eventService.searchEventsGet).toHaveBeenCalledWith(searchParams);
        expect(searchResult).toEqual({ success: true, data: mockResponse.data });
      });

      it('should use POST method by default', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchCriteria = { title: 'Alumni Meet' };

        const mockResponse = {
          code: '200',
          data: []
        };

        eventService.searchEventsPost.mockResolvedValue(mockResponse);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEvents(searchCriteria);
        });

        expect(eventService.searchEventsPost).toHaveBeenCalledWith(searchCriteria);
        expect(searchResult).toEqual({ success: true, data: mockResponse.data });
      });

      it('should use POST method when explicitly specified', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchCriteria = { title: 'Alumni Meet' };

        const mockResponse = {
          code: '200',
          data: []
        };

        eventService.searchEventsPost.mockResolvedValue(mockResponse);

        let searchResult;
        await act(async () => {
          searchResult = await result.current.searchEvents(searchCriteria, 'POST');
        });

        expect(eventService.searchEventsPost).toHaveBeenCalledWith(searchCriteria);
        expect(searchResult).toEqual({ success: true, data: mockResponse.data });
      });
    });

    describe('Clear functionality', () => {
      it('should clear search and filters', () => {
        const { result } = renderHook(() => useEventSearch());

        // Set some values first
        act(() => {
          result.current.handleSearchQueryChange('test query');
          result.current.handleFilterTypeChange('MEETING');
        });

        expect(result.current.searchQuery).toBe('test query');
        expect(result.current.filterType).toBe('MEETING');

        // Clear everything
        act(() => {
          result.current.clearSearch();
        });

        expect(result.current.searchQuery).toBe('');
        expect(result.current.filterType).toBe('all');
        expect(result.current.error).toBe(null);
        expect(result.current.searchResults).toEqual([]);
      });
    });

    describe('Loading states', () => {
      it('should show loading state during search', async () => {
        const { result } = renderHook(() => useEventSearch());
        const searchCriteria = { title: 'test' };

        // Mock a delayed response
        eventService.searchEventsPost.mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve({ code: '200', data: [] }), 100))
        );

        let searchPromise;
        act(() => {
          searchPromise = result.current.searchEventsPost(searchCriteria);
        });

        // Check loading state
        expect(result.current.loading).toBe(true);

        // Wait for the search to complete
        await act(async () => {
          await searchPromise;
        });

        expect(result.current.loading).toBe(false);
      });
    });
  });
});
