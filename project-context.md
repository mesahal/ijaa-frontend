# IJAA Frontend Project Context

## Project Overview

IJAA (IIT JU Alumni Association) is a comprehensive web application for managing academic events, publications, and alumni networks. The frontend is built with React and provides a modern, responsive interface for users, authors, reviewers, and administrators.

## Technology Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Context API (UnifiedAuthContext, FeatureFlagContext, ThemeContext)
- **HTTP Client**: Axios for API communication
- **Testing**: Jest with React Testing Library and Cypress for E2E testing
- **Icons**: Lucide React for consistent iconography
- **Routing**: React Router v6 for navigation
- **Code Quality**: ESLint and Prettier for formatting
- **Notifications**: React Toastify for user feedback

## Environment Configuration

### Required Environment Variables

```bash
# API Gateway Base URL (Updated to match backend)
REACT_APP_API_BASE_URL=http://localhost:8000/ijaa/api/v1

# Admin API Base URL (Updated to match backend)
REACT_APP_API_ADMIN_URL=http://localhost:8000/ijaa/api/v1/admin

# File Service API Base URL (Updated to match backend)
REACT_APP_API_FILE_URL=http://localhost:8000/ijaa/api/v1/files/users

# Event Service API Base URL (Updated to match backend)
REACT_APP_API_EVENT_URL=http://localhost:8000/ijaa/api/v1/events

# Theme/Settings API Base URL (Updated to match backend)
REACT_APP_THEME_API_BASE_URL=http://localhost:8000/ijaa/api/v1/users

# Application Configuration
REACT_APP_APP_NAME=IJAA Frontend
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

## Core Features

### 1. Authentication System
- **JWT Authentication**: Complete JWT-based authentication with refresh token flow
- **Memory-Only Access Tokens**: Enhanced security with memory-only token storage
- **Multi-role Support**: Users, Authors, Reviewers, Admins, Super Admins
- **Protected Routes**: Role-based access control
- **Admin Authentication**: Separate admin authentication system

### 2. Feature Flag System
- **Hierarchical Management**: Feature flags grouped by parent features
- **Modern UI**: Gradient headers with real-time statistics
- **Admin Panel**: Complete feature flag management interface
- **API Integration**: Full backend integration for feature flag control

### 3. Event Management System
- **Event Creation**: Rich text editor with media upload support
- **Event Discovery**: Search, trending events, and recommendations
- **Event Participation**: RSVP management and attendance tracking
- **Event Interactions**: Comments, likes, and social features
- **Advanced Features**: Advanced search, templates, and analytics

### 4. User Management
- **Profile Management**: Comprehensive user profiles with social features
- **Photo Management**: Profile and cover photo upload with drag-and-drop
- **Theme Integration**: User theme preferences with cross-device sync
- **Alumni Network**: Professional networking and mentorship features

### 5. Admin Panel
- **Dashboard**: Real-time analytics and system overview
- **User Management**: Complete user administration
- **Feature Flag Management**: Hierarchical feature flag control
- **System Settings**: Configuration and maintenance tools

## File Structure

```
src/
├── admin/              # Admin panel components and pages
├── components/         # Reusable UI components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── routes/             # Main application routes
├── services/           # Service layer for API calls
├── user/               # User-specific components and pages
├── utils/              # Utility functions and API clients
└── __tests__/          # Test files
```

## Key Components

### Context Providers
- **UnifiedAuthContext**: Centralized authentication state
- **FeatureFlagContext**: Feature flag state management
- **ThemeContext**: Dark/light mode theme management

### Custom Hooks
- **useFeatureFlag**: Single feature flag checking
- **useMultiFeatureFlag**: Multiple feature flag checking
- **useUnifiedAuth**: Authentication state access
- **Event Management Hooks**: 10+ specialized hooks for event management
  - **useEvents**: Core event management with pagination
  - **useEventActions**: Event CRUD operations
  - **useEventDiscovery**: Event search and discovery
  - **useEventParticipation**: RSVP management
  - **useEventInteraction**: Comments and social features
  - **useEventAdvancedFeatures**: Advanced search and analytics

### API Utilities
- **AuthService**: Centralized authentication service
- **axiosInstance**: Enhanced axios with automatic token refresh
- **adminApi**: Admin-specific API endpoints
- **eventService**: Event management service layer
- **photoApi**: Photo upload/management APIs

## Testing Strategy

### Testing Infrastructure
- **Jest**: Primary testing framework with React Testing Library
- **Cypress**: End-to-end testing framework
- **Coverage**: 70%+ test coverage requirement
- **Test Categories**: Unit, integration, component, context, utility, page, and E2E tests

### Key Testing Features
- **Component Tests**: Individual component testing with proper mocking
- **Hook Tests**: Custom hook testing with state management
- **Integration Tests**: Complete application integration testing
- **E2E Tests**: User flows, authentication, and admin workflows
- **Performance Tests**: Performance and optimization testing
- **Security Tests**: Security and vulnerability testing

## Current Project Status

### Architecture
- **Modular Design**: Clean separation between admin, user, and shared components
- **Advanced State Management**: React Context API with specialized hooks
- **Comprehensive Testing**: Multi-layered testing strategy with 100+ test files
- **Feature Flag System**: Granular control over application functionality
- **Modern UI/UX**: Facebook-style design with responsive layouts
- **Security-First**: JWT authentication with memory-only token storage

### Key Metrics
- **Total Components**: 50+ reusable UI components
- **Custom Hooks**: 20+ specialized hooks
- **Test Coverage**: 70%+ with comprehensive test suites
- **API Integration**: 10+ service layers with full backend integration
- **Feature Flags**: 30+ feature flags for granular control

## Recent Achievements

### Phase 6: Advanced Event Management System
- **Comprehensive Event Hooks**: 10+ specialized hooks for event management
- **Service Layer Extensions**: Enhanced eventService.js with full API integration
- **Testing Infrastructure**: Comprehensive test coverage for all event hooks
- **UX Enhancements**: Modern event interface with real-time updates

### Phase 7: Enhanced User Management System
- **Advanced Profile Management**: Comprehensive user profile system
- **Dashboard Enhancement**: Real data integration with engaging UX
- **Photo Management**: Profile and cover photo upload with drag-and-drop
- **Theme Integration**: Cross-device theme synchronization

### Phase 8: Advanced Admin Management System
- **Admin Dashboard**: Comprehensive admin panel with real-time analytics
- **Feature Flag System**: Modern hierarchical feature flag management
- **User Management**: Complete user administration with role management
- **System Settings**: Configuration and maintenance tools

### Phase 9: Comprehensive Testing Infrastructure
- **Advanced Testing Scripts**: Extensive npm script ecosystem
- **Test Categories**: Specialized testing for different aspects
- **CI/CD Integration**: GitHub Actions workflow for automated testing
- **Performance Testing**: Performance and optimization testing

### Phase 10: Modern Authentication System
- **JWT Authentication**: Complete JWT-based authentication system
- **Memory-Only Access Tokens**: Enhanced security with memory-only storage
- **Automatic Token Refresh**: Seamless token refresh using HttpOnly cookies
- **Multi-role Support**: Users, Authors, Reviewers, Admins, Super Admins

## Development Guidelines

- **Component Design**: Functional components with hooks
- **State Management**: Context API for global state, local state for component-specific data
- **Styling**: Tailwind CSS with consistent design system
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Performance**: Optimized rendering and lazy loading
- **Accessibility**: WCAG compliance and keyboard navigation
- **Code Quality**: ESLint and Prettier for consistent code style

## Security Features

### Authentication Architecture
- **Token Storage Strategy**: Access tokens in memory only, refresh tokens in HttpOnly cookies
- **Automatic Token Refresh**: Seamless experience without user intervention
- **Request Queuing**: Failed requests queued during token refresh
- **API Integration**: Automatic token attachment and refresh handling

### Security Measures
- **XSS Prevention**: Memory-only token storage eliminates localStorage vulnerabilities
- **CSRF Protection**: HttpOnly cookies for refresh tokens
- **Role-based Access**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation for all user inputs

## Deployment

- **Build Process**: Vite-optimized production builds
- **Environment Configuration**: Environment-specific settings
- **Performance Monitoring**: Real-time performance tracking
- **Error Tracking**: Comprehensive error monitoring and reporting