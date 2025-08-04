# 🚀 IJAA Backend API Documentation

## 📋 **Overview**

This document provides comprehensive API documentation for the IJAA (IIT Jahangirnagar Alumni Association) backend system. The API follows RESTful principles and uses JWT-based authentication.

**Base URL:** `http://localhost:8000` (Gateway Service)

---

## 🔐 **Authentication**

### **JWT Token Format:**

```
Authorization: Bearer <jwt_token>
```

### **Token Claims:**

- **User Tokens:** `username`, `role: "USER"`, `userType: "ALUMNI"`
- **Admin Tokens:** `email`, `role: "ADMIN"`, `userType: "ADMIN"`

### **Token Expiration:** 1 hour (3600 seconds)

---

## 👥 **User Authentication APIs**

### **1. User Registration**

```http
POST /api/v1/user/signup
Content-Type: application/json

{
  "username": "john.doe",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "Registration successful",
  "code": "201",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "USER_ABC123XYZ"
  }
}
```

### **2. User Login**

```http
POST /api/v1/user/signin
Content-Type: application/json

{
  "username": "john.doe",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "code": "200",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "USER_ABC123XYZ"
  }
}
```

---

## 👨‍💼 **Admin Authentication APIs**

### **3. Admin Login**

```http
POST /api/v1/admin/login
Content-Type: application/json

{
  "email": "admin@ijaa.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "message": "Admin login successful",
  "code": "200",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "adminId": 1,
    "name": "Administrator",
    "email": "admin@ijaa.com",
    "role": "ADMIN",
    "active": true
  }
}
```

### **4. Admin Registration**

```http
POST /api/v1/admin/signup
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@ijaa.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "message": "Admin registration successful",
  "code": "201",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "adminId": 2,
    "name": "New Admin",
    "email": "newadmin@ijaa.com",
    "role": "USER",
    "active": true
  }
}
```

---

## 👤 **User Profile Management APIs**

### **5. Get User Profile**

```http
GET /api/v1/user/profile/{userId}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Profile fetched successfully",
  "code": "200",
  "data": {
    "username": "john.doe",
    "userId": "USER_ABC123XYZ",
    "name": "John Doe",
    "profession": "Software Engineer",
    "location": "Dhaka, Bangladesh",
    "bio": "Alumni from IIT, Jahangirnagar University",
    "phone": "+880-1234567890",
    "linkedIn": "https://linkedin.com/in/johndoe",
    "website": "https://johndoe.com",
    "batch": "2018",
    "email": "john@example.com",
    "facebook": "https://facebook.com/johndoe",
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": true,
    "showEmail": true,
    "showFacebook": true,
    "connections": 25,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### **6. Update Basic Profile Info**

```http
PUT /api/v1/user/basic
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "profession": "Software Engineer",
  "location": "Dhaka, Bangladesh",
  "bio": "Updated bio information",
  "phone": "+880-1234567890",
  "linkedIn": "https://linkedin.com/in/johndoe",
  "website": "https://johndoe.com",
  "batch": "2018",
  "email": "john@example.com",
  "facebook": "https://facebook.com/johndoe"
}
```

### **7. Update Profile Visibility Settings**

```http
PUT /api/v1/user/visibility
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "showPhone": true,
  "showLinkedIn": true,
  "showWebsite": false,
  "showEmail": true,
  "showFacebook": false
}
```

---

## 💼 **Experience Management APIs**

### **8. Get User Experiences**

```http
GET /api/v1/user/experiences/{userId}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Experiences retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "title": "Senior Software Engineer",
      "company": "Tech Corp",
      "period": "2022 - Present",
      "description": "Leading development team for web applications"
    }
  ]
}
```

### **9. Add Experience**

```http
POST /api/v1/user/experiences
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "company": "Startup Inc",
  "period": "2020 - 2022",
  "description": "Developed full-stack web applications"
}
```

### **10. Delete Experience**

```http
DELETE /api/v1/user/experiences/{userId}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "experienceId": 1
}
```

---

## 🎯 **Interest Management APIs**

### **11. Get User Interests**

```http
GET /api/v1/user/interests/{userId}
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Interests retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "interest": "Web Development",
      "createdAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### **12. Add Interest**

```http
POST /api/v1/user/interests
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "interest": "Machine Learning"
}
```

### **13. Delete Interest**

```http
DELETE /api/v1/user/interests/{userId}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "interestId": 1
}
```

---

## 🔍 **Alumni Search APIs**

### **14. Search Alumni (POST)**

```http
POST /api/v1/user/alumni/search
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John",
  "batch": "2018",
  "department": "CSE",
  "profession": "Software Engineer",
  "location": "Dhaka",
  "skills": ["Java", "Spring Boot"]
}
```

### **15. Search Alumni (GET)**

```http
GET /api/v1/user/alumni/search?name=John&batch=2018&department=CSE
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Alumni search completed",
  "code": "200",
  "data": [
    {
      "username": "john.doe",
      "name": "John Doe",
      "batch": "2018",
      "department": "CSE",
      "profession": "Software Engineer",
      "company": "Tech Corp",
      "location": "Dhaka, Bangladesh",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Software Engineer with 5 years experience",
      "connections": 25,
      "skills": ["Java", "Spring Boot", "React"],
      "isVisible": true
    }
  ]
}
```

---

## 🎉 **User Event Management APIs**

### **16. Get User's Events**

```http
GET /api/v1/user/events/my-events
Authorization: Bearer <jwt_token>
```

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
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

### **17. Get User's Active Events**

```http
GET /api/v1/user/events/my-events/active
Authorization: Bearer <jwt_token>
```

### **18. Get User's Event by ID**

```http
GET /api/v1/user/events/my-events/{eventId}
Authorization: Bearer <jwt_token>
```

### **19. Create Event**

```http
POST /api/v1/user/events/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Alumni Meet 2024",
  "description": "Annual alumni gathering",
  "startDate": "2024-12-25T18:00:00",
  "endDate": "2024-12-25T22:00:00",
  "location": "IIT Campus",
  "eventType": "MEETING",
  "isOnline": false,
  "meetingLink": null,
  "maxParticipants": 100,
  "organizerName": "John Doe",
  "organizerEmail": "john@example.com"
}
```

### **20. Update User's Event**

```http
PUT /api/v1/user/events/my-events/{eventId}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Alumni Meet 2024",
  "description": "Updated annual alumni gathering",
  "startDate": "2024-12-25T18:00:00",
  "endDate": "2024-12-25T22:00:00",
  "location": "IIT Campus",
  "eventType": "MEETING",
  "isOnline": false,
  "meetingLink": null,
  "maxParticipants": 100,
  "organizerName": "John Doe",
  "organizerEmail": "john@example.com"
}
```

### **21. Delete User's Event**

```http
DELETE /api/v1/user/events/my-events/{eventId}
Authorization: Bearer <jwt_token>
```

### **22. Get All Active Events (Public)**

```http
GET /api/v1/user/events/all-events
Authorization: Bearer <jwt_token>
```

### **23. Get Event by ID (Public)**

```http
GET /api/v1/user/events/all-events/{eventId}
Authorization: Bearer <jwt_token>
```

---

## 👨‍💼 **Admin Management APIs**

### **24. Get Admin Profile**

```http
GET /api/v1/admin/profile
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Admin profile retrieved successfully",
  "code": "200",
  "data": {
    "adminId": 1,
    "name": "Administrator",
    "email": "admin@ijaa.com",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  }
}
```

### **25. Get Dashboard Statistics**

```http
GET /api/v1/admin/dashboard
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Dashboard statistics retrieved successfully",
  "code": "200",
  "data": {
    "totalUsers": 150,
    "totalAdmins": 5,
    "totalEvents": 25,
    "activeEvents": 20,
    "totalAnnouncements": 10,
    "totalReports": 3
  }
}
```

### **26. Get All Admins**

```http
GET /api/v1/admin/admins
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Admins retrieved successfully",
  "code": "200",
  "data": [
    {
      "adminId": 1,
      "name": "Administrator",
      "email": "admin@ijaa.com",
      "role": "ADMIN",
      "active": true,
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### **27. Update Admin Role**

```http
PUT /api/v1/admin/admins/{adminId}/role
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "role": "ADMIN"
}
```

### **28. Deactivate Admin**

```http
POST /api/v1/admin/admins/{adminId}/deactivate
Authorization: Bearer <jwt_token>
```

### **29. Activate Admin**

```http
POST /api/v1/admin/admins/{adminId}/activate
Authorization: Bearer <jwt_token>
```

---

## 👥 **User Management (Admin) APIs**

### **30. Get All Users**

```http
GET /api/v1/admin/users
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Users retrieved successfully",
  "code": "200",
  "data": [
    {
      "userId": "USER_ABC123XYZ",
      "username": "john.doe",
      "active": true,
      "createdAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### **31. Block User**

```http
POST /api/v1/admin/users/{userId}/block
Authorization: Bearer <jwt_token>
```

### **32. Unblock User**

```http
POST /api/v1/admin/users/{userId}/unblock
Authorization: Bearer <jwt_token>
```

### **33. Delete User**

```http
DELETE /api/v1/admin/users/{userId}
Authorization: Bearer <jwt_token>
```

---

## 🎉 **Event Management (Admin) APIs**

### **34. Get All Events (Admin)**

```http
GET /api/v1/admin/events
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Events retrieved successfully",
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
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

### **35. Create Event (Admin)**

```http
POST /api/v1/admin/events
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Admin Created Event",
  "description": "Event created by admin",
  "startDate": "2024-12-25T18:00:00",
  "endDate": "2024-12-25T22:00:00",
  "location": "IIT Campus",
  "eventType": "MEETING",
  "isOnline": false,
  "meetingLink": null,
  "maxParticipants": 100,
  "organizerName": "Admin User",
  "organizerEmail": "admin@ijaa.com"
}
```

### **36. Update Event (Admin)**

```http
PUT /api/v1/admin/events/{eventId}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Admin Event",
  "description": "Updated event description",
  "startDate": "2024-12-25T18:00:00",
  "endDate": "2024-12-25T22:00:00",
  "location": "IIT Campus",
  "eventType": "MEETING",
  "isOnline": false,
  "meetingLink": null,
  "maxParticipants": 100,
  "organizerName": "Admin User",
  "organizerEmail": "admin@ijaa.com"
}
```

### **37. Delete Event (Admin)**

```http
DELETE /api/v1/admin/events/{eventId}
Authorization: Bearer <jwt_token>
```

---

## 📢 **Announcement Management (Admin) APIs**

### **38. Get All Announcements**

```http
GET /api/v1/admin/announcements
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Announcements retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "title": "Important Announcement",
      "content": "This is an important announcement for all alumni",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### **39. Create Announcement**

```http
POST /api/v1/admin/announcements
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Announcement",
  "content": "This is a new announcement for all alumni"
}
```

### **40. Delete Announcement**

```http
DELETE /api/v1/admin/announcements/{announcementId}
Authorization: Bearer <jwt_token>
```

---

## 📊 **Report Management (Admin) APIs**

### **41. Get All Reports**

```http
GET /api/v1/admin/reports
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Reports retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "reporterUsername": "john.doe",
      "reportedUsername": "jane.smith",
      "reason": "Inappropriate content",
      "description": "User posted inappropriate content",
      "status": "PENDING",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### **42. Resolve Report**

```http
POST /api/v1/admin/reports/{reportId}/resolve
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "resolution": "Warning issued to user",
  "action": "WARN"
}
```

---

## 🚩 **Feature Flag Management (Admin) APIs**

### **43. Get All Feature Flags**

```http
GET /api/v1/admin/feature-flags
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Feature flags retrieved successfully",
  "code": "200",
  "data": [
    {
      "featureName": "user_events",
      "enabled": true,
      "description": "Allow users to create and manage events",
      "createdAt": "2024-01-01T10:00:00",
      "updatedAt": "2024-01-01T10:00:00"
    }
  ]
}
```

### **44. Update Feature Flag**

```http
PUT /api/v1/admin/feature-flags/{featureName}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "enabled": true,
  "description": "Updated feature description"
}
```

---

## ⚠️ **Error Responses**

### **Common Error Formats:**

#### **401 Unauthorized:**

```json
{
  "message": "Missing Authorization Header",
  "code": "401",
  "data": null
}
```

#### **403 Forbidden:**

```json
{
  "message": "Access denied",
  "code": "403",
  "data": null
}
```

#### **404 Not Found:**

```json
{
  "message": "Resource not found",
  "code": "404",
  "data": null
}
```

#### **400 Bad Request:**

```json
{
  "message": "Invalid request data",
  "code": "400",
  "data": null
}
```

#### **500 Internal Server Error:**

```json
{
  "message": "Internal server error",
  "code": "500",
  "data": null
}
```

---

## 🔧 **Request/Response DTOs**

### **EventRequest:**

```json
{
  "title": "string (required, max 200 chars)",
  "description": "string (optional)",
  "startDate": "datetime (required, ISO format)",
  "endDate": "datetime (required, ISO format)",
  "location": "string (optional, max 100 chars)",
  "eventType": "string (optional, max 50 chars)",
  "isOnline": "boolean (optional, default false)",
  "meetingLink": "string (optional, max 500 chars)",
  "maxParticipants": "integer (required, min 1)",
  "organizerName": "string (required, max 100 chars)",
  "organizerEmail": "string (required, max 100 chars)"
}
```

### **ProfileDto:**

```json
{
  "username": "string",
  "userId": "string",
  "name": "string",
  "profession": "string",
  "location": "string",
  "bio": "string",
  "phone": "string",
  "linkedIn": "string",
  "website": "string",
  "batch": "string",
  "email": "string",
  "facebook": "string",
  "showPhone": "boolean",
  "showLinkedIn": "boolean",
  "showWebsite": "boolean",
  "showEmail": "boolean",
  "showFacebook": "boolean",
  "connections": "integer",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## 🚀 **Frontend Integration Guide**

### **1. Authentication Flow:**

```javascript
// Login
const loginResponse = await fetch("/api/v1/user/signin", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});

const {
  data: { token },
} = await loginResponse.json();

// Store token
localStorage.setItem("jwt_token", token);
```

### **2. Authenticated Requests:**

```javascript
// Add token to all requests
const headers = {
  Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  "Content-Type": "application/json",
};

const response = await fetch("/api/v1/user/profile/user123", {
  headers,
});
```

### **3. Error Handling:**

```javascript
try {
  const response = await fetch("/api/v1/user/events/create", {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  const result = await response.json();
} catch (error) {
  console.error("API Error:", error.message);
}
```

### **4. Event Management Example:**

```javascript
// Create event
const createEvent = async (eventData) => {
  const response = await fetch("/api/v1/user/events/create", {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  });
  return response.json();
};

// Get user's events
const getUserEvents = async () => {
  const response = await fetch("/api/v1/user/events/my-events", {
    headers,
  });
  return response.json();
};

// Get all events
const getAllEvents = async () => {
  const response = await fetch("/api/v1/user/events/all-events", {
    headers,
  });
  return response.json();
};
```

---

## 📱 **Mobile App Integration**

### **React Native Example:**

```javascript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Store token
await AsyncStorage.setItem("jwt_token", token);

// Get token
const token = await AsyncStorage.getItem("jwt_token");

// API call
const response = await fetch(`${API_BASE_URL}/api/v1/user/events/my-events`, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

---

## 🔄 **WebSocket Support (Future)**

### **Real-time Updates:**

```javascript
// Connect to WebSocket
const ws = new WebSocket("ws://localhost:8000/ws");

// Listen for event updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "EVENT_CREATED") {
    // Update UI with new event
  }
};
```

---

## 📊 **API Rate Limits**

### **Current Limits:**

- **Authentication:** 10 requests per minute
- **Event Creation:** 5 events per hour per user
- **Search:** 20 requests per minute
- **Profile Updates:** 10 requests per minute

### **Rate Limit Headers:**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 1640995200
```

---

## 🧪 **Testing Endpoints**

### **Swagger UI:**

```
http://localhost:8081/swagger-ui.html
```

### **Health Check:**

```
GET /actuator/health
```

### **API Info:**

```
GET /actuator/info
```

---

## 📈 **Monitoring & Analytics**

### **Available Metrics:**

- Request count per endpoint
- Response times
- Error rates
- User activity
- Event creation trends

### **Monitoring Endpoints:**

```
GET /actuator/metrics
GET /actuator/metrics/http.server.requests
GET /actuator/metrics/jvm.memory.used
```

---

## 🔐 **Security Best Practices**

### **Frontend Implementation:**

1. **Token Storage:** Use secure storage (not localStorage for sensitive apps)
2. **Token Refresh:** Implement automatic token refresh
3. **Error Handling:** Handle 401/403 errors gracefully
4. **Input Validation:** Validate all user inputs
5. **HTTPS:** Always use HTTPS in production

### **Backend Security:**

1. **CORS:** Configured for frontend domains
2. **Rate Limiting:** Implemented on all endpoints
3. **Input Validation:** Comprehensive validation
4. **SQL Injection:** Protected via JPA
5. **XSS Protection:** Input sanitization

---

## 📞 **Support & Contact**

### **API Support:**

- **Email:** api-support@ijaa.com
- **Documentation:** https://docs.ijaa.com/api
- **GitHub:** https://github.com/ijaa/backend

### **Development Team:**

- **Lead Developer:** dev@ijaa.com
- **DevOps:** devops@ijaa.com
- **QA:** qa@ijaa.com

---

## 📝 **Changelog**

### **v2.1.0 (Current)**

- ✅ Added User Event Management APIs
- ✅ Enhanced Event Response with creator tracking
- ✅ Added comprehensive error handling
- ✅ Improved API documentation
- ✅ Added rate limiting
- ✅ Enhanced security measures

### **v2.0.0**

- ✅ Complete user authentication system
- ✅ Admin management features
- ✅ Profile management
- ✅ Alumni search functionality
- ✅ Experience and interest tracking

### **v1.0.0**

- ✅ Basic authentication
- ✅ User registration and login
- ✅ Simple profile management

---

_Last Updated: December 2024_
_API Version: 2.1.0_
