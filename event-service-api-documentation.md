# Event Service API Documentation

## Overview
The Event Service provides comprehensive event management functionality for the IJAA platform.

**Base URL**: `http://localhost:8082` (or through Gateway: `http://localhost:8000/ijaa/api/v1/user/events`)

**Authentication**: All endpoints require JWT authentication.

---

## 📋 Frontend Integration Phases

### **Phase 1: Core Event Management** (Start Here)
Essential event CRUD operations for basic functionality.

### **Phase 2: Event Discovery & Search**
Event browsing, searching, and discovery features.

### **Phase 3: Event Participation**
RSVP and participation management.

### **Phase 4: Event Interaction**
Comments, likes, and social features.

### **Phase 5: Advanced Features**
Advanced search, recommendations, and analytics.

---

## 🎯 Phase 1: Core Event Management

### **1.1 Get All Active Events**
**Endpoint**: `GET /api/v1/user/events/all-events`
**Purpose**: Display events on homepage/event listing page

**Request**:
```http
GET /api/v1/user/events/all-events?page=0&size=10&sort=startDate,asc
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-15T18:00:00",
        "endDate": "2024-12-15T22:00:00",
        "maxParticipants": 100,
        "currentParticipants": 45,
        "status": "ACTIVE",
        "category": "SOCIAL",
        "organizerId": 123,
        "organizerName": "John Doe"
      }
    ],
    "totalElements": 25,
    "totalPages": 3,
    "size": 10,
    "number": 0,
    "first": true,
    "last": false
  }
}
```

### **1.2 Get Specific Event Details**
**Endpoint**: `GET /api/v1/user/events/all-events/{eventId}`
**Purpose**: Event detail page

**Request**:
```http
GET /api/v1/user/events/all-events/1
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "id": 1,
    "title": "Alumni Meet 2024",
    "description": "Annual alumni gathering with networking opportunities",
    "location": "Dhaka, Bangladesh",
    "startDate": "2024-12-15T18:00:00",
    "endDate": "2024-12-15T22:00:00",
    "maxParticipants": 100,
    "currentParticipants": 45,
    "status": "ACTIVE",
    "category": "SOCIAL",
    "organizerId": 123,
    "organizerName": "John Doe",
    "participants": [
      {
        "userId": 456,
        "userName": "Jane Smith",
        "status": "CONFIRMED",
        "joinedAt": "2024-11-05T14:30:00"
      }
    ],
    "comments": [
      {
        "id": 1,
        "content": "Looking forward to this event!",
        "userId": 456,
        "userName": "Jane Smith",
        "createdAt": "2024-11-05T15:00:00",
        "likes": 3
      }
    ]
  }
}
```

### **1.3 Create New Event**
**Endpoint**: `POST /api/v1/user/events/create`
**Purpose**: Event creation form

**Request**:
```http
POST /api/v1/user/events/create
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Tech Workshop 2024",
  "description": "Workshop on latest technologies",
  "location": "Dhaka, Bangladesh",
  "startDate": "2024-12-20T09:00:00",
  "endDate": "2024-12-20T17:00:00",
  "maxParticipants": 50,
  "category": "EDUCATIONAL",
  "isPublic": true,
  "requiresApproval": false
}
```

**Response**:
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 2,
    "title": "Tech Workshop 2024",
    "description": "Workshop on latest technologies",
    "location": "Dhaka, Bangladesh",
    "startDate": "2024-12-20T09:00:00",
    "endDate": "2024-12-20T17:00:00",
    "maxParticipants": 50,
    "currentParticipants": 0,
    "status": "ACTIVE",
    "category": "EDUCATIONAL",
    "organizerId": 123,
    "organizerName": "John Doe"
  }
}
```

### **1.4 Get User's Created Events**
**Endpoint**: `GET /api/v1/user/events/my-events`
**Purpose**: User's event management dashboard

**Request**:
```http
GET /api/v1/user/events/my-events
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Alumni Meet 2024",
      "description": "Annual alumni gathering",
      "location": "Dhaka, Bangladesh",
      "startDate": "2024-12-15T18:00:00",
      "endDate": "2024-12-15T22:00:00",
      "maxParticipants": 100,
      "currentParticipants": 45,
      "status": "ACTIVE",
      "category": "SOCIAL",
      "organizerId": 123,
      "organizerName": "John Doe"
    }
  ]
}
```

### **1.5 Update User's Event**
**Endpoint**: `PUT /api/v1/user/events/my-events/{eventId}`
**Purpose**: Event editing form

**Request**:
```http
PUT /api/v1/user/events/my-events/2
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Advanced Tech Workshop 2024",
  "description": "Advanced workshop on latest technologies",
  "location": "Dhaka, Bangladesh",
  "startDate": "2024-12-20T09:00:00",
  "endDate": "2024-12-20T17:00:00",
  "maxParticipants": 75,
  "category": "EDUCATIONAL"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": 2,
    "title": "Advanced Tech Workshop 2024",
    "description": "Advanced workshop on latest technologies",
    "location": "Dhaka, Bangladesh",
    "startDate": "2024-12-20T09:00:00",
    "endDate": "2024-12-20T17:00:00",
    "maxParticipants": 75,
    "currentParticipants": 0,
    "status": "ACTIVE",
    "category": "EDUCATIONAL",
    "organizerId": 123,
    "organizerName": "John Doe"
  }
}
```

### **1.6 Delete User's Event**
**Endpoint**: `DELETE /api/v1/user/events/my-events/{eventId}`
**Purpose**: Event deletion confirmation

**Request**:
```http
DELETE /api/v1/user/events/my-events/2
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": null
}
```

---

## 🔍 Phase 2: Event Discovery & Search

### **2.1 Basic Event Search**
**Endpoint**: `GET /api/v1/user/events/search`
**Purpose**: Search functionality with filters

**Request**:
```http
GET /api/v1/user/events/search?title=workshop&category=EDUCATIONAL&location=Dhaka&startDate=2024-12-01&endDate=2024-12-31&page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Events found successfully",
  "data": {
    "content": [
      {
        "id": 2,
        "title": "Advanced Tech Workshop 2024",
        "description": "Advanced workshop on latest technologies",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-20T09:00:00",
        "endDate": "2024-12-20T17:00:00",
        "maxParticipants": 75,
        "currentParticipants": 0,
        "status": "ACTIVE",
        "category": "EDUCATIONAL",
        "organizerId": 123,
        "organizerName": "John Doe"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **2.2 Get Upcoming Events**
**Endpoint**: `GET /api/v1/user/events/advanced-search/upcoming`
**Purpose**: Homepage upcoming events section

**Request**:
```http
GET /api/v1/user/events/advanced-search/upcoming?days=30&page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Upcoming events retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-15T18:00:00",
        "endDate": "2024-12-15T22:00:00",
        "maxParticipants": 100,
        "currentParticipants": 85,
        "status": "ACTIVE",
        "category": "SOCIAL",
        "organizerId": 123,
        "organizerName": "John Doe",
        "daysUntilEvent": 15
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **2.3 Get Trending Events**
**Endpoint**: `GET /api/v1/user/events/advanced-search/trending`
**Purpose**: Homepage trending events section

**Request**:
```http
GET /api/v1/user/events/advanced-search/trending?limit=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Trending events retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Alumni Meet 2024",
      "description": "Annual alumni gathering",
      "location": "Dhaka, Bangladesh",
      "startDate": "2024-12-15T18:00:00",
      "endDate": "2024-12-15T22:00:00",
      "maxParticipants": 100,
      "currentParticipants": 85,
      "status": "ACTIVE",
      "category": "SOCIAL",
      "organizerId": 123,
      "organizerName": "John Doe",
      "trendingScore": 0.92
    }
  ]
}
```

---

## 👥 Phase 3: Event Participation

### **3.1 RSVP to Event**
**Endpoint**: `POST /api/v1/user/events/participation/rsvp`
**Purpose**: Event RSVP buttons (Join/Maybe/Decline)

**Request**:
```http
POST /api/v1/user/events/participation/rsvp
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "eventId": 1,
  "status": "CONFIRMED",
  "message": "Looking forward to attending!"
}
```

**Response**:
```json
{
  "success": true,
  "message": "RSVP submitted successfully",
  "data": {
    "id": 1,
    "eventId": 1,
    "userId": 456,
    "userName": "Jane Smith",
    "status": "CONFIRMED",
    "message": "Looking forward to attending!",
    "joinedAt": "2024-11-05T14:30:00",
    "updatedAt": "2024-11-05T14:30:00"
  }
}
```

### **3.2 Get User's Event Participations**
**Endpoint**: `GET /api/v1/user/events/participation/my-participations`
**Purpose**: User's event calendar/dashboard

**Request**:
```http
GET /api/v1/user/events/participation/my-participations?status=CONFIRMED&page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Participations retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "eventId": 1,
        "eventTitle": "Alumni Meet 2024",
        "eventStartDate": "2024-12-15T18:00:00",
        "eventLocation": "Dhaka, Bangladesh",
        "userId": 456,
        "userName": "Jane Smith",
        "status": "CONFIRMED",
        "message": "Looking forward to attending!",
        "joinedAt": "2024-11-05T14:30:00",
        "updatedAt": "2024-11-05T14:30:00"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **3.3 Update Participation Status**
**Endpoint**: `PUT /api/v1/user/events/participation/{participationId}`
**Purpose**: Change RSVP status

**Request**:
```http
PUT /api/v1/user/events/participation/1
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "status": "MAYBE",
  "message": "I might be able to attend"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Participation updated successfully",
  "data": {
    "id": 1,
    "eventId": 1,
    "userId": 456,
    "userName": "Jane Smith",
    "status": "MAYBE",
    "message": "I might be able to attend",
    "joinedAt": "2024-11-05T14:30:00",
    "updatedAt": "2024-11-05T15:00:00"
  }
}
```

---

## 💬 Phase 4: Event Interaction

### **4.1 Get Event Comments**
**Endpoint**: `GET /api/v1/user/events/comments/event/{eventId}`
**Purpose**: Event comments section

**Request**:
```http
GET /api/v1/user/events/comments/event/1?page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "eventId": 1,
        "content": "This looks like a great event! Looking forward to it.",
        "userId": 456,
        "userName": "Jane Smith",
        "parentCommentId": null,
        "likes": 3,
        "createdAt": "2024-11-05T15:00:00",
        "updatedAt": "2024-11-05T15:00:00",
        "replies": [
          {
            "id": 2,
            "eventId": 1,
            "content": "Me too! Should be fun.",
            "userId": 789,
            "userName": "Bob Johnson",
            "parentCommentId": 1,
            "likes": 1,
            "createdAt": "2024-11-05T15:30:00",
            "updatedAt": "2024-11-05T15:30:00"
          }
        ]
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **4.2 Add Event Comment**
**Endpoint**: `POST /api/v1/user/events/comments/`
**Purpose**: Comment form on event page

**Request**:
```http
POST /api/v1/user/events/comments/
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "eventId": 1,
  "content": "This looks like a great event! Looking forward to it.",
  "parentCommentId": null
}
```

**Response**:
```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": 1,
    "eventId": 1,
    "content": "This looks like a great event! Looking forward to it.",
    "userId": 456,
    "userName": "Jane Smith",
    "parentCommentId": null,
    "likes": 0,
    "createdAt": "2024-11-05T15:00:00",
    "updatedAt": "2024-11-05T15:00:00"
  }
}
```

### **4.3 Toggle Comment Like**
**Endpoint**: `POST /api/v1/user/events/comments/{commentId}/like`
**Purpose**: Like/unlike comment buttons

**Request**:
```http
POST /api/v1/user/events/comments/1/like
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Comment liked successfully",
  "data": {
    "commentId": 1,
    "liked": true,
    "totalLikes": 4
  }
}
```

### **4.4 Update Comment**
**Endpoint**: `PUT /api/v1/user/events/comments/{commentId}`
**Purpose**: Edit comment functionality

**Request**:
```http
PUT /api/v1/user/events/comments/1
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "content": "This looks like an amazing event! Really excited to attend."
}
```

**Response**:
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "id": 1,
    "eventId": 1,
    "content": "This looks like an amazing event! Really excited to attend.",
    "userId": 456,
    "userName": "Jane Smith",
    "parentCommentId": null,
    "likes": 3,
    "createdAt": "2024-11-05T15:00:00",
    "updatedAt": "2024-11-05T16:00:00"
  }
}
```

### **4.5 Delete Comment**
**Endpoint**: `DELETE /api/v1/user/events/comments/{commentId}`
**Purpose**: Delete comment functionality

**Request**:
```http
DELETE /api/v1/user/events/comments/1
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": null
}
```

---

## 🚀 Phase 5: Advanced Features

### **5.1 Advanced Event Search**
**Endpoint**: `POST /api/v1/user/events/advanced-search/advanced`
**Purpose**: Advanced search page with multiple filters

**Request**:
```http
POST /api/v1/user/events/advanced-search/advanced
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "workshop",
  "description": "technology",
  "location": "Dhaka",
  "category": "EDUCATIONAL",
  "startDateFrom": "2024-12-01T00:00:00",
  "startDateTo": "2024-12-31T23:59:59",
  "organizerName": "John",
  "minParticipants": 10,
  "maxParticipants": 100,
  "status": "ACTIVE",
  "sortBy": "startDate",
  "sortDirection": "ASC",
  "page": 0,
  "size": 10
}
```

**Response**:
```json
{
  "success": true,
  "message": "Advanced search completed successfully",
  "data": {
    "content": [
      {
        "id": 2,
        "title": "Advanced Tech Workshop 2024",
        "description": "Advanced workshop on latest technologies",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-20T09:00:00",
        "endDate": "2024-12-20T17:00:00",
        "maxParticipants": 75,
        "currentParticipants": 0,
        "status": "ACTIVE",
        "category": "EDUCATIONAL",
        "organizerId": 123,
        "organizerName": "John Doe"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **5.2 Get Event Recommendations**
**Endpoint**: `GET /api/v1/user/events/advanced-search/recommendations`
**Purpose**: Personalized recommendations section

**Request**:
```http
GET /api/v1/user/events/advanced-search/recommendations?limit=5
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Event recommendations retrieved successfully",
  "data": [
    {
      "id": 3,
      "title": "Tech Networking Event",
      "description": "Networking event for tech professionals",
      "location": "Dhaka, Bangladesh",
      "startDate": "2024-12-25T19:00:00",
      "endDate": "2024-12-25T22:00:00",
      "maxParticipants": 50,
      "currentParticipants": 15,
      "status": "ACTIVE",
      "category": "NETWORKING",
      "organizerId": 456,
      "organizerName": "Tech Community",
      "recommendationScore": 0.85
    }
  ]
}
```

### **5.3 Get Similar Events**
**Endpoint**: `GET /api/v1/user/events/advanced-search/similar/{eventId}`
**Purpose**: "Similar events" section on event detail page

**Request**:
```http
GET /api/v1/user/events/advanced-search/similar/1?limit=5
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Similar events retrieved successfully",
  "data": [
    {
      "id": 4,
      "title": "Alumni Reunion 2024",
      "description": "Another alumni gathering event",
      "location": "Chittagong, Bangladesh",
      "startDate": "2024-12-30T18:00:00",
      "endDate": "2024-12-30T22:00:00",
      "maxParticipants": 80,
      "currentParticipants": 20,
      "status": "ACTIVE",
      "category": "SOCIAL",
      "organizerId": 789,
      "organizerName": "Alumni Association",
      "similarityScore": 0.75
    }
  ]
}
```

### **5.4 Get High Engagement Events**
**Endpoint**: `GET /api/v1/user/events/advanced-search/high-engagement`
**Purpose**: Popular events section

**Request**:
```http
GET /api/v1/user/events/advanced-search/high-engagement?threshold=50&page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "High engagement events retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-15T18:00:00",
        "endDate": "2024-12-15T22:00:00",
        "maxParticipants": 100,
        "currentParticipants": 85,
        "engagementRate": 85.0,
        "status": "ACTIVE",
        "category": "SOCIAL",
        "organizerId": 123,
        "organizerName": "John Doe"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **5.5 Get Events by Location**
**Endpoint**: `GET /api/v1/user/events/advanced-search/location/{location}`
**Purpose**: Location-based event filtering

**Request**:
```http
GET /api/v1/user/events/advanced-search/location/Dhaka?page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Events by location retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-15T18:00:00",
        "endDate": "2024-12-15T22:00:00",
        "maxParticipants": 100,
        "currentParticipants": 85,
        "status": "ACTIVE",
        "category": "SOCIAL",
        "organizerId": 123,
        "organizerName": "John Doe"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

### **5.6 Get Events by Organizer**
**Endpoint**: `GET /api/v1/user/events/advanced-search/organizer/{organizerName}`
**Purpose**: Organizer profile page

**Request**:
```http
GET /api/v1/user/events/advanced-search/organizer/John?page=0&size=10
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Events by organizer retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering",
        "location": "Dhaka, Bangladesh",
        "startDate": "2024-12-15T18:00:00",
        "endDate": "2024-12-15T22:00:00",
        "maxParticipants": 100,
        "currentParticipants": 85,
        "status": "ACTIVE",
        "category": "SOCIAL",
        "organizerId": 123,
        "organizerName": "John Doe"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0,
    "first": true,
    "last": true
  }
}
```

---

## 📊 Data Models

### Event
```json
{
  "id": "Long",
  "title": "String (required)",
  "description": "String",
  "location": "String",
  "startDate": "LocalDateTime (required)",
  "endDate": "LocalDateTime (required)",
  "maxParticipants": "Integer",
  "currentParticipants": "Integer",
  "status": "EventStatus (ACTIVE, CANCELLED, COMPLETED)",
  "category": "EventCategory (SOCIAL, EDUCATIONAL, NETWORKING, PROFESSIONAL)",
  "organizerId": "Long (required)",
  "organizerName": "String",
  "isPublic": "Boolean",
  "requiresApproval": "Boolean",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Event Participation
```json
{
  "id": "Long",
  "eventId": "Long (required)",
  "userId": "Long (required)",
  "userName": "String",
  "status": "ParticipationStatus (CONFIRMED, DECLINED, MAYBE)",
  "message": "String",
  "joinedAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

### Event Comment
```json
{
  "id": "Long",
  "eventId": "Long (required)",
  "content": "String (required)",
  "userId": "Long (required)",
  "userName": "String",
  "parentCommentId": "Long",
  "likes": "Integer",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Event title is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Event not found",
  "data": null
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "data": null
}
```

---

## 🔧 Integration Notes

### Authentication
- All endpoints require a valid JWT token in the Authorization header
- Token should be obtained from the User Service login endpoint
- Token format: `Bearer <jwt_token>`

### Pagination
- Most list endpoints support pagination
- Use `page` and `size` query parameters
- Response includes pagination metadata

### Error Handling
- Always check the `success` field in responses
- Handle different HTTP status codes appropriately
- Display user-friendly error messages

### Date Format
- All dates are in ISO 8601 format: `YYYY-MM-DDTHH:mm:ss`
- Use UTC timezone for consistency

---

## 🎯 Frontend Integration Checklist

### Phase 1: Core Event Management ✅
- [ ] Event listing page
- [ ] Event detail page
- [ ] Event creation form
- [ ] Event editing form
- [ ] Event deletion confirmation

### Phase 2: Event Discovery & Search ✅
- [ ] Search functionality
- [ ] Upcoming events section
- [ ] Trending events section

### Phase 3: Event Participation ✅
- [ ] RSVP buttons (Join/Maybe/Decline)
- [ ] User's event calendar
- [ ] RSVP status management

### Phase 4: Event Interaction ✅
- [ ] Comments section
- [ ] Comment form
- [ ] Like/unlike functionality
- [ ] Comment editing/deletion

### Phase 5: Advanced Features ✅
- [ ] Advanced search page
- [ ] Recommendations section
- [ ] Similar events section
- [ ] Popular events section
- [ ] Location-based filtering
- [ ] Organizer profile pages

This documentation is organized for step-by-step frontend integration. Start with Phase 1 for basic functionality and progressively add more features through the phases.
