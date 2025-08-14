# 🎛️ Feature Flag Integration Guide for Frontend Development

## 📋 Overview

This guide provides a comprehensive breakdown of all feature flag-related APIs for frontend integration. The APIs are organized into logical groups for sequential implementation, enabling dynamic feature control without code deployment.

---

## 🔐 Authentication Requirements

**All APIs require authentication:**
```http
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Admin Role Required:**
- Most feature flag management endpoints require `ADMIN` role
- User endpoints only require `USER` role for checking feature status

---

## 🎯 Group 1: Basic Feature Flag Management (Admin)

### 1.1 Get All Feature Flags
**Endpoint:** `GET /api/v1/admin/feature-flags`

**Response:**
```json
{
  "message": "Feature flags retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "featureName": "NEW_UI",
      "enabled": true,
      "description": "Enable new user interface with modern design",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    },
    {
      "id": 2,
      "featureName": "CHAT_FEATURE",
      "enabled": false,
      "description": "Enable real-time chat functionality between alumni",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

### 1.2 Get Feature Flag by Name
**Endpoint:** `GET /api/v1/admin/feature-flags/{featureName}`

**Response:**
```json
{
  "message": "Feature flag retrieved successfully",
  "code": "200",
  "data": {
    "id": 1,
    "featureName": "NEW_UI",
    "enabled": true,
    "description": "Enable new user interface with modern design",
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
}
```

### 1.3 Create Feature Flag
**Endpoint:** `POST /api/v1/admin/feature-flags`

**Request Body:**
```json
{
  "featureName": "NEW_FEATURE",
  "description": "Enable new feature for testing"
}
```

**Response:**
```json
{
  "message": "Feature flag created successfully",
  "code": "201",
  "data": {
    "id": 3,
    "featureName": "NEW_FEATURE",
    "enabled": false,
    "description": "Enable new feature for testing",
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T10:00:00"
  }
}
```

### 1.4 Update Feature Flag
**Endpoint:** `PUT /api/v1/admin/feature-flags/{featureName}`

**Request Body:**
```json
{
  "enabled": true
}
```

**Response:**
```json
{
  "message": "Feature flag updated successfully",
  "code": "200",
  "data": {
    "id": 1,
    "featureName": "NEW_UI",
    "enabled": true,
    "description": "Enable new user interface with modern design",
    "createdAt": "2024-12-01T10:00:00",
    "updatedAt": "2024-12-01T11:00:00"
  }
}
```

### 1.5 Delete Feature Flag
**Endpoint:** `DELETE /api/v1/admin/feature-flags/{featureName}`

**Response:**
```json
{
  "message": "Feature flag deleted successfully",
  "code": "200",
  "data": null
}
```

---

## 🎯 Group 2: Feature Flag Status Management (Admin)

### 2.1 Get Enabled Feature Flags
**Endpoint:** `GET /api/v1/admin/feature-flags/enabled`

**Response:**
```json
{
  "message": "Enabled feature flags retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "featureName": "NEW_UI",
      "enabled": true,
      "description": "Enable new user interface with modern design",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

### 2.2 Get Disabled Feature Flags
**Endpoint:** `GET /api/v1/admin/feature-flags/disabled`

**Response:**
```json
{
  "message": "Disabled feature flags retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 2,
      "featureName": "CHAT_FEATURE",
      "enabled": false,
      "description": "Enable real-time chat functionality between alumni",
      "createdAt": "2024-12-01T10:00:00",
      "updatedAt": "2024-12-01T10:00:00"
    }
  ]
}
```

---

## 🎯 Group 3: Feature Flag Status Checking (User)

### 3.1 Check Feature Flag Status
**Endpoint:** `GET /api/v1/admin/feature-flags/check/{featureName}`

**Response (Enabled):**
```json
{
  "message": "Feature flag status retrieved successfully",
  "code": "200",
  "data": {
    "featureName": "NEW_UI",
    "enabled": true
  }
}
```

**Response (Disabled):**
```json
{
  "message": "Feature flag status retrieved successfully",
  "code": "200",
  "data": {
    "featureName": "CHAT_FEATURE",
    "enabled": false
  }
}
```

---

## 🎯 Group 4: Feature Flag Integration Utilities

### 4.1 Predefined Feature Flags

The system includes predefined feature flags for common functionality:

```javascript
// Feature flag constants
const FEATURE_FLAGS = {
  NEW_UI: "NEW_UI",
  CHAT_FEATURE: "CHAT_FEATURE",
  EVENT_REGISTRATION: "EVENT_REGISTRATION",
  PAYMENT_INTEGRATION: "PAYMENT_INTEGRATION",
  SOCIAL_LOGIN: "SOCIAL_LOGIN",
  DARK_MODE: "DARK_MODE",
  NOTIFICATIONS: "NOTIFICATIONS",
  ADVANCED_SEARCH: "ADVANCED_SEARCH",
  ALUMNI_DIRECTORY: "ALUMNI_DIRECTORY",
  MENTORSHIP_PROGRAM: "MENTORSHIP_PROGRAM",
  EVENT_ANALYTICS: "EVENT_ANALYTICS",
  EVENT_TEMPLATES: "EVENT_TEMPLATES",
  RECURRING_EVENTS: "RECURRING_EVENTS",
  EVENT_MEDIA: "EVENT_MEDIA",
  EVENT_COMMENTS: "EVENT_COMMENTS"
};
```

### 4.2 Feature Flag Service Class

```javascript
class FeatureFlagService {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  // Get headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Get all feature flags (Admin only)
  async getAllFeatureFlags() {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Get feature flag by name (Admin only)
  async getFeatureFlag(featureName) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/${featureName}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Create feature flag (Admin only)
  async createFeatureFlag(featureName, description) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        featureName,
        description
      })
    });
    return response.json();
  }

  // Update feature flag (Admin only)
  async updateFeatureFlag(featureName, enabled) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/${featureName}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        enabled
      })
    });
    return response.json();
  }

  // Delete feature flag (Admin only)
  async deleteFeatureFlag(featureName) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/${featureName}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Get enabled feature flags (Admin only)
  async getEnabledFeatureFlags() {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/enabled`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Get disabled feature flags (Admin only)
  async getDisabledFeatureFlags() {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/disabled`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Check feature flag status (User)
  async checkFeatureFlag(featureName) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/check/${featureName}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Check if feature is enabled (User)
  async isFeatureEnabled(featureName) {
    const response = await this.checkFeatureFlag(featureName);
    return response.data?.enabled || false;
  }
}
```

---

## 🎯 Group 5: Frontend Integration Patterns

### 5.1 React Hook for Feature Flags

```javascript
import { useState, useEffect } from 'react';

const useFeatureFlag = (featureName, defaultValue = false) => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/admin/feature-flags/check/${featureName}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsEnabled(data.data?.enabled || false);
        } else {
          setError('Failed to check feature flag');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkFeatureFlag();
  }, [featureName]);

  return { isEnabled, loading, error };
};

// Usage example
const MyComponent = () => {
  const { isEnabled, loading, error } = useFeatureFlag('NEW_UI');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {isEnabled ? (
        <NewUIComponent />
      ) : (
        <LegacyUIComponent />
      )}
    </div>
  );
};
```

### 5.2 Vue.js Composable for Feature Flags

```javascript
import { ref, onMounted } from 'vue';

export function useFeatureFlag(featureName, defaultValue = false) {
  const isEnabled = ref(defaultValue);
  const loading = ref(true);
  const error = ref(null);

  const checkFeatureFlag = async () => {
    try {
      loading.value = true;
      const response = await fetch(`/api/v1/admin/feature-flags/check/${featureName}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        isEnabled.value = data.data?.enabled || false;
      } else {
        error.value = 'Failed to check feature flag';
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    checkFeatureFlag();
  });

  return {
    isEnabled,
    loading,
    error,
    checkFeatureFlag
  };
}
```

### 5.3 Angular Service for Feature Flags

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface FeatureFlag {
  id: number;
  featureName: string;
  enabled: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlagStatus {
  featureName: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  private baseURL = 'http://localhost:8081';
  private featureFlags = new BehaviorSubject<Map<string, boolean>>(new Map());

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Get all feature flags (Admin only)
  getAllFeatureFlags(): Observable<FeatureFlag[]> {
    return this.http.get<{data: FeatureFlag[]}>(`${this.baseURL}/api/v1/admin/feature-flags`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Check feature flag status (User)
  checkFeatureFlag(featureName: string): Observable<FeatureFlagStatus> {
    return this.http.get<{data: FeatureFlagStatus}>(`${this.baseURL}/api/v1/admin/feature-flags/check/${featureName}`, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data)
    );
  }

  // Check if feature is enabled (User)
  isFeatureEnabled(featureName: string): Observable<boolean> {
    return this.checkFeatureFlag(featureName).pipe(
      map(status => status.enabled),
      catchError(() => [false])
    );
  }

  // Update feature flag (Admin only)
  updateFeatureFlag(featureName: string, enabled: boolean): Observable<FeatureFlag> {
    return this.http.put<{data: FeatureFlag}>(`${this.baseURL}/api/v1/admin/feature-flags/${featureName}`, {
      enabled
    }, {
      headers: this.getHeaders()
    }).pipe(
      map(response => response.data)
    );
  }
}
```

---

## 🎯 Group 6: Advanced Integration Patterns

### 6.1 Conditional Rendering

```javascript
// React conditional rendering
const ConditionalFeature = ({ featureName, children, fallback = null }) => {
  const { isEnabled, loading } = useFeatureFlag(featureName);

  if (loading) return <div>Loading...</div>;
  
  return isEnabled ? children : fallback;
};

// Usage
<ConditionalFeature featureName="NEW_UI" fallback={<LegacyUI />}>
  <NewUI />
</ConditionalFeature>
```

### 6.2 Feature Flag Context

```javascript
// React context for feature flags
const FeatureFlagContext = createContext();

export const FeatureFlagProvider = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatureFlags = async () => {
      try {
        const response = await fetch('/api/v1/admin/feature-flags', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const flagsMap = new Map();
          data.data.forEach(flag => {
            flagsMap.set(flag.featureName, flag.enabled);
          });
          setFeatureFlags(flagsMap);
        }
      } catch (error) {
        console.error('Failed to load feature flags:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatureFlags();
  }, []);

  const isFeatureEnabled = (featureName) => {
    return featureFlags.get(featureName) || false;
  };

  return (
    <FeatureFlagContext.Provider value={{ isFeatureEnabled, loading }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

// Usage
const useFeatureFlags = () => useContext(FeatureFlagContext);

const MyComponent = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  
  return (
    <div>
      {isFeatureEnabled('NEW_UI') && <NewUIComponent />}
      {isFeatureEnabled('CHAT_FEATURE') && <ChatComponent />}
    </div>
  );
};
```

---

## 🚀 Implementation Checklist

### Phase 1: Basic Feature Flag Integration
- [ ] Implement feature flag service class
- [ ] Create feature flag checking utilities
- [ ] Add error handling and fallbacks
- [ ] Implement caching mechanism

### Phase 2: Frontend Framework Integration
- [ ] Create React hooks for feature flags
- [ ] Implement Vue.js composables
- [ ] Add Angular services
- [ ] Create conditional rendering components

### Phase 3: Advanced Patterns
- [ ] Implement feature flag context
- [ ] Add progressive enhancement patterns
- [ ] Create fallback strategies
- [ ] Implement error handling patterns

### Phase 4: Testing and Development
- [ ] Create mock services for testing
- [ ] Implement testing utilities
- [ ] Add integration tests
- [ ] Create development tools

### Phase 5: Monitoring and Analytics
- [ ] Add feature flag usage tracking
- [ ] Implement error monitoring
- [ ] Create analytics dashboard
- [ ] Add performance monitoring

### Phase 6: Production Deployment
- [ ] Implement production caching
- [ ] Add monitoring and alerting
- [ ] Create deployment strategies
- [ ] Add documentation

---

## 📝 Best Practices

### 1. **Error Handling**
- Always provide fallback values when feature flag checks fail
- Log errors for monitoring and debugging
- Use graceful degradation strategies

### 2. **Performance**
- Implement caching to reduce API calls
- Use batch requests when possible
- Consider client-side caching strategies

### 3. **User Experience**
- Avoid loading states for feature flag checks
- Use progressive enhancement
- Provide smooth transitions between feature states

### 4. **Testing**
- Mock feature flag services in tests
- Test both enabled and disabled states
- Include error scenarios in tests

### 5. **Monitoring**
- Track feature flag usage
- Monitor error rates
- Implement analytics for feature adoption

### 6. **Security**
- Validate feature flag names
- Implement proper authentication
- Use role-based access control

---

## 🎯 Common Use Cases

### 1. **UI/UX Features**
```javascript
// New UI toggle
const { isEnabled } = useFeatureFlag('NEW_UI');
return isEnabled ? <NewDesign /> : <LegacyDesign />;
```

### 2. **Feature Rollouts**
```javascript
// Gradual feature rollout
const { isEnabled } = useFeatureFlag('CHAT_FEATURE');
return isEnabled ? <ChatComponent /> : <ComingSoon />;
```

### 3. **A/B Testing**
```javascript
// A/B testing with feature flags
const { isEnabled } = useFeatureFlag('NEW_SEARCH_ALGORITHM');
return isEnabled ? <NewSearch /> : <OldSearch />;
```

### 4. **Emergency Rollbacks**
```javascript
// Emergency feature disable
const { isEnabled } = useFeatureFlag('PAYMENT_INTEGRATION');
return isEnabled ? <PaymentForm /> : <MaintenanceMessage />;
```

---

## 🎨 Frontend Integration Examples

### React/JavaScript Example

```javascript
// Feature flag service class
class FeatureFlagService {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  // Get headers
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Check if feature is enabled (User)
  async isFeatureEnabled(featureName) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/check/${featureName}`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    const data = await response.json();
    return data.data?.enabled || false;
  }

  // Get all feature flags (Admin only)
  async getAllFeatureFlags() {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags`, {
      method: 'GET',
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Update feature flag (Admin only)
  async updateFeatureFlag(featureName, enabled) {
    const response = await fetch(`${this.baseURL}/api/v1/admin/feature-flags/${featureName}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({
        enabled
      })
    });
    return response.json();
  }
}

// Usage example
const featureFlagService = new FeatureFlagService('http://localhost:8081', 'your-jwt-token');

// Check if feature is enabled
const isNewUIEnabled = await featureFlagService.isFeatureEnabled('NEW_UI');
console.log('New UI enabled:', isNewUIEnabled);

// Get all feature flags (Admin)
const allFlags = await featureFlagService.getAllFeatureFlags();
console.log('All feature flags:', allFlags.data);

// Update feature flag (Admin)
const updatedFlag = await featureFlagService.updateFeatureFlag('NEW_UI', true);
console.log('Updated feature flag:', updatedFlag.data);
```

---

*This guide provides a comprehensive overview of all feature flag-related APIs for frontend integration. Follow the sequential groups for optimal implementation.*
