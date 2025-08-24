import { eventApi, PARTICIPATION_STATUS, EVENT_PRIVACY, EVENT_TYPES, formatDateForAPI, canUserJoinEvent } from '../../utils/eventApi';
import apiClient from '../../utils/apiClient';

// Mock the apiClient
jest.mock('../../utils/apiClient');

describe('eventApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test event description',
        eventDate: '2024-12-25T18:00:00',
        endDate: '2024-12-25T22:00:00',
        location: 'Test Location',
        eventType: EVENT_TYPES.NETWORKING,
        privacy: EVENT_PRIVACY.PUBLIC,
        maxParticipants: 100,
        registrationDeadline: '2024-12-20T23:59:59',
        tags: ['test', 'event'],
        isRecurring: false,
        recurringPattern: null,
        templateId: null
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Event created successfully',
          data: {
            id: 'event_123456789',
            ...eventData,
            currentParticipants: 0,
            createdBy: 'user_123456789',
            createdAt: '2024-12-01T10:00:00',
            updatedAt: '2024-12-01T10:00:00'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventApi.createEvent(eventData);

      expect(apiClient.post).toHaveBeenCalledWith('/events/create', eventData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle errors when creating event', async () => {
      const error = new Error('Validation failed');
      apiClient.post.mockRejectedValue(error);

      await expect(eventApi.createEvent({})).rejects.toThrow('Validation failed');
    });
  });

  describe('getAllEvents', () => {
    it('should get all events with pagination', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Events retrieved successfully',
          data: {
            content: [
              {
                id: 'event_123456789',
                title: 'Test Event',
                description: 'Test event description',
                eventDate: '2024-12-25T18:00:00',
                endDate: '2024-12-25T22:00:00',
                location: 'Test Location',
                eventType: EVENT_TYPES.NETWORKING,
                privacy: EVENT_PRIVACY.PUBLIC,
                maxParticipants: 100,
                currentParticipants: 25,
                registrationDeadline: '2024-12-20T23:59:59',
                tags: ['test', 'event'],
                isRecurring: false,
                createdBy: 'user_123456789',
                createdAt: '2024-12-01T10:00:00',
                updatedAt: '2024-12-01T10:00:00'
              }
            ],
            pageable: {
              pageNumber: 0,
              pageSize: 10,
              sort: {
                sorted: true,
                unsorted: false
              }
            },
            totalElements: 1,
            totalPages: 1,
            last: true,
            first: true,
            numberOfElements: 1
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await eventApi.getAllEvents(0, 10, 'eventDate,desc');

      expect(apiClient.get).toHaveBeenCalledWith('/events?page=0&size=10&sort=eventDate,desc');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getEventById', () => {
    it('should get event by ID with full details', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Event details retrieved successfully',
          data: {
            id: 'event_123456789',
            title: 'Test Event',
            description: 'Test event description',
            eventDate: '2024-12-25T18:00:00',
            endDate: '2024-12-25T22:00:00',
            location: 'Test Location',
            eventType: EVENT_TYPES.NETWORKING,
            privacy: EVENT_PRIVACY.PUBLIC,
            maxParticipants: 100,
            currentParticipants: 25,
            registrationDeadline: '2024-12-20T23:59:59',
            tags: ['test', 'event'],
            isRecurring: false,
            createdBy: {
              id: 'user_123456789',
              firstName: 'John',
              lastName: 'Doe',
              email: 'user@example.com'
            },
            participants: [
              {
                id: 'participation_123',
                user: {
                  id: 'user_456789',
                  firstName: 'Jane',
                  lastName: 'Smith',
                  email: 'jane@example.com'
                },
                status: PARTICIPATION_STATUS.CONFIRMED,
                registeredAt: '2024-12-02T15:30:00'
              }
            ],
            comments: [
              {
                id: 'comment_123',
                content: 'Looking forward to this event!',
                user: {
                  id: 'user_456789',
                  firstName: 'Jane',
                  lastName: 'Smith'
                },
                createdAt: '2024-12-02T16:00:00'
              }
            ],
            media: [
              {
                id: 'media_123',
                type: 'IMAGE',
                url: 'https://example.com/event-image.jpg',
                caption: 'Event banner',
                uploadedBy: 'user_123456789',
                uploadedAt: '2024-12-01T10:30:00'
              }
            ],
            createdAt: '2024-12-01T10:00:00',
            updatedAt: '2024-12-01T10:00:00'
          }
        }
      };

      apiClient.get.mockResolvedValue(mockResponse);

      const result = await eventApi.getEventById('event_123456789');

      expect(apiClient.get).toHaveBeenCalledWith('/events/event_123456789');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const eventData = {
        title: 'Updated Test Event',
        description: 'Updated test event description',
        eventDate: '2024-12-26T18:00:00',
        endDate: '2024-12-26T22:00:00',
        location: 'Updated Location',
        eventType: EVENT_TYPES.NETWORKING,
        privacy: EVENT_PRIVACY.PUBLIC,
        maxParticipants: 150,
        registrationDeadline: '2024-12-21T23:59:59',
        tags: ['test', 'event', 'updated']
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Event updated successfully',
          data: {
            id: 'event_123456789',
            ...eventData,
            currentParticipants: 25,
            createdBy: 'user_123456789',
            updatedAt: '2024-12-02T14:30:00'
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await eventApi.updateEvent('event_123456789', eventData);

      expect(apiClient.put).toHaveBeenCalledWith('/events/event_123456789', eventData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Event deleted successfully',
          data: null
        }
      };

      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await eventApi.deleteEvent('event_123456789');

      expect(apiClient.delete).toHaveBeenCalledWith('/events/event_123456789');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('Group 3: Event Search and Discovery', () => {
    describe('searchEventsGet', () => {
      it('should search events with GET parameters (Group 3.1)', async () => {
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
          data: {
            message: 'Events retrieved successfully',
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
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEventsGet(searchParams);

        expect(apiClient.get).toHaveBeenCalledWith('/events/search?location=IIT+Campus&eventType=MEETING&startDate=2024-12-01T00%3A00%3A00&endDate=2024-12-31T23%3A59%3A59&isOnline=false&organizerName=John+Doe&title=Alumni&description=gathering');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle empty search parameters', async () => {
        const mockResponse = {
          data: {
            message: 'Events retrieved successfully',
            code: '200',
            data: []
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEventsGet({});

        expect(apiClient.get).toHaveBeenCalledWith('/events/search?');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle search errors', async () => {
        const error = new Error('Search failed');
        apiClient.get.mockRejectedValue(error);

        await expect(eventApi.searchEventsGet({ location: 'test' })).rejects.toThrow('Search failed');
      });
    });

    describe('searchEventsPost', () => {
      it('should search events with POST body (Group 3.2)', async () => {
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
          data: {
            message: 'Search completed successfully',
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
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEventsPost(searchCriteria);

        expect(apiClient.post).toHaveBeenCalledWith('/events/search', searchCriteria);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle empty search criteria', async () => {
        const mockResponse = {
          data: {
            message: 'Search completed successfully',
            code: '200',
            data: []
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEventsPost({});

        expect(apiClient.post).toHaveBeenCalledWith('/events/search', {});
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle search errors', async () => {
        const error = new Error('Search failed');
        apiClient.post.mockRejectedValue(error);

        await expect(eventApi.searchEventsPost({ title: 'test' })).rejects.toThrow('Search failed');
      });
    });

    describe('searchEvents (unified)', () => {
      it('should use GET method when specified', async () => {
        const searchParams = { location: 'IIT Campus' };
        const mockResponse = {
          data: {
            message: 'Events retrieved successfully',
            code: '200',
            data: []
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEvents(searchParams, 'GET');

        expect(apiClient.get).toHaveBeenCalledWith('/events/search?location=IIT+Campus');
        expect(result).toEqual(mockResponse.data);
      });

      it('should use POST method by default', async () => {
        const searchCriteria = { title: 'Alumni Meet' };
        const mockResponse = {
          data: {
            message: 'Search completed successfully',
            code: '200',
            data: []
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEvents(searchCriteria);

        expect(apiClient.post).toHaveBeenCalledWith('/events/search', searchCriteria);
        expect(result).toEqual(mockResponse.data);
      });

      it('should use POST method when explicitly specified', async () => {
        const searchCriteria = { title: 'Alumni Meet' };
        const mockResponse = {
          data: {
            message: 'Search completed successfully',
            code: '200',
            data: []
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await eventApi.searchEvents(searchCriteria, 'POST');

        expect(apiClient.post).toHaveBeenCalledWith('/events/search', searchCriteria);
        expect(result).toEqual(mockResponse.data);
      });
    });
  });

  describe('rsvpToEvent', () => {
    it('should RSVP to an event', async () => {
      const rsvpData = {
        eventId: 'event_123456789',
        status: PARTICIPATION_STATUS.CONFIRMED,
        message: 'Looking forward to attending!'
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'RSVP submitted successfully',
          data: {
            id: 'participation_123',
            eventId: 'event_123456789',
            userId: 'user_456789',
            status: PARTICIPATION_STATUS.CONFIRMED,
            message: 'Looking forward to attending!',
            registeredAt: '2024-12-02T15:30:00'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventApi.rsvpToEvent('event_123456789', PARTICIPATION_STATUS.CONFIRMED, 'Looking forward to attending!');

      expect(apiClient.post).toHaveBeenCalledWith('/events/participation/rsvp', rsvpData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('sendInvitations', () => {
    it('should send event invitations', async () => {
      const usernames = ['friend1@example.com', 'friend2@example.com'];
      const personalMessage = 'You\'re invited to our alumni meet!';

      const invitationData = {
        eventId: 'event_123456789',
        invitees: [
          {
            email: 'friend1@example.com',
            message: 'You\'re invited to our alumni meet!'
          },
          {
            email: 'friend2@example.com',
            message: 'You\'re invited to our alumni meet!'
          }
        ]
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Invitations sent successfully',
          data: {
            sentCount: 2,
            invitations: [
              {
                id: 'invitation_123',
                eventId: 'event_123456789',
                inviteeEmail: 'friend1@example.com',
                message: 'You\'re invited to our alumni meet!',
                status: 'SENT',
                sentAt: '2024-12-02T16:00:00'
              },
              {
                id: 'invitation_124',
                eventId: 'event_123456789',
                inviteeEmail: 'friend2@example.com',
                message: 'You\'re invited to our alumni meet!',
                status: 'SENT',
                sentAt: '2024-12-02T16:00:00'
              }
            ]
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventApi.sendInvitations('event_123456789', usernames, personalMessage);

      expect(apiClient.post).toHaveBeenCalledWith('/events/invitations/send', invitationData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('addEventComment', () => {
    it('should add a comment to an event', async () => {
      const commentData = {
        eventId: 'event_123456789',
        content: 'This looks like a great event! Looking forward to it.'
      };

      const mockResponse = {
        data: {
          success: true,
          message: 'Comment added successfully',
          data: {
            id: 'comment_124',
            eventId: 'event_123456789',
            content: 'This looks like a great event! Looking forward to it.',
            user: {
              id: 'user_456789',
              firstName: 'Jane',
              lastName: 'Smith'
            },
            createdAt: '2024-12-02T16:30:00'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventApi.addEventComment('event_123456789', 'This looks like a great event! Looking forward to it.');

      expect(apiClient.post).toHaveBeenCalledWith('/events/comments', commentData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('uploadEventMedia', () => {
    it('should upload media for an event', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('eventId', 'event_123456789');
      formData.append('file', file);
      formData.append('caption', 'Event banner image');
      formData.append('type', 'IMAGE');

      const mockResponse = {
        data: {
          success: true,
          message: 'Media uploaded successfully',
          data: {
            id: 'media_124',
            eventId: 'event_123456789',
            type: 'IMAGE',
            url: 'https://example.com/event-media-124.jpg',
            caption: 'Event banner image',
            uploadedBy: 'user_456789',
            uploadedAt: '2024-12-02T17:00:00'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventApi.uploadEventMedia('event_123456789', file, 'Event banner image', 'IMAGE');

      expect(apiClient.post).toHaveBeenCalledWith('/events/media', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});

describe('Constants', () => {
  describe('PARTICIPATION_STATUS', () => {
    it('should have all participation status values', () => {
      expect(PARTICIPATION_STATUS).toEqual({
        PENDING: 'PENDING',
        CONFIRMED: 'CONFIRMED',
        DECLINED: 'DECLINED',
        MAYBE: 'MAYBE',
        CANCELLED: 'CANCELLED',
        GOING: 'CONFIRMED',
        NOT_GOING: 'DECLINED'
      });
    });
  });

  describe('EVENT_PRIVACY', () => {
    it('should have all privacy level values', () => {
      expect(EVENT_PRIVACY).toEqual({
        PUBLIC: 'PUBLIC',
        PRIVATE: 'PRIVATE',
        ALUMNI_ONLY: 'ALUMNI_ONLY'
      });
    });
  });

  describe('EVENT_TYPES', () => {
    it('should have all event type values', () => {
      expect(EVENT_TYPES).toEqual({
        NETWORKING: 'NETWORKING',
        WORKSHOP: 'WORKSHOP',
        CONFERENCE: 'CONFERENCE',
        SOCIAL: 'SOCIAL',
        CAREER: 'CAREER',
        MENTORSHIP: 'MENTORSHIP'
      });
    });
  });
});

describe('Helper functions', () => {
  describe('formatDateForAPI', () => {
    it('should format date for API', () => {
      const date = new Date('2024-12-25T18:00:00');
      const result = formatDateForAPI(date);
      expect(result).toBe(date.toISOString());
    });

    it('should return null for null date', () => {
      const result = formatDateForAPI(null);
      expect(result).toBeNull();
    });
  });

  describe('canUserJoinEvent', () => {
    it('should allow user to join public event', () => {
      const event = { privacy: EVENT_PRIVACY.PUBLIC };
      const user = { id: 'user_123' };
      const result = canUserJoinEvent(event, user);
      expect(result).toBe(true);
    });

    it('should allow event creator to join private event', () => {
      const event = { privacy: EVENT_PRIVACY.PRIVATE, createdBy: 'user_123' };
      const user = { id: 'user_123' };
      const result = canUserJoinEvent(event, user);
      expect(result).toBe(true);
    });

    it('should not allow other users to join private event', () => {
      const event = { privacy: EVENT_PRIVACY.PRIVATE, createdBy: 'user_123' };
      const user = { id: 'user_456' };
      const result = canUserJoinEvent(event, user);
      expect(result).toBe(false);
    });

    it('should allow user to join alumni-only event', () => {
      const event = { privacy: EVENT_PRIVACY.ALUMNI_ONLY };
      const user = { id: 'user_123' };
      const result = canUserJoinEvent(event, user);
      expect(result).toBe(true);
    });

    it('should return false for null event or user', () => {
      expect(canUserJoinEvent(null, { id: 'user_123' })).toBe(false);
      expect(canUserJoinEvent({ privacy: EVENT_PRIVACY.PUBLIC }, null)).toBe(false);
    });
  });
}); 