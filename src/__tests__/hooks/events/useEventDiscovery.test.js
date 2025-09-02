import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventDiscovery } from '../../../hooks/events/useEventDiscovery';
import eventService from '../../../services/eventService';

// Mock the event service
jest.mock('../../../services/eventService');

// Mock the authentication context
jest.mock('../../../context/UnifiedAuthContext');

const mockUseUnifiedAuth = require('../../../context/UnifiedAuthContext').useUnifiedAuth;

describe('useEventDiscovery Hook - Phase 2: Event Discovery & Search', () => {
  const mockUser = {
    token: 'mock-token',
    email: 'test@example.com'
  };

  beforeEach(() => {
    mockUseUnifiedAuth.mockReturnValue({ user: mockUser });
    jest.clearAllMocks();
  });

  describe('Upcoming Events', () => {
    it('should load upcoming events successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Upcoming events retrieved successfully',
        data: {
          content: [
            {
              id: 1,
              title: 'Upcoming Event 1',
              eventType: 'TECHNICAL',
              startDate: '2024-12-20T19:00:00',
              endDate: '2024-12-20T21:00:00',
              location: 'Online',
              maxParticipants: 100,
              currentParticipants: 23
            }
          ],
          totalElements: 1,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getUpcomingEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadUpcomingEvents();
      });

      await waitFor(() => {
        expect(result.current.upcomingEvents).toHaveLength(1);
        expect(result.current.upcomingEvents[0].title).toBe('Upcoming Event 1');
        expect(result.current.upcomingEvents[0].category).toBe('EDUCATIONAL'); // Mapped from TECHNICAL
        expect(result.current.upcomingLoading).toBe(false);
        expect(result.current.upcomingError).toBeNull();
      });
    });

    it('should handle upcoming events API error', async () => {
      const mockError = new Error('Failed to load upcoming events');
      eventService.getUpcomingEvents.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadUpcomingEvents();
      });

      await waitFor(() => {
        expect(result.current.upcomingEvents).toEqual([]);
        expect(result.current.upcomingLoading).toBe(false);
        expect(result.current.upcomingError).toBe('Failed to load upcoming events');
      });
    });

    it('should not load upcoming events when user is not authenticated', async () => {
      mockUseUnifiedAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadUpcomingEvents();
      });

      expect(result.current.upcomingEvents).toEqual([]);
      expect(result.current.upcomingLoading).toBe(false);
      expect(eventService.getUpcomingEvents).not.toHaveBeenCalled();
    });
  });

  describe('Trending Events', () => {
    it('should load trending events successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Trending events retrieved successfully',
        data: [
          {
            id: 1,
            title: 'Trending Event 1',
            eventType: 'NETWORKING',
            startDate: '2024-12-25T19:00:00',
            endDate: '2024-12-25T21:00:00',
            location: 'Conference Center',
            maxParticipants: 50,
            currentParticipants: 45,
            trendingScore: 0.92
          }
        ]
      };

      eventService.getTrendingEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadTrendingEvents();
      });

      await waitFor(() => {
        expect(result.current.trendingEvents).toHaveLength(1);
        expect(result.current.trendingEvents[0].title).toBe('Trending Event 1');
        expect(result.current.trendingEvents[0].category).toBe('NETWORKING');
        expect(result.current.trendingEvents[0].trendingScore).toBe(0.92);
        expect(result.current.trendingLoading).toBe(false);
        expect(result.current.trendingError).toBeNull();
      });
    });

    it('should handle trending events API error', async () => {
      const mockError = new Error('Failed to load trending events');
      eventService.getTrendingEvents.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadTrendingEvents();
      });

      await waitFor(() => {
        expect(result.current.trendingEvents).toEqual([]);
        expect(result.current.trendingLoading).toBe(false);
        expect(result.current.trendingError).toBe('Failed to load trending events');
      });
    });
  });

  describe('Event Search', () => {
    it('should search events successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Events found successfully',
        data: {
          content: [
            {
              id: 1,
              title: 'Search Result Event',
              eventType: 'WORKSHOP',
              startDate: '2024-12-30T19:00:00',
              endDate: '2024-12-30T21:00:00',
              location: 'Workshop Room',
              maxParticipants: 30,
              currentParticipants: 15
            }
          ],
          totalElements: 1,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.searchEventsPhase2.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventDiscovery());

      const searchParams = {
        title: 'workshop',
        category: 'EDUCATIONAL'
      };

      await act(async () => {
        await result.current.searchEvents(searchParams);
      });

      await waitFor(() => {
        expect(result.current.searchResults).toHaveLength(1);
        expect(result.current.searchResults[0].title).toBe('Search Result Event');
        expect(result.current.searchResults[0].category).toBe('EDUCATIONAL'); // Mapped from WORKSHOP
        expect(result.current.searchLoading).toBe(false);
        expect(result.current.searchError).toBeNull();
      });
    });

    it('should handle search API error', async () => {
      const mockError = new Error('Search failed');
      eventService.searchEventsPhase2.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.searchEvents({ title: 'test' });
      });

      await waitFor(() => {
        expect(result.current.searchResults).toEqual([]);
        expect(result.current.searchLoading).toBe(false);
        expect(result.current.searchError).toBe('Search failed');
      });
    });

    it('should clear search results', async () => {
      const { result } = renderHook(() => useEventDiscovery());

      // Set some initial state
      act(() => {
        result.current.searchResults = [{ id: 1, title: 'Test Event' }];
        result.current.searchError = 'Some error';
      });

      act(() => {
        result.current.clearSearch();
      });

      expect(result.current.searchResults).toEqual([]);
      expect(result.current.searchError).toBeNull();
      expect(result.current.searchPagination).toEqual({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
      });
    });
  });

  describe('Event Type Mapping', () => {
    it('should map API event types to frontend categories correctly', async () => {
      const mockResponse = {
        success: true,
        data: {
          content: [
            { id: 1, title: 'Technical Event', eventType: 'TECHNICAL' },
            { id: 2, title: 'Workshop Event', eventType: 'WORKSHOP' },
            { id: 3, title: 'Networking Event', eventType: 'NETWORKING' },
            { id: 4, title: 'Sports Event', eventType: 'SPORTS' },
            { id: 5, title: 'Career Event', eventType: 'CAREER' },
            { id: 6, title: 'Social Event', eventType: 'SOCIAL' }
          ]
        }
      };

      eventService.getUpcomingEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadUpcomingEvents();
      });

      await waitFor(() => {
        expect(result.current.upcomingEvents[0].category).toBe('EDUCATIONAL'); // TECHNICAL -> EDUCATIONAL
        expect(result.current.upcomingEvents[1].category).toBe('EDUCATIONAL'); // WORKSHOP -> EDUCATIONAL
        expect(result.current.upcomingEvents[2].category).toBe('NETWORKING'); // NETWORKING -> NETWORKING
        expect(result.current.upcomingEvents[3].category).toBe('SOCIAL'); // SPORTS -> SOCIAL
        expect(result.current.upcomingEvents[4].category).toBe('PROFESSIONAL'); // CAREER -> PROFESSIONAL
        expect(result.current.upcomingEvents[5].category).toBe('SOCIAL'); // SOCIAL -> SOCIAL
      });
    });
  });

  describe('Pagination', () => {
    it('should handle pagination for upcoming events', async () => {
      const mockResponse = {
        success: true,
        data: {
          content: [{ id: 1, title: 'Event 1' }],
          totalElements: 25,
          totalPages: 3,
          size: 10,
          number: 1,
          first: false,
          last: false
        }
      };

      eventService.getUpcomingEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventDiscovery());

      await act(async () => {
        await result.current.loadUpcomingEvents(30, 1, 10);
      });

      await waitFor(() => {
        expect(result.current.upcomingPagination.page).toBe(1);
        expect(result.current.upcomingPagination.totalElements).toBe(25);
        expect(result.current.upcomingPagination.totalPages).toBe(3);
        expect(result.current.upcomingPagination.first).toBe(false);
        expect(result.current.upcomingPagination.last).toBe(false);
      });
    });
  });
});
