import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventActions } from '../../../hooks/events/useEventActions';
import eventService from '../../../services/eventService';

// Mock the dependencies
jest.mock('../../../services/eventService');

describe('useEventActions Hook - Group 2: Event Creation and Management', () => {
  const mockRefreshEvents = jest.fn();

  const validEventForm = {
    title: 'Alumni Meet 2024',
    description: 'Annual alumni gathering and networking event',
    startDate: '2024-12-25T18:00:00',
    endDate: '2024-12-25T22:00:00',
    location: 'IIT Campus, Main Auditorium',
    eventType: 'MEETING',
    isOnline: false,
    meetingLink: null,
    maxParticipants: 100,
    organizerName: 'John Doe',
    organizerEmail: 'john.doe@example.com',
    privacy: 'PUBLIC',
    inviteMessage: 'Join us for the annual alumni meet!'
  };

  const mockEvent = {
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRefreshEvents.mockClear();
  });

  describe('Group 2.1: Create Event', () => {
    it('should create event successfully with valid data', async () => {
      const mockResponse = {
        code: '201',
        data: {
          id: 1,
          ...validEventForm,
          createdAt: '2024-12-01T10:00:00',
          updatedAt: '2024-12-01T10:00:00'
        }
      };

      eventService.createEvent.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let createResult;
      await act(async () => {
        createResult = await result.current.handleCreateEvent(validEventForm);
      });

      expect(eventService.createEvent).toHaveBeenCalledWith({
        title: 'Alumni Meet 2024',
        description: 'Annual alumni gathering and networking event',
        startDate: '2024-12-25T18:00:00',
        endDate: '2024-12-25T22:00:00',
        location: 'IIT Campus, Main Auditorium',
        eventType: 'MEETING',
        isOnline: false,
        meetingLink: null,
        maxParticipants: 100,
        organizerName: 'John Doe',
        organizerEmail: 'john.doe@example.com',
        privacy: 'PUBLIC',
        inviteMessage: 'Join us for the annual alumni meet!'
      });
      expect(mockRefreshEvents).toHaveBeenCalled();
      expect(createResult).toEqual({ success: true, data: mockResponse.data });
    });

    it('should create online event successfully with meeting link', async () => {
      const onlineEventForm = {
        ...validEventForm,
        isOnline: true,
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      };

      const mockResponse = {
        code: '201',
        data: {
          id: 1,
          ...onlineEventForm,
          createdAt: '2024-12-01T10:00:00',
          updatedAt: '2024-12-01T10:00:00'
        }
      };

      eventService.createEvent.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let createResult;
      await act(async () => {
        createResult = await result.current.handleCreateEvent(onlineEventForm);
      });

      expect(eventService.createEvent).toHaveBeenCalledWith(onlineEventForm);
      expect(mockRefreshEvents).toHaveBeenCalled();
      expect(createResult).toEqual({ success: true, data: mockResponse.data });
    });

    it('should handle missing required fields', async () => {
      const incompleteEventForm = {
        title: 'Alumni Meet 2024',
        description: 'Annual alumni gathering'
        // Missing required fields: startDate, endDate, organizerName, organizerEmail
      };

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let createResult;
      await act(async () => {
        createResult = await result.current.handleCreateEvent(incompleteEventForm);
      });

      expect(eventService.createEvent).not.toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(createResult).toEqual({
        success: false,
        error: 'Please fill in all required fields: title, start date, end date, organizer name, and organizer email'
      });
    });

    it('should handle invalid date range', async () => {
      const invalidDateEventForm = {
        ...validEventForm,
        startDate: '2024-12-25T22:00:00',
        endDate: '2024-12-25T18:00:00'
      };

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let createResult;
      await act(async () => {
        createResult = await result.current.handleCreateEvent(invalidDateEventForm);
      });

      expect(eventService.createEvent).not.toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(createResult).toEqual({
        success: false,
        error: 'Start date must be before end date'
      });
    });

    it('should handle online event without meeting link', async () => {
      const onlineEventWithoutLink = {
        ...validEventForm,
        isOnline: true,
        meetingLink: null
      };

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let createResult;
      await act(async () => {
        createResult = await result.current.handleCreateEvent(onlineEventWithoutLink);
      });

      expect(eventService.createEvent).not.toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(createResult).toEqual({
        success: false,
        error: 'Meeting link is required for online events'
      });
    });

    it('should handle API errors when creating event', async () => {
      const mockError = new Error('Failed to create event');
      eventService.createEvent.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let createResult;
      await act(async () => {
        createResult = await result.current.handleCreateEvent(validEventForm);
      });

      expect(eventService.createEvent).toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(createResult).toEqual({
        success: false,
        error: 'Failed to create event'
      });
    });
  });

  describe('Group 2.2: Update Event', () => {
    it('should update event successfully with valid data', async () => {
      const updateEventForm = {
        ...validEventForm,
        title: 'Updated Alumni Meet 2024',
        description: 'Updated annual alumni gathering'
      };

      const mockResponse = {
        code: '200',
        data: {
          id: 1,
          ...updateEventForm,
          updatedAt: '2024-12-02T10:00:00'
        }
      };

      eventService.updateEvent.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let updateResult;
      await act(async () => {
        updateResult = await result.current.handleCreateEvent(updateEventForm, mockEvent);
      });

      expect(eventService.updateEvent).toHaveBeenCalledWith(1, updateEventForm);
      expect(mockRefreshEvents).toHaveBeenCalled();
      expect(updateResult).toEqual({ success: true, data: mockResponse.data });
    });

    it('should handle missing required fields during update', async () => {
      const incompleteUpdateForm = {
        title: 'Updated Alumni Meet 2024'
        // Missing required fields: startDate, endDate, organizerName, organizerEmail
      };

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let updateResult;
      await act(async () => {
        updateResult = await result.current.handleCreateEvent(incompleteUpdateForm, mockEvent);
      });

      expect(eventService.updateEvent).not.toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(updateResult).toEqual({
        success: false,
        error: 'Please fill in all required fields: title, start date, end date, organizer name, and organizer email'
      });
    });

    it('should handle API errors when updating event', async () => {
      const mockError = new Error('Failed to update event');
      eventService.updateEvent.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let updateResult;
      await act(async () => {
        updateResult = await result.current.handleCreateEvent(validEventForm, mockEvent);
      });

      expect(eventService.updateEvent).toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(updateResult).toEqual({
        success: false,
        error: 'Failed to update event'
      });
    });
  });

  describe('Group 2.3: Delete Event', () => {
    beforeEach(() => {
      // Mock window.confirm to return true
      global.window.confirm = jest.fn(() => true);
    });

    it('should delete event successfully', async () => {
      const mockResponse = {
        code: '200',
        data: null
      };

      eventService.deleteEvent.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.handleDeleteEvent(1);
      });

      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this event? This action cannot be undone.');
      expect(eventService.deleteEvent).toHaveBeenCalledWith(1);
      expect(mockRefreshEvents).toHaveBeenCalled();
      expect(deleteResult).toEqual({ success: true });
    });

    it('should handle missing event ID', async () => {
      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.handleDeleteEvent();
      });

      expect(eventService.deleteEvent).not.toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(deleteResult).toEqual({
        success: false,
        error: 'Event ID is required'
      });
    });

    it('should handle user cancellation', async () => {
      // Mock window.confirm to return false
      global.window.confirm = jest.fn(() => false);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.handleDeleteEvent(1);
      });

      expect(window.confirm).toHaveBeenCalled();
      expect(eventService.deleteEvent).not.toHaveBeenCalled();
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(deleteResult).toEqual({
        success: false,
        error: 'Cancelled by user'
      });
    });

    it('should handle API errors when deleting event', async () => {
      const mockError = new Error('Failed to delete event');
      eventService.deleteEvent.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      let deleteResult;
      await act(async () => {
        deleteResult = await result.current.handleDeleteEvent(1);
      });

      expect(eventService.deleteEvent).toHaveBeenCalledWith(1);
      expect(mockRefreshEvents).not.toHaveBeenCalled();
      expect(deleteResult).toEqual({
        success: false,
        error: 'Failed to delete event'
      });
    });
  });

  describe('Error Handling and Loading States', () => {
    it('should set loading state during operations', async () => {
      const mockResponse = {
        code: '201',
        data: { id: 1, ...validEventForm }
      };

      eventService.createEvent.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      expect(result.current.loading).toBe(false);

      let createPromise;
      act(() => {
        createPromise = result.current.handleCreateEvent(validEventForm);
      });

      expect(result.current.loading).toBe(true);

      await act(async () => {
        await createPromise;
      });

      expect(result.current.loading).toBe(false);
    });

    it('should clear error when clearError is called', async () => {
      const mockError = new Error('Test error');
      eventService.createEvent.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventActions(mockRefreshEvents));

      await act(async () => {
        await result.current.handleCreateEvent(validEventForm);
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});
