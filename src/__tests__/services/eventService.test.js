import eventService from '../../services/eventService';
import apiClient from '../../utils/apiClient';

// Mock the apiClient
jest.mock('../../utils/apiClient');

describe('EventService - Group 1: Basic Event Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Group 1: Basic Event Management APIs', () => {
    describe('getMyEvents', () => {
      it('should fetch user events successfully', async () => {
        const mockResponse = {
          data: {
            message: 'User events retrieved successfully',
            code: '200',
            data: [
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
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventService.getMyEvents();

        expect(apiClient.get).toHaveBeenCalledWith('/events/my-events');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when fetching user events', async () => {
        const mockError = new Error('Failed to fetch events');
        apiClient.get.mockRejectedValue(mockError);

        await expect(eventService.getMyEvents()).rejects.toThrow('Failed to fetch events');
        expect(apiClient.get).toHaveBeenCalledWith('/events/my-events');
      });
    });

    describe('getMyActiveEvents', () => {
      it('should fetch user active events successfully', async () => {
        const mockResponse = {
          data: {
            message: 'User active events retrieved successfully',
            code: '200',
            data: [
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
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventService.getMyActiveEvents();

        expect(apiClient.get).toHaveBeenCalledWith('/events/my-events/active');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when fetching user active events', async () => {
        const mockError = new Error('Failed to fetch active events');
        apiClient.get.mockRejectedValue(mockError);

        await expect(eventService.getMyActiveEvents()).rejects.toThrow('Failed to fetch active events');
        expect(apiClient.get).toHaveBeenCalledWith('/events/my-events/active');
      });
    });

    describe('getAllActiveEvents', () => {
      it('should fetch all active events successfully', async () => {
        const mockResponse = {
          data: {
            message: 'All active events retrieved successfully',
            code: '200',
            data: [
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
              }
            ]
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventService.getAllActiveEvents();

        expect(apiClient.get).toHaveBeenCalledWith('/events/all-events');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when fetching all active events', async () => {
        const mockError = new Error('Failed to fetch all active events');
        apiClient.get.mockRejectedValue(mockError);

        await expect(eventService.getAllActiveEvents()).rejects.toThrow('Failed to fetch all active events');
        expect(apiClient.get).toHaveBeenCalledWith('/events/all-events');
      });
    });

    describe('getEventById', () => {
      it('should fetch event by ID successfully', async () => {
        const mockResponse = {
          data: {
            message: 'Event retrieved successfully',
            code: '200',
            data: {
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
            }
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventService.getEventById(1);

        expect(apiClient.get).toHaveBeenCalledWith('/events/all-events/1');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when fetching event by ID', async () => {
        const mockError = new Error('Event not found');
        apiClient.get.mockRejectedValue(mockError);

        await expect(eventService.getEventById(999)).rejects.toThrow('Event not found');
        expect(apiClient.get).toHaveBeenCalledWith('/events/all-events/999');
      });
    });

    describe('createEvent', () => {
      it('should create event successfully', async () => {
        const eventData = {
          title: 'Alumni Meet 2024',
          description: 'Annual alumni gathering',
          startDate: '2024-12-25T18:00:00',
          endDate: '2024-12-25T22:00:00',
          location: 'IIT Campus',
          eventType: 'NETWORKING',
          isOnline: false,
          meetingLink: null,
          maxParticipants: 100,
          organizerName: 'John Doe',
          organizerEmail: 'john@example.com',
          privacy: 'PUBLIC',
          inviteMessage: 'Join our annual alumni meet!'
        };

        const mockResponse = {
          data: {
            message: 'Event created successfully',
            code: '201',
            data: {
              id: 1,
              ...eventData,
              createdAt: '2024-12-01T10:00:00',
              updatedAt: '2024-12-01T10:00:00'
            }
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await eventService.createEvent(eventData);

        expect(apiClient.post).toHaveBeenCalledWith('/events/create', eventData);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when creating event', async () => {
        const eventData = {
          title: 'Alumni Meet 2024',
          description: 'Annual alumni gathering',
          startDate: '2024-12-25T18:00:00',
          endDate: '2024-12-25T22:00:00',
          location: 'IIT Campus',
          eventType: 'NETWORKING',
          isOnline: false,
          meetingLink: null,
          maxParticipants: 100,
          organizerName: 'John Doe',
          organizerEmail: 'john@example.com',
          privacy: 'PUBLIC',
          inviteMessage: 'Join our annual alumni meet!'
        };

        const mockError = new Error('Failed to create event');
        apiClient.post.mockRejectedValue(mockError);

        await expect(eventService.createEvent(eventData)).rejects.toThrow('Failed to create event');
        expect(apiClient.post).toHaveBeenCalledWith('/events/create', eventData);
      });
    });

    describe('updateEvent', () => {
      it('should update event successfully', async () => {
        const eventId = 1;
        const eventData = {
          title: 'Updated Alumni Meet 2024',
          description: 'Updated annual alumni gathering',
          startDate: '2024-12-25T18:00:00',
          endDate: '2024-12-25T22:00:00',
          location: 'IIT Campus',
          eventType: 'NETWORKING',
          isOnline: false,
          meetingLink: null,
          maxParticipants: 100,
          organizerName: 'John Doe',
          organizerEmail: 'john@example.com',
          privacy: 'PUBLIC',
          inviteMessage: 'Join our annual alumni meet!'
        };

        const mockResponse = {
          data: {
            message: 'Event updated successfully',
            code: '200',
            data: {
              id: eventId,
              ...eventData,
              updatedAt: '2024-12-01T10:00:00'
            }
          }
        };

        apiClient.put.mockResolvedValue(mockResponse);

        const result = await eventService.updateEvent(eventId, eventData);

        expect(apiClient.put).toHaveBeenCalledWith(`/events/my-events/${eventId}`, eventData);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when updating event', async () => {
        const eventId = 1;
        const eventData = {
          title: 'Updated Alumni Meet 2024',
          description: 'Updated annual alumni gathering',
          startDate: '2024-12-25T18:00:00',
          endDate: '2024-12-25T22:00:00',
          location: 'IIT Campus',
          eventType: 'NETWORKING',
          isOnline: false,
          meetingLink: null,
          maxParticipants: 100,
          organizerName: 'John Doe',
          organizerEmail: 'john@example.com',
          privacy: 'PUBLIC',
          inviteMessage: 'Join our annual alumni meet!'
        };

        const mockError = new Error('Failed to update event');
        apiClient.put.mockRejectedValue(mockError);

        await expect(eventService.updateEvent(eventId, eventData)).rejects.toThrow('Failed to update event');
        expect(apiClient.put).toHaveBeenCalledWith(`/events/my-events/${eventId}`, eventData);
      });
    });

    describe('deleteEvent', () => {
      it('should delete event successfully', async () => {
        const eventId = 1;

        const mockResponse = {
          data: {
            message: 'Event deleted successfully',
            code: '200',
            data: null
          }
        };

        apiClient.delete.mockResolvedValue(mockResponse);

        const result = await eventService.deleteEvent(eventId);

        expect(apiClient.delete).toHaveBeenCalledWith(`/events/my-events/${eventId}`);
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when deleting event', async () => {
        const eventId = 1;

        const mockError = new Error('Failed to delete event');
        apiClient.delete.mockRejectedValue(mockError);

        await expect(eventService.deleteEvent(eventId)).rejects.toThrow('Failed to delete event');
        expect(apiClient.delete).toHaveBeenCalledWith(`/events/my-events/${eventId}`);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      apiClient.get.mockRejectedValue(networkError);

      await expect(eventService.getMyEvents()).rejects.toThrow('Network Error');
    });

    it('should handle API errors with response data', async () => {
      const apiError = {
        response: {
          data: {
            message: 'Invalid request',
            code: '400'
          }
        }
      };
      apiClient.get.mockRejectedValue(apiError);

      await expect(eventService.getMyEvents()).rejects.toEqual({
        message: 'Invalid request',
        code: '400'
      });
    });
  });
});

describe('EventService - Group 2: Event Creation and Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Group 2.1: Create Event', () => {
    const validEventData = {
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

    it('should create event successfully with all required fields', async () => {
      const mockResponse = {
        data: {
          message: 'Event created successfully',
          code: '201',
          data: {
            id: 1,
            ...validEventData,
            createdAt: '2024-12-01T10:00:00',
            updatedAt: '2024-12-01T10:00:00'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventService.createEvent(validEventData);

      expect(apiClient.post).toHaveBeenCalledWith('/events/create', validEventData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should create online event successfully with meeting link', async () => {
      const onlineEventData = {
        ...validEventData,
        isOnline: true,
        meetingLink: 'https://meet.google.com/abc-defg-hij'
      };

      const mockResponse = {
        data: {
          message: 'Event created successfully',
          code: '201',
          data: {
            id: 1,
            ...onlineEventData,
            createdAt: '2024-12-01T10:00:00',
            updatedAt: '2024-12-01T10:00:00'
          }
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await eventService.createEvent(onlineEventData);

      expect(apiClient.post).toHaveBeenCalledWith('/events/create', onlineEventData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when required fields are missing', async () => {
      const incompleteEventData = {
        title: 'Alumni Meet 2024',
        description: 'Annual alumni gathering'
        // Missing required fields: startDate, endDate, organizerName, organizerEmail
      };

      await expect(eventService.createEvent(incompleteEventData)).rejects.toThrow('Missing required fields: startDate, endDate, organizerName, organizerEmail');
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw error when start date is after end date', async () => {
      const invalidDateEventData = {
        ...validEventData,
        startDate: '2024-12-25T22:00:00',
        endDate: '2024-12-25T18:00:00'
      };

      await expect(eventService.createEvent(invalidDateEventData)).rejects.toThrow('Start date must be before end date');
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should throw error when online event is missing meeting link', async () => {
      const onlineEventWithoutLink = {
        ...validEventData,
        isOnline: true,
        meetingLink: null
      };

      await expect(eventService.createEvent(onlineEventWithoutLink)).rejects.toThrow('Meeting link is required for online events');
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should handle API errors when creating event', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Failed to create event',
            code: '400'
          }
        }
      };
      apiClient.post.mockRejectedValue(mockError);

      await expect(eventService.createEvent(validEventData)).rejects.toEqual({
        message: 'Failed to create event',
        code: '400'
      });
      expect(apiClient.post).toHaveBeenCalledWith('/events/create', validEventData);
    });
  });

  describe('Group 2.2: Update Event', () => {
    const validUpdateData = {
      title: 'Updated Alumni Meet 2024',
      description: 'Updated annual alumni gathering and networking event',
      startDate: '2024-12-26T18:00:00',
      endDate: '2024-12-26T22:00:00',
      location: 'IIT Campus, Updated Auditorium',
      eventType: 'NETWORKING',
      isOnline: false,
      meetingLink: null,
      maxParticipants: 150,
      organizerName: 'John Doe',
      organizerEmail: 'john.doe@example.com',
      privacy: 'PUBLIC',
      inviteMessage: 'Updated invite message!'
    };

    it('should update event successfully with all required fields', async () => {
      const eventId = 1;
      const mockResponse = {
        data: {
          message: 'Event updated successfully',
          code: '200',
          data: {
            id: eventId,
            ...validUpdateData,
            updatedAt: '2024-12-02T10:00:00'
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await eventService.updateEvent(eventId, validUpdateData);

      expect(apiClient.put).toHaveBeenCalledWith(`/events/my-events/${eventId}`, validUpdateData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should update online event successfully with meeting link', async () => {
      const eventId = 1;
      const onlineUpdateData = {
        ...validUpdateData,
        isOnline: true,
        meetingLink: 'https://meet.google.com/xyz-uvw-123'
      };

      const mockResponse = {
        data: {
          message: 'Event updated successfully',
          code: '200',
          data: {
            id: eventId,
            ...onlineUpdateData,
            updatedAt: '2024-12-02T10:00:00'
          }
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await eventService.updateEvent(eventId, onlineUpdateData);

      expect(apiClient.put).toHaveBeenCalledWith(`/events/my-events/${eventId}`, onlineUpdateData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when required fields are missing during update', async () => {
      const eventId = 1;
      const incompleteUpdateData = {
        title: 'Updated Alumni Meet 2024'
        // Missing required fields: startDate, endDate, organizerName, organizerEmail
      };

      await expect(eventService.updateEvent(eventId, incompleteUpdateData)).rejects.toThrow('Missing required fields: startDate, endDate, organizerName, organizerEmail');
      expect(apiClient.put).not.toHaveBeenCalled();
    });

    it('should throw error when start date is after end date during update', async () => {
      const eventId = 1;
      const invalidDateUpdateData = {
        ...validUpdateData,
        startDate: '2024-12-26T22:00:00',
        endDate: '2024-12-26T18:00:00'
      };

      await expect(eventService.updateEvent(eventId, invalidDateUpdateData)).rejects.toThrow('Start date must be before end date');
      expect(apiClient.put).not.toHaveBeenCalled();
    });

    it('should throw error when online event is missing meeting link during update', async () => {
      const eventId = 1;
      const onlineUpdateWithoutLink = {
        ...validUpdateData,
        isOnline: true,
        meetingLink: null
      };

      await expect(eventService.updateEvent(eventId, onlineUpdateWithoutLink)).rejects.toThrow('Meeting link is required for online events');
      expect(apiClient.put).not.toHaveBeenCalled();
    });

    it('should handle API errors when updating event', async () => {
      const eventId = 1;
      const mockError = {
        response: {
          data: {
            message: 'Failed to update event',
            code: '400'
          }
        }
      };
      apiClient.put.mockRejectedValue(mockError);

      await expect(eventService.updateEvent(eventId, validUpdateData)).rejects.toEqual({
        message: 'Failed to update event',
        code: '400'
      });
      expect(apiClient.put).toHaveBeenCalledWith(`/events/my-events/${eventId}`, validUpdateData);
    });
  });

  describe('Group 2.3: Delete Event', () => {
    it('should delete event successfully', async () => {
      const eventId = 1;
      const mockResponse = {
        data: {
          message: 'Event deleted successfully',
          code: '200',
          data: null
        }
      };

      apiClient.delete.mockResolvedValue(mockResponse);

      const result = await eventService.deleteEvent(eventId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/events/my-events/${eventId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when event ID is missing', async () => {
      await expect(eventService.deleteEvent()).rejects.toThrow('Event ID is required');
      expect(apiClient.delete).not.toHaveBeenCalled();
    });

    it('should throw error when event ID is null', async () => {
      await expect(eventService.deleteEvent(null)).rejects.toThrow('Event ID is required');
      expect(apiClient.delete).not.toHaveBeenCalled();
    });

    it('should throw error when event ID is empty string', async () => {
      await expect(eventService.deleteEvent('')).rejects.toThrow('Event ID is required');
      expect(apiClient.delete).not.toHaveBeenCalled();
    });

    it('should handle API errors when deleting event', async () => {
      const eventId = 1;
      const mockError = {
        response: {
          data: {
            message: 'Failed to delete event',
            code: '400'
          }
        }
      };
      apiClient.delete.mockRejectedValue(mockError);

      await expect(eventService.deleteEvent(eventId)).rejects.toEqual({
        message: 'Failed to delete event',
        code: '400'
      });
      expect(apiClient.delete).toHaveBeenCalledWith(`/events/my-events/${eventId}`);
    });

    it('should handle network errors when deleting event', async () => {
      const eventId = 1;
      const networkError = new Error('Network Error');
      apiClient.delete.mockRejectedValue(networkError);

      await expect(eventService.deleteEvent(eventId)).rejects.toThrow('Network Error');
      expect(apiClient.delete).toHaveBeenCalledWith(`/events/my-events/${eventId}`);
    });
  });
});
