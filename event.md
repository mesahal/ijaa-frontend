# 🎉 Event Integration Guide for Frontend Development

## 📋 Overview

This guide provides a comprehensive breakdown of all event-related APIs for frontend integration. The APIs are organized into logical groups for sequential implementation.

---

## 🔐 Authentication Requirements

**All APIs require authentication:**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**User Context Header (for some endpoints):**
```http
X-USER_ID: <base64-encoded-user-context>
```

**Generate User Context:**
```javascript
const userContext = btoa(JSON.stringify({
  username: "user.username",
  userId: "user.id"
}));
```

---

## 🎯 Group 1: Basic Event Management

### 1.1 Get User's Events
**Endpoint:** `GET /api/v1/user/events/my-events`

**Response:**
```json
{
  "message": "User events retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "title": "Alumni Meet 2024",
      "description": "Annual alumni gathering",
      "startDate": "2024-12-25T18:00:00",
      "endDate": "2024-12-25T22:00:00",
      "location": "IIT Campus",
      "eventType": "MEETING",
      "active": true,
      "isOnline": false,
      "meetingLink": null,
      "maxParticipants": 100,
      "currentParticipants": 0,
      "organizerName": "John Doe",
      "organizerEmail": "john@example.com",
      "createdByUsername": "john.doe",
      "privacy": "PUBLIC",
      "inviteMessage": "Join our annual alumni meet!",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

### 1.2 Get User's Active Events
**Endpoint:** `GET /api/v1/user/events/my-events/active`

### 1.3 Get All Active Events (Public)
**Endpoint:** `GET /api/v1/user/events/all-events`

### 1.4 Get Event by ID
**Endpoint:** `GET /api/v1/user/events/all-events/{eventId}`

---

## 🎯 Group 2: Event Creation and Management

### 2.1 Create Event
**Endpoint:** `POST /api/v1/user/events/create`

**Request Body:**
```json
{
  "title": "Alumni Meet 2024",
  "description": "Annual alumni gathering and networking event",
  "startDate": "2024-12-25T18:00:00",
  "endDate": "2024-12-25T22:00:00",
  "location": "IIT Campus, Main Auditorium",
  "eventType": "MEETING",
  "isOnline": false,
  "meetingLink": null,
  "maxParticipants": 100,
  "organizerName": "John Doe",
  "organizerEmail": "john.doe@example.com",
  "privacy": "PUBLIC",
  "inviteMessage": "Join us for the annual alumni meet!"
}
```

### 2.2 Update Event
**Endpoint:** `PUT /api/v1/user/events/my-events/{eventId}`

### 2.3 Delete Event
**Endpoint:** `DELETE /api/v1/user/events/my-events/{eventId}`

---

## 🎯 Group 3: Event Search and Discovery

### 3.1 Search Events (GET)
**Endpoint:** `GET /api/v1/user/events/search`

**Query Parameters:**
- `location` (optional): Event location
- `eventType` (optional): Event type (MEETING, WORKSHOP, CONFERENCE, etc.)
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `isOnline` (optional): Boolean for online events
- `organizerName` (optional): Organizer name
- `title` (optional): Event title
- `description` (optional): Event description

### 3.2 Advanced Event Search (POST)
**Endpoint:** `POST /api/v1/user/events/search`

**Request Body:**
```json
{
  "location": "IIT",
  "eventType": "MEETING",
  "startDate": "2024-12-01T00:00:00",
  "endDate": "2024-12-31T23:59:59",
  "isOnline": false,
  "organizerName": "John",
  "title": "Alumni",
  "description": "gathering"
}
```

---

## 🎯 Group 4: Event Participation (RSVP)

### 4.1 RSVP to Event
**Endpoint:** `POST /api/v1/user/events/participation/rsvp`

**Request Body:**
```json
{
  "eventId": 1,
  "status": "GOING",
  "message": "Looking forward to attending!"
}
```

**Status Values:**
- `GOING` - User confirmed attendance
- `MAYBE` - User might attend
- `NOT_GOING` - User declined
- `PENDING` - Invitation sent but not responded

### 4.2 Update RSVP Status
**Endpoint:** `PUT /api/v1/user/events/participation/{eventId}/rsvp`

### 4.3 Cancel RSVP
**Endpoint:** `DELETE /api/v1/user/events/participation/{eventId}/rsvp`

### 4.4 Get My Participation
**Endpoint:** `GET /api/v1/user/events/participation/{eventId}/my-participation`

### 4.5 Get Event Participants
**Endpoint:** `GET /api/v1/user/events/participation/{eventId}/participants`

---

## 🎯 Group 5: Event Comments

### 5.1 Create Comment
**Endpoint:** `POST /api/v1/user/events/comments`

**Request Body:**
```json
{
  "eventId": 1,
  "content": "This event looks amazing! Looking forward to attending.",
  "parentCommentId": null
}
```

### 5.2 Get Event Comments
**Endpoint:** `GET /api/v1/user/events/comments/event/{eventId}`

**Query Parameters:**
- `page` (default: 0): Page number
- `size` (default: 20): Page size

### 5.3 Update Comment
**Endpoint:** `PUT /api/v1/user/events/comments/{commentId}`

### 5.4 Delete Comment
**Endpoint:** `DELETE /api/v1/user/events/comments/{commentId}`

### 5.5 Like/Unlike Comment
**Endpoint:** `POST /api/v1/user/events/comments/{commentId}/like`

---

## 🎯 Group 6: Event Invitations

### 6.1 Send Invitations
**Endpoint:** `POST /api/v1/user/events/invitations/send`

**Request Body:**
```json
{
  "eventId": 1,
  "usernames": ["john.doe", "jane.smith", "bob.wilson"],
  "personalMessage": "You're invited to our annual alumni meet! Please join us."
}
```

### 6.2 Accept Invitation
**Endpoint:** `POST /api/v1/user/events/invitations/{eventId}/accept`

### 6.3 Decline Invitation
**Endpoint:** `POST /api/v1/user/events/invitations/{eventId}/decline`

### 6.4 Get My Invitations
**Endpoint:** `GET /api/v1/user/events/invitations/my-invitations`

### 6.5 Get Unread Invitations
**Endpoint:** `GET /api/v1/user/events/invitations/my-invitations/unread`

### 6.6 Get Unresponded Invitations
**Endpoint:** `GET /api/v1/user/events/invitations/my-invitations/unresponded`

### 6.7 Mark Invitation as Read
**Endpoint:** `POST /api/v1/user/events/invitations/{eventId}/mark-read`

---

## 🎯 Group 7: Event Media

### 7.1 Upload Media
**Endpoint:** `POST /api/v1/user/events/media`

**Request Body:**
```json
{
  "eventId": 1,
  "fileUrl": "https://example.com/image.jpg",
  "caption": "Event banner",
  "type": "IMAGE"
}
```

### 7.2 Get Event Media
**Endpoint:** `GET /api/v1/user/events/media/event/{eventId}`

### 7.3 Get Media by Type
**Endpoint:** `GET /api/v1/user/events/media/event/{eventId}/type/{mediaType}`

### 7.4 Update Media Caption
**Endpoint:** `PUT /api/v1/user/events/media/{mediaId}/caption`

### 7.5 Delete Media
**Endpoint:** `DELETE /api/v1/user/events/media/{mediaId}`

### 7.6 Like/Unlike Media
**Endpoint:** `POST /api/v1/user/events/media/{mediaId}/like`

---

## 🎯 Group 8: Event Templates

### 8.1 Get All Templates
**Endpoint:** `GET /api/v1/event-templates`

### 8.2 Get Public Templates
**Endpoint:** `GET /api/v1/event-templates/public`

### 8.3 Get Template by ID
**Endpoint:** `GET /api/v1/event-templates/{templateId}`

### 8.4 Create Event from Template
**Endpoint:** `POST /api/v1/event-templates/{templateId}/create-event`

### 8.5 Search Templates
**Endpoint:** `GET /api/v1/event-templates/search`

---

## 🎯 Group 9: Event Analytics

### 9.1 Get Event Analytics
**Endpoint:** `GET /api/v1/event-analytics/{eventId}`

### 9.2 Update Event Analytics
**Endpoint:** `POST /api/v1/event-analytics`

### 9.3 Get Analytics Summary
**Endpoint:** `GET /api/v1/event-analytics/{eventId}/summary`

### 9.4 Get Dashboard Statistics
**Endpoint:** `GET /api/v1/event-analytics/dashboard/stats`

---

## 🎯 Group 10: Advanced Features

### 10.1 Get Recurring Events
**Endpoint:** `GET /api/v1/user/events/recurring`

### 10.2 Get Event Recommendations
**Endpoint:** `GET /api/v1/user/events/recommendations`

### 10.3 Get Event Calendar
**Endpoint:** `GET /api/v1/user/events/calendar`

---

## 🎨 Frontend Integration Examples

### React/JavaScript Example

```javascript
// Event service class
class EventService {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  // Get headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Get user's events
  async getUserEvents() {
    const response = await fetch(`${this.baseURL}/api/v1/user/events/my-events`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Create event
  async createEvent(eventData) {
    const response = await fetch(`${this.baseURL}/api/v1/user/events/create`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(eventData)
    });
    return response.json();
  }

  // RSVP to event
  async rsvpToEvent(eventId, status, message = '') {
    const response = await fetch(`${this.baseURL}/api/v1/user/events/participation/rsvp`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        eventId,
        status,
        message
      })
    });
    return response.json();
  }

  // Search events
  async searchEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/api/v1/user/events/search?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }
}

// Usage example
const eventService = new EventService('http://localhost:8081', 'your-jwt-token');

// Get user's events
const events = await eventService.getUserEvents();
console.log(events.data);

// Create a new event
const newEvent = await eventService.createEvent({
  title: 'Alumni Meet 2024',
  description: 'Annual alumni gathering',
  startDate: '2024-12-25T18:00:00',
  endDate: '2024-12-25T22:00:00',
  location: 'IIT Campus',
  eventType: 'MEETING',
  maxParticipants: 100,
  organizerName: 'John Doe',
  organizerEmail: 'john@example.com'
});
console.log(newEvent.data);

// RSVP to an event
const rsvp = await eventService.rsvpToEvent(1, 'GOING', 'Looking forward to it!');
console.log(rsvp.data);
```

---

## 🚀 Implementation Checklist

### Phase 1: Basic Event Management
- [ ] Implement authentication and token management
- [ ] Create event listing components
- [ ] Implement event creation form
- [ ] Add event detail view
- [ ] Implement event editing functionality
- [ ] Add event deletion with confirmation

### Phase 2: Event Participation
- [ ] Implement RSVP functionality
- [ ] Add participation status indicators
- [ ] Create participant list view
- [ ] Implement participation management

### Phase 3: Event Discovery
- [ ] Implement event search functionality
- [ ] Add advanced search filters
- [ ] Create search results view
- [ ] Implement event recommendations

### Phase 4: Social Features
- [ ] Implement event comments system
- [ ] Add comment replies functionality
- [ ] Implement comment likes
- [ ] Create media upload functionality
- [ ] Add media gallery view

### Phase 5: Invitations and Templates
- [ ] Implement invitation system
- [ ] Add invitation management
- [ ] Create event templates
- [ ] Implement template-based event creation

### Phase 6: Analytics and Advanced Features
- [ ] Implement event analytics
- [ ] Create analytics dashboard
- [ ] Add recurring events support
- [ ] Implement event calendar view

---

## 📝 Notes

1. **Error Handling**: Always implement proper error handling for all API calls
2. **Loading States**: Show loading indicators during API calls
3. **Validation**: Implement client-side validation for forms
4. **Pagination**: Handle pagination for list endpoints
5. **Real-time Updates**: Consider implementing WebSocket for real-time updates
6. **Caching**: Implement appropriate caching strategies
7. **Testing**: Write comprehensive tests for all components
8. **Accessibility**: Ensure all components are accessible
9. **Mobile Responsiveness**: Design for mobile-first approach
10. **Performance**: Optimize for performance and user experience

---

*This guide provides a comprehensive overview of all event-related APIs for frontend integration. Follow the sequential groups for optimal implementation.*
