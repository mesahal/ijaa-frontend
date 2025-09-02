# Event Banner APIs - Frontend Integration Guide

## Overview
This document provides comprehensive API documentation for the Event Banner system, which has been **properly integrated with the File Service** following the same pattern as user profile and cover photos. The Event Banner system now handles actual file uploads, storage, and serving through the dedicated File Service.

**Base URL:** `http://localhost:8080/ijaa/api/v1/user/events/banner`

**Authentication:** All endpoints require authentication via `X-USER_ID` header (except where noted)

**File Service Integration:** Event banners are stored and served through the File Service, ensuring consistent file handling across the application.

---

## 1. Upload Event Banner

### Endpoint
```
POST /api/v1/user/events/banner/{eventId}
```

### Description
Upload or update a banner image for an event. Each event can have only one banner image. If a banner already exists for the event, it will be automatically replaced. The file is stored and served through the File Service.

### Headers
```
Content-Type: multipart/form-data
X-USER_ID: {username}
Authorization: Bearer {token}
```

### Path Parameters
- `eventId` (String): ID of the event

### Form Data
- `file` (MultipartFile): Banner image file (JPG, JPEG, PNG, WEBP, max 5MB)

### Response (Success - 201)
```json
{
    "message": "Banner uploaded successfully",
    "code": "201",
    "data": {
        "message": "Event banner uploaded successfully",
        "fileUrl": "/ijaa/api/v1/events/1/banner/file/abc123.jpg",
        "fileName": "abc123.jpg",
        "fileSize": 1024000
    }
}
```

### Response (Error - 400)
```json
{
    "message": "File type not allowed. Allowed types: jpg, jpeg, png, webp",
    "code": "400",
    "data": null
}
```

### Response (Error - 401)
```json
{
    "message": "Authentication required",
    "code": "401",
    "data": null
}
```

### Response (Error - 404)
```json
{
    "message": "Event not found",
    "code": "404",
    "data": null
}
```

---

## 2. Get Event Banner URL

### Endpoint
```
GET /api/v1/user/events/banner/{eventId}
```

### Description
Get the banner URL for a specific event. This returns the URL that can be used to access the banner image file.

### Path Parameters
- `eventId` (String): ID of the event

### Response (Success - 200)
```json
{
    "message": "Banner URL retrieved successfully",
    "code": "200",
    "data": {
        "photoUrl": "/ijaa/api/v1/events/1/banner/file/abc123.jpg",
        "message": "Event banner found",
        "exists": true
    }
}
```

### Response (Success - 200 - No Banner)
```json
{
    "message": "Banner URL retrieved successfully",
    "code": "200",
    "data": {
        "photoUrl": null,
        "message": "No event banner found",
        "exists": false
    }
}
```

---

## 3. Delete Event Banner

### Endpoint
```
DELETE /api/v1/user/events/banner/{eventId}
```

### Description
Delete the banner image for an event. This removes both the file from storage and the database record.

### Headers
```
X-USER_ID: {username}
Authorization: Bearer {token}
```

### Path Parameters
- `eventId` (String): ID of the event

### Response (Success - 200)
```json
{
    "message": "Banner deleted successfully",
    "code": "200",
    "data": null
}
```

### Response (Error - 404)
```json
{
    "message": "Event not found",
    "code": "404",
    "data": null
}
```

---

## 4. Serve Event Banner File (Public)

### Endpoint
```
GET /ijaa/api/v1/events/{eventId}/banner/file/{fileName}
```

### Description
**Public endpoint** - Serve the actual event banner image file. This endpoint returns the image file directly and can be used in `<img>` tags or for direct file access.

### Path Parameters
- `eventId` (String): ID of the event
- `fileName` (String): Name of the banner file

### Response (Success - 200)
- **Content-Type:** `image/jpeg` (or appropriate image type)
- **Body:** Raw image file data

### Response (Error - 404)
- File not found or access denied

---

## Data Models

### FileUploadResponse
```json
{
    "message": "Event banner uploaded successfully",
    "fileUrl": "/ijaa/api/v1/events/1/banner/file/abc123.jpg",
    "fileName": "abc123.jpg",
    "fileSize": 1024000
}
```

### PhotoUrlResponse
```json
{
    "photoUrl": "/ijaa/api/v1/events/1/banner/file/abc123.jpg",
    "message": "Event banner found",
    "exists": true
}
```

---

## Error Responses

### Common Error Codes
- **400**: Bad Request (validation errors, invalid file type)
- **401**: Unauthorized (missing or invalid authentication)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (event or banner doesn't exist)
- **500**: Internal Server Error

### Error Response Format
```json
{
    "message": "Error description",
    "code": "400",
    "data": null
}
```

---

## Frontend Integration Examples

### JavaScript/TypeScript Examples

#### Upload Event Banner
```javascript
const uploadBanner = async (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`/ijaa/api/v1/user/events/banner/${eventId}`, {
        method: 'POST',
        headers: {
            'X-USER_ID': 'current_username',
            'Authorization': 'Bearer ' + token
        },
        body: formData
    });
    
    return await response.json();
};
```

#### Get Event Banner URL
```javascript
const getBannerUrl = async (eventId) => {
    const response = await fetch(`/ijaa/api/v1/user/events/banner/${eventId}`, {
        method: 'GET',
        headers: {
            'X-USER_ID': 'current_username',
            'Authorization': 'Bearer ' + token
        }
    });
    
    return await response.json();
};
```

#### Display Event Banner in HTML
```html
<!-- Get the banner URL first, then display -->
<img id="eventBanner" src="" alt="Event Banner" style="display: none;">

<script>
const displayBanner = async (eventId) => {
    try {
        const response = await getBannerUrl(eventId);
        if (response.data && response.data.exists) {
            const img = document.getElementById('eventBanner');
            img.src = response.data.photoUrl;
            img.style.display = 'block';
        }
    } catch (error) {
        console.error('Failed to load banner:', error);
    }
};
</script>
```

#### Delete Event Banner
```javascript
const deleteBanner = async (eventId) => {
    const response = await fetch(`/ijaa/api/v1/user/events/banner/${eventId}`, {
        method: 'DELETE',
        headers: {
            'X-USER_ID': 'current_username',
            'Authorization': 'Bearer ' + token
        }
    });
    
    return await response.json();
};
```

---

## Notes for Frontend Developers

1. **File Upload**: Use `multipart/form-data` for file uploads with the `file` parameter
2. **File Types**: Supported formats include JPG, JPEG, PNG, WEBP
3. **File Size**: Maximum file size is 5MB
4. **Authentication**: Always include the `X-USER_ID` header and `Authorization` token for protected endpoints
5. **Public File Access**: Banner files can be accessed directly via the public file serving endpoint
6. **One Banner Per Event**: Each event can have only one banner. Uploading a new banner replaces the existing one
7. **Error Handling**: Always handle error responses and display appropriate messages to users
8. **File Service Integration**: The system uses the File Service for consistent file handling across the application

---

## Architecture Overview

### Service Integration
```
Frontend → Gateway → Event Service → File Service
                ↓
            File Storage
```

### File Flow
1. **Upload**: Frontend → Event Service → File Service → File Storage
2. **Retrieve**: Frontend → Event Service → File Service → File Storage
3. **Serve**: Frontend → Gateway → File Service → File Storage (Public)

### Database Schema

#### File Service - Event Banner Table
```sql
create table event_banners (
    id bigint generated by default as identity,
    event_id varchar(255) not null unique,  -- One banner per event
    file_name varchar(200) not null,
    file_size bigint not null,
    file_type varchar(50) not null,
    created_at timestamp(6) not null,
    updated_at timestamp(6) not null,
    primary key (id)
);
```

**Key Features:**
- **Unique constraint** on `event_id` ensures one banner per event
- **File metadata** stored in database
- **Actual files** stored in file system
- **Public serving** through dedicated endpoints

---

## Migration from Previous Implementation

### What Changed
- **✅ File Service Integration**: Now uses dedicated File Service for file handling
- **✅ Actual File Uploads**: Handles real file uploads instead of metadata-only
- **✅ Public File Serving**: Files can be accessed directly via public endpoints
- **✅ Consistent Architecture**: Follows the same pattern as profile/cover photos
- **✅ Better Security**: Proper file validation and access control

### Benefits
- **🎯 Consistent**: Same file handling pattern across the application
- **🔒 Secure**: Proper file validation and access control
- **⚡ Efficient**: Dedicated file service for optimal performance
- **🔄 Scalable**: Can easily add CDN or cloud storage later
- **🛠️ Maintainable**: Centralized file handling logic

---

## Testing

The Event Banner APIs have comprehensive integration tests. You can run the tests using:

```bash
# File Service tests
cd file-service && mvn test -Dtest=EventBannerIntegrationTest

# Event Service tests  
cd event-service && mvn test -Dtest=EventBannerResourceIntegrationTest
```

The tests cover all endpoints including file uploads, URL retrieval, and file serving.

---

## File Service Endpoints

The File Service also provides direct endpoints for event banners:

- `POST /api/v1/events/{eventId}/banner` - Upload event banner
- `GET /api/v1/events/{eventId}/banner` - Get banner URL
- `DELETE /api/v1/events/{eventId}/banner` - Delete banner
- `GET /api/v1/events/{eventId}/banner/file/{fileName}` - Serve banner file (public)

These endpoints are routed through the Gateway and provide the same functionality as the Event Service endpoints.
