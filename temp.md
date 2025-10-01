# IJAA API Endpoints - Complete List
**Base URL**: `http://localhost:8000/ijaa`

## 🔐 Authentication APIs
**Base Path**: `/api/v1/auth/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/auth/login` | User authentication | `user.login` |
| POST | `http://localhost:8000/ijaa/api/v1/auth/register` | User registration | `user.registration` |
| POST | `http://localhost:8000/ijaa/api/v1/auth/refresh` | Refresh access token | `user.refresh` |
| POST | `http://localhost:8000/ijaa/api/v1/auth/logout` | Logout and invalidate refresh token | None |
| POST | `http://localhost:8000/ijaa/api/v1/auth/change-password` | Password management | `user.password-change` |

## 👤 User Management APIs
**Base Path**: `/api/v1/users/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}` | Get user profile | `user.profile` |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}` | Update profile information | `user.profile` |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/profile` | Update profile visibility | `user.profile` |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences` | Get user experiences | `user.experiences` |
| POST | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences` | Add experience | `user.experiences` |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences/{experienceId}` | Update experience | `user.experiences` |
| DELETE | `http://localhost:8000/ijaa/api/v1/users/{userId}/experiences/{experienceId}` | Delete experience | `user.experiences` |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests` | Get user interests | `user.interests` |
| POST | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests` | Add interest | `user.interests` |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests/{interestId}` | Update interest | `user.interests` |
| DELETE | `http://localhost:8000/ijaa/api/v1/users/{userId}/interests/{interestId}` | Delete interest | `user.interests` |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings` | Get user settings | `user.settings` |
| PUT | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings` | Update user settings | `user.settings` |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings/theme` | Get current user theme | `user.settings` |
| GET | `http://localhost:8000/ijaa/api/v1/users/{userId}/settings/themes` | Get available theme options | `user.settings` |
| POST | `http://localhost:8000/ijaa/api/v1/users/search` | Alumni search functionality | None |
| GET | `http://localhost:8000/ijaa/api/v1/users/search/metadata` | Get alumni search metadata | None |

## 🛡️ Admin Management APIs
**Base Path**: `/api/v1/admin/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/admin/login` | Admin authentication | `admin.auth` |
| POST | `http://localhost:8000/ijaa/api/v1/admin/admins` | Admin registration | `admin.auth` |
| GET | `http://localhost:8000/ijaa/api/v1/admin/admins` | Get all admins | `admin.features` |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/admins/{adminId}/password` | Change admin password | `admin.auth` |
| GET | `http://localhost:8000/ijaa/api/v1/admin/admins/profile` | Get admin profile | `admin.auth` |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/admins/{adminId}/deactivate` | Deactivate admin | `admin.features` |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/admins/{adminId}/activate` | Activate admin | `admin.features` |
| GET | `http://localhost:8000/ijaa/api/v1/admin/dashboard/stats` | Dashboard statistics | `admin.features` |
| GET | `http://localhost:8000/ijaa/api/v1/admin/users` | Get all users | `admin.user-management` |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/users/{userId}/block` | Block user | `admin.user-management` |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/users/{userId}/unblock` | Unblock user | `admin.user-management` |
| DELETE | `http://localhost:8000/ijaa/api/v1/admin/users/{userId}` | Delete user | `admin.user-management` |

## 🚩 Feature Flag Management APIs
**Base Path**: `/api/v1/admin/feature-flags/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/` | Get all feature flags | `admin.features` |
| GET | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}` | Get specific feature flag | `admin.features` |
| POST | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/` | Create new feature flag | `admin.features` |
| PUT | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}` | Update feature flag | `admin.features` |
| DELETE | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}` | Delete feature flag | `admin.features` |
| GET | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}/enabled` | Check feature flag status (Public) | `system.health` |
| POST | `http://localhost:8000/ijaa/api/v1/admin/feature-flags/refresh-cache` | Refresh feature flag cache | `admin.features` |

## 🌍 Location APIs
**Base Path**: `/api/v1/locations/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/locations/countries` | Get all countries | `user.location` |
| GET | `http://localhost:8000/ijaa/api/v1/locations/countries/{countryId}/cities` | Get cities by country | `user.location` |

## 🎉 Event Management APIs
**Base Path**: `/api/v1/events/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/events/my-events` | Get user's created events | `events` |
| GET | `http://localhost:8000/ijaa/api/v1/events/my-events/active` | Get user's active events | `events` |
| GET | `http://localhost:8000/ijaa/api/v1/events/all-events` | Get all active events | `events` |
| GET | `http://localhost:8000/ijaa/api/v1/events/all-events/{eventId}` | Get specific event details | `events` |
| GET | `http://localhost:8000/ijaa/api/v1/events/my-events/{eventId}` | Get user's specific event | `events` |
| POST | `http://localhost:8000/ijaa/api/v1/events/create` | Create new event | `events.creation` |
| PUT | `http://localhost:8000/ijaa/api/v1/events/my-events/{eventId}` | Update user's event | `events.update` |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/my-events/{eventId}` | Delete user's event | `events.delete` |
| POST | `http://localhost:8000/ijaa/api/v1/events/search` | Search events with filters | `search` |

## 🎫 Event Participation APIs
**Base Path**: `/api/v1/events/participation/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/participation/rsvp` | RSVP to events | `events.participation` |
| PUT | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/rsvp` | Update RSVP status | `events.participation` |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/rsvp` | Cancel RSVP | `events.participation` |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/my-participation` | Get user's participation for event | `events.participation` |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/participants` | Get event participants | `events.participation` |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/{eventId}/participants/{status}` | Get participants by status | `events.participation` |
| GET | `http://localhost:8000/ijaa/api/v1/events/participation/my-participations` | Get user's event participations | `events.participation` |

## 💬 Event Comments APIs
**Base Path**: `/api/v1/events/comments/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/comments/` | Add event comment | `events.comments` |
| GET | `http://localhost:8000/ijaa/api/v1/events/comments/event/{eventId}` | Get event comments with nested replies | `events.comments` |
| GET | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}` | Get specific comment | `events.comments` |
| PUT | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}` | Update comment | `events.comments` |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}` | Delete comment | `events.comments` |
| POST | `http://localhost:8000/ijaa/api/v1/events/comments/{commentId}/like` | Toggle comment like | `events.comments` |
| GET | `http://localhost:8000/ijaa/api/v1/events/comments/recent` | Get recent comments | `events.comments` |
| GET | `http://localhost:8000/ijaa/api/v1/events/comments/popular` | Get popular comments | `events.comments` |

## 📧 Event Invitations APIs
**Base Path**: `/api/v1/events/invitations/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/send` | Send event invitation | `events.invitations` |
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/accept` | Accept invitation | `events.invitations` |
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/decline` | Decline invitation | `events.invitations` |
| POST | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/mark-read` | Mark invitation as read | `events.invitations` |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/my-invitations` | Get user's received invitations | `events.invitations` |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/my-invitations/unread` | Get unread invitations | `events.invitations` |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/my-invitations/unresponded` | Get unresponded invitations | `events.invitations` |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/{eventId}/invitations` | Get event invitations | `events.invitations` |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/sent-by-me` | Get invitations sent by user | `events.invitations` |
| GET | `http://localhost:8000/ijaa/api/v1/events/invitations/counts` | Get invitation counts | `events.invitations` |

## 🖼️ Event Banner APIs
**Base Path**: `/api/v1/events/banner/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/banner/{eventId}` | Upload/Update event banner | `events.banner` |
| GET | `http://localhost:8000/ijaa/api/v1/events/banner/{eventId}` | Get event banner URL | `events.banner` |
| DELETE | `http://localhost:8000/ijaa/api/v1/events/banner/{eventId}` | Delete event banner | `events.banner` |

## 🔍 Advanced Event Search APIs
**Base Path**: `/api/v1/events/advanced-search/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/events/advanced-search/advanced` | Advanced event search with multiple filters | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/recommendations` | Get event recommendations | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/trending` | Get trending events | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/location/{location}` | Get events by location | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/organizer/{organizerName}` | Get events by organizer | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/high-engagement` | Get high engagement events | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/upcoming` | Get upcoming events | `search.advanced-filters` |
| GET | `http://localhost:8000/ijaa/api/v1/events/advanced-search/similar/{eventId}` | Get similar events | `search.advanced-filters` |

## 📁 File Management APIs
**Base Path**: `/api/v1/files/users/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo` | Upload profile photo | `file-upload.profile-photo` |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo` | Get profile photo URL | `file-download` |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo` | Delete profile photo | `file-delete` |
| POST | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo` | Upload cover photo | `file-upload.cover-photo` |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo` | Get cover photo URL | `file-download` |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo` | Delete cover photo | `file-delete` |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/profile-photo/file/**` | Serve profile photo file (Public) | `file-download` |
| GET | `http://localhost:8000/ijaa/api/v1/files/users/{userId}/cover-photo/file/**` | Serve cover photo file (Public) | `file-download` |

## 🎨 Event File APIs
**Base Path**: `/api/v1/files/events/`

| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| POST | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner` | Upload event banner | `events.banner` |
| GET | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner` | Get event banner URL | `file-download` |
| DELETE | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner` | Delete event banner | `file-delete` |
| GET | `http://localhost:8000/ijaa/api/v1/files/events/{eventId}/banner/file/{fileName}` | Serve event banner file (Public) | `file-download` |

## 🏥 Health Check APIs

### User Service Health Endpoints
| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/health/status` | Basic health check | `system.health` |
| GET | `http://localhost:8000/ijaa/api/v1/health/database` | Database health check | `system.health` |

### Event Service Health Endpoints
| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/events/health/status` | Basic health check | `system.health` |
| GET | `http://localhost:8000/ijaa/api/v1/events/health/database` | Database health check | `system.health` |

### File Service Health Endpoints
| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/files/health/status` | Basic health check | `system.health` |
| GET | `http://localhost:8000/ijaa/api/v1/files/health/database` | Database health check | `system.health` |

### Config Service Health Endpoints (Critical Infrastructure)
| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/config/health/status` | Basic health check | None |
| GET | `http://localhost:8000/ijaa/api/v1/config/health/config` | Configuration health check | None |
| GET | `http://localhost:8000/ijaa/api/v1/config/health/test` | Test endpoint | None |

### Discovery Service Health Endpoints (Critical Infrastructure)
| Method | Endpoint | Description | Feature Flag |
|--------|----------|-------------|--------------|
| GET | `http://localhost:8000/ijaa/api/v1/discovery/health/status` | Basic health check | None |
| GET | `http://localhost:8000/ijaa/api/v1/discovery/health/registry` | Service registry health check | None |
| GET | `http://localhost:8000/ijaa/api/v1/discovery/health/test` | Test endpoint | None |

## 📊 API Summary

- **Total Endpoints**: 89
- **Authentication Required**: 75
- **Public Endpoints**: 14
- **Feature Flags**: 44 hierarchical flags
- **Services**: 5 (User, Event, File, Config, Discovery)

## 🔑 Authentication

- **Access Token**: 15-minute expiration
- **Refresh Token**: 7-day expiration (HttpOnly cookie)
- **Header**: `Authorization: Bearer <token>`

## 🌐 Public Endpoints (No Authentication)

1. `GET /ijaa/api/v1/admin/feature-flags/{name}/enabled`
2. `POST /ijaa/api/v1/auth/refresh`
3. `POST /ijaa/api/v1/auth/logout`
4. `GET /ijaa/api/v1/locations/**`
5. `GET /ijaa/api/v1/files/users/*/profile-photo/file/**`
6. `GET /ijaa/api/v1/files/users/*/cover-photo/file/**`
7. `GET /ijaa/api/v1/files/events/{eventId}/banner/file/{fileName}`
8. All Config Service health endpoints
9. All Discovery Service health endpoints

---

**Generated**: December 2024  
**Base URL**: `http://localhost:8000/ijaa`  
**Gateway Port**: 8000  
**Total APIs**: 89 endpoints across 5 services
