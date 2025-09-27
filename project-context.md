# IJAA Frontend Project Context

## Project Overview
IJAA (International Journal of Applied Arts) is a comprehensive web application for managing academic events, publications, and alumni networks. The frontend is built with React and provides a modern, responsive interface for users, authors, reviewers, and administrators.

## Technology Stack
- **Frontend Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite (with React plugin) for fast development and optimized builds
- **Styling**: Tailwind CSS with dark mode support and custom design system
- **State Management**: React Context API (UnifiedAuthContext, FeatureFlagContext, ThemeContext)
- **HTTP Client**: Axios for API communication
- **Testing**: Jest with React Testing Library and Cypress for E2E testing
- **Icons**: Lucide React and FontAwesome for consistent iconography
- **Routing**: React Router v6 for navigation
- **TypeScript**: Partial TypeScript support with type definitions
- **Code Quality**: ESLint with TypeScript support, Prettier for formatting
- **Fonts**: @fontsource/noto-sans for typography
- **Notifications**: React Toastify for user feedback
- **Email Integration**: EmailJS for email functionality
- **Environment Configuration**: Environment variables for API endpoints and configuration

## Environment Configuration

### Environment Variables
The project uses environment variables for all API endpoints and configuration. This ensures flexibility across different environments (development, test, production).

#### **Environment Files**
- `.env` - Development environment configuration
- `.env.production` - Production environment configuration  
- `.env.test` - Test environment configuration
- `.env.example` - Template file for environment setup

#### **Required Environment Variables**
```bash
# API Gateway Base URL
REACT_APP_API_BASE_URL=http://localhost:8000/ijaa/api/v1/user

# Admin API Base URL
REACT_APP_API_ADMIN_URL=http://localhost:8000/ijaa/api/v1/user/admin

# File Service API Base URL
REACT_APP_API_FILE_URL=http://localhost:8000/ijaa/api/v1/file

# Event Service API Base URL
REACT_APP_API_EVENT_URL=http://localhost:8000/ijaa/api/v1/event

# Theme/Settings API Base URL
REACT_APP_THEME_API_BASE_URL=http://localhost:8000/ijaa/api/v1/user/settings

# Config Service API Base URL
REACT_APP_CONFIG_API_URL=http://localhost:8000/ijaa/api/v1/config

# Discovery Service API Base URL
REACT_APP_DISCOVERY_API_URL=http://localhost:8000/ijaa/api/v1/discovery

# Application Configuration
REACT_APP_APP_NAME=IJAA Frontend
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# Feature Flags
REACT_APP_ENABLE_DEBUG=true
REACT_APP_ENABLE_ANALYTICS=false

# CORS Configuration
REACT_APP_CORS_ORIGIN=http://localhost:3000
```

#### **Environment Setup**
1. Copy `.env.example` to `.env`
2. Update the values according to your environment
3. For production, use `.env.production` with HTTPS URLs
4. For testing, use `.env.test` with test-specific configurations

## Build and Development Tools

### Package Manager
- **npm**: Primary package manager with comprehensive script ecosystem

### Build Configuration
- **Vite**: Modern build tool with React plugin
- **PostCSS**: CSS processing with Tailwind CSS
- **Tailwind CSS**: Utility-first CSS framework with custom configuration

### Development Scripts
The project includes an extensive set of npm scripts for development, testing, and deployment:

#### **Core Development**
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App (if needed)

#### **Testing Infrastructure**
- `npm test`: Run unit tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm run test:ci`: Run tests in CI mode (no watch)
- `npm run test:unit`: Run only unit tests
- `npm run test:integration`: Run only integration tests
- `npm run test:components`: Run component tests
- `npm run test:context`: Run context tests
- `npm run test:utils`: Run utility tests
- `npm run test:pages`: Run page tests

#### **E2E Testing with Cypress**
- `npm run cypress:open`: Open Cypress test runner
- `npm run cypress:run`: Run Cypress tests
- `npm run cypress:run:headless`: Run Cypress tests headlessly
- `npm run cypress:run:chrome/firefox/edge`: Run tests in specific browsers
- `npm run cypress:run:mobile/tablet/desktop`: Run tests with different viewports
- `npm run test:e2e`: Run E2E tests headlessly
- `npm run test:e2e:all`: Run all E2E tests

#### **Code Quality**
- `npm run lint`: Run ESLint
- `npm run lint:fix`: Fix ESLint issues automatically
- `npm run lint:check`: Check for linting issues
- `npm run format`: Format code with Prettier
- `npm run format:check`: Check code formatting
- `npm run format:write`: Write formatted code

#### **Advanced Testing**
- `npm run test:snapshot`: Run snapshot tests
- `npm run test:accessibility`: Run accessibility tests
- `npm run test:performance`: Run performance tests
- `npm run test:regression`: Run regression tests
- `npm run test:security`: Run security tests
- `npm run test:visual`: Run visual regression tests

#### **Development Workflows**
- `npm run dev:test`: Start dev server with Cypress
- `npm run dev:test:parallel`: Run dev server, tests, and Cypress in parallel
- `npm run dev:test:full`: Complete development testing workflow

#### **CI/CD Scripts**
- `npm run ci:test`: Run tests for CI environment
- `npm run ci:build`: Build for CI environment
- `npm run ci:deploy`: Deploy from CI

## Core Features

### 1. Authentication System
- **Modern JWT Authentication**: Complete JWT-based authentication system with refresh token flow
- **UnifiedAuthContext**: Centralized authentication state management with memory-only access token storage
- **AuthService**: Centralized authentication service with proper API endpoint integration
- **Automatic Token Refresh**: Seamless token refresh using HttpOnly cookies without user intervention
- **Memory-Only Access Tokens**: Access tokens stored only in React Context memory for enhanced security
- **Multi-role Support**: Users, Authors, Reviewers, Admins, Super Admins
- **Session Management**: Hybrid approach with memory tokens and localStorage for user data persistence
- **Protected Routes**: Role-based access control for different sections
- **Admin Authentication**: Separate admin authentication system with independent token management
- **Axios Interceptors**: Automatic token attachment and refresh handling for all API requests

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
- `GET /api/v1/user/admin/feature-flags` - Get all feature flags
- `GET /api/v1/user/admin/feature-flags/enabled` - Get enabled feature flags
- `GET /api/v1/user/admin/feature-flags/disabled` - Get disabled feature flags
- `POST /api/v1/user/admin/feature-flags` - Create feature flag
- `PUT /api/v1/user/admin/feature-flags/{name}` - Update feature flag
- `DELETE /api/v1/user/admin/feature-flags/{name}` - Delete feature flag
- `GET /api/v1/user/admin/feature-flags/{name}/enabled` - Check feature flag status
- `POST /api/v1/user/admin/feature-flags/refresh-cache` - Refresh feature flag cache

#### **React Components**
- **FeatureFlagContext**: Global state management for feature flags
- **useFeatureFlag Hook**: Check single feature flag status
- **useMultiFeatureFlag Hook**: Check multiple feature flags simultaneously
- **FeatureFlagWrapper**: Conditional rendering based on feature flag status
- **MultiFeatureFlag**: Advanced component for complex feature combinations
- **FeatureFlagDemo**: Demonstration component for feature flag usage
- **FeatureFlagDebugPanel**: Debug panel for feature flag management

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

### 3. Event Management System
- **Event Creation**: Rich text editor with media upload support
- **Create Event Page**: Full-page form replacing popup modal (`/events/create`)
- **Event Editing**: Edit mode support on same page (`/events/edit/:eventId`)
- **Event Categories**: Organized event classification system (NETWORKING, WORKSHOP, CONFERENCE, SOCIAL, CAREER, MENTORSHIP)
- **Registration System**: Attendee management with capacity limits
- **Event Analytics**: Comprehensive reporting and insights
- **Recurring Events**: Support for series and patterns
- **Event Templates**: Predefined templates for common event types
- **Event Invitations**: Email-based invitation system
- **Event Comments**: Social interaction features
- **Event Media**: Photo and video sharing
- **Event Search**: Advanced search and filtering capabilities
- **Default Event Images**: Automatic fallback to `/cover.jpg` for event cover images
- **Banner Image Upload**: Integrated banner image upload for events with preview, drag-and-drop support, and edit mode management

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
- **Photo Management**: Profile and cover photo upload/management with default images
- **Default Images**: Automatic fallback to `/dp.png` for profile photos and `/cover.jpg` for cover photos
- **Experience Tracking**: Professional experience and achievements
- **Interest Management**: User interests and preferences

### 6. Admin Panel
- **Dashboard**: Real-time analytics and system overview
- **User Management**: Admin tools for user administration
- **Content Moderation**: Tools for managing submissions and events
- **System Configuration**: Feature flags and system settings
- **Reporting**: Comprehensive analytics and reporting tools
- **Announcements**: System-wide announcement management
- **Settings**: System configuration and maintenance

## File Structure
```
src/
├── components/          # Reusable UI components
│   ├── events/         # Event-specific components
│   ├── ui/             # Base UI components
│   └── ...             # Other component categories
├── context/            # React Context providers
├── hooks/              # Custom React hooks
│   └── events/         # Event-specific hooks
├── pages/              # Main application pages
├── services/           # Service layer for API calls
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and API clients
├── __tests__/          # Test files
│   ├── components/     # Component tests
│   ├── context/        # Context tests
│   ├── hooks/          # Hook tests
│   ├── pages/          # Page tests
│   ├── utils/          # Utility tests
│   └── __mocks__/      # Test mocks
└── setupTests.js       # Test configuration
```

## Key Components

### Context Providers
- **UnifiedAuthContext**: Centralized authentication state
- **FeatureFlagContext**: Feature flag state management
- **ThemeContext**: Dark/light mode theme management
- **AdminAuthContext**: Admin-specific authentication

### Custom Hooks
- **useFeatureFlag**: Single feature flag checking
- **useMultiFeatureFlag**: Multiple feature flag checking
- **useUnifiedAuth**: Authentication state access
- **useCurrentUserProfile**: Current user profile management
- **useCurrentUserPhoto**: User photo management
- **useUserPhoto**: User photo utilities
- **Event Hooks**: Comprehensive event management hooks

### API Utilities
- **AuthService**: Centralized authentication service with JWT token management and refresh flow (uses `REACT_APP_API_BASE_URL`)
- **axiosInstance**: Enhanced axios instance with automatic token refresh and request retry interceptors (uses `REACT_APP_API_BASE_URL`)
- **adminApi**: Admin-specific API endpoints with proper error handling (uses `REACT_APP_API_ADMIN_URL`)
- **featureFlagApi**: Feature flag management APIs with hierarchical structure support (uses `REACT_APP_API_ADMIN_URL`)
- **eventService**: Event management service layer with comprehensive comment API integration (uses `REACT_APP_API_EVENT_URL`)
- **photoApi**: Photo upload/management APIs with file validation and URL conversion (uses `REACT_APP_API_BASE_URL`)
- **apiClient**: Base HTTP client configuration using enhanced axios instance (uses `REACT_APP_API_BASE_URL`)
- **authHelper**: Authentication utilities and helper functions
- **sessionManager**: Session management utilities with hybrid memory/localStorage approach
- **themeApi**: Theme and Settings API client and helpers for cross-device theme persistence (uses `REACT_APP_THEME_API_BASE_URL`)

### UI Components
- **Button**: Reusable button component
- **Input**: Form input component
- **Card**: Card layout component
- **Navbar**: Navigation component
- **UserCard**: User profile card
- **RoleBadge**: Role indicator component
- **PhotoManager**: Photo management component
- **CommentCard**: Advanced comment component with edit, delete, like, and reply functionality
- **ThemeSettingsCard**: Compact theme selection card with API-fetched dropdown options for profile integration

## Testing Strategy

### Unit Testing
- **Jest**: Primary testing framework
- **React Testing Library**: Component testing utilities
- **Coverage Threshold**: 70% minimum coverage requirement
- **Mock Strategy**: Comprehensive mocking of external dependencies
- **Test Categories**: Unit, integration, component, context, utility tests

### E2E Testing
- **Cypress**: End-to-end testing framework
- **Test Categories**: Authentication, user flows, accessibility, performance
- **Browser Support**: Chrome, Firefox, Edge
- **Viewport Testing**: Mobile, tablet, desktop responsive testing
- **Visual Testing**: Screenshot comparison and visual regression

### Test Configuration
- **Jest Config**: Custom configuration with module mapping
- **Cypress Config**: Browser and viewport configuration
- **Coverage Reports**: HTML, LCOV, JSON, and text formats
- **Test Environment**: jsdom for React component testing

### CI/CD Testing
- **GitHub Actions**: Automated testing workflow
- **Matrix Testing**: Multiple Node.js versions
- **Parallel Jobs**: Unit tests, E2E tests, security tests
- **Artifact Upload**: Test results and coverage reports

## Development Guidelines
- **Component Design**: Functional components with hooks
- **State Management**: Context API for global state, local state for component-specific data
- **Styling**: Tailwind CSS with consistent design system
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized rendering and lazy loading
- **Accessibility**: WCAG compliance and keyboard navigation
- **Code Quality**: ESLint and Prettier for consistent code style
- **TypeScript**: Gradual TypeScript adoption with type definitions

## Authentication Architecture

### Security-First Design
The authentication system implements a security-first approach with the following principles:

#### **Token Storage Strategy**
- **Access Tokens**: Stored only in React Context memory, never in localStorage or sessionStorage
- **Refresh Tokens**: Stored in HttpOnly cookies by the backend, inaccessible to JavaScript
- **User Data**: Stored in localStorage for persistence across browser sessions
- **Global Access**: Access token available via `window.__accessToken` for axios interceptors

#### **Automatic Token Refresh**
- **Seamless Experience**: Users never see "session expired" messages during normal usage
- **Request Queuing**: Failed requests are queued during token refresh to prevent race conditions
- **Error Handling**: Graceful fallback to login page only when refresh fails
- **Loading States**: Visual indicators during token refresh operations

#### **API Integration**
- **Request Interceptors**: Automatically attach access tokens to all API requests
- **Response Interceptors**: Handle 401 errors with automatic token refresh and request retry
- **Error Propagation**: Proper error handling and user feedback for authentication failures
- **CORS Support**: Configured for cross-origin requests with credentials

#### **Backend Compatibility**
- **Gateway Integration**: All requests go through the API gateway at port 8000
- **Endpoint Structure**: Follows RESTful conventions with proper HTTP methods
- **Response Format**: Consistent JSON response structure across all endpoints
- **Feature Flags**: Integration with backend feature flag system for access control

## Design System

### Tailwind Configuration
- **Custom Colors**: Professional LinkedIn-inspired color palette
- **Typography**: Inter font family with custom font sizes
- **Spacing**: Extended spacing scale
- **Shadows**: Modern shadow system with LinkedIn-style variants
- **Animations**: Smooth CSS animations and transitions
- **Dark Mode**: Class-based dark mode support
- **Responsive**: Mobile-first responsive design

### Color Palette
```javascript
// Primary Colors (Blue)
primary: { 50: "#f0f9ff", ..., 950: "#082f49" }

// Secondary Colors (Gray)
secondary: { 50: "#f8fafc", ..., 950: "#020617" }

// Semantic Colors
success: { 50: "#f0fdf4", ..., 950: "#052e16" }
warning: { 50: "#fffbeb", ..., 950: "#451a03" }
error: { 50: "#fef2f2", ..., 950: "#450a0a" }

// LinkedIn-inspired Colors
linkedin: {
  blue: "#0a66c2",
  "blue-dark": "#004182",
  gray: "#666666",
  "gray-light": "#f3f2ef",
  "gray-dark": "#191919",
  white: "#ffffff"
}
```

## Deployment
- **Build Process**: Vite-optimized production builds
- **Environment Configuration**: Environment-specific settings
- **Performance Monitoring**: Real-time performance tracking
- **Error Tracking**: Comprehensive error monitoring and reporting
- **Static Assets**: Optimized asset delivery with caching

## Recent Improvements
- **Modern Authentication System Implementation**: Complete overhaul of authentication system with JWT tokens, refresh token flow, and memory-only access token storage
  - **New AuthService**: Created centralized authentication service (`src/services/AuthService.js`) with proper API endpoints matching backend structure
    - **Login Endpoint**: `POST /ijaa/api/v1/user/signin` with access token in response body
    - **Refresh Endpoint**: `POST /ijaa/api/v1/user/refresh` using HttpOnly cookies for refresh tokens
    - **Logout Endpoint**: `POST /ijaa/api/v1/user/logout` to clear refresh token cookies
    - **Registration Endpoint**: `POST /ijaa/api/v1/user/signup` with firstName, lastName, email, password
  - **Enhanced Axios Interceptors**: Implemented automatic token refresh and request retry mechanism
    - **Request Interceptor**: Automatically attaches access token from memory to all API requests
    - **Response Interceptor**: Handles 401 errors by automatically refreshing tokens and retrying failed requests
    - **Token Refresh Flow**: Seamless token refresh using HttpOnly cookies without user intervention
    - **Request Queuing**: Queues failed requests during token refresh to prevent race conditions
  - **Memory-Only Access Token Storage**: Access tokens stored only in React Context memory, never in localStorage
    - **Security Enhancement**: Eliminates XSS vulnerability risks from localStorage token storage
    - **Automatic Cleanup**: Tokens are automatically cleared on page refresh or logout
    - **Global Access**: Access token available globally via `window.__accessToken` for axios interceptors
  - **Updated API Base URLs**: All API endpoints updated to use new gateway structure
    - **Gateway Base URL**: `http://localhost:8000/ijaa/api/v1/user` (updated from port 8000)
    - **Admin API URL**: `http://localhost:8000/ijaa/api/v1/user/admin` (corrected path structure)
    - **File Service URL**: `http://localhost:8000/ijaa/api/v1/file`
    - **Theme API URL**: `http://localhost:8000/ijaa/api/v1/user/settings`
  - **Enhanced SignUp Form**: Added firstName and lastName fields to match new API requirements
    - **Form Validation**: Comprehensive validation for all required fields
    - **User Experience**: Redirects to sign-in page after successful registration
    - **API Integration**: Uses new AuthService registration endpoint
  - **Improved Error Handling**: Better error messages and user feedback for authentication failures
    - **Token Expiry**: Automatic logout with user-friendly messages when refresh fails
    - **Network Errors**: Graceful handling of network connectivity issues
    - **Validation Errors**: Clear validation messages for form inputs
  - **Backward Compatibility**: Maintained compatibility with existing features and admin authentication
    - **Session Manager**: Updated to work with new authentication flow while maintaining localStorage for user data
    - **Admin Routes**: Admin authentication system remains unchanged and functional
    - **Feature Flags**: All feature flag functionality preserved and working
- **User Theme Preference Integration**: Integrated Theme and Settings APIs for persistent theme across devices with profile-embedded theme settings
  - **Context Refactor**: Updated `src/context/ThemeContext.jsx` to default to LIGHT theme for unauthenticated users, fetch/update theme via `themeApi`, manage `DARK | LIGHT | DEVICE`, apply `dark`/`light` classes, and listen to system changes
  - **API Utility**: Added `src/utils/themeApi.js` with axios client, interceptors, endpoints, and helpers (`THEME_OPTIONS`, `isValidTheme`, conversions)
  - **Theme Settings Card**: Created `src/components/ThemeSettingsCard.jsx` as a standard theme selection card with "Theme" label and dropdown showing "System", "Dark", "Light" options fetched from API, integrated directly into the profile page
  - **Profile Integration**: Added ThemeSettingsCard to `src/pages/Profile.jsx` for seamless theme management within user profile
  - **Removed Settings Page**: Eliminated dedicated `/settings` page and route, removed Settings link from Navbar profile menu for cleaner UX
  - **Default Light Theme**: Site defaults to light theme for all unauthenticated sessions, with user-specific themes applied after login
  - **Toast Theme**: `ToastContainer` theme now reflects current `document.documentElement` class
  - **Tests**: Added/updated tests for ThemeContext (updated initialization expectations), ThemeSettingsCard component, removed UserSettings page tests, with proper mocks for `matchMedia`, `localStorage`, `sessionManager`, and axios
- **Events Page Modernization**: Successfully modernized the Events page with clean, Facebook-style design
  - **Search Page Alignment**: Updated Events page layout to match the Search page design for consistency
  - **Pagination Integration**: Added comprehensive pagination functionality matching the Search page implementation
    - **Pagination Component**: Integrated reusable Pagination component with page size selector
    - **Pagination Info Display**: Shows current page, total pages, and results count like Search page
    - **Page Navigation**: Smooth scrolling to top when changing pages or page size
    - **Page Size Options**: Configurable page sizes (6, 12, 24, 48) with automatic page reset
    - **Loading States**: Proper loading indicators during pagination operations
    - **Null Safety**: Added comprehensive null checks for pagination state to prevent runtime errors
  - **UI/UX Improvements**: Streamlined Events page layout and functionality
    - **Event Overview Removal**: Removed Event Overview section to simplify the interface and focus on core functionality
    - **Create Event Button Positioning**: Moved Create Event button to the same line as the page title for better space utilization and cleaner layout
    - **Duplicate Button Fix**: Removed duplicate "Advanced Filters" button, keeping only the "Advanced" button within the EventFilters component
    - **Improved Layout**: Better responsive design with title and button on the same line using flexbox layout
    - **Cleaner Interface**: Simplified search and filter form without redundant buttons
  - **Event Detail Page Implementation**: Created modern event detail page with dark theme design
    - **Clickable Event Cards**: Removed view buttons and made entire event cards clickable for better UX
    - **Modern Dark Theme**: Implemented dark-themed event detail page matching the provided design reference
    - **Banner Header**: Large gradient banner with event title, date, and time prominently displayed
    - **Event Information Section**: Comprehensive event details with icons, organizer info, and location
    - **Action Buttons**: Attend, Share, and More options buttons with modern styling
    - **Tab Navigation**: Details and Comments tabs with active state indicators
    - **About Section**: Event description with "See more" functionality
    - **Comments System**: Full comments functionality with add, display, and interaction features
    - **RSVP Integration**: Full RSVP functionality with participation status management
    - **Responsive Design**: Mobile-first responsive design with proper breakpoints
    - **Navigation**: Back button to return to events list
    - **Loading States**: Proper loading indicators and error handling
    - **API Error Handling**: Robust error handling with fallback to mock data for development
    - **Mock Data Support**: Development-friendly mock data when API is unavailable
    - **ViewProfile-Style Layout**: Complete redesign to match ViewProfile page structure with clean white/dark cards, grid layout, and professional appearance
      - **Main Container**: Consistent `max-w-4xl mx-auto px-4 py-8` layout matching ViewProfile
      - **Event Card**: Large card with cover photo, event icon, and header information
      - **Full-Width Layout**: Single column layout using full width for better content display
      - **Clean Cards**: White/dark cards with rounded corners, shadows, and borders
      - **Professional Styling**: Consistent with ViewProfile's clean, modern design
      - **Removed Tabs**: Simplified layout without tab navigation for cleaner UX
      - **Integrated Event Information**: All event details (date/time, location, attendance, organizer, status) displayed directly below the event title in the main header area
      - **Improved Layout Alignment**: Event information now displays in a structured grid layout:
        - **Date & Time and Location**: Side by side in first row
        - **Attendance and Organizer**: Side by side in second row  
        - **Status**: Full width on third row
        - **Event Link**: Full width when available
      - **Button Text Update**: Changed "Attend" button to "Join" to match event cards
      - **Removed Profile Photo**: Eliminated event icon/profile photo for cleaner banner-only design
      - **Removed Sidebar**: Eliminated sidebar cards for cleaner, more focused layout
    - **Full Comment System Integration**: Complete comment functionality using real API endpoints
      - **Comment Creation**: Real-time comment posting with API integration
      - **Comment Editing**: In-place comment editing with permission checks
      - **Comment Deletion**: Secure comment deletion with confirmation
      - **Comment Liking**: Like/unlike functionality with real-time updates
      - **Nested Replies**: Support for threaded comments with proper indentation
      - **Permission System**: Users can only edit/delete their own comments
      - **Loading States**: Proper loading indicators for all comment operations
      - **Error Handling**: Comprehensive error handling with user-friendly messages
      - **Real-time Updates**: Immediate UI updates after comment operations
  - **Clean Header Design**: Consistent with project theme using white background and subtle borders
  - **Enhanced Event Cards**: Modern card design with clean backgrounds, improved typography, and social interaction buttons
  - **Modern Tabs**: Redesigned tabs with icons, better spacing, and improved visual hierarchy (removed from main layout)
  - **Advanced Filters**: Modern search and filter interface with active filter display and clear functionality
  - **View Mode Toggle**: Grid and list view options with modern toggle controls
  - **Responsive Design**: Mobile-first responsive design with proper breakpoints
  - **Social Features**: Like, share, and interaction buttons similar to Facebook events
  - **Modern Icons**: Consistent use of Lucide React icons throughout the interface
  - **Improved UX**: Better loading states, error handling, and user feedback
  - **Theme Consistency**: Updated design to match project's clean, professional theme
  - **Bug Fixes**: Fixed function name mismatches and added proper default props to prevent runtime errors
  - **Layout Restructuring**: Removed dedicated header section, integrated filters into Card component, aligned with Search page structure
  - **Test Status**: Modern design tests passing, EventDetail layout changes implemented and tested
  - **Dashboard Enhancement**: Complete redesign with real data integration and engaging user experience
    - **Real Data Integration**: Uses actual user profile, events, participations, and alumni data instead of dummy content
    - **User Profile Data**: Integrates `useCurrentUserProfile` hook for real user information and statistics
    - **Event Data**: Uses `useEventDiscovery` and `useEventParticipation` hooks for real upcoming events and user participations
    - **Alumni Search**: Integrates real alumni search API for suggested connections
    - **Connection Management**: Real connection requests with API integration
    - **Modern Header**: Personalized welcome message with real user name and navigation buttons
    - **Statistics Cards**: Real metrics from user profile and participation data (connections and events attended only)
    - **Quick Actions**: Functional navigation buttons to events, search, and profile pages
    - **Profile Summary**: Real user profile display with avatar, name, profession, and connection count
    - **Upcoming Events**: Real events from API with proper formatting and navigation
    - **Recent Activities**: Real user participations with event details and status
    - **Suggested Connections**: Real alumni from search API with connection functionality
    - **Loading States**: Proper loading indicators for all data fetching operations
    - **Error Handling**: Graceful error handling with fallback content
    - **Responsive Design**: Fully responsive layout that works on all device sizes
    - **Interactive Elements**: Hover effects, transitions, and engaging visual feedback
- **Component Modernization**: Updated EventCard, EventTabs, and EventFilters components
  - **EventCard**: Dual view modes (grid/list), modern styling, social interaction buttons
  - **EventTabs**: Icon-based navigation with modern styling and responsive design
  - **EventFilters**: Advanced search interface with active filter display
- **Testing Infrastructure**: Comprehensive test coverage for modern design features
  - **Modern Design Tests**: Created dedicated test suite for modern design features
  - **Component Tests**: Updated existing tests to work with modern design
  - **Visual Regression**: Tests for gradient headers, modern styling, and responsive design
- **Bug Fixes**: Resolved critical issues in event management
  - **Function Name Fixes**: Corrected function name mismatches in EventDetailsModal
  - **Default Props**: Added proper default values to prevent runtime errors
  - **Error Handling**: Improved error handling for missing functions and props
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
- **Build Tool Migration**: Migrated from Create React App to Vite for faster development
- **Enhanced Testing Infrastructure**: Comprehensive testing setup with Jest, React Testing Library, and Cypress
- **CI/CD Pipeline**: GitHub Actions workflow for automated testing and deployment
- **Code Quality Tools**: ESLint and Prettier integration for consistent code style
- **TypeScript Support**: Added TypeScript configuration and type definitions
- **Advanced Scripts**: Extensive npm script ecosystem for development workflows

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
  1. **Correct Endpoint**: Updated to use the exact admin endpoint from backend: `http://localhost:8000/ijaa/api/v1/user/admin/feature-flags/{name}/enabled`
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

### Phase 4: Event Interaction Implementation (Latest)
**Status: ✅ COMPLETED**

**Implemented Features:**
- **Comment System**: Complete comment functionality with add, edit, delete, and like operations
- **Comment Management**: Users can create, update, and delete their own comments
- **Comment Likes**: Like/unlike functionality for comments with real-time updates
- **Comment Pagination**: Efficient pagination for large comment threads
- **Comment Permissions**: Proper permission checks for comment operations
- **Comment Integration**: Seamless integration with event details modal

**Technical Achievements:**
- **Service Layer Extensions**: Added Phase 4 methods to `eventService.js`:
  - `getEventComments()`: Fetch comments for events with pagination
  - `addEventComment()`: Add new comments to events
  - `updateComment()`: Update existing comments
  - `deleteComment()`: Delete comments with proper permissions
  - `toggleCommentLike()`: Like/unlike comments
- **Custom Hook**: `useEventInteraction` hook for comment and interaction state management
- **UI Components**: New components for interaction features:
  - `CommentForm`: Form component for adding and editing comments
  - `CommentCard`: Individual comment display with actions
  - `CommentsSection`: Main comments section with pagination
- **Enhanced EventComments**: Refactored existing component to use new hook
- **Comment State Management**: Complete state management for comments and interactions

**Testing:**
- **Hook Tests**: Comprehensive unit tests for `useEventInteraction` hook
- **Test Coverage**: 24 test cases covering all interaction scenarios:
  - Load comments (success, error, pagination)
  - Add comments (success, error, validation)
  - Update comments (success, error, validation)
  - Delete comments (success, error)
  - Toggle comment likes (success, error)
  - Pagination methods (next, previous, specific page)
  - Error clearing methods
  - Utility methods (permission checks)
- **API Mocking**: Proper mocking of interaction API endpoints
- **State Management Tests**: Verification of correct state updates and pagination

**UX Enhancements:**
- **Real-time Updates**: Immediate UI updates for comment operations
- **Interactive Comments**: Like/unlike functionality with visual feedback
- **Comment Permissions**: Clear indication of user permissions for comment actions
- **Pagination Controls**: Smooth pagination for large comment threads
- **Loading States**: Proper loading indicators for all comment operations
- **Error Handling**: User-friendly error messages for failed operations

**Performance Optimizations:**
- **Efficient Pagination**: Smart pagination handling for comment threads
- **Optimistic Updates**: Immediate UI feedback for better responsiveness
- **State Management**: Efficient state updates for comment operations
- **Memory Management**: Proper cleanup of comment state

**Integration Features:**
- **EventDetailsModal Integration**: Comments tab integrated into event details modal
- **Cross-Phase Compatibility**: Seamless integration with all previous phases
- **Consistent UX**: Unified user experience across all event features
- **Permission System**: Proper integration with user authentication and roles

**Security & Validation:**
- **Authentication Checks**: Proper authentication for all comment operations
- **Permission Validation**: User can only edit/delete their own comments
- **Admin Permissions**: Admin users can delete any comment
- **Input Validation**: Validation of comment content and operations
- **Error Handling**: Comprehensive error handling for failed operations

**Component Architecture:**
- **Modular Design**: Clean separation of concerns between components
- **Reusable Components**: CommentForm and CommentCard are reusable
- **Hook Abstraction**: useEventInteraction provides clean API for comment operations
- **State Consistency**: Maintained data consistency across all comment operations

### Phase 5: Advanced Features Implementation (Latest)
**Status: ✅ COMPLETED**

**Implemented Features:**
- **Advanced Search**: Comprehensive search with multiple filters (title, description, location, category, date range, organizer, participant count)
- **Event Recommendations**: Personalized event recommendations based on user preferences and behavior
- **Similar Events**: Find similar events based on content, category, and location
- **High Engagement Events**: Discover popular events with high participation rates
- **Location-Based Filtering**: Find events by specific locations
- **Organizer-Based Filtering**: Browse events by specific organizers
- **Advanced Analytics**: Engagement metrics and popularity indicators

**Technical Achievements:**
- **Service Layer Extensions**: Added Phase 5 methods to `eventService.js`:
  - `advancedSearch()`: Advanced search with multiple criteria
  - `getEventRecommendations()`: Personalized event recommendations
  - `getSimilarEvents()`: Find similar events for a given event
  - `getHighEngagementEvents()`: High engagement/popular events
  - `getEventsByLocation()`: Location-based event filtering
  - `getEventsByOrganizer()`: Organizer-based event filtering
- **Custom Hook**: `useEventAdvancedFeatures` hook for advanced features state management
- **Comprehensive State Management**: Separate state for each advanced feature:
  - Advanced search results and pagination
  - Event recommendations
  - Similar events
  - High engagement events
  - Location-based events
  - Organizer-based events
- **Flexible Response Handling**: Support for both paginated and array responses
- **URL Encoding**: Proper URL encoding for location and organizer parameters

**Testing:**
- **Hook Tests**: Comprehensive unit tests for `useEventAdvancedFeatures` hook
- **Test Coverage**: 25 test cases covering all advanced feature scenarios:
  - Advanced search (success, error, pagination)
  - Event recommendations (success, error)
  - Similar events (success, error, validation)
  - High engagement events (success, error, pagination)
  - Location-based events (success, error, validation)
  - Organizer-based events (success, error, validation)
  - Error clearing methods for all features
  - Pagination handling for searchable features
  - Array response handling for recommendations and similar events
- **API Mocking**: Proper mocking of all Phase 5 API endpoints
- **Authentication Tests**: Verification of authentication requirements
- **Validation Tests**: Input validation for required parameters

**UX Enhancements:**
- **Advanced Search Interface**: Comprehensive search form with multiple filters
- **Recommendation Engine**: Personalized event suggestions
- **Discovery Features**: Multiple ways to discover relevant events
- **Location Intelligence**: Location-based event discovery
- **Organizer Profiles**: Organizer-focused event browsing
- **Engagement Metrics**: Visual indicators for event popularity
- **Loading States**: Proper loading indicators for all advanced operations
- **Error Handling**: User-friendly error messages for failed operations

**Performance Optimizations:**
- **Efficient Search**: Optimized search algorithms with multiple criteria
- **Smart Caching**: Intelligent caching of search results and recommendations
- **Pagination**: Efficient handling of large result sets
- **Lazy Loading**: On-demand loading of advanced features
- **Memory Management**: Proper cleanup of advanced feature state

**Integration Features:**
- **Cross-Phase Integration**: Seamless integration with all previous phases
- **Event Discovery**: Enhanced event discovery capabilities
- **User Experience**: Improved user experience with advanced features
- **Data Consistency**: Maintained consistency across all event data
- **Backward Compatibility**: Full compatibility with existing event features

**Security & Validation:**
- **Authentication Checks**: Proper authentication for all advanced features
- **Input Validation**: Validation of search criteria and parameters
- **Parameter Sanitization**: Proper URL encoding and parameter handling
- **Error Handling**: Comprehensive error handling for all operations
- **Rate Limiting**: Built-in support for API rate limiting

**Analytics & Insights:**
- **Engagement Metrics**: Track event popularity and engagement
- **Recommendation Scoring**: Personalized recommendation algorithms
- **Similarity Scoring**: Event similarity calculations
- **Location Analytics**: Location-based event insights
- **Organizer Analytics**: Organizer performance metrics

**Future-Ready Architecture:**
- **Scalable Design**: Architecture ready for future enhancements
- **Modular Components**: Reusable components for advanced features
- **Extensible Hooks**: Hook design allows for easy feature additions
- **API Abstraction**: Clean service layer for easy API updates
- **State Management**: Efficient state management for complex features
