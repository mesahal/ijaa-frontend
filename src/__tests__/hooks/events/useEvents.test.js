import { renderHook, act, waitFor } from '@testing-library/react';
import { useEvents } from '../../../hooks/events/useEvents';
import eventService from '../../../services/eventService';
import { useAuth } from '../../../context/AuthContext';

// Mock the dependencies
jest.mock('../../../services/eventService');
jest.mock('../../../context/AuthContext');

describe('useEvents Hook - Group 1: Basic Event Management', () => {
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
      location: 'IIT Campus',
      eventType: 'NETWORKING',
      active: true,
      isOnline: false,
      meetingLink: null,
      maxParticipants: 100,
      currentParticipants: 0,
      organizerName: 'John Doe',
      organizerEmail: 'john@example.com',
      createdByUsername: 'john.doe',
      privacy: 'PUBLIC',
      inviteMessage: 'Join our annual alumni meet!',
      createdAt: '2024-12-01T10:00:00',
      updatedAt: '2024-12-01T10:00:00'
    },
    {
      id: 2,
      title: 'Workshop on AI',
      description: 'Learn about artificial intelligence',
      startDate: '2024-12-30T10:00:00',
      endDate: '2024-12-30T16:00:00',
      location: 'Online',
      eventType: 'WORKSHOP',
      active: true,
      isOnline: true,
      meetingLink: 'https://meet.google.com/abc123',
      maxParticipants: 50,
      currentParticipants: 25,
      organizerName: 'Jane Smith',
      organizerEmail: 'jane@example.com',
      createdByUsername: 'jane.smith',
      privacy: 'PUBLIC',
      inviteMessage: 'Join our AI workshop!',
      createdAt: '2024-12-01T10:00:00',
      updatedAt: '2024-12-01T10:00:00'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the auth context
    useAuth.mockReturnValue({
      user: mockUser,
      signIn: jest.fn(),
      signOut: jest.fn()
    });
  });

  describe('Group 1: Basic Event Management - Core Functionality', () => {
    it('should load all events by default', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getAllActiveEvents).toHaveBeenCalled();
      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.activeTab).toBe('all');
    });

    it('should load user events when activeTab is my-events', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents.filter(e => e.createdByUsername === 'testuser')
      };

      eventService.getMyEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      // Change tab to my-events
      act(() => {
        result.current.handleTabChange('my-events');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getMyEvents).toHaveBeenCalled();
      expect(result.current.myEvents).toEqual(mockEvents.filter(e => e.createdByUsername === 'testuser'));
    });

    it('should load user active events when activeTab is my-active-events', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents.filter(e => e.createdByUsername === 'testuser' && e.active)
      };

      eventService.getMyActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      // Change tab to my-active-events
      act(() => {
        result.current.handleTabChange('my-active-events');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getMyActiveEvents).toHaveBeenCalled();
      expect(result.current.myEvents).toEqual(mockEvents.filter(e => e.createdByUsername === 'testuser' && e.active));
    });

    it('should handle authentication errors', async () => {
      useAuth.mockReturnValue({
        user: null,
        signIn: jest.fn(),
        signOut: jest.fn()
      });

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.error).toBe('Authentication required');
      });
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch events');
      eventService.getAllActiveEvents.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Failed to fetch events');
      });
    });

    it('should refresh events when refreshEvents is called', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Clear the mock to verify it's called again
      eventService.getAllActiveEvents.mockClear();

      act(() => {
        result.current.refreshEvents();
      });

      await waitFor(() => {
        expect(eventService.getAllActiveEvents).toHaveBeenCalled();
      });
    });
  });

  describe('Group 1: Basic Event Management - Tab Navigation', () => {
    it('should handle tab changes correctly', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Test tab change to my-events
      act(() => {
        result.current.handleTabChange('my-events');
      });

      expect(result.current.activeTab).toBe('my-events');

      // Test tab change to my-active-events
      act(() => {
        result.current.handleTabChange('my-active-events');
      });

      expect(result.current.activeTab).toBe('my-active-events');

      // Test tab change back to all
      act(() => {
        result.current.handleTabChange('all');
      });

      expect(result.current.activeTab).toBe('all');
    });

    it('should get current events based on active tab', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const currentEvents = result.current.getCurrentEvents();
      expect(currentEvents).toEqual(mockEvents);
    });
  });

  describe('Group 1: Basic Event Management - Event Details', () => {
    it('should get event by ID successfully', async () => {
      const mockEvent = mockEvents[0];
      const mockResponse = {
        code: '200',
        data: mockEvent
      };

      eventService.getEventById.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const event = await result.current.getEventById(1);
      expect(event).toEqual(mockEvent);
      expect(eventService.getEventById).toHaveBeenCalledWith(1);
    });

    it('should handle errors when getting event by ID', async () => {
      const mockError = new Error('Event not found');
      eventService.getEventById.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.getEventById(999)).rejects.toThrow('Event not found');
    });
  });

  describe('Group 1: Basic Event Management - State Management', () => {
    it('should manage loading state correctly', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      // Should be loading initially
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should manage error state correctly', async () => {
      const mockError = new Error('Network error');
      eventService.getAllActiveEvents.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should clear error when loading new data', async () => {
      const mockError = new Error('Network error');
      eventService.getAllActiveEvents.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // Mock successful response for next call
      const mockResponse = {
        code: '200',
        data: mockEvents
      };
      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      act(() => {
        result.current.refreshEvents();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('Group 1: Basic Event Management - Integration', () => {
    it('should integrate with event service correctly', async () => {
      const mockResponse = {
        code: '200',
        data: mockEvents
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(eventService.getAllActiveEvents).toHaveBeenCalled();
      expect(result.current.events).toEqual(mockEvents);
    });

    it('should handle different response codes', async () => {
      const mockResponse = {
        code: '404',
        message: 'Events not found'
      };

      eventService.getAllActiveEvents.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEvents());

      await waitFor(() => {
        expect(result.current.error).toBe('Events not found');
      });
    });
  });
});
