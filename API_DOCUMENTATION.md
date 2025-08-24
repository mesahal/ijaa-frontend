# 📁 File Service API Documentation

## Overview

The File Service provides comprehensive file management capabilities for the IJAA platform, specifically handling profile and cover photo uploads, downloads, and management. This service is designed to work seamlessly with Swagger UI and direct API calls.

**Base URL**: `http://localhost:8083` (Development)  
**API Version**: v1  
**Content Type**: `application/json` (except for file uploads which use `multipart/form-data`)

---

## 🔐 Authentication

All endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📋 API Endpoints

### 1. Upload Profile Photo

**Endpoint**: `POST /api/v1/users/{userId}/profile-photo`  
**Content-Type**: `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (UUID format) |
| `file` | file | Yes | Image file (JPG, JPEG, PNG, WEBP, max 5MB) |

#### Request Example

```bash
curl -X POST 'http://localhost:8083/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/profile-photo' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/image.jpg'
```

#### Response Examples

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "data": {
    "message": "Profile photo uploaded successfully",
    "filePath": "/uploads/profile/899d8e7d-d050-4494-adea-42c68f25738d.jpg",
    "fileUrl": "/uploads/profile/899d8e7d-d050-4494-adea-42c68f25738d.jpg",
    "fileName": "899d8e7d-d050-4494-adea-42c68f25738d.jpg",
    "fileSize": 2048576
  },
  "timestamp": 1756013486863
}
```

**Error Response (400 Bad Request) - Missing File**:
```json
{
  "success": false,
  "message": "File parameter is missing. Please provide a file.",
  "data": null,
  "timestamp": 1756013486863
}
```

**Error Response (400 Bad Request) - Empty File**:
```json
{
  "success": false,
  "message": "File is empty. Please select a valid image file.",
  "data": null,
  "timestamp": 1756013486863
}
```

**Error Response (400 Bad Request) - Invalid File Type**:
```json
{
  "success": false,
  "message": "Invalid file type. Only JPG, JPEG, PNG, WEBP are allowed",
  "data": null,
  "timestamp": 1756013486863
}
```

**Error Response (500 Internal Server Error)**:
```json
{
  "success": false,
  "message": "Failed to upload profile photo: Error details",
  "data": null,
  "timestamp": 1756013486863
}
```

---

### 2. Upload Cover Photo

**Endpoint**: `POST /api/v1/users/{userId}/cover-photo`  
**Content-Type**: `multipart/form-data`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (UUID format) |
| `file` | file | Yes | Image file (JPG, JPEG, PNG, WEBP, max 5MB) |

#### Request Example

```bash
curl -X POST 'http://localhost:8083/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/cover-photo' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@/path/to/your/cover-image.jpg'
```

#### Response Examples

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Cover photo uploaded successfully",
  "data": {
    "message": "Cover photo uploaded successfully",
    "filePath": "/uploads/cover/0eb938a7-1ead-4409-8510-491aaef100cb.jpg",
    "fileUrl": "/uploads/cover/0eb938a7-1ead-4409-8510-491aaef100cb.jpg",
    "fileName": "0eb938a7-1ead-4409-8510-491aaef100cb.jpg",
    "fileSize": 3072000
  },
  "timestamp": 1756013486863
}
```

**Error Responses**: Same as Profile Photo upload (see above)

---

### 3. Get Profile Photo URL

**Endpoint**: `GET /api/v1/users/{userId}/profile-photo`  
**Content-Type**: `application/json`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (UUID format) |

#### Request Example

```bash
curl -X GET 'http://localhost:8083/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/profile-photo' \
  -H 'Authorization: Bearer your-jwt-token'
```

#### Response Examples

**Success Response (200 OK) - Photo Exists**:
```json
{
  "success": true,
  "message": "Profile photo URL retrieved successfully",
  "data": {
    "photoUrl": "/uploads/profile/899d8e7d-d050-4494-adea-42c68f25738d.jpg",
    "hasPhoto": true
  },
  "timestamp": 1756013486863
}
```

**Success Response (200 OK) - No Photo**:
```json
{
  "success": true,
  "message": "Profile photo URL retrieved successfully",
  "data": {
    "photoUrl": null,
    "hasPhoto": false
  },
  "timestamp": 1756013486863
}
```

---

### 4. Get Cover Photo URL

**Endpoint**: `GET /api/v1/users/{userId}/cover-photo`  
**Content-Type**: `application/json`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (UUID format) |

#### Request Example

```bash
curl -X GET 'http://localhost:8083/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/cover-photo' \
  -H 'Authorization: Bearer your-jwt-token'
```

#### Response Examples

**Success Response (200 OK) - Photo Exists**:
```json
{
  "success": true,
  "message": "Cover photo URL retrieved successfully",
  "data": {
    "photoUrl": "/uploads/cover/0eb938a7-1ead-4409-8510-491aaef100cb.jpg",
    "hasPhoto": true
  },
  "timestamp": 1756013486863
}
```

**Success Response (200 OK) - No Photo**:
```json
{
  "success": true,
  "message": "Cover photo URL retrieved successfully",
  "data": {
    "photoUrl": null,
    "hasPhoto": false
  },
  "timestamp": 1756013486863
}
```

---

### 5. Delete Profile Photo

**Endpoint**: `DELETE /api/v1/users/{userId}/profile-photo`  
**Content-Type**: `application/json`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (UUID format) |

#### Request Example

```bash
curl -X DELETE 'http://localhost:8083/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/profile-photo' \
  -H 'Authorization: Bearer your-jwt-token'
```

#### Response Example

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile photo deleted successfully",
  "data": null,
  "timestamp": 1756013486863
}
```

---

### 6. Delete Cover Photo

**Endpoint**: `DELETE /api/v1/users/{userId}/cover-photo`  
**Content-Type**: `application/json`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | User ID (UUID format) |

#### Request Example

```bash
curl -X DELETE 'http://localhost:8083/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/cover-photo' \
  -H 'Authorization: Bearer your-jwt-token'
```

#### Response Example

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Cover photo deleted successfully",
  "data": null,
  "timestamp": 1756013486863
}
```

---

## 📊 Data Models

### FileUploadResponse
```typescript
interface FileUploadResponse {
  message: string;
  filePath: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
}
```

### PhotoUrlResponse
```typescript
interface PhotoUrlResponse {
  photoUrl: string | null;
  hasPhoto: boolean;
}
```

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: number;
}
```

---

## 🔧 Frontend Implementation Guide

### 1. File Upload Implementation

#### Using FormData (Recommended)

```javascript
// Profile Photo Upload
async function uploadProfilePhoto(userId, file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`/api/v1/users/${userId}/profile-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getJwtToken()}`,
        // Don't set Content-Type for FormData - browser will set it automatically
      },
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Upload successful:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Cover Photo Upload
async function uploadCoverPhoto(userId, file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`/api/v1/users/${userId}/cover-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getJwtToken()}`,
      },
      body: formData
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Upload successful:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

#### Using Axios

```javascript
import axios from 'axios';

// Profile Photo Upload
async function uploadProfilePhoto(userId, file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      `/api/v1/users/${userId}/profile-photo`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${getJwtToken()}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error('Upload failed:', error.response?.data?.message || error.message);
    throw error;
  }
}
```

### 2. File Validation

```javascript
// File validation helper
function validateImageFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) {
    throw new Error('Please select a file');
  }

  if (file.size === 0) {
    throw new Error('File is empty. Please select a valid image file.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP are allowed');
  }

  if (!file.name || file.name.trim() === '') {
    throw new Error('Invalid file name. Please select a valid image file.');
  }

  return true;
}

// Usage
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  try {
    validateImageFile(file);
    // Proceed with upload
    uploadProfilePhoto(userId, file);
  } catch (error) {
    alert(error.message);
  }
});
```

### 3. Photo URL Retrieval

```javascript
// Get Profile Photo URL
async function getProfilePhotoUrl(userId) {
  try {
    const response = await fetch(`/api/v1/users/${userId}/profile-photo`, {
      headers: {
        'Authorization': `Bearer ${getJwtToken()}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to get profile photo URL:', error);
    throw error;
  }
}

// Get Cover Photo URL
async function getCoverPhotoUrl(userId) {
  try {
    const response = await fetch(`/api/v1/users/${userId}/cover-photo`, {
      headers: {
        'Authorization': `Bearer ${getJwtToken()}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to get cover photo URL:', error);
    throw error;
  }
}
```

### 4. Photo Deletion

```javascript
// Delete Profile Photo
async function deleteProfilePhoto(userId) {
  try {
    const response = await fetch(`/api/v1/users/${userId}/profile-photo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getJwtToken()}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Profile photo deleted successfully');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to delete profile photo:', error);
    throw error;
  }
}

// Delete Cover Photo
async function deleteCoverPhoto(userId) {
  try {
    const response = await fetch(`/api/v1/users/${userId}/cover-photo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getJwtToken()}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Cover photo deleted successfully');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to delete cover photo:', error);
    throw error;
  }
}
```

### 5. Complete React Component Example

```jsx
import React, { useState, useEffect } from 'react';

const ProfilePhotoManager = ({ userId }) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load existing photos
  useEffect(() => {
    loadPhotos();
  }, [userId]);

  const loadPhotos = async () => {
    try {
      const [profileData, coverData] = await Promise.all([
        getProfilePhotoUrl(userId),
        getCoverPhotoUrl(userId)
      ]);
      
      setProfilePhoto(profileData);
      setCoverPhoto(coverData);
    } catch (error) {
      setError('Failed to load photos');
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      setLoading(true);
      setError(null);
      
      validateImageFile(file);
      
      let result;
      if (type === 'profile') {
        result = await uploadProfilePhoto(userId, file);
        setProfilePhoto({ photoUrl: result.fileUrl, hasPhoto: true });
      } else {
        result = await uploadCoverPhoto(userId, file);
        setCoverPhoto({ photoUrl: result.fileUrl, hasPhoto: true });
      }
      
      alert(`${type === 'profile' ? 'Profile' : 'Cover'} photo uploaded successfully!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (type) => {
    try {
      setLoading(true);
      setError(null);
      
      if (type === 'profile') {
        await deleteProfilePhoto(userId);
        setProfilePhoto({ photoUrl: null, hasPhoto: false });
      } else {
        await deleteCoverPhoto(userId);
        setCoverPhoto({ photoUrl: null, hasPhoto: false });
      }
      
      alert(`${type === 'profile' ? 'Profile' : 'Cover'} photo deleted successfully!`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="photo-manager">
      <h2>Photo Management</h2>
      
      {error && <div className="error">{error}</div>}
      
      {/* Profile Photo Section */}
      <div className="photo-section">
        <h3>Profile Photo</h3>
        {profilePhoto?.hasPhoto ? (
          <div>
            <img src={profilePhoto.photoUrl} alt="Profile" />
            <button 
              onClick={() => handleDeletePhoto('profile')}
              disabled={loading}
            >
              Delete Profile Photo
            </button>
          </div>
        ) : (
          <div>
            <p>No profile photo uploaded</p>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileUpload(file, 'profile');
              }}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* Cover Photo Section */}
      <div className="photo-section">
        <h3>Cover Photo</h3>
        {coverPhoto?.hasPhoto ? (
          <div>
            <img src={coverPhoto.photoUrl} alt="Cover" />
            <button 
              onClick={() => handleDeletePhoto('cover')}
              disabled={loading}
            >
              Delete Cover Photo
            </button>
          </div>
        ) : (
          <div>
            <p>No cover photo uploaded</p>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileUpload(file, 'cover');
              }}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {loading && <div className="loading">Processing...</div>}
    </div>
  );
};

export default ProfilePhotoManager;
```

---

## 🚨 Error Handling

### Common Error Scenarios

1. **Missing File Parameter**
   - Error: `"File parameter is missing. Please provide a file."`
   - Solution: Ensure the file is properly attached to the FormData

2. **Empty File**
   - Error: `"File is empty. Please select a valid image file."`
   - Solution: Check if the file has content before uploading

3. **Invalid File Type**
   - Error: `"Invalid file type. Only JPG, JPEG, PNG, WEBP are allowed"`
   - Solution: Validate file type on frontend before upload

4. **File Size Exceeded**
   - Error: `"File size exceeds maximum limit"`
   - Solution: Check file size (max 5MB) before upload

5. **Authentication Error**
   - Error: `401 Unauthorized`
   - Solution: Ensure valid JWT token is included in Authorization header

6. **User Not Found**
   - Error: `404 Not Found`
   - Solution: Verify the user ID is valid and exists

### Error Handling Best Practices

```javascript
// Centralized error handler
function handleApiError(error) {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return `Bad Request: ${data.message}`;
      case 401:
        return 'Authentication required. Please log in again.';
      case 404:
        return 'Resource not found.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
}

// Usage
try {
  await uploadProfilePhoto(userId, file);
} catch (error) {
  const errorMessage = handleApiError(error);
  showNotification(errorMessage, 'error');
}
```

---

## 🔒 Security Considerations

1. **Authentication**: All endpoints require valid JWT tokens
2. **File Validation**: Server validates file type and size
3. **User Authorization**: Users can only manage their own photos
4. **File Storage**: Files are stored with UUID names to prevent conflicts
5. **Automatic Cleanup**: Old files are automatically deleted when replaced

---

## 📝 Notes for Frontend Developers

1. **File Upload**: Use `FormData` for file uploads, don't set `Content-Type` header manually
2. **Image Display**: Use the returned `fileUrl` to display images
3. **Error Handling**: Always handle both network and validation errors
4. **Loading States**: Show loading indicators during file operations
5. **File Validation**: Implement client-side validation for better UX
6. **Responsive Design**: Consider image aspect ratios for different screen sizes
7. **Caching**: Consider caching photo URLs to reduce API calls

---

## 🧪 Testing

### Swagger UI Testing
- Access Swagger UI at: `http://localhost:8083/swagger-ui.html`
- Test all endpoints directly from the browser
- File uploads work correctly in Swagger UI

### Postman Testing
- Import the API collection
- Set up environment variables for base URL and JWT token
- Test file uploads using the form-data body type

---

*Last Updated: August 2025*  
*Version: 1.0*  
*File Service API Documentation*
