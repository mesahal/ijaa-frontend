# Feature Flag Implementation Guide for Frontend

## Overview

The IJAA system implements a sophisticated feature flag system with hierarchical structure, caching, and role-based access control.

### How Feature Flags Work: Backend vs Frontend

**Backend Implementation:**
- Feature flags are implemented as **API restrictions** using `@RequiresFeature` annotations
- When a feature is disabled, the API returns `403 Forbidden` or `FeatureDisabledException`
- This prevents unauthorized access to backend functionality

**Frontend Implementation:**
- Feature flags are used for **UI/UX control** - showing/hiding components
- Frontend checks feature flag status before rendering components
- This provides a better user experience than showing error screens

### Frontend Decision Making Process

```
1. Component wants to render → Check feature flag status
2. If enabled → Render component normally
3. If disabled → Show fallback or hide component
4. If API call needed → Backend will also validate (double protection)
```

## API Endpoints

### Base URL
- Gateway: `http://localhost:8080`
- Direct User Service: `http://localhost:8081`

### Authentication
All admin endpoints require:
- Authorization: `Bearer {JWT_TOKEN}`
- Role: `ADMIN`
- Feature Flag: `admin.features` must be enabled

## Core APIs

### 1. Get All Feature Flags (Admin)
**GET** `/api/v1/admin/feature-flags`

**Response:**
```json
{
  "message": "Feature flags retrieved successfully",
  "code": "200",
  "data": [
    {
      "id": 1,
      "name": "chat",
      "displayName": "Chat Feature",
      "enabled": true,
      "description": "Real-time chat functionality",
      "parentId": null,
      "children": [
        {
          "id": 2,
          "name": "chat.file-sharing",
          "displayName": "File Sharing in Chat",
          "enabled": true,
          "parentId": 1
        }
      ]
    }
  ]
}
```

### 2. Check Feature Flag Status (Public)
**GET** `/api/v1/admin/feature-flags/{name}/enabled`

**Response:**
```json
{
  "message": "Feature flag status retrieved successfully",
  "code": "200",
  "data": {
    "name": "chat",
    "enabled": true
  }
}
```

### 3. Create Feature Flag (Admin)
**POST** `/api/v1/admin/feature-flags`

**Request:**
```json
{
  "name": "chat.video-calls",
  "displayName": "Video Calls in Chat",
  "description": "Enable video calling functionality",
  "parentId": 1,
  "enabled": false
}
```

### 4. Update Feature Flag (Admin)
**PUT** `/api/v1/admin/feature-flags/{name}`

**Request:**
```json
{
  "enabled": true
}
```

### 5. Delete Feature Flag (Admin)
**DELETE** `/api/v1/admin/feature-flags/{name}`

### 6. Get Enabled/Disabled Flags (Admin)
**GET** `/api/v1/admin/feature-flags/enabled`
**GET** `/api/v1/admin/feature-flags/disabled`

### 7. Refresh Cache (Admin)
**POST** `/api/v1/admin/feature-flags/refresh-cache`

## Data Models

```typescript
interface FeatureFlagDto {
  id: number;
  name: string;
  displayName: string;
  parentId: number | null;
  enabled: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  children?: FeatureFlagDto[];
}

interface FeatureFlagStatus {
  name: string;
  enabled: boolean;
}

interface ApiResponse<T> {
  message: string;
  code: string;
  data: T;
}
```

## Frontend Implementation

### Feature Flag Service

```typescript
export class FeatureFlagService {
  private api: AxiosInstance;

  constructor(baseURL: string, token?: string) {
    this.api = axios.create({
      baseURL: `${baseURL}/api/v1/admin/feature-flags`,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  async getAllFeatureFlags(): Promise<FeatureFlagDto[]> {
    const response = await this.api.get<ApiResponse<FeatureFlagDto[]>>('');
    return response.data.data;
  }

  async checkFeatureFlag(name: string): Promise<FeatureFlagStatus> {
    const response = await this.api.get<ApiResponse<FeatureFlagStatus>>(`/${name}/enabled`);
    return response.data.data;
  }

  async createFeatureFlag(request: FeatureFlagRequest): Promise<FeatureFlagDto> {
    const response = await this.api.post<ApiResponse<FeatureFlagDto>>('', request);
    return response.data.data;
  }

  async updateFeatureFlag(name: string, enabled: boolean): Promise<FeatureFlagDto> {
    const response = await this.api.put<ApiResponse<FeatureFlagDto>>(`/${name}`, { enabled });
    return response.data.data;
  }

  async deleteFeatureFlag(name: string): Promise<void> {
    await this.api.delete<ApiResponse<void>>(`/${name}`);
  }
}
```

### React Hook

```typescript
export const useFeatureFlag = (featureName: string, baseURL: string) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const featureFlagService = new FeatureFlagService(baseURL);

  const checkFeatureFlag = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await featureFlagService.checkFeatureFlag(featureName);
      setIsEnabled(status.enabled);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check feature flag');
      setIsEnabled(false);
    } finally {
      setLoading(false);
    }
  }, [featureName, featureFlagService]);

  useEffect(() => {
    checkFeatureFlag();
  }, [checkFeatureFlag]);

  return { isEnabled, loading, error, refetch: checkFeatureFlag };
};
```

### React Context

```typescript
interface FeatureFlagContextType {
  featureFlags: FeatureFlagDto[];
  loading: boolean;
  error: string | null;
  isFeatureEnabled: (featureName: string) => boolean;
  refreshFeatureFlags: () => Promise<void>;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  baseURL,
  token,
}) => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const featureFlagService = new FeatureFlagService(baseURL, token);

  const loadFeatureFlags = async () => {
    try {
      setLoading(true);
      setError(null);
      const flags = await featureFlagService.getAllFeatureFlags();
      setFeatureFlags(flags);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load feature flags');
    } finally {
      setLoading(false);
    }
  };

  const isFeatureEnabled = (featureName: string): boolean => {
    const findFlag = (flags: FeatureFlagDto[], name: string): FeatureFlagDto | null => {
      for (const flag of flags) {
        if (flag.name === name) return flag;
        if (flag.children) {
          const found = findFlag(flag.children, name);
          if (found) return found;
        }
      }
      return null;
    };

    const flag = findFlag(featureFlags, featureName);
    if (!flag) return false;

    // Check parent flags (hierarchical behavior)
    if (flag.parentId) {
      const parent = findFlag(featureFlags, flag.parentId.toString());
      if (parent && !parent.enabled) return false;
    }

    return flag.enabled;
  };

  useEffect(() => {
    loadFeatureFlags();
  }, []);

  const value: FeatureFlagContextType = {
    featureFlags,
    loading,
    error,
    isFeatureEnabled,
    refreshFeatureFlags: loadFeatureFlags,
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
```

### Feature Flag Component

```typescript
export const FeatureFlag: React.FC<FeatureFlagProps> = ({
  feature,
  children,
  fallback = null,
}) => {
  const { isFeatureEnabled, loading } = useFeatureFlags();

  if (loading) return <div>Loading...</div>;
  if (!isFeatureEnabled(feature)) return <>{fallback}</>;
  return <>{children}</>;
};
```

### Advanced Feature Flag Components

#### 1. Feature Flag with API Integration

```typescript
// components/FeatureFlagWithAPI.tsx
interface FeatureFlagWithAPIProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  onApiError?: (error: Error) => void;
}

export const FeatureFlagWithAPI: React.FC<FeatureFlagWithAPIProps> = ({
  feature,
  children,
  fallback = null,
  onApiError,
}) => {
  const { isEnabled, loading, error } = useFeatureFlag(feature, baseURL);

  useEffect(() => {
    if (error && onApiError) {
      onApiError(new Error(`Feature '${feature}' is not available`));
    }
  }, [error, feature, onApiError]);

  if (loading) return <div>Loading...</div>;
  if (error || !isEnabled) return <>{fallback}</>;
  return <>{children}</>;
};
```

#### 2. Feature Flag with Multiple Dependencies

```typescript
// components/MultiFeatureFlag.tsx
interface MultiFeatureFlagProps {
  features: string[];
  children: ReactNode;
  fallback?: ReactNode;
  requireAll?: boolean; // true = all must be enabled, false = any can be enabled
}

export const MultiFeatureFlag: React.FC<MultiFeatureFlagProps> = ({
  features,
  children,
  fallback = null,
  requireAll = true,
}) => {
  const { isFeatureEnabled, loading } = useFeatureFlags();

  if (loading) return <div>Loading...</div>;

  const checkFeatures = () => {
    if (requireAll) {
      return features.every(feature => isFeatureEnabled(feature));
    } else {
      return features.some(feature => isFeatureEnabled(feature));
    }
  };

  if (!checkFeatures()) return <>{fallback}</>;
  return <>{children}</>;
};

// Usage examples:
// All features must be enabled
<MultiFeatureFlag features={['chat', 'chat.file-sharing']} requireAll={true}>
  <ChatWithFileSharing />
</MultiFeatureFlag>

// Any feature can be enabled
<MultiFeatureFlag features={['dark-mode', 'light-mode']} requireAll={false}>
  <ThemeSelector />
</MultiFeatureFlag>
```

#### 3. Feature Flag with Conditional Rendering

```typescript
// components/ConditionalFeatureFlag.tsx
interface ConditionalFeatureFlagProps {
  feature: string;
  enabledComponent: ReactNode;
  disabledComponent?: ReactNode;
  loadingComponent?: ReactNode;
}

export const ConditionalFeatureFlag: React.FC<ConditionalFeatureFlagProps> = ({
  feature,
  enabledComponent,
  disabledComponent = null,
  loadingComponent = <div>Loading...</div>,
}) => {
  const { isEnabled, loading } = useFeatureFlag(feature, baseURL);

  if (loading) return <>{loadingComponent}</>;
  if (isEnabled) return <>{enabledComponent}</>;
  return <>{disabledComponent}</>;
};
```

## Frontend Decision Making Patterns

### How Frontend Components Decide What to Show

The frontend uses feature flags to make **UI/UX decisions** before rendering components. Here's how different scenarios are handled:

#### 1. Simple Component Show/Hide

```typescript
// Basic pattern: Show component only if feature is enabled
const ChatSection: React.FC = () => {
  return (
    <FeatureFlag feature="chat">
      <ChatComponent />
    </FeatureFlag>
  );
};
```

#### 2. Component with Fallback

```typescript
// Show alternative content when feature is disabled
const FileUploadSection: React.FC = () => {
  return (
    <FeatureFlag 
      feature="file-upload.profile-photo" 
      fallback={<p>Profile photo upload is currently unavailable</p>}
    >
      <ProfilePhotoUpload />
    </FeatureFlag>
  );
};
```

#### 3. Multiple API Dependencies

```typescript
// Component that uses multiple APIs - check all required features
const AdvancedChatComponent: React.FC = () => {
  return (
    <MultiFeatureFlag 
      features={['chat', 'chat.file-sharing', 'chat.voice-calls']} 
      requireAll={true}
      fallback={<BasicChatComponent />}
    >
      <AdvancedChatWithAllFeatures />
    </MultiFeatureFlag>
  );
};
```

#### 4. Progressive Enhancement

```typescript
// Show basic version by default, enhance if features are available
const UserProfile: React.FC = () => {
  return (
    <div className="user-profile">
      {/* Always show basic info */}
      <BasicUserInfo />
      
      {/* Enhance with experiences if available */}
      <FeatureFlag feature="user.experiences">
        <WorkExperienceSection />
      </FeatureFlag>
      
      {/* Enhance with interests if available */}
      <FeatureFlag feature="user.interests">
        <InterestsSection />
      </FeatureFlag>
      
      {/* Show advanced features only if all are available */}
      <MultiFeatureFlag features={['user.experiences', 'user.interests']}>
        <AdvancedProfileAnalytics />
      </MultiFeatureFlag>
    </div>
  );
};
```

#### 5. Conditional Navigation

```typescript
// Show/hide navigation items based on features
const NavigationMenu: React.FC = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      
      <FeatureFlag feature="events">
        <Link to="/events">Events</Link>
      </FeatureFlag>
      
      <FeatureFlag feature="chat">
        <Link to="/chat">Chat</Link>
      </FeatureFlag>
      
      <FeatureFlag feature="alumni.search">
        <Link to="/directory">Alumni Directory</Link>
      </FeatureFlag>
    </nav>
  );
};
```

#### 6. Feature-Dependent Forms

```typescript
// Show different form fields based on available features
const UserRegistrationForm: React.FC = () => {
  return (
    <form>
      {/* Always required */}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      
      {/* Optional based on features */}
      <FeatureFlag feature="user.experiences">
        <WorkExperienceFields />
      </FeatureFlag>
      
      <FeatureFlag feature="user.interests">
        <InterestsFields />
      </FeatureFlag>
      
      <FeatureFlag feature="file-upload.profile-photo">
        <ProfilePhotoUpload />
      </FeatureFlag>
    </form>
  );
};
```

## Usage Examples

### Basic Usage

```typescript
// App.tsx
const App: React.FC = () => {
  return (
    <FeatureFlagProvider baseURL="http://localhost:8080" token={userToken}>
      <div className="app">
        <FeatureFlag feature="chat">
          <ChatComponent />
        </FeatureFlag>
        
        <FeatureFlag feature="chat.file-sharing">
          <FileSharingComponent />
        </FeatureFlag>
        
        <FeatureFlag feature="chat.video-calls" fallback={<p>Coming soon!</p>}>
          <VideoCallComponent />
        </FeatureFlag>
      </div>
    </FeatureFlagProvider>
  );
};
```

### Hook Usage

```typescript
const UserProfile: React.FC = () => {
  const { isEnabled: isExperiencesEnabled, loading } = useFeatureFlag('user.experiences', 'http://localhost:8080');
  const { isEnabled: isInterestsEnabled } = useFeatureFlag('user.interests', 'http://localhost:8080');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="user-profile">
      <BasicProfileInfo />
      {isExperiencesEnabled && <WorkExperienceSection />}
      {isInterestsEnabled && <InterestsSection />}
    </div>
  );
};
```

### Complete Feature Flag Flow

#### 1. Frontend Decision Making

```typescript
// Step 1: Frontend checks feature flag before rendering
const ChatComponent: React.FC = () => {
  const { isEnabled, loading, error } = useFeatureFlag('chat', baseURL);

  // Step 2: Make UI decision based on flag status
  if (loading) return <div>Loading chat...</div>;
  if (!isEnabled) return <div>Chat is currently unavailable</div>;
  if (error) return <div>Unable to load chat feature</div>;

  // Step 3: Render component (API calls will be made)
  return <ChatInterface />;
};
```

#### 2. API Call Protection (Double Validation)

```typescript
// Even if frontend shows component, backend will validate
const ChatInterface: React.FC = () => {
  const sendMessage = async (message: string) => {
    try {
      // This API call will be protected by backend @RequiresFeature("chat")
      const response = await api.post('/api/v1/chat/messages', { message });
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        // Backend rejected the request - feature is disabled
        showError('Chat feature is currently disabled');
      }
      throw error;
    }
  };

  return (
    <div>
      <MessageList />
      <MessageInput onSend={sendMessage} />
    </div>
  );
};
```

#### 3. Error Handling Strategy

```typescript
// components/FeatureFlagErrorBoundary.tsx
export class FeatureFlagErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    if (error.message.includes('Feature') || error.message.includes('403')) {
      return { hasError: true, error };
    }
    return null;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="feature-error">
          <h3>Feature Unavailable</h3>
          <p>This feature is currently not available.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<FeatureFlagErrorBoundary>
  <FeatureFlag feature="chat">
    <ChatComponent />
  </FeatureFlag>
</FeatureFlagErrorBoundary>
```

## Feature Flag Management

### Important: Dynamic vs Static Constants

**⚠️ WARNING**: The feature flag system is **dynamic** and managed through the backend API. Static constants can be misleading and should be used carefully.

### Approach 1: Dynamic Feature Flag Discovery (Recommended)

```typescript
// services/featureFlagService.ts
export class FeatureFlagService {
  // ... existing methods ...

  // Get all available feature flag names
  async getAvailableFeatureFlags(): Promise<string[]> {
    const flags = await this.getAllFeatureFlags();
    return this.extractFlagNames(flags);
  }

  private extractFlagNames(flags: FeatureFlagDto[]): string[] {
    const names: string[] = [];
    
    const extractNames = (flagList: FeatureFlagDto[]) => {
      flagList.forEach(flag => {
        names.push(flag.name);
        if (flag.children && flag.children.length > 0) {
          extractNames(flag.children);
        }
      });
    };
    
    extractNames(flags);
    return names;
  }

  // Validate if a feature flag exists
  async validateFeatureFlag(name: string): Promise<boolean> {
    try {
      await this.checkFeatureFlag(name);
      return true;
    } catch (error) {
      return false;
    }
  }
}
```

### Approach 2: Runtime Constants (Better than Static)

```typescript
// hooks/useFeatureFlags.ts
export const useFeatureFlags = () => {
  const [availableFlags, setAvailableFlags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlags = async () => {
      try {
        const flags = await featureFlagService.getAvailableFeatureFlags();
        setAvailableFlags(flags);
      } catch (error) {
        console.error('Failed to load feature flags:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFlags();
  }, []);

  return { availableFlags, loading };
};

// Usage
const { availableFlags, loading } = useFeatureFlags();

// Check if a flag exists before using it
const isFlagAvailable = (flagName: string) => availableFlags.includes(flagName);
```

### Approach 3: Type-Safe Feature Flag Names (Advanced)

```typescript
// types/featureFlags.ts
export type FeatureFlagName = 
  | 'chat'
  | 'chat.file-sharing'
  | 'chat.voice-calls'
  | 'events'
  | 'events.creation'
  | 'file-upload'
  | 'file-upload.profile-photo'
  | 'user.experiences'
  | 'user.interests'
  | 'search'
  | 'search.advanced-filters';

// Enhanced hook with type safety
export const useTypedFeatureFlag = (featureName: FeatureFlagName, baseURL: string) => {
  return useFeatureFlag(featureName, baseURL);
};

// Usage with type checking
const { isEnabled } = useTypedFeatureFlag('chat.file-sharing', baseURL);
```

### Approach 4: Feature Flag Registry (Most Robust)

```typescript
// services/featureFlagRegistry.ts
class FeatureFlagRegistry {
  private flags: Map<string, FeatureFlagDto> = new Map();
  private initialized = false;

  async initialize(baseURL: string, token?: string): Promise<void> {
    if (this.initialized) return;

    const service = new FeatureFlagService(baseURL, token);
    const allFlags = await service.getAllFeatureFlags();
    
    this.populateRegistry(allFlags);
    this.initialized = true;
  }

  private populateRegistry(flags: FeatureFlagDto[]): void {
    const addToRegistry = (flagList: FeatureFlagDto[]) => {
      flagList.forEach(flag => {
        this.flags.set(flag.name, flag);
        if (flag.children && flag.children.length > 0) {
          addToRegistry(flag.children);
        }
      });
    };
    
    addToRegistry(flags);
  }

  isFlagAvailable(name: string): boolean {
    return this.flags.has(name);
  }

  getFlag(name: string): FeatureFlagDto | undefined {
    return this.flags.get(name);
  }

  getAllFlagNames(): string[] {
    return Array.from(this.flags.keys());
  }

  refresh(): void {
    this.initialized = false;
    this.flags.clear();
  }
}

export const featureFlagRegistry = new FeatureFlagRegistry();
```

### Usage with Registry

```typescript
// App.tsx
const App: React.FC = () => {
  useEffect(() => {
    // Initialize registry on app start
    featureFlagRegistry.initialize('http://localhost:8080', userToken);
  }, []);

  return (
    <FeatureFlagProvider baseURL="http://localhost:8080" token={userToken}>
      <div className="app">
        {/* Only render if flag exists in registry */}
        {featureFlagRegistry.isFlagAvailable('chat') && (
          <FeatureFlag feature="chat">
            <ChatComponent />
          </FeatureFlag>
        )}
      </div>
    </FeatureFlagProvider>
  );
};
```

### Best Practices for Feature Flag Constants

1. **Avoid Static Constants**: Don't hardcode feature flag names
2. **Use Dynamic Discovery**: Load available flags from the backend
3. **Validate Before Use**: Check if a flag exists before using it
4. **Type Safety**: Use TypeScript for compile-time checking
5. **Registry Pattern**: Maintain a runtime registry of available flags
6. **Error Handling**: Gracefully handle missing or invalid flags

## Error Handling

```typescript
export class FeatureFlagError extends Error {
  constructor(
    message: string,
    public code: string,
    public featureName?: string
  ) {
    super(message);
    this.name = 'FeatureFlagError';
  }
}

// Enhanced service with error handling
export class EnhancedFeatureFlagService extends FeatureFlagService {
  async checkFeatureFlag(name: string): Promise<FeatureFlagStatus> {
    try {
      const response = await this.api.get<ApiResponse<FeatureFlagStatus>>(`/${name}/enabled`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new FeatureFlagError(
          `Feature flag '${name}' not found`,
          'FEATURE_NOT_FOUND',
          name
        );
      }
      
      if (error.response?.status === 403) {
        throw new FeatureFlagError(
          'Access denied to feature flag',
          'ACCESS_DENIED',
          name
        );
      }
      
      throw new FeatureFlagError(
        error.response?.data?.message || 'Failed to check feature flag',
        error.response?.status?.toString() || 'UNKNOWN_ERROR',
        name
      );
    }
  }
}
```

## Testing

### Unit Test Example

```typescript
describe('useFeatureFlag', () => {
  it('should return enabled state when feature is enabled', async () => {
    const mockCheckFeatureFlag = jest.fn().mockResolvedValue({
      name: 'chat',
      enabled: true,
    });

    mockService.mockImplementation(() => ({
      checkFeatureFlag: mockCheckFeatureFlag,
    } as any));

    const { result } = renderHook(() => useFeatureFlag('chat', 'http://localhost:8080'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isEnabled).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
```

## Best Practices

1. **Dynamic Discovery**: Load feature flags from the backend instead of using static constants
2. **Validate Before Use**: Always check if a feature flag exists before using it
3. **Hierarchical Structure**: Use dot notation for parent-child relationships
4. **Caching**: Implement client-side caching for performance
5. **Error Boundaries**: Wrap feature flag components in error boundaries
6. **Type Safety**: Use TypeScript for type-safe feature flag usage
7. **Testing**: Test feature flag logic thoroughly
8. **Documentation**: Document all feature flags and their purposes
9. **Registry Pattern**: Use a registry to maintain runtime knowledge of available flags
10. **Graceful Degradation**: Handle missing or disabled features gracefully

## Conclusion

This feature flag system provides a robust, scalable solution for managing application features. It supports hierarchical flags, role-based access, caching, and comprehensive error handling. The frontend implementation includes reusable components, hooks, and services for easy integration.
