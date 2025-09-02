import { renderHook, act } from '@testing-library/react';
import { useEventAdvancedFeatures } from '../../../hooks/events/useEventAdvancedFeatures';
import eventService from '../../../services/eventService';

// Mock the eventService
jest.mock('../../../services/eventService');

// Mock the UnifiedAuthContext
jest.mock('../../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => ({
    user: {
      id: 1,
      username: 'testuser',
      token: 'mock-token'
    },
    isAuthenticated: true
  })
}));

describe('useEventAdvancedFeatures Hook - Phase 5: Advanced Features', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Advanced Search', () => {
    it('should perform advanced search successfully', async () => {
      const mockSearchResults = {
        success: true,
        data: {
          content: [
            { id: 1, title: 'Advanced Event 1' },
            { id: 2, title: 'Advanced Event 2' }
          ],
          totalElements: 2,
          totalPages: 1,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.advancedSearch.mockResolvedValue(mockSearchResults);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.performAdvancedSearch({
          title: 'workshop',
          category: 'EDUCATIONAL'
        });
      });

      expect(eventService.advancedSearch).toHaveBeenCalledWith({
        title: 'workshop',
        category: 'EDUCATIONAL',
        page: 0,
        size: 10
      });
      expect(result.current.advancedSearchResults).toEqual(mockSearchResults.data.content);
      expect(result.current.advancedSearchLoading).toBe(false);
      expect(result.current.advancedSearchError).toBeNull();
    });

    it('should handle advanced search error', async () => {
      const errorMessage = 'Advanced search failed';
      eventService.advancedSearch.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.performAdvancedSearch({ title: 'test' });
      });

      expect(result.current.advancedSearchError).toBe(errorMessage);
      expect(result.current.advancedSearchResults).toEqual([]);
      expect(result.current.advancedSearchLoading).toBe(false);
    });


  });

  describe('Event Recommendations', () => {
    it('should load recommendations successfully', async () => {
      const mockRecommendations = {
        success: true,
        data: [
          { id: 1, title: 'Recommended Event 1', recommendationScore: 0.85 },
          { id: 2, title: 'Recommended Event 2', recommendationScore: 0.75 }
        ]
      };

      eventService.getEventRecommendations.mockResolvedValue(mockRecommendations);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadRecommendations(5);
      });

      expect(eventService.getEventRecommendations).toHaveBeenCalledWith(5);
      expect(result.current.recommendations).toEqual(mockRecommendations.data);
      expect(result.current.recommendationsLoading).toBe(false);
      expect(result.current.recommendationsError).toBeNull();
    });

    it('should handle recommendations error', async () => {
      const errorMessage = 'Failed to load recommendations';
      eventService.getEventRecommendations.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadRecommendations();
      });

      expect(result.current.recommendationsError).toBe(errorMessage);
      expect(result.current.recommendations).toEqual([]);
      expect(result.current.recommendationsLoading).toBe(false);
    });
  });

  describe('Similar Events', () => {
    it('should load similar events successfully', async () => {
      const mockSimilarEvents = {
        success: true,
        data: [
          { id: 1, title: 'Similar Event 1', similarityScore: 0.85 },
          { id: 2, title: 'Similar Event 2', similarityScore: 0.75 }
        ]
      };

      eventService.getSimilarEvents.mockResolvedValue(mockSimilarEvents);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadSimilarEvents(123, 5);
      });

      expect(eventService.getSimilarEvents).toHaveBeenCalledWith(123, 5);
      expect(result.current.similarEvents).toEqual(mockSimilarEvents.data);
      expect(result.current.similarEventsLoading).toBe(false);
      expect(result.current.similarEventsError).toBeNull();
    });

    it('should handle similar events error', async () => {
      const errorMessage = 'Failed to load similar events';
      eventService.getSimilarEvents.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadSimilarEvents(123);
      });

      expect(result.current.similarEventsError).toBe(errorMessage);
      expect(result.current.similarEvents).toEqual([]);
      expect(result.current.similarEventsLoading).toBe(false);
    });

    it('should require event ID for similar events', async () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadSimilarEvents(null);
      });

      expect(eventService.getSimilarEvents).not.toHaveBeenCalled();
      expect(result.current.similarEventsError).toBe('Event ID is required');
    });
  });

  describe('High Engagement Events', () => {
    it('should load high engagement events successfully', async () => {
      const mockHighEngagementEvents = {
        success: true,
        data: {
          content: [
            { id: 1, title: 'High Engagement Event 1', engagementRate: 85.0 },
            { id: 2, title: 'High Engagement Event 2', engagementRate: 75.0 }
          ],
          totalElements: 2,
          totalPages: 1,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getHighEngagementEvents.mockResolvedValue(mockHighEngagementEvents);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadHighEngagementEvents(50, 0, 10);
      });

      expect(eventService.getHighEngagementEvents).toHaveBeenCalledWith(50, 0, 10);
      expect(result.current.highEngagementEvents).toEqual(mockHighEngagementEvents.data.content);
      expect(result.current.highEngagementLoading).toBe(false);
      expect(result.current.highEngagementError).toBeNull();
    });

    it('should handle high engagement events error', async () => {
      const errorMessage = 'Failed to load high engagement events';
      eventService.getHighEngagementEvents.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadHighEngagementEvents();
      });

      expect(result.current.highEngagementError).toBe(errorMessage);
      expect(result.current.highEngagementEvents).toEqual([]);
      expect(result.current.highEngagementLoading).toBe(false);
    });
  });

  describe('Events by Location', () => {
    it('should load events by location successfully', async () => {
      const mockLocationEvents = {
        success: true,
        data: {
          content: [
            { id: 1, title: 'Location Event 1', location: 'Dhaka' },
            { id: 2, title: 'Location Event 2', location: 'Dhaka' }
          ],
          totalElements: 2,
          totalPages: 1,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getEventsByLocation.mockResolvedValue(mockLocationEvents);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadEventsByLocation('Dhaka', 0, 10);
      });

      expect(eventService.getEventsByLocation).toHaveBeenCalledWith('Dhaka', 0, 10);
      expect(result.current.locationEvents).toEqual(mockLocationEvents.data.content);
      expect(result.current.locationEventsLoading).toBe(false);
      expect(result.current.locationEventsError).toBeNull();
    });

    it('should handle location events error', async () => {
      const errorMessage = 'Failed to load events by location';
      eventService.getEventsByLocation.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadEventsByLocation('Dhaka');
      });

      expect(result.current.locationEventsError).toBe(errorMessage);
      expect(result.current.locationEvents).toEqual([]);
      expect(result.current.locationEventsLoading).toBe(false);
    });

    it('should require location for location events', async () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadEventsByLocation('');
      });

      expect(eventService.getEventsByLocation).not.toHaveBeenCalled();
      expect(result.current.locationEventsError).toBe('Location is required');
    });
  });

  describe('Events by Organizer', () => {
    it('should load events by organizer successfully', async () => {
      const mockOrganizerEvents = {
        success: true,
        data: {
          content: [
            { id: 1, title: 'Organizer Event 1', organizerName: 'John Doe' },
            { id: 2, title: 'Organizer Event 2', organizerName: 'John Doe' }
          ],
          totalElements: 2,
          totalPages: 1,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getEventsByOrganizer.mockResolvedValue(mockOrganizerEvents);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadEventsByOrganizer('John Doe', 0, 10);
      });

      expect(eventService.getEventsByOrganizer).toHaveBeenCalledWith('John Doe', 0, 10);
      expect(result.current.organizerEvents).toEqual(mockOrganizerEvents.data.content);
      expect(result.current.organizerEventsLoading).toBe(false);
      expect(result.current.organizerEventsError).toBeNull();
    });

    it('should handle organizer events error', async () => {
      const errorMessage = 'Failed to load events by organizer';
      eventService.getEventsByOrganizer.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadEventsByOrganizer('John Doe');
      });

      expect(result.current.organizerEventsError).toBe(errorMessage);
      expect(result.current.organizerEvents).toEqual([]);
      expect(result.current.organizerEventsLoading).toBe(false);
    });

    it('should require organizer name for organizer events', async () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadEventsByOrganizer('');
      });

      expect(eventService.getEventsByOrganizer).not.toHaveBeenCalled();
      expect(result.current.organizerEventsError).toBe('Organizer name is required');
    });
  });

  describe('Error Clearing', () => {
    it('should clear advanced search error', () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      act(() => {
        result.current.clearAdvancedSearchError();
      });

      expect(result.current.advancedSearchError).toBeNull();
    });

    it('should clear recommendations error', () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      act(() => {
        result.current.clearRecommendationsError();
      });

      expect(result.current.recommendationsError).toBeNull();
    });

    it('should clear similar events error', () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      act(() => {
        result.current.clearSimilarEventsError();
      });

      expect(result.current.similarEventsError).toBeNull();
    });

    it('should clear high engagement error', () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      act(() => {
        result.current.clearHighEngagementError();
      });

      expect(result.current.highEngagementError).toBeNull();
    });

    it('should clear location events error', () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      act(() => {
        result.current.clearLocationEventsError();
      });

      expect(result.current.locationEventsError).toBeNull();
    });

    it('should clear organizer events error', () => {
      const { result } = renderHook(() => useEventAdvancedFeatures());

      act(() => {
        result.current.clearOrganizerEventsError();
      });

      expect(result.current.organizerEventsError).toBeNull();
    });
  });

  describe('Pagination Handling', () => {
    it('should handle pagination for advanced search', async () => {
      const mockPaginatedResults = {
        success: true,
        data: {
          content: [{ id: 1, title: 'Event 1' }],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.advancedSearch.mockResolvedValue(mockPaginatedResults);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.performAdvancedSearch({}, 1, 5);
      });

      expect(eventService.advancedSearch).toHaveBeenCalledWith({
        page: 1,
        size: 5
      });
      expect(result.current.advancedSearchPagination).toEqual({
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        hasNext: false,
        hasPrevious: false
      });
    });

    it('should handle pagination for high engagement events', async () => {
      const mockPaginatedResults = {
        success: true,
        data: {
          content: [{ id: 1, title: 'High Engagement Event' }],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getHighEngagementEvents.mockResolvedValue(mockPaginatedResults);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadHighEngagementEvents(50, 1, 5);
      });

      expect(eventService.getHighEngagementEvents).toHaveBeenCalledWith(50, 1, 5);
      expect(result.current.highEngagementPagination).toEqual({
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
        hasNext: false,
        hasPrevious: false
      });
    });
  });

  describe('Array Response Handling', () => {
    it('should handle array response for recommendations', async () => {
      const mockArrayResponse = {
        success: true,
        data: [
          { id: 1, title: 'Recommendation 1' },
          { id: 2, title: 'Recommendation 2' }
        ]
      };

      eventService.getEventRecommendations.mockResolvedValue(mockArrayResponse);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadRecommendations();
      });

      expect(result.current.recommendations).toEqual(mockArrayResponse.data);
    });

    it('should handle array response for similar events', async () => {
      const mockArrayResponse = {
        success: true,
        data: [
          { id: 1, title: 'Similar Event 1' },
          { id: 2, title: 'Similar Event 2' }
        ]
      };

      eventService.getSimilarEvents.mockResolvedValue(mockArrayResponse);

      const { result } = renderHook(() => useEventAdvancedFeatures());

      await act(async () => {
        await result.current.loadSimilarEvents(123);
      });

      expect(result.current.similarEvents).toEqual(mockArrayResponse.data);
    });
  });
});
