import eventService from '../../services/eventService';
import apiClient from '../../utils/apiClient';

// Mock the apiClient
jest.mock('../../utils/apiClient');

describe('EventService - Phase 1: Core Event Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Phase 1: Core Event Management APIs', () => {
    describe('getAllActiveEvents (1.1)', () => {
      it('should fetch all active events successfully', async () => {
        const mockResponse = {
          data: {
            success: true,
            message: 'Events retrieved successfully',
            data: {
              content: [
                {
                  id: 1,
                  title: 'Alumni Meet 2024',
                  description: 'Annual alumni gathering',
                  location: 'Dhaka, Bangladesh',
                  startDate: '2024-12-15T18:00:00',
                  endDate: '2024-12-15T22:00:00',
                  maxParticipants: 100,
                  currentParticipants: 45,
                  status: 'ACTIVE',
                  category: 'SOCIAL',
                  organizerId: 123,
                  organizerName: 'John Doe'
                }
              ],
              totalElements: 25,
              totalPages: 3,
              size: 10,
              number: 0,
              first: true,
              last: false
            }
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventService.getAllActiveEvents(0, 10, 'startDate,asc');

        expect(apiClient.get).toHaveBeenCalledWith('/events/all-events?page=0&size=10&sort=startDate,asc');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when fetching all active events', async () => {
        const mockError = new Error('Failed to fetch events');
        apiClient.get.mockRejectedValue(mockError);

        await expect(eventService.getAllActiveEvents()).rejects.toThrow('Failed to fetch events');
        expect(apiClient.get).toHaveBeenCalledWith('/events/all-events?page=0&size=10&sort=startDate,asc');
      });
    });

    describe('getEventById (1.2)', () => {
      it('should fetch specific event details successfully', async () => {
        const mockResponse = {
          data: {
            success: true,
            message: 'Event retrieved successfully',
            data: {
              id: 1,
              title: 'Alumni Meet 2024',
              description: 'Annual alumni gathering with networking opportunities',
              location: 'Dhaka, Bangladesh',
              startDate: '2024-12-15T18:00:00',
              endDate: '2024-12-15T22:00:00',
              maxParticipants: 100,
              currentParticipants: 45,
              status: 'ACTIVE',
              category: 'SOCIAL',
              organizerId: 123,
              organizerName: 'John Doe',
              participants: [
                {
                  userId: 456,
                  userName: 'Jane Smith',
                  status: 'CONFIRMED',
                  joinedAt: '2024-11-05T14:30:00'
                }
              ],
              comments: [
                {
                  id: 1,
                  content: 'Looking forward to this event!',
                  userId: 456,
                  userName: 'Jane Smith',
                  createdAt: '2024-11-05T15:00:00',
                  likes: 3
                }
              ]
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

    describe('createEvent (1.3)', () => {
      it('should create a new event successfully', async () => {
        const eventData = {
          title: 'Tech Workshop 2024',
          description: 'Workshop on latest technologies',
          location: 'Dhaka, Bangladesh',
          startDate: '2024-12-20T09:00:00',
          endDate: '2024-12-20T17:00:00',
          maxParticipants: 50,
          category: 'EDUCATIONAL',
          isPublic: true,
          requiresApproval: false
        };

        const mockResponse = {
          data: {
            success: true,
            message: 'Event created successfully',
            data: {
              id: 2,
              title: 'Tech Workshop 2024',
              description: 'Workshop on latest technologies',
              location: 'Dhaka, Bangladesh',
              startDate: '2024-12-20T09:00:00',
              endDate: '2024-12-20T17:00:00',
              maxParticipants: 50,
              currentParticipants: 0,
              status: 'ACTIVE',
              category: 'EDUCATIONAL',
              organizerId: 123,
              organizerName: 'John Doe'
            }
          }
        };

        apiClient.post.mockResolvedValue(mockResponse);

        const result = await eventService.createEvent(eventData);

        expect(apiClient.post).toHaveBeenCalledWith('/events/create', eventData);
        expect(result).toEqual(mockResponse.data);
      });

      it('should validate required fields when creating event', async () => {
        const invalidEventData = {
          title: 'Tech Workshop 2024',
          // Missing required fields: startDate, endDate, category
        };

        await expect(eventService.createEvent(invalidEventData)).rejects.toThrow('Missing required fields: startDate, endDate, category');
      });

      it('should validate dates when creating event', async () => {
        const invalidEventData = {
          title: 'Tech Workshop 2024',
          startDate: '2024-12-20T17:00:00',
          endDate: '2024-12-20T09:00:00', // End before start
          category: 'EDUCATIONAL'
        };

        await expect(eventService.createEvent(invalidEventData)).rejects.toThrow('Start date must be before end date');
      });
    });

    describe('getMyEvents (1.4)', () => {
      it('should fetch user events successfully', async () => {
        const mockResponse = {
          data: {
            success: true,
            message: 'Events retrieved successfully',
            data: [
              {
                id: 1,
                title: 'Alumni Meet 2024',
                description: 'Annual alumni gathering',
                location: 'Dhaka, Bangladesh',
                startDate: '2024-12-15T18:00:00',
                endDate: '2024-12-15T22:00:00',
                maxParticipants: 100,
                currentParticipants: 45,
                status: 'ACTIVE',
                category: 'SOCIAL',
                organizerId: 123,
                organizerName: 'John Doe'
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

    describe('updateEvent (1.5)', () => {
      it('should update user event successfully', async () => {
        const eventData = {
          title: 'Advanced Tech Workshop 2024',
          description: 'Advanced workshop on latest technologies',
          location: 'Dhaka, Bangladesh',
          startDate: '2024-12-20T09:00:00',
          endDate: '2024-12-20T17:00:00',
          maxParticipants: 75,
          category: 'EDUCATIONAL'
        };

        const mockResponse = {
          data: {
            success: true,
            message: 'Event updated successfully',
            data: {
              id: 2,
              title: 'Advanced Tech Workshop 2024',
              description: 'Advanced workshop on latest technologies',
              location: 'Dhaka, Bangladesh',
              startDate: '2024-12-20T09:00:00',
              endDate: '2024-12-20T17:00:00',
              maxParticipants: 75,
              currentParticipants: 0,
              status: 'ACTIVE',
              category: 'EDUCATIONAL',
              organizerId: 123,
              organizerName: 'John Doe'
            }
          }
        };

        apiClient.put.mockResolvedValue(mockResponse);

        const result = await eventService.updateEvent(2, eventData);

        expect(apiClient.put).toHaveBeenCalledWith('/events/my-events/2', eventData);
        expect(result).toEqual(mockResponse.data);
      });

      it('should validate required fields when updating event', async () => {
        const invalidEventData = {
          title: 'Advanced Tech Workshop 2024',
          // Missing required fields: startDate, endDate, category
        };

        await expect(eventService.updateEvent(2, invalidEventData)).rejects.toThrow('Missing required fields: startDate, endDate, category');
      });
    });

    describe('deleteEvent (1.6)', () => {
      it('should delete user event successfully', async () => {
        const mockResponse = {
          data: {
            success: true,
            message: 'Event deleted successfully',
            data: null
          }
        };

        apiClient.delete.mockResolvedValue(mockResponse);

        const result = await eventService.deleteEvent(2);

        expect(apiClient.delete).toHaveBeenCalledWith('/events/my-events/2');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle missing event ID when deleting', async () => {
        await expect(eventService.deleteEvent()).rejects.toThrow('Event ID is required');
      });

      it('should handle errors when deleting event', async () => {
        const mockError = new Error('Failed to delete event');
        apiClient.delete.mockRejectedValue(mockError);

        await expect(eventService.deleteEvent(2)).rejects.toThrow('Failed to delete event');
        expect(apiClient.delete).toHaveBeenCalledWith('/events/my-events/2');
      });
    });
  });

  // Keep existing tests for other methods...
  describe('Legacy Methods', () => {
    describe('getMyActiveEvents', () => {
      it('should fetch user active events successfully', async () => {
        const mockResponse = {
          data: {
            success: true,
            message: 'User active events retrieved successfully',
            data: [
              {
                id: 1,
                title: 'Alumni Meet 2024',
                description: 'Annual alumni gathering',
                startDate: '2024-12-25T18:00:00',
                endDate: '2024-12-25T22:00:00',
                location: 'IIT Campus',
                category: 'SOCIAL',
                active: true,
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

    describe('getAllEvents', () => {
      it('should fetch all events with pagination successfully', async () => {
        const mockResponse = {
          data: {
            success: true,
            message: 'Events retrieved successfully',
            data: {
              content: [
              {
                id: 1,
                title: 'Alumni Meet 2024',
                description: 'Annual alumni gathering',
                startDate: '2024-12-25T18:00:00',
                endDate: '2024-12-25T22:00:00',
                location: 'IIT Campus',
                  category: 'SOCIAL',
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
              ],
              totalElements: 1,
              totalPages: 1,
              size: 10,
              number: 0,
              first: true,
              last: true
            }
          }
        };

        apiClient.get.mockResolvedValue(mockResponse);

        const result = await eventService.getAllEvents(0, 10, 'eventDate,desc');

        expect(apiClient.get).toHaveBeenCalledWith('/events?page=0&size=10&sort=eventDate,desc');
        expect(result).toEqual(mockResponse.data);
      });

      it('should handle errors when fetching all events', async () => {
        const mockError = new Error('Failed to fetch events');
        apiClient.get.mockRejectedValue(mockError);

        await expect(eventService.getAllEvents()).rejects.toThrow('Failed to fetch events');
        expect(apiClient.get).toHaveBeenCalledWith('/events?page=0&size=10&sort=eventDate,desc');
      });
    });
  });
});
