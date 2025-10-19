# IJAA API Endpoints - Complete List
**Base URL**: `http://localhost:8000/ijaa`

## 🔐 Authentication APIs
**Base Path**: `/api/v1/auth/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/auth/login` | User authentication | `user.login` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/auth/register` | User registration | `user.registration` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/auth/refresh` | Refresh access token | `user.refresh` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/auth/logout` | Logout and invalidate refresh token | `user.logout` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/auth/change-password` | Password management | `user.password-change` | Yes |

## 👤 User Management APIs
**Base Path**: `/api/v1/users/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}` | Get user profile | `user.profile` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}` | Update profile information | `user.profile` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/profile` | Update profile visibility | `user.profile` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences` | Get user experiences | `user.experiences` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences` | Add experience | `user.experiences` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences/{experienceId}` | Update experience | `user.experiences` | No |
| DELETE | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences/{experienceId}` | Delete experience | `user.experiences` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests` | Get user interests | `user.interests` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests` | Add interest | `user.interests` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests/{interestId}` | Update interest | `user.interests` | No |
| DELETE | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests/{interestId}` | Delete interest | `user.interests` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings` | Get user settings | `user.settings` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings` | Update user settings | `user.settings` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings/theme` | Get current user theme | `user.settings` | No |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings/themes` | Get available theme options | `user.settings` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/users/search` | Alumni search functionality | `alumni.search` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/users/search/metadata` | Get alumni search metadata | `alumni.search` | No |

## 🛡️ Admin Management APIs
**Base Path**: `/api/v1/admin/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/admin/login` | Admin authentication | `admin.auth` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/admin/logout` | Admin logout | `admin.logout` | No |
| POST | `http://localhost:8000/ijaa/api/v1/admin/admins` | Admin registration | `admin.auth` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/admin/admins` | Get all admins | `admin.features` | Yes |
| PUT  | `http://localhost:8000/ijaa/api/v1/admin/change-password` | Change admin password | `admin.auth` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/admin/profile` | Get admin profile | `admin.auth` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/admin/admins/{adminId}/deactivate` | Deactivate admin | `admin.features` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/admin/admins/{adminId}/activate` | Activate admin | `admin.features` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/admin/dashboard` | Dashboard statistics | `admin.features` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/admin/users` | Get all users | `admin.user-management` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/admin/users/{userId}/block` | Block user | `admin.user-management` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/admin/users/{userId}/unblock` | Unblock user | `admin.user-management` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/admin/users/{userId}` | Delete user | `admin.user-management` | Yes |

## 🚩 Feature Flag Management APIs
**Base Path**: `/api/v1/admin/feature-flags/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/` | Get all feature flags | `admin.features` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}` | Get specific feature flag | `admin.features` | No |
| POST | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/` | Create new feature flag | `admin.features` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}` | Update feature flag | `admin.features` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}` | Delete feature flag | `admin.features` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}/enabled` | Check feature flag status (Public) | `system.health` | Yes |

## 🌍 Location APIs
**Base Path**: `/api/v1/locations/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/locations/countries` | Get all countries | `user.location` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/locations/countries/{countryId}/cities` | Get cities by country | `user.location` | Yes |

## 🎉 Event Management APIs
**Base Path**: `/api/v1/events/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/events/my-events` | Get user's created events | `events` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/my-events/active` | Get user's active events | `events` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/all-events` | Get all active events | `events` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/all-events/{eventId}` | Get specific event details | `events` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/my-events/{eventId}` | Get user's specific event | `events` | No |
| POST | `http://localhost:8000/ijaa/api/v1/events/create` | Create new event | `events.creation` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/events/my-events/{eventId}` | Update user's event | `events.update` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/my-events/{eventId}` | Delete user's event | `events.delete` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/events/search` | Search events with filters | `search` | Yes |

### Frontend consumption notes

- The Events page provides header tabs for **All Events** and **My Events**. The My Events tab fetches `GET /events/my-events` and renders with **6 items per page** using client-side pagination when the API returns arrays.

## 📝 Event Posts APIs
**Base Path**: `/api/v1/events/posts/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/posts` | Create event post (multipart/form-data) | `events.posts.create` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/events/posts/event/{eventId}` | Get event posts (paginated) | `events.posts` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/events/posts/event/{eventId}/all` | Get all event posts | `events.posts` | No |
| GET  | `http://localhost:8000/ijaa/api/v1/events/posts/{postId}` | Get specific post | `events.posts` | No |
| PUT  | `http://localhost:8000/ijaa/api/v1/events/posts/{postId}` | Update post | `events.posts.update` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/posts/{postId}` | Delete post | `events.posts.delete` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/events/posts/{postId}/like` | Toggle post like | `events.posts.like` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/events/posts/user/{username}` | Get user's posts (paginated) | `events.posts` | No |
| GET  | `http://localhost:8000/ijaa/api/v1/events/posts/user/{username}/event/{eventId}` | Get user's posts for event | `events.posts` | No |

## 🎫 Event Participation APIs
**Base Path**: `/api/v1/events/participation/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/participation/rsvp` | RSVP to events | `events.participation` | Yes |
| PUT | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/rsvp` | Update RSVP status | `events.participation` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/rsvp` | Cancel RSVP | `events.participation` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/my-participation` | Get user's participation for event | `events.participation` | No |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/participants` | Get event participants | `events.participation` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/participants/{status}` | Get participants by status | `events.participation` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/my-participations` | Get user's event participations | `events.participation` | Yes |

### Notes

- **Update RSVP (PUT) expects `status` as a query parameter and no request body.**
  - Example: `PUT /ijaa/api/v1/events/participation/12/rsvp?status=MAYBE`
  - cURL:
```bash
curl -X 'PUT' \
  'http://localhost:8000/ijaa/api/v1/events/participation/12/rsvp?status=MAYBE' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```
- **Cancel RSVP (DELETE) does not take a request body.**
- **Frontend behavior**: Clicking the same RSVP status again (Going/Interested/Can't go) triggers a DELETE to cancel. Clicking a different status triggers a PUT to update.

## 💬 Event Comments APIs
**Base Path**: `/api/v1/events/comments/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/comments/` | Add post comment | `events.comments` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/events/comments/post/{postId}` | Get post comments with nested replies | `events.comments` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}` | Get specific comment | `events.comments` | No |
| PUT  | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}` | Update comment | `events.comments` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}` | Delete comment | `events.comments` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}/like` | Toggle comment like | `events.comments` | Yes |
| GET  | `http://localhost:8000/ijaa/api/v1/events/comments/recent/post/{postId}` | Get recent comments for post | `events.comments` | No |
| GET  | `http://localhost:8000/ijaa/api/v1/events/comments/popular/post/{postId}` | Get popular comments for post | `events.comments` | No |

## 📧 Event Invitations APIs
**Base Path**: `/api/v1/events/invitations/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/send` | Send event invitation | `events.invitations` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/accept` | Accept invitation | `events.invitations` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/decline` | Decline invitation | `events.invitations` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/mark-read` | Mark invitation as read | `events.invitations` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/my-invitations` | Get user's received invitations | `events.invitations` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/my-invitations/unread` | Get unread invitations | `events.invitations` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/my-invitations/unresponded` | Get unresponded invitations | `events.invitations` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/invitations` | Get event invitations | `events.invitations` | No |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/sent-by-me` | Get invitations sent by user | `events.invitations` | No |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/counts` | Get invitation counts | `events.invitations` | Yes |

## 🖼️ Event Banner APIs
**Base Path**: `/api/v1/events/banner/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/banner/{eventId}` | Upload/Update event banner | `events.banner` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/banner/{eventId}` | Get event banner URL | `events.banner` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/banner/{eventId}` | Delete event banner | `events.banner` | Yes |

## 🔍 Advanced Event Search APIs
**Base Path**: `/api/v1/events/advanced-search/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/advanced-search/advanced` | Advanced event search with multiple filters | `search.advanced-filters` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/recommendations` | Get event recommendations | `search.advanced-filters` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/trending` | Get trending events | `search.advanced-filters` | No |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/location/{location}` | Get events by location | `search.advanced-filters` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/organizer/{organizerName}` | Get events by organizer | `search.advanced-filters` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/high-engagement` | Get high engagement events | `search.advanced-filters` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/upcoming` | Get upcoming events | `search.advanced-filters` | No |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/similar/{eventId}` | Get similar events | `search.advanced-filters` | Yes |

## 📁 File Management APIs
**Base Path**: `/api/v1/files/users/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo` | Upload profile photo | `file-upload.profile-photo` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo` | Get profile photo URL | `file-download` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo` | Delete profile photo | `file-delete` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo` | Upload cover photo | `file-upload.cover-photo` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo` | Get cover photo URL | `file-download` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo` | Delete cover photo | `file-delete` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo/file/**` | Serve profile photo file (Public) | `file-download` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo/file/**` | Serve cover photo file (Public) | `file-download` | Yes |

## 🎨 Event File APIs
**Base Path**: `/api/v1/files/events/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner` | Upload event banner | `events.banner` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner` | Get event banner URL | `file-download` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner` | Delete event banner | `file-delete` | Yes |
| GET | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner/file/{fileName}` | Serve event banner file (Public) | `file-download` | Yes |

## 🖼️ Post Media APIs
**Base Path**: `/api/v1/files/posts/`

| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET  | `http://localhost:8000/ijaa/api/v1/files/posts/{postId}/media` | Get all post media (protected) | `events.posts.media` | Yes |
| POST | `http://localhost:8000/ijaa/api/v1/files/posts/{postId}/media` | Upload post media (multipart/form-data) | `events.posts.media` | No |
| GET  | `http://localhost:8000/ijaa/api/v1/files/posts/{postId}/media/{fileName}` | Get post media URL | `file-download` | No |
| GET  | `http://localhost:8000/ijaa/api/v1/files/posts/{postId}/media/file/{fileName}` | Serve post media file (Public) | `file-download` | Yes |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/posts/{postId}/media/{fileName}` | Delete specific post media | `file-delete` | No |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/posts/{postId}/media` | Delete all post media for a post | `file-delete` | No |

## 🚧 Gateway Token Blacklist APIs
**Base Path**: `/api/v1/token/`

| Method | Endpoint | Description | Used in frontend? |
|--------|----------|-------------|--------------------|
| POST | `http://localhost:8000/ijaa/api/v1/token/blacklist` | Blacklist a specific access token (body: `{ token, userId, userType }`) | No |
| POST | `http://localhost:8000/ijaa/api/v1/token/blacklist-all` | Blacklist all tokens for a user (body: `{ userId, userType }`) | No |
| GET  | `http://localhost:8000/ijaa/api/v1/token/is-blacklisted?token=...` | Check if a token is blacklisted | No |

## 🏥 Health Check APIs

### User Service Health Endpoints
| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/health/status` | Basic health check | `system.health` | No |
| GET | `http://localhost:8000/ijaa/api/v1/health/database` | Database health check | `system.health` | No |

### Event Service Health Endpoints
| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/events/health/status` | Basic health check | `system.health` | No |
| GET | `http://localhost:8000/ijaa/api/v1/events/health/database` | Database health check | `system.health` | No |

### File Service Health Endpoints
| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/files/health/status` | Basic health check | `system.health` | No |
| GET | `http://localhost:8000/ijaa/api/v1/files/health/database` | Database health check | `system.health` | No |

### Config Service Health Endpoints (Critical Infrastructure)
| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/config/health/status` | Basic health check | None | No |
| GET | `http://localhost:8000/ijaa/api/v1/config/health/config` | Configuration health check | None | No |
| GET | `http://localhost:8000/ijaa/api/v1/config/health/test` | Test endpoint | None | No |

### Discovery Service Health Endpoints (Critical Infrastructure)
| Method | Endpoint | Description | Feature Flag | Used in frontend? |
|--------|----------|-------------|--------------|--------------------|
| GET | `http://localhost:8000/ijaa/api/v1/discovery/health/status` | Basic health check | None | No |
| GET | `http://localhost:8000/ijaa/api/v1/discovery/health/registry` | Service registry health check | None | No |
| GET | `http://localhost:8000/ijaa/api/v1/discovery/health/test` | Test endpoint | None | No |

## 📊 API Summary

- **Total Endpoints**: 89
- **Authentication Required**: 75
- **Public Endpoints**: 14
- **Feature Flags**: 44 hierarchical flags
- **Services**: 5 (User, Event, File, Config, Discovery)

## 🔑 Authentication

- **Access Token**: 60-minute expiration
- **Refresh Token**: 7-day expiration (HttpOnly cookie)
- **Header**: `Authorization: Bearer <token>`

### Standard Response Wrapper
- All endpoints return a consistent wrapper unless otherwise noted:
```json
{
  "message": "<human readable message>",
  "code": "<http status code as string>",
  "data": <payload or null>
}
```

### Content Types and Auth
- JSON endpoints: `Content-Type: application/json`
- File upload endpoints: `Content-Type: multipart/form-data`
- Protected routes require `Authorization: Bearer <accessToken>` header.
- Feature flags listed per endpoint must be enabled.

## 🌐 Public Endpoints (No Authentication)

1. `GET /ijaa/api/v1/admin/feature-flags/{name}/enabled`
2. `POST /ijaa/api/v1/auth/refresh`
3. `GET /ijaa/api/v1/files/users/*/profile-photo/file/**`
4. `GET /ijaa/api/v1/files/users/*/cover-photo/file/**`
5. `GET /ijaa/api/v1/files/events/{eventId}/banner/file/{fileName}`
6. `GET /ijaa/api/v1/files/posts/*/media/file/**`
7. All Config Service health endpoints
8. All Discovery Service health endpoints

---

# Detailed Examples

Below are request/response examples to integrate each API group. Replace host with your environment. Base prefix is `/ijaa`.

## Authentication

- Login
  - POST `/api/v1/auth/login`
  - Request
```json
{
  "username": "john.doe",
  "password": "password123"
}
```
  - Response
```json
{
  "message": "Login successful",
  "code": "200",
  "data": {
    "accessToken": "<JWT>",
    "tokenType": "Bearer",
    "userId": "USER_ABC123"
  }
}
```

- Register
  - POST `/api/v1/auth/register`
  - Request
```json
{
  "username": "john.doe",
  "password": "password123"
}
```
  - Response: same shape as Login with new `userId`.

- Refresh
  - POST `/api/v1/auth/refresh`
  - Reads refresh token from HttpOnly cookie or body field `{"refreshToken": "..."}`
  - Response
```json
{
  "message": "Token refreshed successfully",
  "code": "200",
  "data": {
    "accessToken": "<JWT>",
    "tokenType": "Bearer",
    "userId": "USER_ABC123"
  }
}
```

- Logout (protected)
  - POST `/api/v1/auth/logout`
  - Side effects: access token blacklisted via gateway; refresh token revoked; clears refresh cookie.
  - Response
```json
{
  "message": "Logout successful",
  "code": "200",
  "data": null
}
```

## User Profile

- Get Profile (protected)
  - GET `/api/v1/users/{userId}`
  - Response
```json
{
  "message": "Profile fetched successfully",
  "code": "200",
  "data": {
    "userId": "USER_ABC123",
    "name": "John Doe",
    "profession": "Software Engineer",
    "cityId": 1,
    "countryId": 1,
    "cityName": "New York",
    "countryName": "United States",
    "bio": "...",
    "phone": "+1-555-...",
    "linkedIn": "https://...",
    "website": "https://...",
    "batch": "2020",
    "facebook": "https://...",
    "email": "john@example.com",
    "showPhone": true,
    "showLinkedIn": true,
    "showWebsite": true,
    "showEmail": true,
    "showFacebook": false,
    "connections": 150
  }
}
```

- Update Profile (protected)
  - PUT `/api/v1/users/{userId}`
  - Request body matches `ProfileDto`.

- Update Profile Visibility (protected)
  - PUT `/api/v1/users/{userId}/profile`
  - Request body contains the `show*` boolean fields from `ProfileDto`.

## User Experiences

- Add Experience (protected)
  - POST `/api/v1/users/{userId}/experiences`
  - Request
```json
{
  "userId": "USER_ABC123",
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "period": "2022-2024",
  "description": "..."
}
```
  - Response contains created `ExperienceDto`.

## User Interests

- Add Interest (protected)
  - POST `/api/v1/users/{userId}/interests`
  - Request
```json
{ "interest": "Machine Learning" }
```

## User Settings

- Get Settings (protected)
  - GET `/api/v1/users/{userId}/settings`
  - Response
```json
{
  "message": "User settings retrieved successfully",
  "code": "200",
  "data": {
    "userId": "USER_ABC123",
    "theme": "DEVICE"
  }
}
```

- Update Settings (protected)
  - PUT `/api/v1/users/{userId}/settings`
  - Request
```json
{ "theme": "LIGHT" }
```

## Alumni Search (protected)

- Search
  - POST `/api/v1/users/search`
  - Request (see `AlumniSearchRequest`)
```json
{
  "searchQuery": "software engineer",
  "batch": "2020",
  "profession": "Technology",
  "cityId": 163,
  "countryId": 101,
  "sortBy": "relevance",
  "page": 0,
  "size": 12
}
```

## Admin

- Login
  - POST `/api/v1/admin/login`
  - Response
```json
{
  "message": "Admin login successful",
  "code": "200",
  "data": {
    "accessToken": "<JWT>",
    "refreshToken": "<random>",
    "adminId": 1,
    "name": "Administrator",
    "email": "admin@ijaa.com",
    "role": "ADMIN",
    "active": true
  }
}
```

## Events

- Create Event (protected)
  - POST `/api/v1/events/create`
  - Request matches `EventRequest`.

## Event Posts (protected)

- Create Post
  - POST `/api/v1/events/posts` (multipart/form-data)
  - Fields: `eventId` (number), `content` (string, optional), `files[]` (0..n)
  - Response returns `EventPostResponse` including `mediaFiles` and `recentComments`.

## Event Comments (protected)

- Add Comment
  - POST `/api/v1/events/comments/`
  - Request
```json
{
  "postId": 1,
  "content": "Great post!",
  "authorName": "John Doe",
  "userId": "USER_ABC123"
}
```

## Event Invitations (protected)

- Send
  - POST `/api/v1/events/invitations/send`
  - Request
```json
{
  "eventId": 1,
  "usernames": ["john.doe", "jane.smith"],
  "personalMessage": "You're invited!"
}
```

## Event Participation (protected)

- RSVP
  - POST `/api/v1/events/participation/rsvp`
  - Request
```json
{ "eventId": 1, "status": "GOING", "message": "See you there" }
```

- Update RSVP
  - PUT `/api/v1/events/participation/{eventId}/rsvp?status=CONFIRMED`
  - No request body. Include Authorization header.
  - cURL
```bash
curl -X 'PUT' \
  'http://localhost:8000/ijaa/api/v1/events/participation/1/rsvp?status=CONFIRMED' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>'
```

- Cancel RSVP
  - DELETE `/api/v1/events/participation/{eventId}/rsvp`
  - No request body. Include Authorization header.

## File: User Photos

- Upload Profile Photo (protected)
  - POST `/api/v1/files/users/{userId}/profile-photo` (multipart/form-data)
  - Parts: `file`
  - Response
```json
{
  "message": "Profile photo uploaded successfully",
  "code": "200",
  "data": {
    "message": "Profile photo uploaded successfully",
    "fileUrl": "/ijaa/api/v1/files/users/USER_ABC123/profile-photo/file/abc.jpg",
    "fileName": "abc.jpg",
    "fileSize": 12345
  }
}
```

## File: Event Banner (public serve)

- GET `/api/v1/files/events/{eventId}/banner/file/{fileName}`
  - Returns the binary file with appropriate content type.

## File: Post Media

- Upload (protected)
  - POST `/api/v1/files/posts/{postId}/media` (multipart/form-data)
  - Parts: `file`, `mediaType` (IMAGE|VIDEO)

- Serve (public)
  - GET `/api/v1/files/posts/{postId}/media/file/{fileName}`
  - Returns binary content.

## Gateway Token Blacklist

- Blacklist Access Token
  - POST `/api/v1/token/blacklist`
  - Request
```json
{ "token": "<accessToken>", "userId": "USER_ABC123", "userType": "USER" }
```

## Health

- GET `/api/v1/config/health/status`
  - Response
```json
{ "status": "healthy", "service": "Config Service", "message": "...", "timestamp": "..." }
```

---

**Generated**: October 2025  
**Base URL**: `http://localhost:8000/ijaa`  
**Gateway Port**: 8000  
**Total APIs**: 89 endpoints across 5 services


