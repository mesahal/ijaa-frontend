# IJAA Frontend Project Context

## Project Overview
IJAA (International Journal of Applied Arts) is a comprehensive web application for managing academic events, publications, and alumni networks. The frontend is built with React and provides a modern, responsive interface for users, authors, reviewers, and administrators.

## Technology Stack
- **Frontend Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Context API (UnifiedAuthContext, FeatureFlagContext)
- **HTTP Client**: Axios for API communication
- **Testing**: Jest with React Testing Library
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router for navigation

## Core Features

### 1. Authentication System
- **UnifiedAuthContext**: Centralized authentication state management
- **Multi-role Support**: Users, Authors, Reviewers, Admins, Super Admins
- **Session Management**: JWT token-based authentication with automatic refresh
- **Protected Routes**: Role-based access control for different sections

### 2. Feature Flag System (Modern Implementation)
The feature flag system provides granular control over application functionality with a modern, hierarchical interface.

#### **Modern UI Design**
- **Gradient Headers**: Beautiful blue-to-purple gradient header with real-time statistics
- **Hierarchical Grouping**: Feature flags are grouped by parent features with expandable sections
- **Modern Cards**: Rounded corners, shadows, and smooth transitions
- **Color-coded Icons**: Each feature type has a unique, meaningful icon
- **Responsive Design**: Works seamlessly on all device sizes

#### **Key Features**
- **Parent-Child Relationships**: Visual indicators showing hierarchical dependencies
- **Expandable Groups**: Click to expand/collapse feature groups
- **Real-time Statistics**: Live count of enabled/disabled/total features in header
- **Single Filter**: Simplified unified filter (All, Enabled, Disabled)
- **Modern Modals**: Backdrop blur, smooth animations, and improved UX
- **Removed Unnecessary Elements**: Eliminated redundant refresh buttons for cleaner interface

#### **Data Structure**
```javascript
{
  id: 1,
  name: "events.creation",
  displayName: "Event Creation",
  description: "Event creation functionality",
  enabled: true,
  parentId: 1,
  children: []
}
```

#### **API Endpoints**
- `GET /api/v1/admin/feature-flags` - Get all feature flags
- `GET /api/v1/admin/feature-flags/enabled` - Get enabled feature flags
- `GET /api/v1/admin/feature-flags/disabled` - Get disabled feature flags
- `POST /api/v1/admin/feature-flags` - Create feature flag
- `PUT /api/v1/admin/feature-flags/{name}` - Update feature flag
- `DELETE /api/v1/admin/feature-flags/{name}` - Delete feature flag
- `GET /api/v1/admin/feature-flags/{name}/enabled` - Check feature flag status
- `POST /api/v1/admin/feature-flags/refresh-cache` - Refresh feature flag cache

#### **React Components**
- **FeatureFlagContext**: Global state management for feature flags
- **useFeatureFlag Hook**: Check single feature flag status
- **useMultiFeatureFlag Hook**: Check multiple feature flags simultaneously
- **FeatureFlagWrapper**: Conditional rendering based on feature flag status
- **MultiFeatureFlag**: Advanced component for complex feature combinations

#### **Admin Panel Integration**
- **Modern Interface**: Beautiful, intuitive admin panel for feature flag management
- **Hierarchical View**: Grouped display with parent-child relationships
- **Real-time Updates**: Immediate visual feedback for all changes
- **Bulk Operations**: Efficient management of multiple feature flags
- **Search & Filter**: Quick access to specific feature flags

#### **Predefined Feature Flags**
```javascript
// User Management
'user.registration', 'user.login', 'user.password-change', 'user.profile', 'user.experiences', 'user.interests'

// Event System
'events', 'events.creation', 'events.update', 'events.delete', 'events.participation', 'events.invitations', 'events.comments', 'events.media', 'events.templates', 'events.recurring', 'events.reminders'

// File Management
'file-upload', 'file-upload.profile-photo', 'file-upload.cover-photo', 'file-download', 'file-delete'

// Search & Discovery
'search', 'search.advanced-filters', 'alumni.search'

// Admin Features
'admin.features', 'admin.auth', 'admin.user-management', 'admin.announcements', 'admin.reports'

// Legacy Features
'NEW_UI', 'CHAT_FEATURE', 'EVENT_REGISTRATION', 'PAYMENT_INTEGRATION', 'SOCIAL_LOGIN', 'DARK_MODE', 'NOTIFICATIONS', 'ADVANCED_SEARCH', 'ALUMNI_DIRECTORY', 'MENTORSHIP_PROGRAM', 'EVENT_ANALYTICS', 'EVENT_TEMPLATES', 'RECURRING_EVENTS', 'EVENT_MEDIA', 'EVENT_COMMENTS'
```

### 3. Event Management
- **Event Creation**: Rich text editor with media upload support
- **Event Categories**: Organized event classification system
- **Registration System**: Attendee management with capacity limits
- **Event Analytics**: Comprehensive reporting and insights
- **Recurring Events**: Support for series and patterns

### 4. Publication System
- **Manuscript Submission**: Multi-step submission process
- **Peer Review**: Automated review assignment and tracking
- **Version Control**: Document versioning and change tracking
- **Publication Workflow**: Editorial review and approval process

### 5. User Management
- **Profile Management**: Comprehensive user profiles with social features
- **Role-based Access**: Granular permissions for different user types
- **Alumni Network**: Professional networking and mentorship features
- **Notification System**: Real-time updates and email notifications

### 6. Admin Panel
- **Dashboard**: Real-time analytics and system overview
- **User Management**: Admin tools for user administration
- **Content Moderation**: Tools for managing submissions and events
- **System Configuration**: Feature flags and system settings
- **Reporting**: Comprehensive analytics and reporting tools

## File Structure
```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Main application pages
├── utils/              # Utility functions and API clients
├── __tests__/          # Test files
└── setupTests.js       # Test configuration
```

## Key Components

### Context Providers
- **UnifiedAuthContext**: Centralized authentication state
- **FeatureFlagContext**: Feature flag state management

### Custom Hooks
- **useFeatureFlag**: Single feature flag checking
- **useMultiFeatureFlag**: Multiple feature flag checking
- **useUnifiedAuth**: Authentication state access

### API Utilities
- **adminApi**: Admin-specific API endpoints
- **featureFlagApi**: Feature flag management APIs
- **axios**: HTTP client configuration

## Testing Strategy
- **Unit Tests**: Component and hook testing with Jest
- **Integration Tests**: API integration and user flow testing
- **Mock Strategy**: Comprehensive mocking of external dependencies
- **Test Coverage**: High coverage for critical functionality

## Development Guidelines
- **Component Design**: Functional components with hooks
- **State Management**: Context API for global state, local state for component-specific data
- **Styling**: Tailwind CSS with consistent design system
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized rendering and lazy loading
- **Accessibility**: WCAG compliance and keyboard navigation

## Deployment
- **Build Process**: Optimized production builds
- **Environment Configuration**: Environment-specific settings
- **Performance Monitoring**: Real-time performance tracking
- **Error Tracking**: Comprehensive error monitoring and reporting

## Recent Improvements
- **Comprehensive Feature Flag Integration**: Implemented feature flag protection across the entire application
- **Page-Level Protection**: All major pages now have feature flag protection with proper fallback messages
- **Component-Level Protection**: Individual components and sections are protected with feature flags
- **Navigation Protection**: Navbar items are conditionally shown based on feature flag status
- **Admin Route Protection**: All admin routes are protected with appropriate feature flags
- **Public Route Protection**: Authentication routes (login/registration) are protected
- **File Upload Protection**: Photo upload components are protected with feature flags
- **Profile Section Protection**: Individual profile sections (experiences, interests, password change) are protected
- **Modern Feature Flag UI**: Complete redesign with hierarchical grouping, modern styling, and improved UX
- **Removed Redundant Elements**: Eliminated unnecessary refresh buttons for cleaner interface
- **Enhanced Visual Design**: Gradient headers, better spacing, and improved typography
- **Improved Accessibility**: Better keyboard navigation and screen reader support
- **Optimized Performance**: Reduced unnecessary re-renders and improved loading states
- **Fixed Feature Flag Duplication Issues**: Resolved duplicate feature display in admin panel
- **Improved Parent-Child Relationship Display**: Features now properly show as individual items with dropdown controls for children
- **Enhanced Test Coverage**: Updated and expanded test suite for AdminFeatureFlags component
- **Consistent Admin Panel Theme**: Feature flags page now matches the overall admin panel design system

## Comprehensive Feature Flag Implementation (Latest)

### Application-Wide Feature Flag Protection

#### **Page-Level Protection**
- **Events Page**: Protected by `events` feature flag with "Events Unavailable" fallback
- **Search Page**: Protected by `alumni.search` feature flag with "Alumni Search Unavailable" fallback
- **Notifications Page**: Protected by `notifications` feature flag with "Notifications Unavailable" fallback
- **Contact Support Page**: Protected by `reports` feature flag with "Contact Support Unavailable" fallback
- **Profile Page**: Protected by `user.profile` feature flag with "Profile Management Unavailable" fallback
- **View Profile Page**: Protected by `user.profile` feature flag with "Profile View Unavailable" fallback
- **Dashboard Page**: Protected by `user.profile` feature flag with "Dashboard Unavailable" fallback
- **SignIn Page**: Protected by `user.login` feature flag with "Login Unavailable" fallback
- **SignUp Page**: Protected by `user.registration` feature flag with "Registration Unavailable" fallback

#### **Admin Route Protection**
- **Admin Dashboard**: Protected by `admin.features` feature flag
- **Admin Users**: Protected by `admin.user-management` feature flag
- **Admin Announcements**: Protected by `admin.announcements` feature flag
- **Admin Reports**: Protected by `admin.reports` feature flag
- **Admin Settings**: Protected by `admin.auth` feature flag
- **Admin Management**: Protected by `admin.features` feature flag

#### **Component-Level Protection**
- **Password Change Section**: Protected by `user.password-change` feature flag (hidden when disabled)
- **Experiences Section**: Protected by `user.experiences` feature flag (hidden when disabled)
- **Interests Section**: Protected by `user.interests` feature flag (hidden when disabled)
- **Profile Photo Upload**: Protected by `file-upload.profile-photo` feature flag (hidden when disabled)
- **Cover Photo Upload**: Protected by `file-upload.cover-photo` feature flag (hidden when disabled)

#### **Navigation Protection**
- **Events Navigation**: Only shown when `events` feature flag is enabled
- **Search Navigation**: Only shown when `alumni.search` feature flag is enabled
- **Notifications Icon**: Only shown when `notifications` feature flag is enabled
- **Help Menu Item**: Only shown when `reports` feature flag is enabled
- **Landing Page Sign-In**: Only shown when `user.login` feature flag is enabled
- **Landing Page Join Now**: Only shown when `user.registration` feature flag is enabled

### Feature Flag Behavior Patterns

#### **Page-Level Behavior**
- **When Enabled**: Page renders normally with full functionality
- **When Disabled**: Shows comprehensive "Feature Unavailable" page with:
  - Appropriate icon for the feature
  - Clear explanation message
  - "Go Back" button for navigation
  - Consistent styling across all pages

#### **Component-Level Behavior**
- **When Enabled**: Component renders normally
- **When Disabled**: Component is completely hidden (no fallback shown)
- **Rationale**: Components are part of larger pages, so hiding them provides cleaner UX

#### **Navigation Behavior**
- **When Enabled**: Navigation item appears in navbar/menu
- **When Disabled**: Navigation item is completely hidden
- **Rationale**: Prevents users from navigating to disabled features

### Database Structure Alignment
Updated feature flag constants to match exact database structure:
```javascript
// Admin Features
ADMIN_FEATURES: 'admin.features',
ADMIN_USER_MANAGEMENT: 'admin.user-management',
ADMIN_ANNOUNCEMENTS: 'admin.announcements',
ADMIN_REPORTS: 'admin.reports',
ADMIN_AUTH: 'admin.auth',

// User Features
USER_PROFILE: 'user.profile',
USER_REGISTRATION: 'user.registration',
USER_LOGIN: 'user.login',
USER_EXPERIENCES: 'user.experiences',
USER_INTERESTS: 'user.interests',
USER_PASSWORD_CHANGE: 'user.password-change',

// Events System
EVENTS: 'events',
EVENTS_CREATION: 'events.creation',
EVENTS_UPDATE: 'events.update',
EVENTS_DELETE: 'events.delete',
EVENTS_PARTICIPATION: 'events.participation',
EVENTS_INVITATIONS: 'events.invitations',
EVENTS_COMMENTS: 'events.comments',
EVENTS_MEDIA: 'events.media',
EVENTS_TEMPLATES: 'events.templates',
EVENTS_RECURRING: 'events.recurring',
EVENTS_ANALYTICS: 'events.analytics',
EVENTS_REMINDERS: 'events.reminders',
CALENDAR_INTEGRATION: 'calendar.integration',

// File Management
FILE: 'file',
FILE_DOWNLOAD: 'file-download',
FILE_DELETE: 'file-delete',
FILE_UPLOAD: 'file-upload',
FILE_UPLOAD_COVER_PHOTO: 'file-upload.cover-photo',
FILE_UPLOAD_PROFILE_PHOTO: 'file-upload.profile-photo',

// Other Features
ALUMNI_SEARCH: 'alumni.search',
ANNOUNCEMENTS: 'announcements',
REPORTS: 'reports',
NOTIFICATIONS: 'notifications'
```

### Test Coverage
- **Comprehensive Integration Tests**: Created `feature-flag-integration.test.jsx` with 20+ test cases
- **Page-Level Tests**: Tests for all major pages with feature flag protection
- **Component-Level Tests**: Tests for individual component protection
- **Admin Route Tests**: Tests for admin feature flag protection
- **Public Route Tests**: Tests for authentication route protection
- **Loading State Tests**: Tests for feature flag loading states
- **Error Handling Tests**: Tests for graceful error handling

### Implementation Benefits
1. **Granular Control**: Each feature can be independently enabled/disabled
2. **User Experience**: Disabled features show appropriate messages instead of errors
3. **Navigation Safety**: Users can't navigate to disabled features
4. **Admin Control**: Admins can control feature availability through the admin panel
5. **Consistent Behavior**: All features follow the same enable/disable patterns
6. **Performance**: Disabled features don't load unnecessary components
7. **Maintenance**: Easy to add new feature flags following established patterns
8. **Landing Page Protection**: Sign-in and "Join Now" buttons are protected by feature flags

### Technical Implementation Details
- **FeatureFlagWrapper**: Reusable component for conditional rendering
- **useFeatureFlag Hook**: Custom hook for checking feature flag status
- **Route-Level Protection**: Feature flags applied at React Router level
- **Component-Level Protection**: Feature flags applied to individual components
- **Navigation Protection**: Feature flags applied to navbar items
- **Fallback Messages**: Consistent, user-friendly messages for disabled features
- **Loading States**: Proper loading indicators while checking feature flags
- **Error Handling**: Graceful error handling for API failures

## Feature Flag System Improvements (Previous)

### Bug Fixes
- **Duplicate Feature Display**: Fixed issue where features appeared both as individual items and as children in dropdowns
- **Proper Grouping**: Features now display correctly with parent features showing individually and children accessible via dropdown
- **Consistent Styling**: Admin feature flags page now uses the same design system as other admin pages

### UI/UX Enhancements
- **Individual Feature Cards**: Each feature (parent or child) is displayed as a separate card with full controls
- **Dropdown Controls**: Parent features with children have dropdown buttons to show/hide children
- **Visual Indicators**: Clear distinction between parent features, child features, and standalone features
- **Consistent Controls**: All features have the same enable/disable, edit, and delete controls

### Technical Improvements
- **Updated Data Processing**: Modified `processFeatureFlags` function to handle API response structure correctly
- **Enhanced State Management**: Improved handling of expanded/collapsed states for feature groups
- **Better Error Handling**: More robust error handling for API calls and state updates
- **Comprehensive Testing**: Updated test suite with 19 passing tests covering all major functionality

### Test Coverage
- **Component Rendering**: Tests for proper display of feature flags with correct indicators
- **User Interactions**: Tests for creating, editing, deleting, and toggling feature flags
- **Filter Functionality**: Tests for filter dropdown and options
- **Error Handling**: Tests for graceful handling of API errors
- **State Management**: Tests for proper state updates and UI feedback

### API Endpoint Fixes
- **URL Encoding Issue**: Feature flag names with dots (like `alumni.search`) were not being URL-encoded properly
- **Solution**: Added `encodeURIComponent()` to all feature flag API endpoints
- **Fixed Endpoints**:
  - `checkFeatureFlag()` in `featureFlagApi.js`
  - `getFeatureFlag()` in `adminApi.js`
  - `updateFeatureFlag()` in `adminApi.js`
  - `deleteFeatureFlag()` in `adminApi.js`
  - `toggleFeatureFlag()` in `adminApi.js`
- **Result**: API calls now work correctly with feature flag names containing dots

### Final API Endpoint Fix
- **Issue**: Feature flag API endpoint mismatch with backend implementation
- **Root Cause**: Using incorrect endpoint path that doesn't match the backend API structure
- **Solution**:
  1. **Correct Endpoint**: Updated to use the exact admin endpoint from backend: `http://localhost:8000/ijaa/api/v1/admin/feature-flags/{name}/enabled`
  2. **User Token Support**: Modified to use user tokens (not admin tokens) with the admin endpoint
  3. **Direct Axios Call**: Implemented direct axios call to bypass API client base URL conflicts
  4. **Proper Headers**: Added correct headers including `Authorization: Bearer {user_token}` and `accept: application/json`
- **Result**: Feature flag API now correctly matches the backend endpoint structure and works with user authentication

### Data Structure Fix
- **Issue**: Feature flag API returning correct response but search tab still not showing
- **Root Cause**: Incorrect data structure handling in `useFeatureFlag` hook
- **API Response Structure**:
  ```json
  {
    "message": "Feature flag status retrieved successfully",
    "code": "200",
    "data": {
      "name": "alumni.search",
      "enabled": true
    }
  }
  ```
- **Solution**: Updated `useFeatureFlag` hook to access `response?.data?.enabled` instead of `response?.enabled`
- **Result**: Search tab now correctly appears when `alumni.search` feature flag is enabled
