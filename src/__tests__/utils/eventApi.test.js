import { eventApi, PARTICIPATION_STATUS, EVENT_PRIVACY } from '../../utils/eventApi';

// Mock the apiClient
jest.mock('../../utils/apiClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Event API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Constants', () => {
    test('should have correct participation status constants', () => {
      expect(PARTICIPATION_STATUS.GOING).toBe('GOING');
      expect(PARTICIPATION_STATUS.MAYBE).toBe('MAYBE');
      expect(PARTICIPATION_STATUS.NOT_GOING).toBe('NOT_GOING');
      expect(PARTICIPATION_STATUS.PENDING).toBe('PENDING');
    });

    test('should have correct event privacy constants', () => {
      expect(EVENT_PRIVACY.PUBLIC).toBe('PUBLIC');
      expect(EVENT_PRIVACY.PRIVATE).toBe('PRIVATE');
      expect(EVENT_PRIVACY.INVITE_ONLY).toBe('INVITE_ONLY');
    });
  });

  describe('API Methods', () => {
    test('should have all required API methods', () => {
      expect(typeof eventApi.rsvpToEvent).toBe('function');
      expect(typeof eventApi.updateRsvpStatus).toBe('function');
      expect(typeof eventApi.cancelRsvp).toBe('function');
      expect(typeof eventApi.getMyParticipation).toBe('function');
      expect(typeof eventApi.getEventParticipants).toBe('function');
      expect(typeof eventApi.getMyParticipations).toBe('function');
      expect(typeof eventApi.sendInvitations).toBe('function');
      expect(typeof eventApi.acceptInvitation).toBe('function');
      expect(typeof eventApi.declineInvitation).toBe('function');
      expect(typeof eventApi.markInvitationAsRead).toBe('function');
      expect(typeof eventApi.getMyInvitations).toBe('function');
      expect(typeof eventApi.getInvitationCounts).toBe('function');
      expect(typeof eventApi.getSentInvitations).toBe('function');
      expect(typeof eventApi.searchEventsGet).toBe('function');
      expect(typeof eventApi.searchEventsPost).toBe('function');
      expect(typeof eventApi.createEvent).toBe('function');
      expect(typeof eventApi.updateEvent).toBe('function');
      expect(typeof eventApi.deleteEvent).toBe('function');
      expect(typeof eventApi.getAllEvents).toBe('function');
      expect(typeof eventApi.getMyEvents).toBe('function');
      expect(typeof eventApi.getEventById).toBe('function');
    });
  });

  describe('Helper Functions', () => {
    test('formatDateForAPI should format dates correctly', () => {
      const { formatDateForAPI } = require('../../utils/eventApi');
      const date = new Date('2024-12-01T10:30:00Z');
      const formatted = formatDateForAPI(date);
      expect(formatted).toBe('2024-12-01T10:30:00.000Z');
    });

    test('canUserJoinEvent should work correctly', () => {
      const { canUserJoinEvent } = require('../../utils/eventApi');
      const user = { username: 'testuser' };
      
      // Public event
      const publicEvent = { privacy: 'PUBLIC' };
      expect(canUserJoinEvent(publicEvent, user)).toBe(true);
      
      // Private event - user is creator
      const privateEvent = { privacy: 'PRIVATE', createdByUsername: 'testuser' };
      expect(canUserJoinEvent(privateEvent, user)).toBe(true);
      
      // Private event - user is not creator
      const privateEventNotCreator = { privacy: 'PRIVATE', createdByUsername: 'otheruser' };
      expect(canUserJoinEvent(privateEventNotCreator, user)).toBe(false);
      
      // Invite only event
      const inviteOnlyEvent = { privacy: 'INVITE_ONLY' };
      expect(canUserJoinEvent(inviteOnlyEvent, user)).toBe(true);
    });
  });
}); 