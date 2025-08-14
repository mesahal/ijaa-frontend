# 🔐 Admin API Integration Guide - Frontend Reference

## 📋 Overview

Complete API documentation for all admin endpoints in the IJAA system. This guide provides request/response examples for frontend integration.

---

## 🔑 Authentication

All admin APIs require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Getting JWT Token**: Use the admin login endpoint first to obtain a JWT token.

---

## 📡 API Endpoints

### 1. 🔐 Admin Login (Get JWT Token)

**Endpoint**: `POST /api/v1/admin/auth/login`

**Description**: Authenticate admin and get JWT token for subsequent API calls.

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "admin@ijaa.com",
  "password": "admin123"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Admin login successful",
  "code": "200",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpamFhLmNvbSIsImlhdCI6MTYzNTY3ODk5MiwiZXhwIjoxNjM1NjgyNTkyfQ.example",
    "adminId": 1,
    "name": "Super Administrator",
    "email": "admin@ijaa.com",
    "role": "ADMIN",
    "active": true
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Invalid email or password",
  "code": "400",
  "data": null
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Admin not found",
  "code": "404",
  "data": null
}
```

---

### 2. 👥 Get All Admins

**Endpoint**: `GET /api/v1/admin/admins`

**Description**: Retrieve list of all admin accounts.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request**: No request body required.

**Success Response (200 OK)**:
```json
{
  "message": "Admins retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "name": "Super Administrator",
      "email": "admin@ijaa.com",
      "role": "ADMIN",
      "active": true,
      "createdAt": "2025-07-31T01:51:12.870989",
      "updatedAt": "2025-07-31T01:51:12.871015"
    },
    {
      "id": 2,
      "name": "Content Manager",
      "email": "content@ijaa.com",
      "role": "ADMIN",
      "active": true,
      "createdAt": "2025-07-31T02:15:30.123456",
      "updatedAt": "2025-07-31T02:15:30.123456"
    }
  ]
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Missing Authorization Header",
  "code": "401",
  "data": null
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Access denied",
  "code": "403",
  "data": null
}
```

---

### 3. ✅ Activate Admin

**Endpoint**: `POST /api/v1/admin/admins/{adminId}/activate`

**Description**: Activate a deactivated admin account.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:
- `adminId`: ID of the admin to activate

**Request**: No request body required.

**Success Response (200 OK)**:
```json
{
  "message": "Admin activated successfully",
  "code": "200",
  "data": {
    "id": 2,
    "name": "Content Manager",
    "email": "content@ijaa.com",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2025-07-31T02:15:30.123456",
    "updatedAt": "2025-07-31T02:15:30.123456"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Admin is already activated",
  "code": "400",
  "data": null
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Admin not found with id: 999",
  "code": "404",
  "data": null
}
```

---

### 4. ❌ Deactivate Admin

**Endpoint**: `POST /api/v1/admin/admins/{adminId}/deactivate`

**Description**: Deactivate an active admin account.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:
- `adminId`: ID of the admin to deactivate

**Request**: No request body required.

**Success Response (200 OK)**:
```json
{
  "message": "Admin deactivated successfully",
  "code": "200",
  "data": {
    "id": 2,
    "name": "Content Manager",
    "email": "content@ijaa.com",
    "role": "ADMIN",
    "active": false,
    "createdAt": "2025-07-31T02:15:30.123456",
    "updatedAt": "2025-07-31T02:15:30.123456"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Admin cannot deactivate their own account",
  "code": "400",
  "data": null
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Admin is already deactivated",
  "code": "400",
  "data": null
}
```

**Error Response (404 Not Found)**:
```json
{
  "message": "Admin not found with id: 999",
  "code": "404",
  "data": null
}
```

---

### 5. 👤 Get Admin Profile

**Endpoint**: `GET /api/v1/admin/profile`

**Description**: Get current authenticated admin's profile information.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request**: No request body required.

**Success Response (200 OK)**:
```json
{
  "message": "Admin profile retrieved successfully",
  "code": "200",
  "data": {
    "id": 1,
    "name": "Super Administrator",
    "email": "admin@ijaa.com",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2025-07-31T01:51:12.870989",
    "updatedAt": "2025-07-31T01:51:12.871015"
  }
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Missing Authorization Header",
  "code": "401",
  "data": null
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Access denied",
  "code": "403",
  "data": null
}
```

---

### 6. 📝 Admin Registration

**Endpoint**: `POST /api/v1/admin/signup`

**Description**: Register a new admin account.

**Security**: 
- First admin: No authentication required
- Subsequent admins: Requires existing admin authentication

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>  // Required for subsequent admins
```

**Request Body**:
```json
{
  "name": "New Admin",
  "email": "newadmin@ijaa.com",
  "password": "securePassword123",
  "role": "ADMIN"
}
```

**Success Response (201 Created)**:
```json
{
  "message": "Admin registration successful",
  "code": "201",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZXdhZG1pbkBpamFhLmNvbSIsImlhdCI6MTYzNTY3ODk5MiwiZXhwIjoxNjM1NjgyNTkyfQ.example",
    "adminId": 3,
    "name": "New Admin",
    "email": "newadmin@ijaa.com",
    "role": "ADMIN",
    "active": true
  }
}
```

**Error Response (409 Conflict)**:
```json
{
  "message": "Admin with email newadmin@ijaa.com already exists",
  "code": "409",
  "data": null
}
```

**Error Response (403 Forbidden)**:
```json
{
  "message": "Only existing ADMIN can create new ADMIN accounts",
  "code": "403",
  "data": null
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Name is required",
  "code": "400",
  "data": null
}
```

---

### 7. 🔐 Change Admin Password

**Endpoint**: `PUT /api/v1/admin/change-password`

**Description**: Change the current authenticated admin's password.

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newSecurePassword123",
  "confirmPassword": "newSecurePassword123"
}
```

**Success Response (200 OK)**:
```json
{
  "message": "Password changed successfully",
  "code": "200",
  "data": {
    "id": 1,
    "name": "Super Administrator",
    "email": "admin@ijaa.com",
    "role": "ADMIN",
    "active": true,
    "createdAt": "2025-07-31T01:51:12.870989",
    "updatedAt": "2025-07-31T01:51:12.871015"
  }
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "Current password is incorrect",
  "code": "400",
  "data": null
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "New password and confirm password do not match",
  "code": "400",
  "data": null
}
```

**Error Response (400 Bad Request)**:
```json
{
  "message": "New password must be different from current password",
  "code": "400",
  "data": null
}
```

**Error Response (401 Unauthorized)**:
```json
{
  "message": "Authentication required to change password",
  "code": "401",
  "data": null
}
```

---

## 🚀 Frontend Integration Examples

### JavaScript/TypeScript Examples

#### 1. Admin Login
```javascript
const adminLogin = async (email, password) => {
  try {
    const response = await fetch('/api/v1/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    
    if (response.ok) {
      // Store JWT token
      localStorage.setItem('adminToken', result.data.token);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

#### 2. Get All Admins
```javascript
const getAllAdmins = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/v1/admin/admins', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to get admins:', error);
    throw error;
  }
};
```

#### 3. Activate Admin
```javascript
const activateAdmin = async (adminId) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`/api/v1/admin/admins/${adminId}/activate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to activate admin:', error);
    throw error;
  }
};
```

#### 4. Deactivate Admin
```javascript
const deactivateAdmin = async (adminId) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`/api/v1/admin/admins/${adminId}/deactivate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to deactivate admin:', error);
    throw error;
  }
};
```

#### 5. Get Admin Profile
```javascript
const getAdminProfile = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/v1/admin/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to get profile:', error);
    throw error;
  }
};
```

#### 6. Admin Registration
```javascript
const registerAdmin = async (adminData) => {
  try {
    const token = localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add token if available (for subsequent admins)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/v1/admin/signup', {
      method: 'POST',
      headers,
      body: JSON.stringify(adminData)
    });

    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to register admin:', error);
    throw error;
  }
};
```

#### 7. Change Password
```javascript
const changePassword = async (currentPassword, newPassword, confirmPassword) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/v1/admin/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to change password:', error);
    throw error;
  }
};
```

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useAdminAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading, error };
};
```

---

## 🔧 Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists

### Error Response Format
All error responses follow this format:
```json
{
  "message": "Descriptive error message",
  "code": "HTTP_STATUS_CODE",
  "data": null
}
```

---

## 🛡️ Security Considerations

1. **JWT Token Storage**: Store JWT tokens securely (localStorage for development, httpOnly cookies for production)
2. **Token Expiration**: Handle token expiration gracefully
3. **Input Validation**: Always validate input on frontend before sending to API
4. **Error Handling**: Don't expose sensitive information in error messages
5. **HTTPS**: Always use HTTPS in production

---

## 📱 Mobile Integration

For mobile apps, use the same API endpoints with appropriate HTTP client libraries:

### React Native Example
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-domain.com/api/v1/admin',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = await AsyncStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ✅ Testing Checklist

Before going live, ensure:

- [ ] All endpoints return correct HTTP status codes
- [ ] Error responses are properly handled
- [ ] JWT token authentication works correctly
- [ ] Password change functionality works
- [ ] Admin activation/deactivation works
- [ ] Input validation works on frontend
- [ ] Error messages are user-friendly
- [ ] Loading states are implemented
- [ ] Token expiration is handled
- [ ] HTTPS is used in production

---

## 📞 Support

For API support or questions:
- Check the Swagger documentation at `/swagger-ui.html`
- Review error logs for debugging
- Test endpoints using the provided examples

---

**Status**: ✅ **Production Ready**
**Last Updated**: August 2025
**Version**: 1.0
