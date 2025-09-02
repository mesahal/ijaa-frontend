import { renderHook, act, waitFor } from '@testing-library/react';
import { useEvents } from '../../../hooks/events/useEvents';
import eventService from '../../../services/eventService';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';

// Mock the dependencies
jest.mock('../../../services/eventService');
jest.mock('../../../context/UnifiedAuthContext');

describe('useEvents Hook - Phase 1: Core Event Management', () => {
  const mockUser = {
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    token: 'mock-token'
  };

  const mockEvents = [
    {
      id: 1,
      title: 'Alumni Meet 2024',
      description: 'Annual alumni gathering',
      startDate: '2024-12-25T18:00:00',
      endDate: '2024-12-25T22:00:00',
      location: 'Dhaka, Bangladesh',
      category: 'SOCIAL',
      status: 'ACTIVE',
      maxParticipants: 100,
      currentParticipants: 45,
      organizerId: 123,
      organizerName: 'John Doe',
      isPublic: true,
      requiresApproval: false
    },
    {
      id: 2,
      title: 'Workshop on AI',
      description: 'Learn about artificial intelligence',
      startDate: '2024-12-30T10:00:00',
      endDate: '2024-12-30T16:00:00',
      location: 'Dhaka, Bangladesh',
      category: 'EDUCATIONAL',
      status: 'ACTIVE',
      maxParticipants: 50,
      currentParticipants: 25,
      organizerId: 456,
      organizerName: 'Jane Smith',
      isPublic: true,
      requiresApproval: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the unified auth context
    useUnifiedAuth.mockReturnValue({
      user: mockUser,
      signIn: jest.fn(),
      signOut: jest.fn(),
      isAuthenticated: true
    });
  });

  describe('Phase 1: Core Event Management - Core Functionality', () => {
    it('should load all events by default', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getAllActiveEvents).toHaveBeenCalledWith(0, 10, 'startDate,asc');
      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.activeTab).toBe('all');
      expect(result.current.pagination).toEqual({
        page: 0,
        size: 10,
        totalElements: 2,
        totalPages: 1,
        first: true,
        last: true
      });
    });

    it('should load user events when activeTab is my-events', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: mockEvents.filter(e => e.organizerId === 123)
      };

      eventService.getMyEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      act(() => {
        result.current.handleTabChange('my-events');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getMyEvents).toHaveBeenCalled();
      expect(result.current.myEvents).toEqual(mockEvents.filter(e => e.organizerId === 123));
      expect(result.current.activeTab).toBe('my-events');
    });

    it('should load user active events when activeTab is my-active-events', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: mockEvents.filter(e => e.status === 'ACTIVE')
      };

      eventService.getMyActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      act(() => {
        result.current.handleTabChange('my-active-events');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getMyActiveEvents).toHaveBeenCalled();
      expect(result.current.myEvents).toEqual(mockEvents.filter(e => e.status === 'ACTIVE'));
      expect(result.current.activeTab).toBe('my-active-events');
    });

    it('should handle authentication errors', async () => {
      useUnifiedAuth.mockReturnValue({
        user: null,
        signIn: jest.fn(),
        signOut: jest.fn(),
        isAuthenticated: false
      });

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.events).toEqual([]);
      expect(result.current.myEvents).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch events');
      eventService.getAllActiveEvents.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch events');
    });

    it('should refresh events when refreshEvents is called', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Reset mock to verify it's called again
      eventService.getAllActiveEvents.mockClear();

      act(() => {
        result.current.refreshEvents();
      });

      await waitFor(() => {
        expect(eventService.getAllActiveEvents).toHaveBeenCalledWith(0, 10, 'startDate,asc');
      });
    });
  });

  describe('Phase 1: Core Event Management - Tab Navigation', () => {
    it('should handle tab changes correctly', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.handleTabChange('my-events');
      });

      expect(result.current.activeTab).toBe('my-events');
      // Should reset pagination when changing tabs
      expect(result.current.pagination).toEqual({
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: false
      });
    });

    it('should get current events based on active tab', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.getCurrentEvents()).toEqual(mockEvents);

      act(() => {
        result.current.handleTabChange('my-events');
      });

      expect(result.current.getCurrentEvents()).toEqual([]);
    });
  });

  describe('Phase 1: Core Event Management - Event Details', () => {
    it('should get event by ID successfully', async () => {
      const mockEvent = mockEvents[0];
      const mockResponse = {
        success: true,
        message: 'Event retrieved successfully',
        data: mockEvent
      };

      eventService.getEventById.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      const event = await result.current.getEventById(1);

      expect(eventService.getEventById).toHaveBeenCalledWith(1);
      expect(event).toEqual(mockEvent);
    });

    it('should handle errors when getting event by ID', async () => {
      const mockError = new Error('Event not found');
      eventService.getEventById.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEvents());

      await expect(result.current.getEventById(999)).rejects.toThrow('Event not found');
    });
  });

  describe('Phase 1: Core Event Management - State Management', () => {
    it('should manage loading state correctly', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      // Should start with loading true
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should manage error state correctly', async () => {
      const mockError = new Error('Failed to fetch events');
      eventService.getAllActiveEvents.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch events');
    });

    it('should clear error when loading new data', async () => {
      const mockError = new Error('Failed to fetch events');
      eventService.getAllActiveEvents.mockRejectedValueOnce(mockError);

      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValueOnce(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch events');

      act(() => {
        result.current.handleTabChange('my-events');
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('Phase 1: Core Event Management - Integration', () => {
    it('should integrate with event service correctly', async () => {
      const mockResponse = {
        success: true,
        message: 'Events retrieved successfully',
        data: {
          content: mockEvents,
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0,
          first: true,
          last: true
        }
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getAllActiveEvents).toHaveBeenCalledWith(0, 10, 'startDate,asc');
      expect(result.current.events).toEqual(mockEvents);
    });

    it('should handle different response codes', async () => {
      const mockResponse = {
        success: false,
        message: 'No events found',
        data: null
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // With the new graceful handling, no error is set for empty responses
      expect(result.current.error).toBeNull();
      expect(result.current.events).toEqual([]);
    });
  });
});
