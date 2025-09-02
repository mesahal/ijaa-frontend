import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventParticipation } from '../../../hooks/events/useEventParticipation';
import eventService from '../../../services/eventService';

// Mock the event service
jest.mock('../../../services/eventService');

// Mock the authentication context
jest.mock('../../../context/UnifiedAuthContext');

const mockUseUnifiedAuth = require('../../../context/UnifiedAuthContext').useUnifiedAuth;

describe('useEventParticipation Hook - Phase 3: Event Participation', () => {
  const mockUser = {
    token: 'mock-token',
    email: 'test@example.com'
  };

  beforeEach(() => {
    mockUseUnifiedAuth.mockReturnValue({ user: mockUser });
    jest.clearAllMocks();
  });

  describe('Load Participations', () => {
    it('should load participations successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Participations retrieved successfully',
        data: {
          content: [
            {
              id: 1,
              eventId: 1,
              eventTitle: 'Test Event 1',
              eventStartDate: '2024-12-20T19:00:00',
              eventLocation: 'Test Location',
              userId: 456,
              userName: 'Jane Smith',
              status: 'CONFIRMED',
              message: 'Looking forward to attending!',
              joinedAt: '2024-11-05T14:30:00',
              updatedAt: '2024-11-05T14:30:00'
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

      eventService.getMyParticipations.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      await waitFor(() => {
        expect(result.current.participations).toHaveLength(1);
        expect(result.current.participations[0].eventTitle).toBe('Test Event 1');
        expect(result.current.participations[0].status).toBe('CONFIRMED');
        expect(result.current.participationsLoading).toBe(false);
        expect(result.current.participationsError).toBeNull();
      });
    });

    it('should handle participations API error', async () => {
      const mockError = new Error('Failed to load participations');
      eventService.getMyParticipations.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      await waitFor(() => {
        expect(result.current.participations).toEqual([]);
        expect(result.current.participationsLoading).toBe(false);
        expect(result.current.participationsError).toBe('Failed to load participations');
      });
    });

    it('should not load participations when user is not authenticated', async () => {
      mockUseUnifiedAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      expect(result.current.participations).toEqual([]);
      expect(result.current.participationsLoading).toBe(false);
      expect(eventService.getMyParticipations).not.toHaveBeenCalled();
    });
  });

  describe('RSVP Operations', () => {
    it('should RSVP to event successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'RSVP submitted successfully',
        data: {
          id: 1,
          eventId: 1,
          userId: 456,
          userName: 'Jane Smith',
          status: 'CONFIRMED',
          message: 'Looking forward to attending!',
          joinedAt: '2024-11-05T14:30:00',
          updatedAt: '2024-11-05T14:30:00'
        }
      };

      eventService.rsvpToEvent.mockResolvedValue(mockResponse);
      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: [] }
      });

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        const response = await result.current.rsvpToEvent(1, 'CONFIRMED', 'Looking forward to attending!');
        expect(response).toEqual(mockResponse.data);
      });

      await waitFor(() => {
        expect(result.current.rsvpLoading).toBe(false);
        expect(result.current.rsvpError).toBeNull();
      });
    });

    it('should handle RSVP API error', async () => {
      const mockError = new Error('RSVP failed');
      eventService.rsvpToEvent.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        const response = await result.current.rsvpToEvent(1, 'CONFIRMED');
        expect(response).toBeNull();
      });

      await waitFor(() => {
        expect(result.current.rsvpLoading).toBe(false);
        expect(result.current.rsvpError).toBe('RSVP failed');
      });
    });

    it('should not RSVP when user is not authenticated', async () => {
      mockUseUnifiedAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        const response = await result.current.rsvpToEvent(1, 'CONFIRMED');
        expect(response).toBeNull();
      });

      expect(result.current.rsvpError).toBe('Authentication required');
      expect(eventService.rsvpToEvent).not.toHaveBeenCalled();
    });
  });

  describe('Update Participation', () => {
    it('should update participation successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Participation updated successfully',
        data: {
          id: 1,
          eventId: 1,
          userId: 456,
          userName: 'Jane Smith',
          status: 'MAYBE',
          message: 'I might be able to attend',
          joinedAt: '2024-11-05T14:30:00',
          updatedAt: '2024-11-05T15:00:00'
        }
      };

      eventService.updateParticipation.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventParticipation());

      // Set initial participations by calling loadMyParticipations first
      const initialParticipations = [{
        id: 1,
        eventId: 1,
        status: 'CONFIRMED',
        message: 'Original message'
      }];

      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: initialParticipations }
      });

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      // Reset the mock for updateParticipation
      eventService.updateParticipation.mockResolvedValue(mockResponse);

      await act(async () => {
        const response = await result.current.updateParticipation(1, 'MAYBE', 'I might be able to attend');
        expect(response).toEqual(mockResponse.data);
      });

      await waitFor(() => {
        expect(result.current.participations[0].status).toBe('MAYBE');
        expect(result.current.participations[0].message).toBe('I might be able to attend');
        expect(result.current.updateLoading).toBe(false);
        expect(result.current.updateError).toBeNull();
      });
    });

    it('should handle update API error', async () => {
      const mockError = new Error('Update failed');
      eventService.updateParticipation.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        const response = await result.current.updateParticipation(1, 'MAYBE');
        expect(response).toBeNull();
      });

      await waitFor(() => {
        expect(result.current.updateLoading).toBe(false);
        expect(result.current.updateError).toBe('Update failed');
      });
    });
  });

  describe('Convenience Methods', () => {
    it('should join event (CONFIRMED status)', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, status: 'CONFIRMED' }
      };

      eventService.rsvpToEvent.mockResolvedValue(mockResponse);
      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: [] }
      });

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.joinEvent(1, 'Excited to join!');
      });

      expect(eventService.rsvpToEvent).toHaveBeenCalledWith(1, 'CONFIRMED', 'Excited to join!');
    });

    it('should maybe attend event (MAYBE status)', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, status: 'MAYBE' }
      };

      eventService.rsvpToEvent.mockResolvedValue(mockResponse);
      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: [] }
      });

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.maybeAttendEvent(1, 'I might attend');
      });

      expect(eventService.rsvpToEvent).toHaveBeenCalledWith(1, 'MAYBE', 'I might attend');
    });

    it('should cancel RSVP (DECLINED status)', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1, status: 'DECLINED' }
      };

      eventService.rsvpToEvent.mockResolvedValue(mockResponse);
      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: [] }
      });

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.cancelRsvp(1, 'Cannot attend');
      });

      expect(eventService.rsvpToEvent).toHaveBeenCalledWith(1, 'DECLINED', 'Cannot attend');
    });
  });

  describe('Status Checking Methods', () => {
    it('should get participation status for specific event', async () => {
      const { result } = renderHook(() => useEventParticipation());

      const mockParticipations = [
        { eventId: 1, status: 'CONFIRMED' },
        { eventId: 2, status: 'MAYBE' }
      ];

      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: mockParticipations }
      });

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      expect(result.current.getParticipationStatus(1)).toBe('CONFIRMED');
      expect(result.current.getParticipationStatus(2)).toBe('MAYBE');
      expect(result.current.getParticipationStatus(3)).toBeNull();
    });

    it('should get participation for specific event', async () => {
      const { result } = renderHook(() => useEventParticipation());

      const mockParticipation = { eventId: 1, status: 'CONFIRMED' };

      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: [mockParticipation] }
      });

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      expect(result.current.getParticipation(1)).toEqual(mockParticipation);
      expect(result.current.getParticipation(2)).toBeNull();
    });

    it('should check if user is participating', async () => {
      const { result } = renderHook(() => useEventParticipation());

      const mockParticipations = [
        { eventId: 1, status: 'CONFIRMED' },
        { eventId: 2, status: 'MAYBE' }
      ];

      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: mockParticipations }
      });

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      expect(result.current.isParticipating(1)).toBe(true);
      expect(result.current.isParticipating(2)).toBe(false);
      expect(result.current.isParticipating(3)).toBe(false);
    });

    it('should check if user is maybe attending', async () => {
      const { result } = renderHook(() => useEventParticipation());

      const mockParticipations = [
        { eventId: 1, status: 'CONFIRMED' },
        { eventId: 2, status: 'MAYBE' }
      ];

      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: mockParticipations }
      });

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      expect(result.current.isMaybeAttending(1)).toBe(false);
      expect(result.current.isMaybeAttending(2)).toBe(true);
      expect(result.current.isMaybeAttending(3)).toBe(false);
    });

    it('should check if user has declined', async () => {
      const { result } = renderHook(() => useEventParticipation());

      const mockParticipations = [
        { eventId: 1, status: 'CONFIRMED' },
        { eventId: 2, status: 'DECLINED' }
      ];

      eventService.getMyParticipations.mockResolvedValue({
        success: true,
        data: { content: mockParticipations }
      });

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      expect(result.current.isParticipating(1)).toBe(true);
      expect(result.current.hasDeclined(2)).toBe(true);
      expect(result.current.hasDeclined(3)).toBe(false);
    });
  });

  describe('Pagination', () => {
    it('should handle pagination for participations', async () => {
      const mockResponse = {
        success: true,
        data: {
          content: [{ id: 1, eventId: 1, status: 'CONFIRMED' }],
          totalElements: 25,
          totalPages: 3,
          size: 10,
          number: 1,
          first: false,
          last: false
        }
      };

      eventService.getMyParticipations.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventParticipation());

      await act(async () => {
        await result.current.loadMyParticipations(null, 1, 10);
      });

      await waitFor(() => {
        expect(result.current.participationsPagination.page).toBe(1);
        expect(result.current.participationsPagination.totalElements).toBe(25);
        expect(result.current.participationsPagination.totalPages).toBe(3);
        expect(result.current.participationsPagination.first).toBe(false);
        expect(result.current.participationsPagination.last).toBe(false);
      });
    });
  });

  describe('Error Clearing', () => {
    it('should clear RSVP error', async () => {
      const { result } = renderHook(() => useEventParticipation());

      // Trigger an RSVP error first
      const mockError = new Error('RSVP failed');
      eventService.rsvpToEvent.mockRejectedValue(mockError);

      await act(async () => {
        await result.current.rsvpToEvent(1, 'CONFIRMED');
      });

      // Verify error is set
      expect(result.current.rsvpError).toBe('RSVP failed');

      // Clear the error
      act(() => {
        result.current.clearRsvpError();
      });

      expect(result.current.rsvpError).toBeNull();
    });

    it('should clear update error', async () => {
      const { result } = renderHook(() => useEventParticipation());

      // Trigger an update error first
      const mockError = new Error('Update failed');
      eventService.updateParticipation.mockRejectedValue(mockError);

      await act(async () => {
        await result.current.updateParticipation(1, 'MAYBE');
      });

      // Verify error is set
      expect(result.current.updateError).toBe('Update failed');

      // Clear the error
      act(() => {
        result.current.clearUpdateError();
      });

      expect(result.current.updateError).toBeNull();
    });

    it('should clear participations error', async () => {
      const { result } = renderHook(() => useEventParticipation());

      // Trigger a participations error first
      const mockError = new Error('Failed to load participations');
      eventService.getMyParticipations.mockRejectedValue(mockError);

      await act(async () => {
        await result.current.loadMyParticipations();
      });

      // Verify error is set
      expect(result.current.participationsError).toBe('Failed to load participations');

      // Clear the error
      act(() => {
        result.current.clearParticipationsError();
      });

      expect(result.current.participationsError).toBeNull();
    });
  });
});
