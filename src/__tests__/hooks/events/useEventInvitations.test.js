import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventInvitations } from '../../../hooks/events/useEventInvitations';
import { useAuth } from '../../../context/AuthContext';
import eventService from '../../../services/eventService';

// Mock dependencies
jest.mock('../../../context/AuthContext');
jest.mock('../../../services/eventService');

describe('useEventInvitations', () => {
  const mockUser = {
    id: 'user-123',
    username: 'testuser',
    token: 'mock-jwt-token'
  };

  const mockParticipation = {
    id: 'participation-123',
    eventId: 'event-123',
    userId: 'user-123',
    status: 'CONFIRMED',
    message: 'Looking forward to it!',
    registeredAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    user: {
      id: 'user-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      profilePicture: 'profile.jpg'
    }
  };

  const mockInvitation = {
    id: 'invitation-123',
    eventId: 'event-123',
    eventTitle: 'Test Event',
    eventDescription: 'Test event description',
    eventStartDate: '2024-01-01T18:00:00Z',
    eventEndDate: '2024-01-01T22:00:00Z',
    eventLocation: 'Test Location',
    eventType: 'NETWORKING',
    inviteeEmail: 'test@example.com',
    inviteeUsername: 'testuser',
    personalMessage: 'You are invited!',
    status: 'SENT',
    sentAt: '2024-01-01T00:00:00Z',
    isRead: false,
    isResponded: false,
    invitedByUsername: 'organizer',
    invitedByEmail: 'organizer@example.com'
  };

  const mockUnreadInvitation = {
    ...mockInvitation,
    id: 'unread-invitation-123',
    isRead: false
  };

  const mockUnrespondedInvitation = {
    ...mockInvitation,
    id: 'unresponded-invitation-123',
    isResponded: false
  };

  const mockInvitationCounts = {
    totalCount: 5,
    unreadCount: 2,
    unrespondedCount: 3,
    acceptedCount: 1,
    declinedCount: 1
  };

  const mockParticipants = [
    {
      id: 'user-123',
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      status: 'CONFIRMED',
      registeredAt: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useEventInvitations());

      expect(result.current.myParticipations).toEqual([]);
      expect(result.current.myInvitations).toEqual([]);
      expect(result.current.unreadInvitations).toEqual([]);
      expect(result.current.unrespondedInvitations).toEqual([]);
      expect(result.current.invitationCounts).toEqual({
        totalCount: 0,
        unreadCount: 0,
        unrespondedCount: 0,
        acceptedCount: 0,
        declinedCount: 0
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasUnreadInvitations).toBe(false);
      expect(result.current.hasUnrespondedInvitations).toBe(false);
      expect(result.current.totalInvitations).toBe(0);
    });

    it('should load user data on mount', async () => {
      eventService.getMyParticipations.mockResolvedValue({
        code: '200',
        data: [mockParticipation]
      });
      eventService.getMyInvitations.mockResolvedValue({
        code: '200',
        data: [mockInvitation]
      });
      eventService.getInvitationCounts.mockResolvedValue({
        code: '200',
        data: mockInvitationCounts
      });
      eventService.getUnreadInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnreadInvitation]
      });
      eventService.getUnrespondedInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnrespondedInvitation]
      });

      const { result } = renderHook(() => useEventInvitations());

      await waitFor(() => {
        expect(result.current.myParticipations).toHaveLength(1);
        expect(result.current.myInvitations).toHaveLength(1);
        expect(result.current.unreadInvitations).toHaveLength(1);
        expect(result.current.unrespondedInvitations).toHaveLength(1);
        expect(result.current.invitationCounts).toEqual(mockInvitationCounts);
      });

      expect(eventService.getMyParticipations).toHaveBeenCalled();
      expect(eventService.getMyInvitations).toHaveBeenCalled();
      expect(eventService.getInvitationCounts).toHaveBeenCalled();
      expect(eventService.getUnreadInvitations).toHaveBeenCalled();
      expect(eventService.getUnrespondedInvitations).toHaveBeenCalled();
    });
  });

  describe('loadUserData', () => {
    it('should load user data successfully', async () => {
      eventService.getMyParticipations.mockResolvedValue({
        code: '200',
        data: [mockParticipation]
      });
      eventService.getMyInvitations.mockResolvedValue({
        code: '200',
        data: [mockInvitation]
      });
      eventService.getInvitationCounts.mockResolvedValue({
        code: '200',
        data: mockInvitationCounts
      });
      eventService.getUnreadInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnreadInvitation]
      });
      eventService.getUnrespondedInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnrespondedInvitation]
      });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        await result.current.loadUserData();
      });

      expect(result.current.myParticipations).toHaveLength(1);
      expect(result.current.myInvitations).toHaveLength(1);
      expect(result.current.unreadInvitations).toHaveLength(1);
      expect(result.current.unrespondedInvitations).toHaveLength(1);
      expect(result.current.invitationCounts).toEqual(mockInvitationCounts);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading error', async () => {
      const errorMessage = 'Failed to load user data';
      eventService.getMyParticipations.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        await result.current.loadUserData();
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });

    it('should not load data without user token', async () => {
      useAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        await result.current.loadUserData();
      });

      expect(eventService.getMyParticipations).not.toHaveBeenCalled();
      expect(eventService.getMyInvitations).not.toHaveBeenCalled();
      expect(eventService.getInvitationCounts).not.toHaveBeenCalled();
    });
  });

  describe('sendInvitations', () => {
    it('should send invitations successfully', async () => {
      eventService.sendInvitations.mockResolvedValue({
        code: '200',
        data: { message: 'Invitations sent successfully' }
      });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.sendInvitations(
          'event-123',
          'user1@example.com, user2@example.com',
          'You are invited!'
        );
        expect(response.success).toBe(true);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle empty usernames', async () => {
      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.sendInvitations(
          'event-123',
          '',
          'You are invited!'
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe('Please enter at least one username');
      });
    });

    it('should handle send invitations error', async () => {
      const errorMessage = 'Failed to send invitations';
      eventService.sendInvitations.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.sendInvitations(
          'event-123',
          'user@example.com',
          'You are invited!'
        );
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation successfully', async () => {
      eventService.acceptInvitation.mockResolvedValue({
        code: '200',
        data: { message: 'Invitation accepted' }
      });
      eventService.getMyParticipations.mockResolvedValue({
        code: '200',
        data: [mockParticipation]
      });
      eventService.getMyInvitations.mockResolvedValue({
        code: '200',
        data: [mockInvitation]
      });
      eventService.getInvitationCounts.mockResolvedValue({
        code: '200',
        data: mockInvitationCounts
      });
      eventService.getUnreadInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnreadInvitation]
      });
      eventService.getUnrespondedInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnrespondedInvitation]
      });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.acceptInvitation('event-123');
        expect(response.success).toBe(true);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle accept invitation error', async () => {
      const errorMessage = 'Failed to accept invitation';
      eventService.acceptInvitation.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.acceptInvitation('event-123');
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('declineInvitation', () => {
    it('should decline invitation successfully', async () => {
      eventService.declineInvitation.mockResolvedValue({
        code: '200',
        data: { message: 'Invitation declined' }
      });
      eventService.getMyParticipations.mockResolvedValue({
        code: '200',
        data: [mockParticipation]
      });
      eventService.getMyInvitations.mockResolvedValue({
        code: '200',
        data: [mockInvitation]
      });
      eventService.getInvitationCounts.mockResolvedValue({
        code: '200',
        data: mockInvitationCounts
      });
      eventService.getUnreadInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnreadInvitation]
      });
      eventService.getUnrespondedInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnrespondedInvitation]
      });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.declineInvitation('event-123');
        expect(response.success).toBe(true);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle decline invitation error', async () => {
      const errorMessage = 'Failed to decline invitation';
      eventService.declineInvitation.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.declineInvitation('event-123');
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('markInvitationAsRead', () => {
    it('should mark invitation as read successfully', async () => {
      eventService.markInvitationAsRead.mockResolvedValue({
        code: '200',
        data: { message: 'Invitation marked as read' }
      });
      eventService.getMyParticipations.mockResolvedValue({
        code: '200',
        data: [mockParticipation]
      });
      eventService.getMyInvitations.mockResolvedValue({
        code: '200',
        data: [mockInvitation]
      });
      eventService.getInvitationCounts.mockResolvedValue({
        code: '200',
        data: mockInvitationCounts
      });
      eventService.getUnreadInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnreadInvitation]
      });
      eventService.getUnrespondedInvitations.mockResolvedValue({
        code: '200',
        data: [mockUnrespondedInvitation]
      });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.markInvitationAsRead('event-123');
        expect(response.success).toBe(true);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle mark invitation as read error', async () => {
      const errorMessage = 'Failed to mark invitation as read';
      eventService.markInvitationAsRead.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.markInvitationAsRead('event-123');
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('getMyParticipationStatus', () => {
    it('should return participation status for event', () => {
      const { result } = renderHook(() => useEventInvitations());

      // Set up participations
      act(() => {
        result.current.myParticipations = [mockParticipation];
      });

      const status = result.current.getMyParticipationStatus('event-123');
      expect(status).toBe('CONFIRMED');
    });

    it('should return null for non-existent participation', () => {
      const { result } = renderHook(() => useEventInvitations());

      const status = result.current.getMyParticipationStatus('non-existent-event');
      expect(status).toBeNull();
    });
  });

  describe('getMyInvitationStatus', () => {
    it('should return invitation status for event', () => {
      const { result } = renderHook(() => useEventInvitations());

      // Set up invitations
      act(() => {
        result.current.myInvitations = [mockInvitation];
      });

      const status = result.current.getMyInvitationStatus('event-123');
      expect(status).toEqual({
        isInvited: true,
        isRead: false,
        isResponded: false
      });
    });

    it('should return null for non-existent invitation', () => {
      const { result } = renderHook(() => useEventInvitations());

      const status = result.current.getMyInvitationStatus('non-existent-event');
      expect(status).toBeNull();
    });
  });

  describe('getEventParticipants', () => {
    it('should get event participants successfully', async () => {
      eventService.getEventParticipants.mockResolvedValue({
        code: '200',
        data: mockParticipants
      });

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.getEventParticipants('event-123');
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockParticipants);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle get event participants error', async () => {
      const errorMessage = 'Failed to load participants';
      eventService.getEventParticipants.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useEventInvitations());

      await act(async () => {
        const response = await result.current.getEventParticipants('event-123');
        expect(response.success).toBe(false);
        expect(response.error).toBe(errorMessage);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useEventInvitations());

      // Set error first
      act(() => {
        result.current.error = 'Some error';
      });

      expect(result.current.error).toBe('Some error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('computed properties', () => {
    it('should compute hasUnreadInvitations correctly', () => {
      const { result } = renderHook(() => useEventInvitations());

      // Test with unread invitations
      act(() => {
        result.current.invitationCounts = { ...mockInvitationCounts, unreadCount: 2 };
      });

      expect(result.current.hasUnreadInvitations).toBe(true);

      // Test without unread invitations
      act(() => {
        result.current.invitationCounts = { ...mockInvitationCounts, unreadCount: 0 };
      });

      expect(result.current.hasUnreadInvitations).toBe(false);
    });

    it('should compute hasUnrespondedInvitations correctly', () => {
      const { result } = renderHook(() => useEventInvitations());

      // Test with unresponded invitations
      act(() => {
        result.current.invitationCounts = { ...mockInvitationCounts, unrespondedCount: 3 };
      });

      expect(result.current.hasUnrespondedInvitations).toBe(true);

      // Test without unresponded invitations
      act(() => {
        result.current.invitationCounts = { ...mockInvitationCounts, unrespondedCount: 0 };
      });

      expect(result.current.hasUnrespondedInvitations).toBe(false);
    });

    it('should compute totalInvitations correctly', () => {
      const { result } = renderHook(() => useEventInvitations());

      act(() => {
        result.current.invitationCounts = mockInvitationCounts;
      });

      expect(result.current.totalInvitations).toBe(5);
    });
  });
});
