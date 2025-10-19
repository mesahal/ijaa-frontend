# IJAA Frontend Project Context

## Project Overview

IJAA (IIT JU Alumni Association) is a comprehensive web application for managing academic events, publications, and alumni networks. The frontend is built with React and provides a modern, responsive interface for users and administrators.

## Technology Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Build**: Create React App (`react-scripts`) for app dev/build; Vite is used only by Cypress component dev server
- **Styling**: Tailwind CSS (dark mode via `class`), PostCSS, Autoprefixer
- **State Management**: React Context API (`AuthContext`, `FeatureFlagContext`, `ThemeContext`; `UnifiedAuthContext` wrapper for legacy tests)
- **HTTP Client**: Axios with centralized interceptors (`src/utils/api/axiosInstance.js`) and `ApiClient` (`src/services/api/apiClient.js`)
- **Testing**: Jest + React Testing Library via `react-scripts test`, Cypress for E2E (and component tests)
- **Icons**: Lucide React, Font Awesome, and `react-icons`
- **Routing**: React Router v6
- **Code Quality**: ESLint and Prettier
- **Notifications**: React Toastify

## Environment Configuration

### Required Environment Variables

```bash
# Core API base
REACT_APP_API_BASE_URL=http://localhost:8000/ijaa/api/v1

# Admin API base
REACT_APP_API_ADMIN_URL=http://localhost:8000/ijaa/api/v1/admin

# File service API base
REACT_APP_API_FILE_URL=http://localhost:8000/ijaa/api/v1/files

# Event service API base
REACT_APP_API_EVENT_URL=http://localhost:8000/ijaa/api/v1/events

# Theme/settings API base (user settings)
REACT_APP_THEME_API_BASE_URL=http://localhost:8000/ijaa/api/v1/users
```

## Core Features

### 1. Authentication System
- **JWT Authentication**: JWT-based authentication with refresh token flow (HttpOnly cookies)
- **Access Token Storage**: In-memory plus sessionStorage (cleared on logout); refresh token via HttpOnly cookie
- **Roles**: `USER` and `ADMIN` (see `src/utils/constants/roleConstants.js`)
- **Protected Routing**: Role-based access control for user and admin areas
- **Admin Authentication**: Separate admin authentication using `REACT_APP_API_ADMIN_URL`

### 2. Feature Flag System
- **Hierarchical Management**: Feature flags grouped by parent features
- **Modern UI**: Gradient headers with real-time statistics
- **Admin Panel**: Complete feature flag management interface
- **API Integration**: Full backend integration for feature flag control

### 3. Event Management System
- **Event Creation**: Form-based creation with optional banner and media uploads
- **Event Discovery**: Search, trending events, and recommendations
- **Event Participation**: RSVP management and attendance tracking
- **Event Interactions**: Comments, likes, and social features
- **Advanced Features**: Advanced search and templates

## Recent Updates (October 2025)

- **RSVP Behavior Refinement**
  - Update RSVP uses `PUT /events/participation/{eventId}/rsvp?status=...` with the status sent as a query parameter and **no request body**. Implemented in `src/services/api/eventService.js` via `updateRsvp(eventId, status)`.
  - Clicking the same RSVP status again (Going/Interested/Can't go) now cancels participation via `DELETE /events/participation/{eventId}/rsvp`. Implemented in `src/user/components/events/RSVPButtons.jsx` and propagated to quick Interested in `EventCard.jsx`.
  - Hook `src/user/hooks/events/useEventParticipation.js` calls `eventService.updateRsvp()` for PUT and `eventService.cancelRsvp()` for DELETE, and refreshes participations.

- **Events Page UX**
  - Added header tabs: **All Events** and **My Events**, placed on the left of the header row, with the **Create Event** button on the right. Implemented in `src/user/pages/Events.jsx`.
  - The **My Events** tab uses the same pagination experience as All Events: 6 per page with page controls. Implemented in `src/user/hooks/events/useEvents.js` (local pagination when API returns arrays) and rendered by the unified pagination component in `Events.jsx`.
  - Event cards have a bottom-anchored action row (Interested + Share) for consistent alignment. Implemented with `flex-1` content container and `mt-auto` action row in `src/user/components/events/EventCard.jsx`.

- **Interested Button Consistency**
  - Quick Interested on cards uses the shared `Button` component. It shows selected style (blue fill, white text) when status is `MAYBE`, and toggles DELETE on repeat click. Implemented in `src/user/components/events/EventCard.jsx`.

### 4. User Management
- **Profile Management**: Comprehensive profile with editable fields and settings
- **Photo Management**: Profile and cover photo upload (drag-and-drop) via `photoApi`
- **Theme Integration**: User theme preference stored via `themeApi`
- **Social Features**: Event-centric posts, comments, likes

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
- **AuthContext**: Centralized authentication state with token refresh integration
- **UnifiedAuthContext**: Compatibility wrapper for legacy tests
- **FeatureFlagContext**: Feature flag state management
- **ThemeContext**: Dark/light mode theme management

### Custom Hooks
- **General**: `useAuth`, `useFeatureFlag`, `usePermissions`
- **Event Hooks**: `useEvents`, `useEventActions`, `useEventDiscovery`, `useEventParticipation`, `useEventInteraction`, `useEventAdvancedFeatures`, `useEventInvitations`, `useEventSearch`, `useEventTemplates`, `useEventBanner`, `useEventSocialFeatures`

### API Utilities
- **axiosInstance** (`src/utils/api/axiosInstance.js`): Axios with interceptors and single-refresh handling
- **ApiClient** (`src/services/api/apiClient.js`): Centralized API client wrapper
- **AuthService** (`src/services/auth/AuthService.js`): Login/refresh/logout helpers
- **adminApi** (`src/services/api/adminApi.js`): Admin endpoints
- **eventApi** and `eventService` (`src/services/api/`): Event operations
- **userApi** (`src/services/api/userApi.js`)
- **postService** (`src/services/api/postService.js`)
- **photoApi** (`src/services/api/photoApi.js`)
- **themeApi** (`src/services/api/themeApi.js`)
- **locationApi** (`src/services/api/locationApi.js`)

## Testing Strategy

### Testing Infrastructure
- **Jest + RTL**: Primary unit/integration testing via `react-scripts test`
- **Cypress**: E2E tests (`cypress.config.js`); component tests use Vite dev server
- **Coverage**: Thresholds configured (80% via `package.json` Jest field; 70% in `jest.config.js` for direct Jest)
- **Test Categories**: Unit, integration, components, context, utils, pages, and E2E flows

### Key Testing Features
- **Component Tests**: Individual component testing with proper mocking
- **Hook Tests**: Custom hook testing with state management
- **Integration Tests**: Cross-module integration tests
- **E2E Tests**: User flows, authentication, and admin workflows

## Current Project Status

### Architecture
- **Modular Design**: Clean separation between admin, user, and shared components
- **Advanced State Management**: React Context API with specialized hooks
- **Testing**: Extensive test suite under `src/__tests__/` and Cypress E2E
- **Feature Flag System**: Granular control over application functionality
- **Modern UI/UX**: Facebook-style design with responsive layouts
- **Security-First**: JWT authentication with memory + sessionStorage token storage

## CI/CD & Automation

- **GitHub Actions**: Workflow at `.github/workflows/test.yml` for continuous testing/linting
- **NPM Scripts**: Rich test matrix in `package.json` for unit/integration/E2E runs and reports

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
- **Token Storage Strategy**: Access tokens in memory and sessionStorage; refresh tokens in HttpOnly cookies
- **Automatic Token Refresh**: Seamless experience via interceptor + single-refresh promise pattern
- **Single Refresh Handling**: Centralized via `TokenManager` to avoid concurrent refreshes
- **API Integration**: Automatic token attachment and refresh handling

### Security Measures
- **XSS Prevention**: Memory-only token storage eliminates localStorage vulnerabilities
- **CSRF Protection**: HttpOnly cookies for refresh tokens
- **Role-based Access**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation for all user inputs

## Deployment

- **Build Process**: `react-scripts build` outputs to `build/`
- **Hosting**: Static hosting or any provider capable of serving CRA builds (no provider-specific config committed)
- **Environment Configuration**: See required variables above; `.env` is gitignored
- **Notes**: Vite is present only for Cypress component testing dev server; the application build uses CRA