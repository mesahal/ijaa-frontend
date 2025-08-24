# Profile Resource APIs Documentation

This document provides comprehensive API documentation for the Profile Resource endpoints, including request/response examples for frontend integration.

## Base URL
```
http://localhost:8081/api/v1/user
```

## Authentication
All protected endpoints require:
- **Authorization Header**: `Bearer <JWT_TOKEN>`
- **X-USER_ID Header**: Base64 encoded user context

## API Endpoints

---

## 1. Get User Profile

### Endpoint
```
GET /profile/{userId}
```

### Description
Get user profile by userId (Public endpoint - no authentication required)

### Path Parameters
- `userId` (string, required): The user ID to fetch profile for

### Request Example
```bash
curl -X GET "http://localhost:8081/api/v1/user/profile/USER_123456" \
  -H "Content-Type: application/json"
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Profile fetched successfully",
  "code": "200",
  "data": {
    "userId": "USER_123456",
    "name": "John Doe",
    "profession": "Software Engineer",
    "location": "New York, NY",
    "bio": "A passionate software developer with expertise in Java and Spring Boot.",
    "batch": "2020",
    "connections": 150,
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": true,
    "showEmail": true,
    "showFacebook": false,
    "phone": "+1-555-123-4567",
    "linkedIn": "https://www.linkedin.com/in/johndoe/",
    "website": "https://www.johndoe.dev",
    "email": "johndoe@example.com",
    "facebook": "https://www.facebook.com/johndoe"
  }
}
```

#### Error Response (404)
```json
{
  "message": "Profile not found",
  "code": "404",
  "data": null
}
```

---

## 2. Update Basic Profile Info

### Endpoint
```
PUT /profile
```

### Description
Update basic profile information (USER role required)

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Body
```json
{
  "userId": "USER_123456",
  "name": "John Doe",
  "profession": "Software Engineer",
  "location": "New York, NY",
  "bio": "A passionate software developer with expertise in Java and Spring Boot.",
  "phone": "+1-555-123-4567",
  "linkedIn": "https://www.linkedin.com/in/johndoe/",
  "website": "https://www.johndoe.dev",
  "batch": "2020",
  "facebook": "https://www.facebook.com/johndoe",
  "email": "johndoe@example.com",
  "showPhone": true,
  "showLinkedIn": true,
  "showWebsite": true,
  "showEmail": true,
  "showFacebook": false,
  "connections": 150
}
```

### Request Example
```bash
curl -X PUT "http://localhost:8081/api/v1/user/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>" \
  -d '{
    "name": "John Doe",
    "profession": "Software Engineer",
    "location": "New York, NY",
    "bio": "A passionate software developer with expertise in Java and Spring Boot.",
    "phone": "+1-555-123-4567",
    "linkedIn": "https://www.linkedin.com/in/johndoe/",
    "website": "https://www.johndoe.dev",
    "batch": "2020",
    "email": "johndoe@example.com",
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": true,
    "showEmail": true,
    "showFacebook": false
  }'
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Profile updated successfully",
  "code": "200",
  "data": {
    "userId": "USER_123456",
    "name": "John Doe",
    "profession": "Software Engineer",
    "location": "New York, NY",
    "bio": "A passionate software developer with expertise in Java and Spring Boot.",
    "batch": "2020",
    "connections": 150,
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": true,
    "showEmail": true,
    "showFacebook": false,
    "phone": "+1-555-123-4567",
    "linkedIn": "https://www.linkedin.com/in/johndoe/",
    "website": "https://www.johndoe.dev",
    "email": "johndoe@example.com",
    "facebook": "https://www.facebook.com/johndoe"
  }
}
```

#### Error Response (401)
```json
{
  "message": "Missing Authorization Header",
  "code": "401",
  "data": null
}
```

---

## 3. Update Profile Visibility

### Endpoint
```
PUT /visibility
```

### Description
Update profile visibility settings (USER role required)

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Body
```json
{
  "showPhone": true,
  "showLinkedIn": true,
  "showWebsite": false,
  "showEmail": true,
  "showFacebook": false
}
```

### Request Example
```bash
curl -X PUT "http://localhost:8081/api/v1/user/visibility" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>" \
  -d '{
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": false,
    "showEmail": true,
    "showFacebook": false
  }'
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Visibility updated successfully",
  "code": "200",
  "data": {
    "userId": "USER_123456",
    "name": "John Doe",
    "profession": "Software Engineer",
    "location": "New York, NY",
    "bio": "A passionate software developer with expertise in Java and Spring Boot.",
    "batch": "2020",
    "connections": 150,
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": false,
    "showEmail": true,
    "showFacebook": false,
    "phone": "+1-555-123-4567",
    "linkedIn": "https://www.linkedin.com/in/johndoe/",
    "website": "https://www.johndoe.dev",
    "email": "johndoe@example.com",
    "facebook": "https://www.facebook.com/johndoe"
  }
}
```

---

## 4. Get User Experiences

### Endpoint
```
GET /experiences/{userId}
```

### Description
Get user experiences by userId (Public endpoint - no authentication required)

### Path Parameters
- `userId` (string, required): The user ID to fetch experiences for

### Request Example
```bash
curl -X GET "http://localhost:8081/api/v1/user/experiences/USER_123456" \
  -H "Content-Type: application/json"
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Experiences fetched successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "userId": "USER_123456",
      "title": "Senior Software Engineer",
      "company": "Tech Innovations Inc",
      "period": "2022-2024",
      "description": "Led development of microservices architecture",
      "createdAt": "2024-01-15T10:30:00"
    },
    {
      "id": 2,
      "userId": "USER_123456",
      "title": "Software Developer",
      "company": "StartupXYZ",
      "period": "2020-2022",
      "description": "Developed full-stack web applications",
      "createdAt": "2024-01-10T14:20:00"
    }
  ]
}
```

---

## 5. Add Experience

### Endpoint
```
POST /experiences
```

### Description
Add a new experience to user profile (USER role required)

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Body
```json
{
  "title": "Senior Software Engineer",
  "company": "Tech Innovations Inc",
  "period": "2022-2024",
  "description": "Led development of microservices architecture"
}
```

### Request Example
```bash
curl -X POST "http://localhost:8081/api/v1/user/experiences" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>" \
  -d '{
    "title": "Senior Software Engineer",
    "company": "Tech Innovations Inc",
    "period": "2022-2024",
    "description": "Led development of microservices architecture"
  }'
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Experience added successfully",
  "code": "200",
  "data": {
    "id": 3,
    "userId": "USER_123456",
    "title": "Senior Software Engineer",
    "company": "Tech Innovations Inc",
    "period": "2022-2024",
    "description": "Led development of microservices architecture",
    "createdAt": "2024-01-20T09:15:00"
  }
}
```

---

## 6. Update Experience

### Endpoint
```
PUT /experiences/{experienceId}
```

### Description
Update a specific experience by ID (USER role required)

### Path Parameters
- `experienceId` (long, required): ID of the experience to update

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Body
```json
{
  "title": "Lead Software Engineer",
  "company": "Updated Company Name",
  "period": "2023-2024",
  "description": "Updated description with new responsibilities"
}
```

### Request Example
```bash
curl -X PUT "http://localhost:8081/api/v1/user/experiences/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>" \
  -d '{
    "title": "Lead Software Engineer",
    "company": "Updated Company Name",
    "period": "2023-2024",
    "description": "Updated description with new responsibilities"
  }'
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Experience updated successfully",
  "code": "200",
  "data": {
    "id": 1,
    "userId": "USER_123456",
    "title": "Lead Software Engineer",
    "company": "Updated Company Name",
    "period": "2023-2024",
    "description": "Updated description with new responsibilities",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

#### Error Response (404)
```json
{
  "message": "Experience not found or unauthorized",
  "code": "404",
  "data": null
}
```

---

## 7. Delete Experience

### Endpoint
```
DELETE /experiences/{experienceId}
```

### Description
Delete a specific experience by ID (USER role required)

### Path Parameters
- `experienceId` (long, required): ID of the experience to delete

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Example
```bash
curl -X DELETE "http://localhost:8081/api/v1/user/experiences/1" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>"
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Experience deleted successfully",
  "code": "200",
  "data": null
}
```

#### Error Response (404)
```json
{
  "message": "Experience not found or unauthorized",
  "code": "404",
  "data": null
}
```

---

## 8. Get User Interests

### Endpoint
```
GET /interests/{userId}
```

### Description
Get user interests by userId (Public endpoint - no authentication required)

### Path Parameters
- `userId` (string, required): The user ID to fetch interests for

### Request Example
```bash
curl -X GET "http://localhost:8081/api/v1/user/interests/USER_123456" \
  -H "Content-Type: application/json"
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Interests fetched successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "userId": "USER_123456",
      "interest": "Machine Learning",
      "createdAt": "2024-01-15T10:30:00"
    },
    {
      "id": 2,
      "userId": "USER_123456",
      "interest": "Web Development",
      "createdAt": "2024-01-10T14:20:00"
    }
  ]
}
```

---

## 9. Add Interest

### Endpoint
```
POST /interests
```

### Description
Add a new interest to user profile (USER role required)

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Body
```json
{
  "interest": "Artificial Intelligence"
}
```

### Request Example
```bash
curl -X POST "http://localhost:8081/api/v1/user/interests" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>" \
  -d '{
    "interest": "Artificial Intelligence"
  }'
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Interest added successfully",
  "code": "200",
  "data": {
    "id": 3,
    "userId": "USER_123456",
    "interest": "Artificial Intelligence",
    "createdAt": "2024-01-20T09:15:00"
  }
}
```

#### Error Response (400)
```json
{
  "message": "Interest already exists",
  "code": "400",
  "data": null
}
```

---

## 10. Update Interest

### Endpoint
```
PUT /interests/{interestId}
```

### Description
Update a specific interest by ID (USER role required)

### Path Parameters
- `interestId` (long, required): ID of the interest to update

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Body
```json
{
  "interest": "Data Science"
}
```

### Request Example
```bash
curl -X PUT "http://localhost:8081/api/v1/user/interests/1" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>" \
  -d '{
    "interest": "Data Science"
  }'
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Interest updated successfully",
  "code": "200",
  "data": {
    "id": 1,
    "userId": "USER_123456",
    "interest": "Data Science",
    "createdAt": "2024-01-15T10:30:00"
  }
}
```

#### Error Response (400)
```json
{
  "message": "Interest already exists",
  "code": "400",
  "data": null
}
```

#### Error Response (404)
```json
{
  "message": "Interest not found or unauthorized",
  "code": "404",
  "data": null
}
```

---

## 11. Delete Interest

### Endpoint
```
DELETE /interests/{interestId}
```

### Description
Delete a specific interest by ID (USER role required)

### Path Parameters
- `interestId` (long, required): ID of the interest to delete

### Headers
- `Authorization: Bearer <JWT_TOKEN>`
- `X-USER_ID: <base64_encoded_user_context>`

### Request Example
```bash
curl -X DELETE "http://localhost:8081/api/v1/user/interests/1" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "X-USER_ID: <base64_encoded_user_context>"
```

### Response Example

#### Success Response (200)
```json
{
  "message": "Interest deleted successfully",
  "code": "200",
  "data": null
}
```

#### Error Response (404)
```json
{
  "message": "Interest not found or unauthorized",
  "code": "404",
  "data": null
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation errors, duplicate interests) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient privileges) |
| 404 | Not Found (resource not found or unauthorized) |
| 500 | Internal Server Error |

## Data Models

### ProfileDto
```json
{
  "userId": "string",
  "name": "string",
  "profession": "string",
  "location": "string",
  "bio": "string",
  "batch": "string",
  "connections": "number",
  "showPhone": "boolean",
  "showLinkedIn": "boolean",
  "showWebsite": "boolean",
  "showEmail": "boolean",
  "showFacebook": "boolean",
  "phone": "string",
  "linkedIn": "string",
  "website": "string",
  "email": "string",
  "facebook": "string"
}
```

### ExperienceDto
```json
{
  "id": "number",
  "userId": "string",
  "title": "string",
  "company": "string",
  "period": "string",
  "description": "string",
  "createdAt": "string (ISO 8601)"
}
```

### InterestDto
```json
{
  "id": "number",
  "userId": "string",
  "interest": "string",
  "createdAt": "string (ISO 8601)"
}
```

### InterestRequest
```json
{
  "interest": "string"
}
```

## Frontend Integration Notes

1. **Authentication**: Always include the JWT token in the Authorization header for protected endpoints
2. **User Context**: Include the X-USER_ID header with base64 encoded user context for all authenticated requests
3. **Error Handling**: Implement proper error handling for all response codes
4. **Validation**: Client-side validation should match server-side validation rules
5. **Partial Updates**: Experience updates support partial updates - only send the fields you want to update
6. **Duplicate Prevention**: Interest names must be unique per user (case-insensitive)
7. **Authorization**: Users can only modify their own experiences and interests

## Testing

You can test these APIs using:
- **Swagger UI**: Available at `http://localhost:8081/swagger-ui.html`
- **Postman**: Use the provided curl examples
- **Frontend Application**: Integrate using the provided examples

---

*Last Updated: December 2024*
*API Version: v1*
