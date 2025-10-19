# IJAA (IIT JU Alumni Association) - Microservices Project Context

## Project Overview
IJAA (IIT JU Alumni Association) is a comprehensive microservices-based alumni management system built with Spring Boot. The system facilitates alumni networking, event management, file handling, and advanced event features through a distributed architecture.


## Architecture

### Service Architecture
```
Gateway Service (8000) → User Service (8081), Event Service (8082), File Service (8083)
                       ↓
                 Discovery Service (8761)
                       ↓  
                 Config Service (8071)
```

### Current Services

#### 1. Discovery Service (Port: 8761)
- **Technology**: Netflix Eureka Server
- **Purpose**: Service registry and discovery
- **Status**: ✅ Functional

#### 2. Config Service (Port: 8071)  
- **Technology**: Spring Cloud Config Server
- **Purpose**: Centralized configuration server (native file system). Currently, services use their local `application.yml` and do not import from Config Server.
- **Status**: ✅ Functional

#### 3. Gateway Service (Port: 8000)
- **Technology**: Spring Cloud Gateway
- **Purpose**: API Gateway and routing
- **Status**: ✅ Functional
- **Key Features**:
  - Request routing to appropriate services
  - JWT token validation and user context propagation
  - Public access for feature flag status checks
  - File serving routes for public image access
  - Centralized token blacklisting with PostgreSQL via `/api/v1/token/*`

#### 4. User Service (Port: 8081)
- **Technology**: Spring Boot + PostgreSQL + JPA
- **Purpose**: User management and authentication
- **Status**: ✅ Functional
- **Key Features**:
  - JWT-based authentication with refresh tokens
  - Profile management (experiences, interests, settings)
  - Alumni search functionality
  - Feature flag system for access control
  - Admin management system
  - Location management (countries and cities)

#### 5. Event Service (Port: 8082)
- **Technology**: Spring Boot + PostgreSQL + JPA
- **Purpose**: Comprehensive event management system
- **Status**: ✅ Functional
- **Key Features**:
  - Event creation, update, and management
  - Advanced search with multiple criteria
  - Comment system with likes and replies
  - Event participation and RSVP system
  - Event invitations and banner management

#### 6. File Service (Port: 8083)
- **Technology**: Spring Boot + File System Storage
- **Purpose**: File upload and management
- **Status**: ✅ Functional
- **Key Features**:
  - Profile photo and cover photo management
  - Event banner upload and management
  - File validation and processing
  - Public file serving endpoints

## Database Schema

### User Service Tables
- `users`: Core user information and authentication
- `profiles`: Extended user profile information with location relationships
- `experiences`: User work experience entries
- `interests`: User interests and skills
- `connections`: Alumni networking connections
- `feature_flags`: System feature flag configuration (hierarchical structure)
- `admins`: Admin user management
- `user_settings`: User preferences and settings (theme)
- `countries`: Location data - countries (id, name)
- `cities`: Location data - cities (id, name, country_id)
- `refresh_tokens`: JWT refresh token storage

### Event Service Tables
- `events`: Event information and metadata
- `event_posts`: Event discussion posts with mixed content support
- `event_comments`: Comment system with nested replies (now post-based)
- `event_participations`: Event RSVP and participation tracking
- `event_invitations`: Event invitation management

### File Service Tables
- `users`: User file metadata
- `event_banners`: Event banner file metadata
- `event_post_media`: Post media files (images and videos)

### Database Configuration
- **SQL Initialization**: `spring.sql.init.mode=always` with `ddl-auto=none`
- **Schema Files**: `classpath:db/schema.sql` for table creation
- **Data Files**: `classpath:db/data.sql` for initial data
- **Initial Data**: 1 admin account, 245 countries, 381 cities, 52 feature flags

## API Endpoints

### Authentication APIs (`/ijaa/api/v1/auth/`)
- ✅ `POST /login` - User authentication (**Feature Flag**: `user.login`)
- ✅ `POST /register` - User registration (**Feature Flag**: `user.registration`)
- ✅ `POST /refresh` - Refresh access token (**Feature Flag**: `user.refresh`)
- ✅ `POST /logout` - Logout and invalidate refresh token (**Feature Flag**: `user.logout`)
- ✅ `POST /change-password` - Password management (**Feature Flag**: `user.password-change`)

### User Management APIs (`/ijaa/api/v1/users/`)
- ✅ `GET /{userId}` - Get user profile (**Feature Flag**: `user.profile`)
- ✅ `PUT /{userId}` - Update profile information (**Feature Flag**: `user.profile`)
- ✅ `PUT /{userId}/profile` - Update profile visibility (**Feature Flag**: `user.profile`)
- ✅ `GET /{userId}/experiences` - Get user experiences (**Feature Flag**: `user.experiences`)
- ✅ `POST /{userId}/experiences` - Add experience (**Feature Flag**: `user.experiences`)
- ✅ `PUT /{userId}/experiences/{experienceId}` - Update experience (**Feature Flag**: `user.experiences`)
- ✅ `DELETE /{userId}/experiences/{experienceId}` - Delete experience (**Feature Flag**: `user.experiences`)
- ✅ `GET /{userId}/interests` - Get user interests (**Feature Flag**: `user.interests`)
- ✅ `POST /{userId}/interests` - Add interest (**Feature Flag**: `user.interests`)
- ✅ `PUT /{userId}/interests/{interestId}` - Update interest (**Feature Flag**: `user.interests`)
- ✅ `DELETE /{userId}/interests/{interestId}` - Delete interest (**Feature Flag**: `user.interests`)
- ✅ `GET /{userId}/settings` - Get user settings (**Feature Flag**: `user.settings`)
- ✅ `PUT /{userId}/settings` - Update user settings (**Feature Flag**: `user.settings`)
- ✅ `GET /{userId}/settings/theme` - Get current user theme (**Feature Flag**: `user.settings`)
- ✅ `GET /{userId}/settings/themes` - Get available theme options (**Feature Flag**: `user.settings`)
- ✅ `POST /search` - Alumni search functionality (No feature flag required)
- ✅ `GET /search/metadata` - Get alumni search metadata (No feature flag required)

### Admin Management APIs (`/ijaa/api/v1/admin/`)
- ✅ `POST /login` - Admin authentication (**Feature Flag**: `admin.auth`)
- ✅ `POST /logout` - Admin logout (**Feature Flag**: `admin.logout`)
- ✅ `POST /admins` - Admin registration (**Feature Flag**: `admin.auth`)
- ✅ `GET /admins` - Get all admins (**Feature Flag**: `admin.features`)
- ✅ `PUT /change-password` - Change admin password (**Feature Flag**: `admin.auth`)
- ✅ `GET /profile` - Get admin profile (**Feature Flag**: `admin.auth`)
- ✅ `POST /admins/{adminId}/deactivate` - Deactivate admin (**Feature Flag**: `admin.features`)
- ✅ `POST /admins/{adminId}/activate` - Activate admin (**Feature Flag**: `admin.features`)
- ✅ `GET /dashboard` - Dashboard statistics (**Feature Flag**: `admin.features`)
- ✅ `GET /users` - Get all users (**Feature Flag**: `admin.user-management`)
- ✅ `POST /users/{userId}/block` - Block user (**Feature Flag**: `admin.user-management`)
- ✅ `POST /users/{userId}/unblock` - Unblock user (**Feature Flag**: `admin.user-management`)
- ✅ `DELETE /users/{userId}` - Delete user (**Feature Flag**: `admin.user-management`)

### Feature Flag Management APIs (`/ijaa/api/v1/admin/feature-flags/`)
- ✅ `GET /` - Get all feature flags (ADMIN only)
- ✅ `GET /{name}` - Get specific feature flag (ADMIN only)
- ✅ `POST /` - Create new feature flag (ADMIN only)
- ✅ `PUT /{name}` - Update feature flag (ADMIN only)
- ✅ `DELETE /{name}` - Delete feature flag (ADMIN only)
- ✅ `GET /{name}/enabled` - Check feature flag status (Public - No authentication required)

### Location APIs (`/ijaa/api/v1/locations/`)
- ✅ `GET /countries` - Get all countries (**Feature Flag**: `user.location`)
- ✅ `GET /countries/{countryId}/cities` - Get cities by country (**Feature Flag**: `user.location`)

### Event Management APIs (`/ijaa/api/v1/events/`)
- ✅ `GET /my-events` - Get user's created events
- ✅ `GET /my-events/active` - Get user's active events
- ✅ `GET /all-events` - Get all active events
- ✅ `GET /all-events/{eventId}` - Get specific event details
- ✅ `GET /my-events/{eventId}` - Get user's specific event
- ✅ `POST /create` - Create new event
- ✅ `PUT /my-events/{eventId}` - Update user's event
- ✅ `DELETE /my-events/{eventId}` - Delete user's event
- ✅ `POST /search` - Search events with filters

### Event Participation APIs (`/ijaa/api/v1/events/participation/`)
- ✅ `POST /rsvp` - RSVP to events
- ✅ `PUT /{eventId}/rsvp` - Update RSVP status
- ✅ `DELETE /{eventId}/rsvp` - Cancel RSVP
- ✅ `GET /{eventId}/my-participation` - Get user's participation for event
- ✅ `GET /{eventId}/participants` - Get event participants
- ✅ `GET /{eventId}/participants/{status}` - Get participants by status
- ✅ `GET /my-participations` - Get user's event participations

### Event Posts APIs (`/ijaa/api/v1/events/posts/`)
- ✅ `POST /` - Create event post (**Feature Flag**: `events.posts.create`)
- ✅ `GET /event/{eventId}` - Get event posts (paginated) (**Feature Flag**: `events.posts`)
- ✅ `GET /event/{eventId}/all` - Get all event posts (**Feature Flag**: `events.posts`)
- ✅ `GET /{postId}` - Get specific post (**Feature Flag**: `events.posts`)
- ✅ `PUT /{postId}` - Update post (**Feature Flag**: `events.posts.update`)
- ✅ `DELETE /{postId}` - Delete post (**Feature Flag**: `events.posts.delete`)
- ✅ `POST /{postId}/like` - Toggle post like (**Feature Flag**: `events.posts.like`)
- ✅ `GET /user/{username}` - Get user's posts (paginated) (**Feature Flag**: `events.posts`)
- ✅ `GET /user/{username}/event/{eventId}` - Get user's posts for event (**Feature Flag**: `events.posts`)

### Event Comments APIs (`/ijaa/api/v1/events/comments/`)
- ✅ `POST /` - Add post comment (**Feature Flag**: `events.comments`)
- ✅ `GET /post/{postId}` - Get post comments with nested replies (**Feature Flag**: `events.comments`)
- ✅ `GET /{commentId}` - Get specific comment (**Feature Flag**: `events.comments`)
- ✅ `PUT /{commentId}` - Update comment (**Feature Flag**: `events.comments`)
- ✅ `DELETE /{commentId}` - Delete comment (**Feature Flag**: `events.comments`)
- ✅ `POST /{commentId}/like` - Toggle comment like (**Feature Flag**: `events.comments`)
- ✅ `GET /recent/post/{postId}` - Get recent comments for post (**Feature Flag**: `events.comments`)
- ✅ `GET /popular/post/{postId}` - Get popular comments for post (**Feature Flag**: `events.comments`)

### Event Invitations APIs (`/ijaa/api/v1/events/invitations/`)
- ✅ `POST /send` - Send event invitation
- ✅ `POST /{eventId}/accept` - Accept invitation
- ✅ `POST /{eventId}/decline` - Decline invitation
- ✅ `POST /{eventId}/mark-read` - Mark invitation as read
- ✅ `GET /my-invitations` - Get user's received invitations
- ✅ `GET /my-invitations/unread` - Get unread invitations
- ✅ `GET /my-invitations/unresponded` - Get unresponded invitations
- ✅ `GET /{eventId}/invitations` - Get event invitations
- ✅ `GET /sent-by-me` - Get invitations sent by user
- ✅ `GET /counts` - Get invitation counts

### Advanced Event Search APIs (`/ijaa/api/v1/events/advanced-search/`)
- ✅ `POST /advanced` - Advanced event search with multiple filters
- ✅ `GET /recommendations` - Get event recommendations
- ✅ `GET /trending` - Get trending events
- ✅ `GET /location/{location}` - Get events by location
- ✅ `GET /organizer/{organizerName}` - Get events by organizer
- ✅ `GET /high-engagement` - Get high engagement events
- ✅ `GET /upcoming` - Get upcoming events
- ✅ `GET /similar/{eventId}` - Get similar events

### File Management APIs (`/ijaa/api/v1/files/users/`)
- ✅ `POST /{userId}/profile-photo` - Upload profile photo (**Feature Flag**: `file-upload.profile-photo`)
- ✅ `GET /{userId}/profile-photo` - Get profile photo URL (**Feature Flag**: `file-download`)
- ✅ `DELETE /{userId}/profile-photo` - Delete profile photo (**Feature Flag**: `file-delete`)
- ✅ `POST /{userId}/cover-photo` - Upload cover photo (**Feature Flag**: `file-upload.cover-photo`)
- ✅ `GET /{userId}/cover-photo` - Get cover photo URL (**Feature Flag**: `file-download`)
- ✅ `DELETE /{userId}/cover-photo` - Delete cover photo (**Feature Flag**: `file-delete`)
- ✅ `GET /{userId}/profile-photo/file/**` - Serve profile photo file (public - no feature flag)
- ✅ `GET /{userId}/cover-photo/file/**` - Serve cover photo file (public - no feature flag)

### Event File APIs (`/ijaa/api/v1/files/events/`)
- ✅ `POST /{eventId}/banner` - Upload event banner (**Feature Flag**: `events.banner`)
- ✅ `GET /{eventId}/banner` - Get event banner URL (**Feature Flag**: `events.banner`)
- ✅ `DELETE /{eventId}/banner` - Delete event banner (**Feature Flag**: `events.banner`)
- ✅ `GET /{eventId}/banner/file/{fileName}` - Serve event banner file (public)

### Post Media APIs (`/ijaa/api/v1/files/posts/`)
- ✅ `GET /{postId}/media` - Get all post media files (protected)
- ✅ `POST /{postId}/media` - Upload post media (**Feature Flag**: `events.posts.media`)
- ✅ `GET /{postId}/media/{fileName}` - Get post media URL (**Feature Flag**: `file-download`)
- ✅ `GET /{postId}/media/file/{fileName}` - Serve post media file (public)
- ✅ `DELETE /{postId}/media/{fileName}` - Delete post media (**Feature Flag**: `file-delete`)

## Feature Flag System

### Overview
The system implements a sophisticated feature flag mechanism with 52 hierarchical flags:
- **Hierarchical Structure**: Parent-child relationships between flags
- **Database-Driven**: Flags stored in database for runtime changes
- **Public Status Checks**: Feature flag status accessible without authentication

### Feature Flag to API Mapping

**User Service Feature Flags:**
- `user.registration` → User signup endpoints
- `user.login` → User signin endpoints  
- `user.logout` → User logout endpoints
- `user.password-change` → Password change endpoints
- `user.profile` → Profile management endpoints (get, update, visibility)
- `user.experiences` → Experience management endpoints (add, update, delete)
- `user.interests` → Interest management endpoints (add, update, delete)
- `user.settings` → User settings endpoints (theme, preferences)
- `user.location` → Location endpoints (countries, cities)

**Admin Service Feature Flags:**
- `admin.auth` → Admin authentication endpoints (login, signup, password change, profile)
- `admin.logout` → Admin logout endpoints
- `admin.features` → Admin management endpoints (list admins, deactivate, activate, dashboard)
- `admin.user-management` → User management endpoints (list users, block, unblock, delete)

**File Service Feature Flags:**
- `file-upload.profile-photo` → Profile photo upload
- `file-upload.cover-photo` → Cover photo upload
- `file-download` → File download/URL retrieval
- `file-delete` → File deletion

**Event Service Feature Flags:**
- `search` → Basic search functionality
- `search.advanced-filters` → Advanced event search endpoints
- `events` → Core event management (creation, update, deletion)
- `events.participation` → Event participation/RSVP
- `events.comments` → Event commenting system (now post-based)
- `events.invitations` → Event invitation system
- `events.media` → Event media attachments
- `events.banner` → Event banner upload and management
- `events.posts` → Event posts and discussion system
- `events.posts.create` → Create event posts
- `events.posts.update` → Update event posts
- `events.posts.delete` → Delete event posts
- `events.posts.like` → Like event posts
- `events.posts.media` → Upload media for posts

**System Feature Flags:**
- `alumni.search` → Alumni search functionality
- `announcements` → System-wide announcements
- `reports` → User reporting system
- `system.health` → System health check endpoints
- `user.refresh` → User token refresh functionality

## JWT Authentication System

### Overview
Production-ready JWT authentication with refresh tokens:
- **Access Tokens**: 60-minute expiration, JWT format with user claims
- **Refresh Tokens**: 7-day expiration, stored in database
- **Secure Cookies**: HttpOnly, Secure, SameSite=Strict for refresh tokens
- **Multi-device Support**: Each device gets its own refresh token

### Authentication Flow
1. **Login**: User provides credentials → Access token + Refresh token cookie
2. **API Access**: Use access token in Authorization header
3. **Token Refresh**: Use refresh token cookie to get new access token
4. **Logout**: Revoke refresh token and clear cookie

### Public Endpoints (No Authentication Required)
- `GET /ijaa/api/v1/admin/feature-flags/{name}/enabled` - Feature flag status check (**Feature Flag**: `system.health`)
- `POST /ijaa/api/v1/auth/refresh` - Refresh access token (**Feature Flag**: `user.refresh`)
- `GET /ijaa/api/v1/files/users/*/profile-photo/file/**` - Profile photo serving (**Feature Flag**: `file-download`)
- `GET /ijaa/api/v1/files/users/*/cover-photo/file/**` - Cover photo serving (**Feature Flag**: `file-download`)
- `GET /ijaa/api/v1/files/events/{eventId}/banner/file/{fileName}` - Event banner serving (**Feature Flag**: `file-download`)
- `GET /ijaa/api/v1/files/posts/{postId}/media/file/{fileName}` - Serve post media files (public)

## Health Check APIs

### User Service Health Endpoints (**Feature Flag**: `system.health`)
- `GET /ijaa/api/v1/health/status` - Basic health check
- `GET /ijaa/api/v1/health/database` - Database health check

### Event Service Health Endpoints (**Feature Flag**: `system.health`)
- `GET /ijaa/api/v1/events/health/status` - Basic health check
- `GET /ijaa/api/v1/events/health/database` - Database health check

### File Service Health Endpoints (**Feature Flag**: `system.health`)
- `GET /ijaa/api/v1/files/health/status` - Basic health check
- `GET /ijaa/api/v1/files/health/database` - Database health check

### Config Service Health Endpoints (No feature flag - Critical infrastructure)
- `GET /ijaa/api/v1/config/health/status` - Basic health check
- `GET /ijaa/api/v1/config/health/config` - Configuration health check
- `GET /ijaa/api/v1/config/health/test` - Test endpoint

### Discovery Service Health Endpoints (No feature flag - Critical infrastructure)
- `GET /ijaa/api/v1/discovery/health/status` - Basic health check
- `GET /ijaa/api/v1/discovery/health/registry` - Service registry health check
- `GET /ijaa/api/v1/discovery/health/test` - Test endpoint

**Note**: Config Service and Discovery Service health endpoints are **NOT** protected by feature flags as they are critical infrastructure services that need to be accessible for system monitoring.

## Development Guidelines

### Project Structure
Each service follows standard Spring Boot structure:
```
src/
├── main/
│   ├── java/com/ijaa/{service}/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── domain/         # DTOs and entities
│   │   ├── config/         # Configuration
│   │   └── common/         # Utilities and common code
│   └── resources/
│       ├── application.yml # Service configuration
│       └── db/            # Database schema and data files
└── test/                  # Test suite
```

### Testing Strategy
- **Unit Tests**: Service layer logic testing
- **Integration Tests**: Full API endpoint testing  
- **Authorization Tests**: Role-based access control validation
- **Feature Flag Tests**: Feature toggle functionality validation

## Post System (NEW FEATURE)

### Overview
The IJAA system now includes a comprehensive post system for event discussions, allowing event creators to create rich, interactive content within their events.

### Key Features
- **Mixed Content Posts**: Support for text, multiple images, and multiple videos in a single post
- **Media Ordering**: Proper ordering and display of media files with `fileOrder` field
- **Post-based Comments**: Comments are now associated with posts rather than directly with events
- **Access Control**: Only event creators can create, update, and delete posts on their events
- **Public Media Access**: Media files can be accessed without authentication for display
- **Real-time Integration**: Media files are automatically included in post responses

### Post Types
- **TEXT**: Text-only posts
- **IMAGE**: Posts with images only
- **VIDEO**: Posts with videos only
- **MIXED**: Posts with both images and videos

### Media Support
- **Images**: JPG, JPEG, PNG, WEBP (max 5MB each)
- **Videos**: MP4, AVI, MOV, WMV, FLV, WEBM (max 50MB each)
- **Multiple Files**: Support for multiple media files per post with proper ordering

### Database Tables
- `event_posts`: Main posts table with content and metadata
- `event_post_media`: Media files associated with posts
- `event_comments`: Comments now reference posts instead of events directly

### API Endpoints
- **Post Management**: Create, read, update, delete posts
- **Media Management**: Upload, serve, delete media files
- **Comment System**: Post-based commenting with nested replies
- **User Posts**: Get posts by user across all events or for specific events

## System Status

**Key Strengths**:
- ✅ **Complete microservices architecture** with proper service separation
- ✅ **JWT authentication system** with refresh tokens and secure cookies
- ✅ **Comprehensive API coverage** for all core features
- ✅ **Feature flag system** with 52 hierarchical flags
- ✅ **Database schema alignment** with JPA entities
- ✅ **SQL initialization** for automatic database setup
- ✅ **Production-ready database** with clean, essential-only data
- ✅ **Advanced post system** with mixed content support (text, images, videos)
- ✅ **Post-based commenting system** with nested replies
- ✅ **Media management** for posts with proper ordering and validation

**Ready for Frontend Integration**: All APIs are stable and tested, with proper authentication flow and error handling in place. The new post system provides rich discussion capabilities for events.

## API Summary

- **Total Endpoints**: 100+ (including new post system)
- **Authentication Required**: 85+
- **Public Endpoints**: 15+
- **Feature Flags**: 52 hierarchical flags
- **Services**: 5 (User, Event, File, Config, Discovery)
- **New Features**: Post system with mixed content support

**System Status**: 🟢 **READY FOR PRODUCTION** with comprehensive functionality, standardized API structure, and advanced social features.