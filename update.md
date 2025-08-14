# 🚀 IJAA Backend System - New Features Update

## 📋 Overview

This document provides comprehensive API documentation for the newly implemented features in the IJAA backend system. The update includes advanced event management capabilities and a dynamic feature flag system for runtime feature control.

---

## 🎯 New Features Summary

### ✅ 1. Advanced Event Management System

- **Event Creation & Management**: Full CRUD operations with privacy settings
- **Event Participation**: RSVP system with multiple status options
- **Event Invitations**: Invitation management with personal messages
- **Event Search**: Advanced search with multiple filters
- **Event Comments**: Commenting system for events
- **Event Media**: Media attachment support
- **Event Templates**: Reusable event templates
- **Recurring Events**: Support for recurring event patterns
- **Event Analytics**: Comprehensive event analytics and reporting

### ✅ 2. Feature Flag System

- **Dynamic Feature Control**: Runtime feature enablement/disablement
- **Admin Interface**: Web-based feature flag management
- **Granular Control**: Feature-level and user-level controls
- **Audit Trail**: Feature flag change tracking
- **Integration**: Seamless integration across all features

---

## 📡 API Endpoints Documentation

### 🔐 Authentication Endpoints

#### User Registration

```http
POST /api/v1/user/auth/signup
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "graduationYear": 2020,
  "department": "Computer Science",
  "currentCompany": "Tech Corp",
  "currentPosition": "Software Engineer"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "user_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### User Login

```http
POST /api/v1/user/auth/signin
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "user_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### Admin Registration

```http
POST /api/v1/admin/auth/signup
Content-Type: application/json

Request Body:
{
  "email": "admin@ijaa.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "SUPER_ADMIN"
}

Response (201 Created):
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "id": "admin_123456789",
    "email": "admin@ijaa.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "SUPER_ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

#### Admin Login

```http
POST /api/v1/admin/auth/signin
Content-Type: application/json

Request Body:
{
  "email": "admin@ijaa.com",
  "password": "admin123"
}

Response (200 OK):
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "id": "admin_123456789",
    "email": "admin@ijaa.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "SUPER_ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

---

## 🎉 Event Management System

### Event Creation

```http
POST /api/v1/user/events/create
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Alumni Meet 2024",
  "description": "Annual alumni gathering and networking event",
  "eventDate": "2024-12-25T18:00:00",
  "endDate": "2024-12-25T22:00:00",
  "location": "IIT Jodhpur Campus",
  "eventType": "NETWORKING",
  "privacy": "PUBLIC",
  "maxParticipants": 100,
  "registrationDeadline": "2024-12-20T23:59:59",
  "tags": ["networking", "alumni", "social"],
  "isRecurring": false,
  "recurringPattern": null,
  "templateId": null
}

Response (201 Created):
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "event_123456789",
    "title": "Alumni Meet 2024",
    "description": "Annual alumni gathering and networking event",
    "eventDate": "2024-12-25T18:00:00",
    "endDate": "2024-12-25T22:00:00",
    "location": "IIT Jodhpur Campus",
    "eventType": "NETWORKING",
    "privacy": "PUBLIC",
    "maxParticipants": 100,
    "currentParticipants": 0,
    "registrationDeadline": "2024-12-20T23:59:59",
    "tags": ["networking", "alumni", "social"],
    "isRecurring": false,
    "createdBy": "user_123456789",
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
}
```

### Get All Events

```http
GET /api/v1/user/events?page=0&size=10&sort=eventDate,desc
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": {
    "content": [
      {
        "id": "event_123456789",
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering and networking event",
        "eventDate": "2024-12-25T18:00:00",
        "endDate": "2024-12-25T22:00:00",
        "location": "IIT Jodhpur Campus",
        "eventType": "NETWORKING",
        "privacy": "PUBLIC",
        "maxParticipants": 100,
        "currentParticipants": 25,
        "registrationDeadline": "2024-12-20T23:59:59",
        "tags": ["networking", "alumni", "social"],
        "isRecurring": false,
        "createdBy": "user_123456789",
        "createdAt": "2024-12-01T10:00:00",
        "updatedAt": "2024-12-01T10:00:00"
      }
    ],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "sorted": true,
        "unsorted": false
      }
    },
    "totalElements": 1,
    "totalPages": 1,
    "last": true,
    "first": true,
    "numberOfElements": 1
  }
}
```

### Get Event Details

```http
GET /api/v1/user/events/{eventId}
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Event details retrieved successfully",
  "data": {
    "id": "event_123456789",
    "title": "Alumni Meet 2024",
    "description": "Annual alumni gathering and networking event",
    "eventDate": "2024-12-25T18:00:00",
    "endDate": "2024-12-25T22:00:00",
    "location": "IIT Jodhpur Campus",
    "eventType": "NETWORKING",
    "privacy": "PUBLIC",
    "maxParticipants": 100,
    "currentParticipants": 25,
    "registrationDeadline": "2024-12-20T23:59:59",
    "tags": ["networking", "alumni", "social"],
    "isRecurring": false,
    "createdBy": {
      "id": "user_123456789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "user@example.com"
    },
    "participants": [
      {
        "id": "participation_123",
        "user": {
          "id": "user_456789",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com"
        },
        "status": "CONFIRMED",
        "registeredAt": "2024-12-02T15:30:00"
      }
    ],
    "comments": [
      {
        "id": "comment_123",
        "content": "Looking forward to this event!",
        "user": {
          "id": "user_456789",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "createdAt": "2024-12-02T16:00:00"
      }
    ],
    "media": [
      {
        "id": "media_123",
        "type": "IMAGE",
        "url": "https://example.com/event-image.jpg",
        "caption": "Event banner",
        "uploadedBy": "user_123456789",
        "uploadedAt": "2024-12-01T10:30:00"
      }
    ],
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
}
```

### Update Event

```http
PUT /api/v1/user/events/{eventId}
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Updated Alumni Meet 2024",
  "description": "Updated description",
  "eventDate": "2024-12-26T18:00:00",
  "endDate": "2024-12-26T22:00:00",
  "location": "Updated Location",
  "eventType": "NETWORKING",
  "privacy": "PUBLIC",
  "maxParticipants": 150,
  "registrationDeadline": "2024-12-21T23:59:59",
  "tags": ["networking", "alumni", "social", "updated"]
}

Response (200 OK):
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": "event_123456789",
    "title": "Updated Alumni Meet 2024",
    "description": "Updated description",
    "eventDate": "2024-12-26T18:00:00",
    "endDate": "2024-12-26T22:00:00",
    "location": "Updated Location",
    "eventType": "NETWORKING",
    "privacy": "PUBLIC",
    "maxParticipants": 150,
    "currentParticipants": 25,
    "registrationDeadline": "2024-12-21T23:59:59",
    "tags": ["networking", "alumni", "social", "updated"],
    "isRecurring": false,
    "createdBy": "user_123456789",
    "updatedAt": "2024-12-02T14:30:00"
  }
}
```

### Delete Event

```http
DELETE /api/v1/user/events/{eventId}
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Event deleted successfully",
  "data": null
}
```

### Event Search

```http
POST /api/v1/user/events/search
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "keyword": "alumni",
  "eventType": "NETWORKING",
  "privacy": "PUBLIC",
  "startDate": "2024-12-01T00:00:00",
  "endDate": "2024-12-31T23:59:59",
  "location": "IIT Jodhpur",
  "tags": ["networking"],
  "page": 0,
  "size": 10,
  "sortBy": "eventDate",
  "sortDirection": "ASC"
}

Response (200 OK):
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "content": [
      {
        "id": "event_123456789",
        "title": "Alumni Meet 2024",
        "description": "Annual alumni gathering and networking event",
        "eventDate": "2024-12-25T18:00:00",
        "endDate": "2024-12-25T22:00:00",
        "location": "IIT Jodhpur Campus",
        "eventType": "NETWORKING",
        "privacy": "PUBLIC",
        "maxParticipants": 100,
        "currentParticipants": 25,
        "tags": ["networking", "alumni", "social"]
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "pageNumber": 0,
    "pageSize": 10
  }
}
```

### Event RSVP

```http
POST /api/v1/user/events/participation/rsvp
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "eventId": "event_123456789",
  "status": "CONFIRMED",
  "message": "Looking forward to attending!"
}

Response (200 OK):
{
  "success": true,
  "message": "RSVP submitted successfully",
  "data": {
    "id": "participation_123",
    "eventId": "event_123456789",
    "userId": "user_456789",
    "status": "CONFIRMED",
    "message": "Looking forward to attending!",
    "registeredAt": "2024-12-02T15:30:00"
  }
}
```

### Send Event Invitations

```http
POST /api/v1/user/events/invitations/send
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "eventId": "event_123456789",
  "invitees": [
    {
      "email": "friend1@example.com",
      "message": "You're invited to our alumni meet!"
    },
    {
      "email": "friend2@example.com",
      "message": "Join us for networking!"
    }
  ]
}

Response (200 OK):
{
  "success": true,
  "message": "Invitations sent successfully",
  "data": {
    "sentCount": 2,
    "invitations": [
      {
        "id": "invitation_123",
        "eventId": "event_123456789",
        "inviteeEmail": "friend1@example.com",
        "message": "You're invited to our alumni meet!",
        "status": "SENT",
        "sentAt": "2024-12-02T16:00:00"
      },
      {
        "id": "invitation_124",
        "eventId": "event_123456789",
        "inviteeEmail": "friend2@example.com",
        "message": "Join us for networking!",
        "status": "SENT",
        "sentAt": "2024-12-02T16:00:00"
      }
    ]
  }
}
```

### Add Event Comment

```http
POST /api/v1/user/events/comments
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "eventId": "event_123456789",
  "content": "This looks like a great event! Looking forward to it."
}

Response (201 Created):
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": "comment_124",
    "eventId": "event_123456789",
    "content": "This looks like a great event! Looking forward to it.",
    "user": {
      "id": "user_456789",
      "firstName": "Jane",
      "lastName": "Smith"
    },
    "createdAt": "2024-12-02T16:30:00"
  }
}
```

### Upload Event Media

```http
POST /api/v1/user/events/media
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- eventId: "event_123456789"
- file: [binary file data]
- caption: "Event banner image"
- type: "IMAGE"

Response (201 Created):
{
  "success": true,
  "message": "Media uploaded successfully",
  "data": {
    "id": "media_124",
    "eventId": "event_123456789",
    "type": "IMAGE",
    "url": "https://example.com/event-media-124.jpg",
    "caption": "Event banner image",
    "uploadedBy": "user_456789",
    "uploadedAt": "2024-12-02T17:00:00"
  }
}
```

---

## 🎛️ Feature Flag System

### Get All Feature Flags

```http
GET /api/v1/admin/feature-flags
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "message": "Feature flags retrieved successfully",
  "data": [
    {
      "id": "flag_123",
      "name": "NEW_UI",
      "description": "Modern user interface with enhanced design",
      "enabled": true,
      "enabledForAllUsers": true,
      "enabledUserIds": [],
      "disabledUserIds": [],
      "createdBy": "admin_123456789",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    },
    {
      "id": "flag_124",
      "name": "CHAT_FEATURE",
      "description": "Real-time chat functionality",
      "enabled": false,
      "enabledForAllUsers": false,
      "enabledUserIds": ["user_123", "user_456"],
      "disabledUserIds": [],
      "createdBy": "admin_123456789",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

### Get Specific Feature Flag

```http
GET /api/v1/admin/feature-flags/{flagName}
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "message": "Feature flag retrieved successfully",
  "data": {
    "id": "flag_123",
    "name": "NEW_UI",
    "description": "Modern user interface with enhanced design",
    "enabled": true,
    "enabledForAllUsers": true,
    "enabledUserIds": [],
    "disabledUserIds": [],
    "createdBy": "admin_123456789",
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
}
```

### Create Feature Flag

```http
POST /api/v1/admin/feature-flags
Authorization: Bearer <admin_token>
Content-Type: application/json

Request Body:
{
  "name": "PAYMENT_INTEGRATION",
  "description": "Payment processing integration",
  "enabled": false,
  "enabledForAllUsers": false,
  "enabledUserIds": ["user_123", "user_456"],
  "disabledUserIds": []
}

Response (201 Created):
{
  "success": true,
  "message": "Feature flag created successfully",
  "data": {
    "id": "flag_125",
    "name": "PAYMENT_INTEGRATION",
    "description": "Payment processing integration",
    "enabled": false,
    "enabledForAllUsers": false,
    "enabledUserIds": ["user_123", "user_456"],
    "disabledUserIds": [],
    "createdBy": "admin_123456789",
    "createdAt": "2024-12-02T18:00:00",
    "updatedAt": "2024-12-02T18:00:00"
  }
}
```

### Update Feature Flag

```http
PUT /api/v1/admin/feature-flags/{flagName}
Authorization: Bearer <admin_token>
Content-Type: application/json

Request Body:
{
  "description": "Updated payment processing integration",
  "enabled": true,
  "enabledForAllUsers": true,
  "enabledUserIds": [],
  "disabledUserIds": []
}

Response (200 OK):
{
  "success": true,
  "message": "Feature flag updated successfully",
  "data": {
    "id": "flag_125",
    "name": "PAYMENT_INTEGRATION",
    "description": "Updated payment processing integration",
    "enabled": true,
    "enabledForAllUsers": true,
    "enabledUserIds": [],
    "disabledUserIds": [],
    "createdBy": "admin_123456789",
    "updatedAt": "2024-12-02T18:30:00"
  }
}
```

### Delete Feature Flag

```http
DELETE /api/v1/admin/feature-flags/{flagName}
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "message": "Feature flag deleted successfully",
  "data": null
}
```

### Get Enabled Features

```http
GET /api/v1/admin/feature-flags/enabled
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "message": "Enabled feature flags retrieved successfully",
  "data": [
    {
      "id": "flag_123",
      "name": "NEW_UI",
      "description": "Modern user interface with enhanced design",
      "enabled": true,
      "enabledForAllUsers": true
    },
    {
      "id": "flag_125",
      "name": "PAYMENT_INTEGRATION",
      "description": "Updated payment processing integration",
      "enabled": true,
      "enabledForAllUsers": true
    }
  ]
}
```

### Get Disabled Features

```http
GET /api/v1/admin/feature-flags/disabled
Authorization: Bearer <admin_token>

Response (200 OK):
{
  "success": true,
  "message": "Disabled feature flags retrieved successfully",
  "data": [
    {
      "id": "flag_124",
      "name": "CHAT_FEATURE",
      "description": "Real-time chat functionality",
      "enabled": false,
      "enabledForAllUsers": false
    }
  ]
}
```

### Check Feature Flag for User

```http
GET /api/v1/user/feature-flags/{flagName}/check
Authorization: Bearer <user_token>

Response (200 OK):
{
  "success": true,
  "message": "Feature flag status retrieved successfully",
  "data": {
    "flagName": "NEW_UI",
    "enabled": true,
    "enabledForUser": true,
    "description": "Modern user interface with enhanced design"
  }
}
```

---

## 👤 User Management

### Get User Profile

```http
GET /api/v1/user/profile
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "graduationYear": 2020,
    "department": "Computer Science",
    "currentCompany": "Tech Corp",
    "currentPosition": "Software Engineer",
    "bio": "Passionate software engineer with 3 years of experience",
    "location": "San Francisco, CA",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "githubUrl": "https://github.com/johndoe",
    "interests": ["Java", "Spring Boot", "Microservices"],
    "experiences": [
      {
        "id": "exp_123",
        "company": "Tech Corp",
        "position": "Software Engineer",
        "startDate": "2021-01-01",
        "endDate": null,
        "description": "Full-stack development using Spring Boot"
      }
    ],
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
}
```

### Update User Profile

```http
PUT /api/v1/user/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "graduationYear": 2020,
  "department": "Computer Science",
  "currentCompany": "Updated Tech Corp",
  "currentPosition": "Senior Software Engineer",
  "bio": "Updated bio with more experience",
  "location": "San Francisco, CA",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "interests": ["Java", "Spring Boot", "Microservices", "Cloud Computing"]
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+1234567890",
    "graduationYear": 2020,
    "department": "Computer Science",
    "currentCompany": "Updated Tech Corp",
    "currentPosition": "Senior Software Engineer",
    "bio": "Updated bio with more experience",
    "location": "San Francisco, CA",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "githubUrl": "https://github.com/johndoe",
    "interests": ["Java", "Spring Boot", "Microservices", "Cloud Computing"],
    "updatedAt": "2024-12-02T19:00:00"
  }
}
```

### Alumni Search

```http
POST /api/v1/user/alumni/search
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "keyword": "software engineer",
  "department": "Computer Science",
  "graduationYear": 2020,
  "location": "San Francisco",
  "company": "Tech Corp",
  "page": 0,
  "size": 10,
  "sortBy": "firstName",
  "sortDirection": "ASC"
}

Response (200 OK):
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "content": [
      {
        "id": "user_456789",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "graduationYear": 2020,
        "department": "Computer Science",
        "currentCompany": "Tech Corp",
        "currentPosition": "Software Engineer",
        "location": "San Francisco, CA",
        "linkedinUrl": "https://linkedin.com/in/janesmith"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "pageNumber": 0,
    "pageSize": 10
  }
}
```

---

## 🔧 Error Responses

### Authentication Error

```http
Response (401 Unauthorized):
{
  "success": false,
  "message": "Authentication failed",
  "error": "Invalid token or token expired",
  "timestamp": "2024-12-02T20:00:00"
}
```

### Validation Error

```http
Response (400 Bad Request):
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ],
  "timestamp": "2024-12-02T20:00:00"
}
```

### Not Found Error

```http
Response (404 Not Found):
{
  "success": false,
  "message": "Resource not found",
  "error": "Event with id 'event_999' not found",
  "timestamp": "2024-12-02T20:00:00"
}
```

### Server Error

```http
Response (500 Internal Server Error):
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred",
  "timestamp": "2024-12-02T20:00:00"
}
```

---

## 📊 Data Models

### Event Types

```json
{
  "NETWORKING": "Networking events",
  "WORKSHOP": "Workshop and training events",
  "CONFERENCE": "Conference and seminar events",
  "SOCIAL": "Social and recreational events",
  "CAREER": "Career development events",
  "MENTORSHIP": "Mentorship and guidance events"
}
```

### Event Privacy Levels

```json
{
  "PUBLIC": "Visible to all users",
  "PRIVATE": "Visible only to invited users",
  "ALUMNI_ONLY": "Visible only to verified alumni"
}
```

### Participation Status

```json
{
  "PENDING": "RSVP pending",
  "CONFIRMED": "Confirmed attendance",
  "DECLINED": "Declined attendance",
  "MAYBE": "Maybe attending",
  "CANCELLED": "Cancelled participation"
}
```

### Admin Roles

```json
{
  "SUPER_ADMIN": "Full system access",
  "ADMIN": "Standard admin access",
  "MODERATOR": "Limited admin access"
}
```

### Feature Flag Types

```json
{
  "NEW_UI": "Modern user interface",
  "CHAT_FEATURE": "Real-time chat functionality",
  "EVENT_REGISTRATION": "Event registration system",
  "PAYMENT_INTEGRATION": "Payment processing",
  "SOCIAL_LOGIN": "Social media login options",
  "DARK_MODE": "Dark mode theme",
  "NOTIFICATIONS": "Push notifications",
  "ADVANCED_SEARCH": "Advanced search with filters",
  "ALUMNI_DIRECTORY": "Public alumni directory",
  "MENTORSHIP_PROGRAM": "Mentorship program matching"
}
```

---

## 🚀 Frontend Integration Guide

### 1. Authentication Flow

```javascript
// Login example
const login = async (email, password) => {
  const response = await fetch("/api/v1/user/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (data.success) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("refreshToken", data.data.refreshToken);
  }
  return data;
};
```

### 2. Event Management

```javascript
// Create event example
const createEvent = async (eventData) => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/v1/user/events/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  return await response.json();
};
```

### 3. Feature Flag Integration

```javascript
// Check feature flag example
const checkFeatureFlag = async (flagName) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/v1/user/feature-flags/${flagName}/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.data.enabled;
};

// Conditional rendering based on feature flag
const renderFeature = async (flagName, component) => {
  const isEnabled = await checkFeatureFlag(flagName);
  return isEnabled ? component : null;
};
```

### 4. Error Handling

```javascript
// Global error handler
const handleApiError = (error) => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = "/login";
  } else if (error.status === 403) {
    // Show access denied message
    showNotification("Access denied", "error");
  } else {
    // Show generic error message
    showNotification("An error occurred", "error");
  }
};
```

---

## 📝 Notes for Frontend Team

### 1. Authentication

- All API calls (except login/signup) require the `Authorization: Bearer <token>` header
- Store JWT tokens securely (localStorage/sessionStorage)
- Implement token refresh logic for expired tokens
- Handle 401 responses by redirecting to login

### 2. Event Management

- Use pagination for event lists (page, size parameters)
- Implement real-time updates for event participation
- Handle file uploads for event media
- Implement search with multiple filters

### 3. Feature Flags

- Check feature flags before rendering components
- Implement fallback UI for disabled features
- Cache feature flag status for performance
- Update UI dynamically when flags change

### 4. Error Handling

- Implement comprehensive error handling
- Show user-friendly error messages
- Handle network errors gracefully
- Implement retry logic for failed requests

### 5. Performance

- Implement request caching where appropriate
- Use pagination for large datasets
- Optimize image uploads and media handling
- Implement lazy loading for event lists

---

## 🔄 API Versioning

All endpoints use version `v1`. Future updates will use `v2`, `v3`, etc., ensuring backward compatibility.

---

_Last Updated: December 2024_
_API Version: v1_
_Status: Production Ready_
