# IIT JU Alumni Frontend – Context Summary

## 🏗️ Overall Purpose & Backend Connection

This project is a frontend web application for the IIT JU Alumni Network, designed to connect alumni of Jahangirnagar University. It provides features such as alumni search, real-time chat, event management, group creation, and profile management. The frontend communicates with a microservices-based backend system (see below), primarily via a REST API gateway (`http://localhost:8000/ijaa/api/v1/user` by default, configurable via `REACT_APP_API_BASE_URL`).

**Backend System:**

- Java 17, Spring Boot 3.4.3, Spring Cloud 2024.0.0
- Microservices: API Gateway, User Service, Discovery Service, Config Service
- PostgreSQL database
- JWT-based authentication (HMAC-SHA256, 1h expiry)
- User context propagated via `X-USER_ID` header (Base64-encoded JSON)

---

## 📁 Project Folder Structure

- **src/**

  - **components/**: Reusable UI components (e.g., `Navbar.jsx`, `DirectChat.jsx`, `GroupChat.jsx`)
  - **context/**: React Context providers for authentication (`UnifiedAuthContext.jsx`) and theme (`ThemeContext.jsx`)
  - **pages/**: Route-based pages (e.g., `Dashboard.jsx`, `Profile.jsx`, `Events.jsx`, `SignIn.jsx`, `Chat.jsx`, etc.)
  - **hooks/**: Custom hooks for events, feature flags, and other functionality
  - **services/**: API service functions
  - **utils/**: Utility functions and helpers
  - **types/**: TypeScript type definitions
  - \***\*tests**/\*\*: Comprehensive test suite
  - **index.jsx**: Main entry point, sets up React Router and providers
  - **index.css**: Global styles (Tailwind CSS)
  - **App.jsx**: Main app component, defines route structure and protected routes

- **public/**: Static assets (images, favicon, HTML template)
- **cypress/**: End-to-end testing configuration and tests
- **coverage/**: Test coverage reports
- **config files**: `tailwind.config.js`, `vite.config.ts`, `eslint.config.js`, `postcss.config.js`, `package.json`

---

## 🧰 Tech Stack

- **React**: v18.2.0
- **React Router DOM**: v6.28.0 (routing and protected routes)
- **Tailwind CSS**: v3.4.17 (utility-first styling, dark mode via class)
- **Axios**: v1.7.8 (API requests)
- **React Context**: For authentication and theme management
- **Lucide-react**: Icon library
- **FontAwesome** and **react-icons**: Additional icon support
- **Vite**: Build tool and dev server
- **Testing**: React Testing Library, Jest DOM, User Event, Cypress
- **Other**: `jwt-decode` for JWT handling, `emailjs-com` for email features

---

## 🔐 Authentication Flow (Frontend & Backend Integration)

- **Unified Context-based**: `UnifiedAuthContext` provides unified authentication for both users and admins, replacing separate `AuthContext` and `AdminAuthContext`.
- **Single Source of Truth**: One context manages both user and admin states, preventing conflicts and ensuring consistent navbar visibility.
- **JWT Storage**: On successful login, JWT and user/admin info are stored in `localStorage` under `alumni_user` or `admin_user` respectively.
- **Login**: Credentials are sent to `/signin` (users) or `/login` (admins) endpoints; on success, token and userId/adminId are saved.
- **Logout**: Clears all authentication state from context and localStorage.
- **Session Conflict Resolution**: When one user type logs in, the other type's session is automatically cleared to prevent conflicts.
- **Auth Headers**: When making API requests (e.g., with Axios), the JWT is included in the `Authorization: Bearer <token>` header.
- **X-USER_ID Header**: For authenticated requests, the frontend should propagate the user context via the `X-USER_ID` header, containing a Base64-encoded JSON string (e.g., `{ "username": "john.doe" }`). This is required by the backend gateway for user context propagation.
- **Session Persistence**: On app load, checks localStorage for existing user or admin session.
- **Cross-tab Synchronization**: Storage change events ensure authentication state is synchronized across browser tabs.
- **No Axios Interceptors**: Headers are set per-request, not globally via interceptors.
- **Password Security**: Passwords are never stored in the frontend; only sent to backend for authentication.
- **Enhanced Email Validation**: SignUp component includes comprehensive email validation using regex pattern `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` to validate email format, domain, and TLD.

---

## 🔌 API Interaction Setup

- **Base URL**: Set via `REACT_APP_API_BASE_URL` environment variable.
- **Axios**: Imported and used directly in page components for API calls.
- **Headers**: JWT token injected manually in each request requiring authentication. For backend compatibility, the `X-USER_ID` header should be included for all authenticated requests.
- **No global Axios instance or interceptors**: Each request sets headers as needed.
- **API Gateway**: All requests are routed through the API gateway (Spring Cloud Gateway, port 8000).

---

## 🧑‍💼 Main Features Implemented

- **Authentication**: Sign in, sign up, forgot/reset password (integrates with backend AuthService)
- **Profile Management**: View, edit, and update profile; view other alumni profiles (ProfileService)
- **Photo Management**: Upload, display, and manage profile and cover photos (File Service)
- **Alumni Search**: Advanced search by profession, location, batch, interests (AlumniSearchService)
- **Events**: View, register, and manage alumni events with full CRUD operations
- **Groups**: Create and join groups, group chat
- **Chat**: Real-time direct and group chat (UI present, backend assumed; planned integration with Firebase/WebRTC)
- **Notifications**: Notification page and UI
- **Settings**: Privacy and account settings
- **Support**: Contact support page
- **Landing Page**: Public marketing and feature overview
- **Admin Panel**: Admin dashboard, user management, feature flags, announcements, reports
- **Other**: Terms, privacy policy, maintenance, not found

---

## 🎉 Advanced Event Management System

### ✅ Event Management Features

- **Event Creation & Management**: Full CRUD operations with privacy settings
- **Event Participation**: RSVP system with multiple status options (CONFIRMED, PENDING, DECLINED, MAYBE, CANCELLED)
- **Event Invitations**: Invitation management with personal messages
- **Event Search**: Advanced search with multiple filters (location, eventType, date range, privacy, tags)
- **Event Comments**: Commenting system for events
- **Event Media**: Media attachment support for events
- **Event Templates**: Reusable event templates
- **Recurring Events**: Support for recurring event patterns
- **Event Analytics**: Comprehensive event analytics and reporting

### ✅ Event API Endpoints

- `POST /api/v1/user/events/create` - Create new event
- `GET /api/v1/user/events` - Get all events with pagination
- `GET /api/v1/user/events/{eventId}` - Get event details
- `PUT /api/v1/user/events/{eventId}` - Update event
- `DELETE /api/v1/user/events/{eventId}` - Delete event
- `POST /api/v1/user/events/search` - Advanced event search
- `POST /api/v1/user/events/participation/rsvp` - RSVP to event
- `POST /api/v1/user/events/invitations/send` - Send event invitations
- `POST /api/v1/user/events/comments` - Add event comment
- `POST /api/v1/user/events/media` - Upload event media

### ✅ Event Types & Privacy Levels

- **Event Types**: NETWORKING, WORKSHOP, CONFERENCE, SOCIAL, CAREER, MENTORSHIP
- **Privacy Levels**: PUBLIC, PRIVATE, ALUMNI_ONLY
- **Participation Status**: PENDING, CONFIRMED, DECLINED, MAYBE, CANCELLED

---

## 🎛️ Feature Flag System

### ✅ Feature Flag Management

- **Dynamic Feature Control**: Runtime feature enablement/disablement
- **Admin Interface**: Web-based feature flag management
- **Granular Control**: Feature-level and user-level controls
- **Audit Trail**: Feature flag change tracking
- **Integration**: Seamless integration across all features

### ✅ Feature Flag API Endpoints

- `GET /api/v1/admin/feature-flags` - Get all feature flags
- `GET /api/v1/admin/feature-flags/{flagName}` - Get specific feature flag
- `POST /api/v1/admin/feature-flags` - Create feature flag
- `PUT /api/v1/admin/feature-flags/{flagName}` - Update feature flag
- `DELETE /api/v1/admin/feature-flags/{flagName}` - Delete feature flag
- `GET /api/v1/admin/feature-flags/enabled` - Get enabled features
- `GET /api/v1/admin/feature-flags/disabled` - Get disabled features
- `GET /api/v1/user/feature-flags/{flagName}/check` - Check feature flag for user

### ✅ Predefined Feature Flags

- **NEW_UI**: Modern user interface with enhanced design
- **CHAT_FEATURE**: Real-time chat functionality
- **EVENT_REGISTRATION**: Event registration system
- **PAYMENT_INTEGRATION**: Payment processing
- **SOCIAL_LOGIN**: Social media login options
- **DARK_MODE**: Dark mode theme
- **NOTIFICATIONS**: Push notifications
- **ADVANCED_SEARCH**: Advanced search with filters
- **ALUMNI_DIRECTORY**: Public alumni directory
- **MENTORSHIP_PROGRAM**: Mentorship program matching

---

## 🧩 Key Reusable Components & Custom Hooks

- **Navbar**: Responsive navigation bar with clean logo design, profile dropdown, theme toggle, and notifications
- **DirectChat / GroupChat**: Chat UIs for direct and group messaging
- **UnifiedAuthContext**: Custom hook `useUnifiedAuth` for unified authentication state and actions for both users and admins
- **ThemeContext**: Custom hook `useTheme` for dark/light mode and persistence
- **Button Component**: Enhanced with `asChild` prop support for rendering as different elements (e.g., Link components) while maintaining button styling and functionality
- **Event Components**: Comprehensive event management components including EventCard, EventForm, EventDetailsModal, etc.
- **Feature Flag Components**: FeatureFlagWrapper, FeatureFlagStatus, FeatureFlagDebugPanel for feature management
- **Photo Management Components**: PhotoManager, PhotoDisplay, ProfilePhotoUploadButton, CoverPhotoUploadButton for photo operations

---

## 🔒 Protected Routes & Route Structure

- **Protected Routes**: Implemented in `App.jsx` using conditional rendering and `Navigate` from React Router. Only authenticated users can access dashboard, profile, events, groups, chat, etc.
- **Admin Routes**: Separate admin routes with AdminRoute wrapper for admin-only access
- **Public Routes**: Landing page, sign in, sign up, forgot/reset password, terms, privacy policy
- **Route Structure**: Centralized in `App.jsx` with clear separation of public, protected, and admin routes

---

## ⚙️ Configuration Files

- **tailwind.config.js**: Tailwind setup, custom screens, dark mode via class
- **vite.config.ts**: Vite config, React plugin, excludes `lucide-react` from optimization
- **eslint.config.js**: ESLint setup for code quality
- **postcss.config.js**: PostCSS for Tailwind
- **package.json**: Scripts, dependencies, and test setup
- **jest.config.js**: Jest testing configuration
- **cypress.config.js**: Cypress E2E testing configuration
- **No .env file found**: But code expects `REACT_APP_API_BASE_URL` to be set

---

## 📦 Third-Party Libraries & Tools

- **UI/Icons**: `lucide-react`, `react-icons`, `@fortawesome`
- **Email**: `emailjs-com`
- **JWT**: `jwt-decode`
- **Testing**: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `cypress`
- **Prettier**: For code formatting
- **No Zustand, React Hook Form, or Toast libraries detected**

---

## 🧪 Testing Setup

- **Testing Libraries**: React Testing Library, Jest DOM, User Event, Cypress
- **Scripts**: `npm test` runs tests via Jest, `npm run cypress:open` for E2E testing
- **Comprehensive Test Coverage**:
  - **Component Tests**: Extensive testing for all major components including authentication, events, feature flags, and UI components
  - **Integration Tests**: App-level integration tests
  - **E2E Tests**: Cypress tests for critical user flows
  - **Build System Tests**: File integrity checks and structural validation
- **Test Patterns**: Uses `getAllByText` for multiple elements, flexible text matching with regex, and comprehensive error handling validation
- **Test Environment**: Proper Jest configuration with jsdom environment for DOM testing
- **Error Handling**: Robust error boundaries and fallbacks for test environments
- **Recent Test Improvements**: Enhanced Profile component tests with proper mocking and error handling validation
- **Test Utilities**: Simplified test-utils.jsx with proper mocking for UnifiedAuthContext and ThemeContext

---

## 📄 Unique or Noteworthy Aspects

- **Microservices Awareness**: The frontend is designed to interact with a microservices backend via a single API gateway, and is aware of service boundaries (e.g., AuthService, ProfileService, AlumniSearchService).
- **Unified Authentication System**: Single `UnifiedAuthContext` manages both user and admin authentication, preventing conflicts and ensuring consistent UI state across browser tabs.
- **Session Conflict Resolution**: Automatic clearing of conflicting sessions when switching between user types, fixing navbar visibility issues.
- **Cross-tab Synchronization**: Storage change events ensure authentication state is synchronized across browser tabs.
- **Theme Persistence**: Dark/light mode is persisted in localStorage and respects system preference
- **Manual JWT Handling**: No global Axios instance; JWT is manually injected per request
- **X-USER_ID Header**: For all authenticated API calls, the frontend should include the `X-USER_ID` header with a Base64-encoded JSON string of the user context (e.g., `{ "username": "john.doe" }`).
- **Clean Logo Design**: Navbar logo displays as image only without background color for a cleaner, more professional appearance
- **No .env file in repo**: But environment variable usage is present in code
- **No global error boundary or toast notifications**: Errors are handled inline in forms/pages
- **No Redux or Zustand**: State management is via React Context only
- **Enhanced Button Component**: Supports `asChild` prop for polymorphic rendering, allowing buttons to render as links while maintaining styling and functionality
- **Robust Email Validation**: Comprehensive email validation in SignUp component with proper regex pattern matching
- **Comprehensive Testing**: Extensive test coverage for components with proper error handling and edge case testing
- **Build System Integrity**: Automated tests to detect missing components, orphaned imports, and structural issues
- **Robust Error Handling**: ThemeContext and other components handle test environments gracefully with proper fallbacks
- **Planned Integrations**: Real-time chat (Firebase), video calls (WebRTC), payments (Stripe/Razorpay), social login (Google/Facebook OAuth)
- **Profile Component Enhancements**: Fixed cover image width to match ViewProfile page layout, removed debug section from production, and ensured proper profile data display with comprehensive error handling
- **Navbar User Icon**: Simplified navbar to show only user avatar without text for cleaner UI
- **Profile Data Fetching**: Enhanced profile data fetching with proper error handling, default values, and console logging for debugging
- **Profile API Endpoint Fix**: Updated Profile component to use correct API endpoints - `/profile` for current user's profile (instead of `/profile/{userId}`), `/experiences` for current user's experiences, and `/interests` for current user's interests. The backend determines the user from the authentication token.
- **Profile Component Data Display Fixes**: 
  - **API Endpoint Correction**: Fixed Profile component to use correct endpoints for current user's data (`/profile/${userId}`, `/experiences/${userId}`, `/interests/${userId}`) instead of user-specific endpoints
  - **Data Handling Improvements**: Enhanced handling of API responses to properly manage both array and single object responses for experiences and interests
  - **Error Handling**: Improved error handling with fallback to user context data when API calls fail
  - **Loading States**: Added proper loading states and error boundaries
  - **Data Validation**: Added validation for API response structure and handling of missing data properties
  - **Test Improvements**: Updated Profile and ViewProfile test files with proper mocking and comprehensive test scenarios
  - **Empty State Handling**: Proper handling of empty arrays and missing data with appropriate UI feedback
  - **Visibility Settings**: Enhanced contact information visibility based on user privacy settings
  - **Form Validation**: Improved form validation for required fields and data integrity
  - **Final API Endpoint Fix**: Corrected all API endpoints to include user ID as required by backend - `/profile/${user?.userId}`, `/experiences/${user?.userId}`, `/interests/${user?.userId}` to match the working curl request format

- **Photo Management System Implementation**:
  - **File Service API Integration**: Implemented comprehensive photo management system using the File Service API (port 8083)
  - **Profile Photo Management**: Added profile photo upload, display, and deletion functionality with proper validation
  - **Cover Photo Management**: Added cover photo upload, display, and deletion functionality with proper validation
  - **Photo API Service**: Created `photoApi.js` utility with functions for upload, download, and delete operations
  - **Photo Manager Component**: Created reusable `PhotoManager` component with `usePhotoManager` hook for photo state management
  - **Photo Display Component**: Created `PhotoDisplay` component with fallback image handling and error recovery
  - **Upload Components**: Created `ProfilePhotoUploadButton` and `CoverPhotoUploadButton` components for file selection
  - **File Validation**: Implemented comprehensive file validation (type, size, format) with user-friendly error messages
  - **Error Handling**: Added robust error handling for network failures, validation errors, and API errors
  - **Loading States**: Implemented proper loading states during photo operations
  - **Integration**: Integrated photo management into Profile and ViewProfile components
  - **Testing**: Created comprehensive test suite for photo API functions and components
  - **API Endpoints**: 
    - `POST /api/v1/users/{userId}/profile-photo` - Upload profile photo
    - `POST /api/v1/users/{userId}/cover-photo` - Upload cover photo
    - `GET /api/v1/users/{userId}/profile-photo` - Get profile photo URL
    - `GET /api/v1/users/{userId}/cover-photo` - Get cover photo URL
    - `DELETE /api/v1/users/{userId}/profile-photo` - Delete profile photo
    - `DELETE /api/v1/users/{userId}/cover-photo` - Delete cover photo
  - **File Validation Rules**: 
    - Supported formats: JPG, JPEG, PNG, WEBP
    - Maximum file size: 5MB
    - Automatic file type validation
    - User-friendly error messages
  - **Security Features**:
    - JWT authentication required for all operations
    - User can only manage their own photos
    - Automatic cleanup of old files when replaced
    - UUID-based file naming to prevent conflicts
  - **Recent Fixes and Improvements**:
    - **Fixed Cover Photo Upload**: Resolved Content-Type header issue for FormData uploads (browser now sets correct boundary automatically)
    - **Enhanced API Client Configuration**: Removed default Content-Type from axios instance to allow proper per-request header setting
    - **Improved Error Handling**: Enhanced error handling for network failures and API errors with proper fallbacks
    - **Fixed ViewProfile Photo Fetching**: Replaced dynamic imports with regular imports for better reliability
    - **Comprehensive Testing**: Added extensive test coverage for all photo API functions including upload, download, and delete operations
    - **FormData Optimization**: Optimized file upload handling by letting browser set Content-Type header automatically
    - **Photo Display Enhancement**: Improved photo display with proper fallback images and error recovery
    - **User Experience**: Enhanced user experience with proper loading states and error messages
    - **API Endpoint Fix**: Fixed photo API endpoints to use correct gateway server format without `/user` path suffix
    - **New API Response Format Support**: Updated photo API to handle new response format with server paths and automatic conversion to web-accessible URLs
    - **Server Path Conversion**: Implemented `convertServerPathToWebUrl` function to convert server paths (e.g., `/home/sahal/ijaa-uploads/profile/file.jpg`) to web-accessible URLs (e.g., `/uploads/profile/file.jpg`)
    - **Enhanced Response Handling**: Updated `getProfilePhotoUrl` and `getCoverPhotoUrl` functions to handle new API response format with `exists` and `photoUrl` fields
    - **PhotoManager Component Updates**: Updated PhotoManager component to properly handle new response format and ensure photo URLs are correctly processed
    - **ViewProfile Component Updates**: Updated ViewProfile component to handle new photo API response format
    - **Test Updates**: Updated photo API tests to reflect new response format and added comprehensive test coverage for path conversion functionality
    - **Base URL Configuration**: Fixed photo API base URL configuration to properly handle environment variables and remove `/user` suffix when needed
    - **API Endpoint Fix**: Fixed photo API endpoints to use correct gateway server format without `/user` path suffix
    - **New API Response Format Support**: Updated photo API to handle new response format with server paths and automatic conversion to web-accessible URLs
    - **Server Path Conversion**: Implemented `convertServerPathToWebUrl` function to convert server paths (e.g., `/home/sahal/ijaa-uploads/profile/file.jpg`) to web-accessible URLs (e.g., `/uploads/profile/file.jpg`)
    - **Enhanced Response Handling**: Updated `getProfilePhotoUrl` and `getCoverPhotoUrl` functions to handle new API response format with `exists` and `photoUrl` fields
    - **PhotoManager Component Updates**: Updated PhotoManager component to properly handle new response format and ensure photo URLs are correctly processed
    - **ViewProfile Component Updates**: Updated ViewProfile component to handle new photo API response format
    - **Test Updates**: Updated photo API tests to reflect new response format and added comprehensive test coverage for path conversion functionality
    - **Base URL Configuration**: Fixed photo API base URL configuration to properly handle environment variables and remove `/user` suffix when needed
    - **Latest Photo API Fixes (January 2025)**:
      - **New Backend Response Format**: Updated photo API to handle new backend response format where photo URLs are returned as full URLs (e.g., `http://localhost:8000/ijaa/api/v1/users/{userId}/cover-photo/file/{fileId}.jpeg`)
      - **Direct URL Usage**: Removed server path conversion logic since backend now returns web-accessible URLs directly
      - **Simplified Response Handling**: Updated `getProfilePhotoUrl` and `getCoverPhotoUrl` functions to use photo URLs directly from API response
      - **Removed Path Conversion**: Removed `convertServerPathToWebUrl` function as it's no longer needed
      - **Enhanced Test Coverage**: Updated photo API tests to reflect new response format with full URLs
      - **PhotoManager Component Updates**: Updated PhotoManager component to properly handle new full URL format
      - **Profile and ViewProfile Integration**: Ensured both Profile and ViewProfile components properly display photos using new URL format
      - **Comprehensive Testing**: Added extensive test coverage for new photo URL format including error handling and fallback scenarios
      - **API Response Format**: Backend now returns photo URLs in format: `http://localhost:8000/ijaa/api/v1/users/{userId}/{photo-type}/file/{fileId}.{extension}`
      - **Error Handling**: Maintained robust error handling for cases where photos are not available or API calls fail
      - **Fallback Images**: Preserved fallback image functionality for cases where photo URLs are null or invalid

---

## 🔄 API Versioning

All endpoints use version `v1`. Future updates will use `v2`, `v3`, etc., ensuring backward compatibility.

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

### Photo API Response Format

```json
{
  "success": true,
  "message": "Cover photo URL retrieved successfully",
  "data": {
    "photoUrl": "http://localhost:8000/ijaa/api/v1/users/e76dbb07-7790-4862-95b0-e0aa96f7b2a3/cover-photo/file/7dd13a8d-5097-40bc-a07b-affe7222df28.jpeg",
    "message": "Cover photo found",
    "exists": true
  },
  "timestamp": 1756067818705
}
```

### Photo API Endpoints

```json
{
  "Profile Photo": {
    "Upload": "POST /api/v1/users/{userId}/profile-photo",
    "Get": "GET /api/v1/users/{userId}/profile-photo",
    "Delete": "DELETE /api/v1/users/{userId}/profile-photo"
  },
  "Cover Photo": {
    "Upload": "POST /api/v1/users/{userId}/cover-photo",
    "Get": "GET /api/v1/users/{userId}/cover-photo",
    "Delete": "DELETE /api/v1/users/{userId}/cover-photo"
  }
}
```

---

## Recent Updates and Fixes

### Profile Photo Integration in Navbar and Search Page (Latest)
- **Issue**: Navbar profile icon and search page user cards were not displaying actual user profile photos from the API
- **Solution**: Implemented comprehensive profile photo integration system:
  - **Created `useCurrentUserPhoto` hook**: Fetches current user's profile photo using photoApi
  - **Created `useUserPhoto` hook**: Fetches profile photos for specific users by userId
  - **Created `UserCard` component**: Reusable component that displays user information with profile photos
  - **Updated Navbar component**: Now displays current user's actual profile photo instead of fallback image
  - **Updated Search page**: Now uses UserCard component to display user profile photos in search results
- **Result**: 
  - Navbar profile icon now shows the current user's actual profile photo
  - Search page user cards now display each user's profile photo from the API
  - Fallback images are used when profile photos are not available
- **Testing**: Created comprehensive tests for all new components and hooks
- **Files Modified**: 
  - `src/hooks/useCurrentUserPhoto.js` - New hook for current user's profile photo
  - `src/hooks/useUserPhoto.js` - New hook for specific user's profile photo
  - `src/components/UserCard.jsx` - New reusable user card component
  - `src/components/Navbar.jsx` - Updated to use current user's profile photo
  - `src/pages/Search.jsx` - Updated to use UserCard component with profile photos
  - `src/__tests__/hooks/useCurrentUserPhoto.test.js` - Tests for current user photo hook
  - `src/__tests__/hooks/useUserPhoto.test.js` - Tests for user photo hook
  - `src/__tests__/components/UserCard.test.jsx` - Tests for UserCard component
  - `src/__tests__/components/Navbar.test.jsx` - Updated tests for profile photo functionality

### Photo API URL Conversion Fix (Previous)
- **Issue**: Backend was returning relative URLs (e.g., `/ijaa/api/v1/users/{userId}/profile-photo/file/{fileId}.jpg`) but frontend needed absolute URLs
- **Solution**: Implemented `convertToAbsoluteUrl` helper function in `photoApi.js` that:
  - Detects if URL is already absolute (starts with http/https)
  - Extracts domain and port from base URL (removes path components)
  - Converts relative URLs to absolute URLs by prepending domain
  - Handles URLs with and without leading slashes
- **Result**: Profile and cover photos now display correctly with full URLs like `http://localhost:8000/ijaa/api/v1/users/{userId}/profile-photo/file/{fileId}.jpg`
- **Testing**: Updated all photo-related tests to verify URL conversion functionality
- **Files Modified**: 
  - `src/utils/photoApi.js` - Added URL conversion logic
  - `src/__tests__/utils/photoApi.test.js` - Added URL conversion tests
  - `src/__tests__/components/PhotoManager.test.jsx` - Updated photo tests
  - `src/__tests__/pages/Profile.test.jsx` - Updated profile photo tests
  - `src/__tests__/pages/ViewProfile.test.jsx` - Updated view profile photo tests

### User Password Change API Integration (Latest)
- **API Endpoint**: `POST /api/v1/user/change-password` (updated from PUT to POST to match backend)
- **Request Format**: JSON with `currentPassword`, `newPassword`, `confirmPassword`
- **Response Format**: `{ message: "Password changed successfully", code: "200", data: null }`
- **Authentication**: Requires JWT token in Authorization header and X-USER_ID header
- **Validation**: Comprehensive password validation including length (8-128 chars), complexity (lowercase, uppercase, number, special char), and confirmation matching
- **Integration**: Integrated into Profile page with admin-style UI and validation
- **Testing**: Comprehensive test coverage for API function and component integration
- **Curl Example**: 
  ```bash
  curl -X 'POST' \
    'http://localhost:8000/ijaa/api/v1/user/change-password' \
    -H 'accept: application/json' \
    -H 'Authorization: Bearer <JWT_TOKEN>' \
    -H 'Content-Type: application/json' \
    -d '{
      "currentPassword": "oldPassword",
      "newPassword": "newPassword123!",
      "confirmPassword": "newPassword123!"
    }'
  ```
- **Files Modified**:
  - `src/utils/apiClient.js` - Updated changeUserPassword function to use POST method
  - `src/pages/Profile.jsx` - Integrated password change form with admin-style UI
  - `src/__tests__/utils/changeUserPassword.test.js` - New comprehensive API tests
  - `src/__tests__/pages/Profile.test.jsx` - Updated component tests for password functionality

---

This summary provides a complete, shareable context for the `ijaa-frontend` React project, suitable for onboarding, prompt engineering, or integration with AI tools. The project has been cleaned up to remove unnecessary documentation files and build artifacts, maintaining only essential project files and comprehensive test coverage.
