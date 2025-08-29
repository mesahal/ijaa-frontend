# Feature Flag Backend Implementation Plan

## Current Backend Feature Flag Structure

This document outlines how the current IJAA backend APIs are organized using feature flags in a hierarchical structure from parent to child features.

## Feature Flag Hierarchy Overview

```
📁 Core Features
├── 🔐 Authentication & User Management
│   ├── user.registration
│   ├── user.login
│   ├── user.password-change
│   ├── user.profile
│   ├── user.experiences
│   └── user.interests
├── 📁 Events System
│   ├── events (Parent)
│   │   ├── events.creation
│   │   ├── events.update
│   │   ├── events.delete
│   │   ├── events.participation
│   │   ├── events.invitations
│   │   ├── events.comments
│   │   ├── events.media
│   │   ├── events.templates
│   │   ├── events.recurring
│   │   └── events.reminders
│   └── search (Parent)
│       └── search.advanced-filters
├── 📁 File Management
│   ├── file-upload (Parent)
│   │   ├── file-upload.profile-photo
│   │   └── file-upload.cover-photo
│   ├── file-download
│   └── file-delete
├── 🔍 Search Features
│   └── alumni.search
└── 👥 Admin Features
    ├── admin.features (Parent)
    │   ├── admin.auth
    │   ├── admin.user-management
    │   ├── admin.announcements
    │   └── admin.reports
    └── admin.features (Self-referencing for feature flag management)
```

## Detailed API Grouping by Feature Flags

### 1. Authentication & User Management

#### Parent Feature: `user.registration`
**APIs Protected:**
- `POST /api/v1/user/signup` - User registration endpoint

**Frontend Decision:**
```typescript
<FeatureFlag feature="user.registration">
  <UserRegistrationForm />
</FeatureFlag>
```

#### Parent Feature: `user.login`
**APIs Protected:**
- `POST /api/v1/user/signin` - User authentication endpoint

**Frontend Decision:**
```typescript
<FeatureFlag feature="user.login">
  <UserLoginForm />
</FeatureFlag>
```

#### Parent Feature: `user.password-change`
**APIs Protected:**
- `POST /api/v1/user/change-password` - Password change endpoint

**Frontend Decision:**
```typescript
<FeatureFlag feature="user.password-change">
  <PasswordChangeForm />
</FeatureFlag>
```

#### Parent Feature: `user.profile`
**APIs Protected:**
- `GET /api/v1/user/profile/{userId}` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

**Frontend Decision:**
```typescript
<FeatureFlag feature="user.profile">
  <UserProfileComponent />
</FeatureFlag>
```

#### Parent Feature: `user.experiences`
**APIs Protected:**
- `POST /api/v1/user/experiences` - Add work experience
- `PUT /api/v1/user/experiences/{id}` - Update work experience
- `DELETE /api/v1/user/experiences/{id}` - Delete work experience

**Frontend Decision:**
```typescript
<FeatureFlag feature="user.experiences">
  <WorkExperienceSection />
</FeatureFlag>
```

#### Parent Feature: `user.interests`
**APIs Protected:**
- `POST /api/v1/user/interests` - Add user interests
- `PUT /api/v1/user/interests/{id}` - Update user interests
- `DELETE /api/v1/user/interests/{id}` - Delete user interests

**Frontend Decision:**
```typescript
<FeatureFlag feature="user.interests">
  <UserInterestsSection />
</FeatureFlag>
```

### 2. Events System

#### Parent Feature: `events`
**APIs Protected:**
- `GET /api/v1/events/` - List all events
- `GET /api/v1/events/{id}` - Get event details

**Frontend Decision:**
```typescript
<FeatureFlag feature="events">
  <EventsList />
  <EventDetails />
</FeatureFlag>
```

#### Child Feature: `events.creation`
**APIs Protected:**
- `POST /api/v1/events/` - Create new event

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.creation']} requireAll={true}>
  <CreateEventForm />
</MultiFeatureFlag>
```

#### Child Feature: `events.update`
**APIs Protected:**
- `PUT /api/v1/events/{id}` - Update event

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.update']} requireAll={true}>
  <EditEventForm />
</MultiFeatureFlag>
```

#### Child Feature: `events.delete`
**APIs Protected:**
- `DELETE /api/v1/events/{id}` - Delete event

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.delete']} requireAll={true}>
  <DeleteEventButton />
</MultiFeatureFlag>
```

#### Child Feature: `events.participation`
**APIs Protected:**
- `POST /api/v1/events/{id}/participate` - Join event
- `DELETE /api/v1/events/{id}/participate` - Leave event

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.participation']} requireAll={true}>
  <EventParticipationButtons />
</MultiFeatureFlag>
```

#### Child Feature: `events.invitations`
**APIs Protected:**
- `POST /api/v1/events/invitations` - Send event invitation
- `GET /api/v1/events/invitations` - Get event invitations

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.invitations']} requireAll={true}>
  <EventInvitationSystem />
</MultiFeatureFlag>
```

#### Child Feature: `events.comments`
**APIs Protected:**
- `GET /api/v1/events/{id}/comments` - Get event comments
- `POST /api/v1/events/{id}/comments` - Add event comment

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.comments']} requireAll={true}>
  <EventCommentsSection />
</MultiFeatureFlag>
```

#### Child Feature: `events.media`
**APIs Protected:**
- `POST /api/v1/events/{id}/media` - Upload event media
- `GET /api/v1/events/{id}/media` - Get event media

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.media']} requireAll={true}>
  <EventMediaGallery />
</MultiFeatureFlag>
```

#### Child Feature: `events.templates`
**APIs Protected:**
- `GET /api/v1/events/templates` - Get event templates
- `POST /api/v1/events/templates` - Create event template

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.templates']} requireAll={true}>
  <EventTemplates />
</MultiFeatureFlag>
```

#### Child Feature: `events.recurring`
**APIs Protected:**
- `POST /api/v1/events/recurring` - Create recurring event
- `GET /api/v1/events/recurring` - Get recurring events

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.recurring']} requireAll={true}>
  <RecurringEventForm />
</MultiFeatureFlag>
```

#### Child Feature: `events.reminders`
**APIs Protected:**
- `POST /api/v1/events/reminders` - Set event reminder
- `GET /api/v1/events/reminders` - Get event reminders

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['events', 'events.reminders']} requireAll={true}>
  <EventReminderSettings />
</MultiFeatureFlag>
```

### 3. Search Features (Nested under Events)

#### Parent Feature: `search`
**APIs Protected:**
- `GET /api/v1/events/search` - Basic event search
- `GET /api/v1/events/search/advanced` - Advanced event search

**Frontend Decision:**
```typescript
<FeatureFlag feature="search">
  <EventSearch />
</FeatureFlag>
```

#### Child Feature: `search.advanced-filters`
**APIs Protected:**
- `GET /api/v1/events/search/advanced` - Advanced event search with filters

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['search', 'search.advanced-filters']} requireAll={true}>
  <AdvancedSearchFilters />
</MultiFeatureFlag>
```

### 4. File Management

#### Parent Feature: `file-upload`
**APIs Protected:**
- All file upload operations (parent feature)

**Frontend Decision:**
```typescript
<FeatureFlag feature="file-upload">
  <FileUploadSection />
</FeatureFlag>
```

#### Child Feature: `file-upload.profile-photo`
**APIs Protected:**
- `POST /api/v1/users/{userId}/profile-photo` - Upload profile photo

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['file-upload', 'file-upload.profile-photo']} requireAll={true}>
  <ProfilePhotoUpload />
</MultiFeatureFlag>
```

#### Child Feature: `file-upload.cover-photo`
**APIs Protected:**
- `POST /api/v1/users/{userId}/cover-photo` - Upload cover photo

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['file-upload', 'file-upload.cover-photo']} requireAll={true}>
  <CoverPhotoUpload />
</MultiFeatureFlag>
```

#### Feature: `file-download`
**APIs Protected:**
- `GET /api/v1/users/{userId}/profile-photo` - Get profile photo URL
- `GET /api/v1/users/{userId}/cover-photo` - Get cover photo URL

**Frontend Decision:**
```typescript
<FeatureFlag feature="file-download">
  <PhotoDisplay />
</FeatureFlag>
```

#### Feature: `file-delete`
**APIs Protected:**
- `DELETE /api/v1/users/{userId}/profile-photo` - Delete profile photo
- `DELETE /api/v1/users/{userId}/cover-photo` - Delete cover photo

**Frontend Decision:**
```typescript
<FeatureFlag feature="file-delete">
  <PhotoDeleteButton />
</FeatureFlag>
```

### 5. Alumni Search Features

#### Feature: `alumni.search`
**APIs Protected:**
- `POST /api/v1/user/alumni/search` - Search alumni

**Frontend Decision:**
```typescript
<FeatureFlag feature="alumni.search">
  <AlumniSearch />
</FeatureFlag>
```

### 6. Admin Features

#### Parent Feature: `admin.features`
**APIs Protected:**
- All admin feature flag management endpoints
- All admin management endpoints

**Frontend Decision:**
```typescript
<FeatureFlag feature="admin.features">
  <AdminPanel />
</FeatureFlag>
```

#### Child Feature: `admin.auth`
**APIs Protected:**
- `POST /api/v1/admin/auth/login` - Admin login
- `POST /api/v1/admin/auth/logout` - Admin logout
- `POST /api/v1/admin/auth/refresh` - Refresh admin token

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['admin.features', 'admin.auth']} requireAll={true}>
  <AdminAuth />
</MultiFeatureFlag>
```

#### Child Feature: `admin.user-management`
**APIs Protected:**
- `GET /api/v1/admin/users` - Get all users
- `PUT /api/v1/admin/users/{id}/status` - Update user status
- `DELETE /api/v1/admin/users/{id}` - Delete user
- `GET /api/v1/admin/users/{id}/details` - Get user details

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['admin.features', 'admin.user-management']} requireAll={true}>
  <UserManagementPanel />
</MultiFeatureFlag>
```

#### Child Feature: `admin.announcements`
**APIs Protected:**
- `POST /api/v1/admin/announcements` - Create announcement
- `PUT /api/v1/admin/announcements/{id}` - Update announcement
- `DELETE /api/v1/admin/announcements/{id}` - Delete announcement

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['admin.features', 'admin.announcements']} requireAll={true}>
  <AnnouncementManagement />
</MultiFeatureFlag>
```

#### Child Feature: `admin.reports`
**APIs Protected:**
- `GET /api/v1/admin/reports` - Get all reports
- `PUT /api/v1/admin/reports/{id}/status` - Update report status
- `DELETE /api/v1/admin/reports/{id}` - Delete report

**Frontend Decision:**
```typescript
<MultiFeatureFlag features={['admin.features', 'admin.reports']} requireAll={true}>
  <ReportManagement />
</MultiFeatureFlag>
```

### 7. Feature Flag Management (Self-Referencing)

#### Feature: `admin.features` (Self-Referencing)
**APIs Protected:**
- `GET /api/v1/admin/feature-flags` - Get all feature flags
- `GET /api/v1/admin/feature-flags/{name}` - Get feature flag by name
- `POST /api/v1/admin/feature-flags` - Create feature flag
- `PUT /api/v1/admin/feature-flags/{name}` - Update feature flag
- `DELETE /api/v1/admin/feature-flags/{name}` - Delete feature flag
- `GET /api/v1/admin/feature-flags/enabled` - Get enabled feature flags
- `GET /api/v1/admin/feature-flags/disabled` - Get disabled feature flags
- `POST /api/v1/admin/feature-flags/refresh-cache` - Refresh feature flag cache

**Frontend Decision:**
```typescript
<FeatureFlag feature="admin.features">
  <FeatureFlagManagement />
</FeatureFlag>
```

## Nested Relationships and Complex Dependencies

### 1. Multi-Level Hierarchies

#### Events System with Nested Search
```
events (Parent)
├── events.creation (Child)
├── events.update (Child)
├── events.delete (Child)
├── events.participation (Child)
├── events.invitations (Child)
├── events.comments (Child)
├── events.media (Child)
├── events.templates (Child)
├── events.recurring (Child)
├── events.reminders (Child)
└── search (Sibling Parent)
    └── search.advanced-filters (Child)
```

**Complex Frontend Decision:**
```typescript
// Advanced event search requires both events and search.advanced-filters
<MultiFeatureFlag 
  features={['events', 'search', 'search.advanced-filters']} 
  requireAll={true}
>
  <AdvancedEventSearch />
</MultiFeatureFlag>
```

#### File Management with Nested Upload Types
```
file-upload (Parent)
├── file-upload.profile-photo (Child)
└── file-upload.cover-photo (Child)
```

**Complex Frontend Decision:**
```typescript
// Profile photo upload requires both parent and child features
<MultiFeatureFlag 
  features={['file-upload', 'file-upload.profile-photo']} 
  requireAll={true}
>
  <ProfilePhotoUpload />
</MultiFeatureFlag>
```

### 2. Self-Referencing Features

#### Admin Features with Self-Reference
```
admin.features (Parent + Self-Reference)
├── admin.auth (Child)
├── admin.user-management (Child)
├── admin.announcements (Child)
├── admin.reports (Child)
└── admin.features (Self-Reference for feature flag management)
```

**Self-Referencing Frontend Decision:**
```typescript
// Feature flag management requires admin.features (self-referencing)
<FeatureFlag feature="admin.features">
  <FeatureFlagManagement />
</FeatureFlag>
```

### 3. Cross-Service Dependencies

#### File Service Dependencies
The file service connects to user service for feature flag validation:

**File Service APIs with Cross-Service Feature Flags:**
- `POST /api/v1/users/{userId}/profile-photo` → Requires `file-upload.profile-photo`
- `POST /api/v1/users/{userId}/cover-photo` → Requires `file-upload.cover-photo`
- `GET /api/v1/users/{userId}/profile-photo` → Requires `file-download`
- `DELETE /api/v1/users/{userId}/profile-photo` → Requires `file-delete`

**Frontend Decision with Cross-Service Awareness:**
```typescript
// File operations require both file service and user service features
<MultiFeatureFlag 
  features={['file-upload', 'file-upload.profile-photo', 'user.profile']} 
  requireAll={true}
>
  <ProfilePhotoManagement />
</MultiFeatureFlag>
```

## Frontend Implementation Strategy

### 1. Progressive Enhancement Approach

```typescript
// Example: User Profile with Progressive Enhancement
const UserProfile: React.FC = () => {
  return (
    <div className="user-profile">
      {/* Always available - basic profile */}
      <BasicUserInfo />
      
      {/* Enhanced with experiences if available */}
      <FeatureFlag feature="user.experiences">
        <WorkExperienceSection />
      </FeatureFlag>
      
      {/* Enhanced with interests if available */}
      <FeatureFlag feature="user.interests">
        <UserInterestsSection />
      </FeatureFlag>
      
      {/* Enhanced with profile photo if available */}
      <MultiFeatureFlag features={['file-upload', 'file-upload.profile-photo']}>
        <ProfilePhotoSection />
      </MultiFeatureFlag>
      
      {/* Advanced analytics only if all features are available */}
      <MultiFeatureFlag 
        features={['user.experiences', 'user.interests', 'user.profile']} 
        requireAll={true}
      >
        <ProfileAnalytics />
      </MultiFeatureFlag>
    </div>
  );
};
```

### 2. Navigation Menu with Feature Flags

```typescript
const NavigationMenu: React.FC = () => {
  return (
    <nav>
      {/* Always available */}
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/profile">Profile</Link>
      
      {/* Conditional navigation items */}
      <FeatureFlag feature="events">
        <Link to="/events">Events</Link>
      </FeatureFlag>
      
      <FeatureFlag feature="alumni.search">
        <Link to="/alumni">Alumni Directory</Link>
      </FeatureFlag>
      
      <FeatureFlag feature="admin.features">
        <Link to="/admin">Admin Panel</Link>
      </FeatureFlag>
    </nav>
  );
};
```

### 3. Form Fields with Feature Flags

```typescript
const UserRegistrationForm: React.FC = () => {
  return (
    <form>
      {/* Required fields - always shown */}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="firstName" type="text" required />
      <input name="lastName" type="text" required />
      
      {/* Optional fields based on features */}
      <FeatureFlag feature="user.experiences">
        <WorkExperienceFields />
      </FeatureFlag>
      
      <FeatureFlag feature="user.interests">
        <InterestsFields />
      </FeatureFlag>
      
      <MultiFeatureFlag features={['file-upload', 'file-upload.profile-photo']}>
        <ProfilePhotoUpload />
      </MultiFeatureFlag>
    </form>
  );
};
```

## Benefits of This Structure

### 1. **Hierarchical Control**
- Parent features control child features
- Disabling `events` automatically disables all event-related features
- Granular control over specific functionality

### 2. **Progressive Enhancement**
- Basic functionality always works
- Advanced features enhance the experience when available
- Graceful degradation when features are disabled

### 3. **Security**
- Backend validates all feature flag requirements
- Frontend provides better UX by not showing disabled features
- Double protection: Frontend UI + Backend API validation

### 4. **Maintainability**
- Clear separation of concerns
- Easy to add new features
- Centralized feature flag management

### 5. **User Experience**
- No broken functionality visible to users
- Clear indication of available features
- Smooth transitions between enabled/disabled states

## Complete API Inventory with Feature Flag Requirements

### User Service APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/signup` | POST | `user.registration` | Parent |
| `/api/v1/user/signin` | POST | `user.login` | Parent |
| `/api/v1/user/change-password` | POST | `user.password-change` | Parent |
| `/api/v1/user/profile/{userId}` | GET | `user.profile` | Parent |
| `/api/v1/user/profile` | PUT | `user.profile` | Parent |
| `/api/v1/user/experiences` | POST | `user.experiences` | Parent |
| `/api/v1/user/experiences/{id}` | PUT | `user.experiences` | Parent |
| `/api/v1/user/experiences/{id}` | DELETE | `user.experiences` | Parent |
| `/api/v1/user/interests` | POST | `user.interests` | Parent |
| `/api/v1/user/interests/{id}` | PUT | `user.interests` | Parent |
| `/api/v1/user/interests/{id}` | DELETE | `user.interests` | Parent |
| `/api/v1/user/alumni/search` | POST | `alumni.search` | Parent |

### Event Service APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/my-events` | GET | `events` | Parent |
| `/api/v1/user/events/my-events/active` | GET | `events` | Parent |
| `/api/v1/user/events/all-events` | GET | `events` | Parent |
| `/api/v1/user/events/all-events/{eventId}` | GET | `events` | Parent |
| `/api/v1/user/events/my-events/{eventId}` | GET | `events` | Parent |
| `/api/v1/user/events/create` | POST | `events.creation` | Child of `events` |
| `/api/v1/user/events/{eventId}/update` | PUT | `events.update` | Child of `events` |
| `/api/v1/user/events/{eventId}/delete` | DELETE | `events.delete` | Child of `events` |
| `/api/v1/user/events/search` | POST | `search` | Parent |
| `/api/v1/user/events/search` | GET | `search` | Parent |

### Event Participation APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/participation/rsvp` | POST | `events.participation` | Child of `events` |

### Event Invitation APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/invitations/send` | POST | `events.invitations` | Child of `events` |
| `/api/v1/user/events/invitations/{eventId}/accept` | POST | None | No Feature Flag |
| `/api/v1/user/events/invitations/{eventId}/decline` | POST | None | No Feature Flag |
| `/api/v1/user/events/invitations/{eventId}/mark-read` | POST | None | No Feature Flag |
| `/api/v1/user/events/invitations/my-invitations` | GET | None | No Feature Flag |
| `/api/v1/user/events/invitations/my-invitations/unread` | GET | None | No Feature Flag |
| `/api/v1/user/events/invitations/my-invitations/unresponded` | GET | None | No Feature Flag |
| `/api/v1/user/events/invitations/{eventId}/invitations` | GET | None | No Feature Flag |
| `/api/v1/user/events/invitations/sent-by-me` | GET | None | No Feature Flag |
| `/api/v1/user/events/invitations/counts` | GET | None | No Feature Flag |

### Event Comment APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/comments` | POST | `events.comments` | Child of `events` |

### Event Media APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/media` | POST | `events.media` | Child of `events` |

### Event Template APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/templates` | GET | `events.templates` | Child of `events` |
| `/api/v1/user/events/templates/public` | GET | None | No Feature Flag |
| `/api/v1/user/events/templates/user` | GET | None | No Feature Flag |
| `/api/v1/user/events/templates/available` | GET | None | No Feature Flag |
| `/api/v1/user/events/templates/{templateId}` | GET | None | No Feature Flag |
| `/api/v1/user/events/templates` | POST | None | No Feature Flag |
| `/api/v1/user/events/templates/{templateId}` | PUT | None | No Feature Flag |
| `/api/v1/user/events/templates/{templateId}` | DELETE | None | No Feature Flag |
| `/api/v1/user/events/templates/{templateId}/make-public` | POST | None | No Feature Flag |
| `/api/v1/user/events/templates/{templateId}/export` | GET | None | No Feature Flag |
| `/api/v1/user/events/templates/import` | POST | None | No Feature Flag |

### Event Reminder APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/reminders` | POST | `events.reminders` | Child of `events` |

### Recurring Event APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/recurring` | GET | `events.recurring` | Child of `events` |
| `/api/v1/user/events/recurring/{eventId}` | GET | None | No Feature Flag |

### Event Analytics APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/user/events/analytics/{eventId}` | GET | None | No Feature Flag |

### File Service APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/users/{userId}/profile-photo` | POST | `file-upload.profile-photo` | Child of `file-upload` |
| `/api/v1/users/{userId}/cover-photo` | POST | `file-upload.cover-photo` | Child of `file-upload` |
| `/api/v1/users/{userId}/profile-photo` | GET | `file-download` | Parent |
| `/api/v1/users/{userId}/cover-photo` | GET | `file-download` | Parent |
| `/api/v1/users/{userId}/profile-photo` | DELETE | `file-delete` | Parent |
| `/api/v1/users/{userId}/cover-photo` | DELETE | `file-delete` | Parent |

### Admin Service APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/admin/auth/login` | POST | `admin.auth` | Child of `admin.features` |
| `/api/v1/admin/auth/logout` | POST | `admin.auth` | Child of `admin.features` |
| `/api/v1/admin/auth/refresh` | POST | `admin.auth` | Child of `admin.features` |
| `/api/v1/admin/users` | GET | `admin.user-management` | Child of `admin.features` |
| `/api/v1/admin/users/{id}/status` | PUT | `admin.user-management` | Child of `admin.features` |
| `/api/v1/admin/users/{id}` | DELETE | `admin.user-management` | Child of `admin.features` |
| `/api/v1/admin/users/{id}/details` | GET | `admin.user-management` | Child of `admin.features` |
| `/api/v1/admin/announcements` | POST | `admin.announcements` | Child of `admin.features` |
| `/api/v1/admin/announcements/{id}` | PUT | `admin.announcements` | Child of `admin.features` |
| `/api/v1/admin/announcements/{id}` | DELETE | `admin.announcements` | Child of `admin.features` |
| `/api/v1/admin/reports` | GET | `admin.reports` | Child of `admin.features` |
| `/api/v1/admin/reports/{id}/status` | PUT | `admin.reports` | Child of `admin.features` |
| `/api/v1/admin/reports/{id}` | DELETE | `admin.reports` | Child of `admin.features` |

### Feature Flag Management APIs

| API Endpoint | Method | Feature Flag Required | Parent-Child Relationship |
|--------------|--------|----------------------|---------------------------|
| `/api/v1/admin/feature-flags` | GET | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/{name}` | GET | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags` | POST | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/{name}` | PUT | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/{name}` | DELETE | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/enabled` | GET | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/disabled` | GET | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/refresh-cache` | POST | `admin.features` | Self-Reference |
| `/api/v1/admin/feature-flags/{name}/enabled` | GET | None (Public) | Public Endpoint |

## Implementation Notes

1. **Backend Priority**: Backend validation is the primary security layer
2. **Frontend Enhancement**: Frontend feature flags improve UX
3. **Caching**: Feature flag status is cached for performance
4. **Error Handling**: Graceful fallbacks for disabled features
5. **Testing**: Comprehensive testing for both enabled and disabled states
6. **Hierarchical Validation**: Child features require parent features to be enabled
7. **Cross-Service Dependencies**: File service depends on user service for feature flag validation
8. **Self-Referencing**: Admin features can manage their own feature flags

## Summary of API Coverage

### Total APIs by Service:
- **User Service**: 12 APIs (all with feature flags)
- **Event Service**: 35+ APIs (mixed feature flag coverage)
- **File Service**: 6 APIs (all with feature flags)
- **Admin Service**: 12 APIs (all with feature flags)
- **Feature Flag Management**: 9 APIs (self-referencing)

### Feature Flag Coverage:
- **APIs with Feature Flags**: 45+ APIs
- **APIs without Feature Flags**: 20+ APIs (mostly event invitation, template, and analytics endpoints)
- **Public APIs**: 1 API (feature flag status check)

### Missing Feature Flags:
Several event service APIs currently lack feature flag protection:
- Event invitation management (accept/decline/mark-read)
- Event template management (create/update/delete/export/import)
- Event analytics
- Some recurring event endpoints

**Recommendation**: Consider adding feature flags to these APIs for consistent access control.

This structure provides a robust, scalable, and user-friendly approach to feature flag implementation in the IJAA system with **65+ APIs** organized in a clear hierarchical structure.
