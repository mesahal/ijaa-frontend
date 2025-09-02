# Theme and Settings APIs - Frontend Integration Guide

## Overview
The Theme and Settings APIs provide comprehensive user preference management, including theme selection (DARK, LIGHT, DEVICE) and other customizable settings. These APIs allow users to personalize their experience across all devices and maintain consistent preferences.

## Base URL
```
http://localhost:8080/ijaa/api/v1/user/settings
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Get User Settings
Retrieves the current user's settings including theme preference.

**Endpoint:** `GET /api/v1/user/settings`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response:**
```json
{
  "message": "User settings retrieved successfully",
  "code": "200",
  "data": {
    "userId": "user123",
    "theme": "DARK"
  }
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "message": "User context not found in request headers",
  "code": "401",
  "data": null
}
```

**Error Response (500 - Internal Server Error):**
```json
{
  "message": "Failed to retrieve user settings",
  "code": "500",
  "data": null
}
```

---

### 2. Update User Settings
Updates the current user's settings including theme preference.

**Endpoint:** `PUT /api/v1/user/settings`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "theme": "LIGHT"
}
```

**Available Theme Options:**
- `"DARK"` - Dark theme
- `"LIGHT"` - Light theme  
- `"DEVICE"` - Follow device system preference

**Response:**
```json
{
  "message": "User settings updated successfully",
  "code": "200",
  "data": {
    "userId": "user123",
    "theme": "LIGHT"
  }
}
```

**Error Response (400 - Bad Request):**
```json
{
  "message": "Invalid theme value. Must be one of: DARK, LIGHT, DEVICE",
  "code": "400",
  "data": null
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "message": "User context not found in request headers",
  "code": "401",
  "data": null
}
```

**Error Response (500 - Internal Server Error):**
```json
{
  "message": "Failed to update user settings",
  "code": "500",
  "data": null
}
```

---

### 3. Get User Theme
Retrieves only the current user's theme preference.

**Endpoint:** `GET /api/v1/user/settings/theme`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response:**
```json
{
  "message": "User theme retrieved successfully",
  "code": "200",
  "data": "DARK"
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "message": "User context not found in request headers",
  "code": "401",
  "data": null
}
```

**Error Response (500 - Internal Server Error):**
```json
{
  "message": "Failed to retrieve user theme",
  "code": "500",
  "data": null
}
```

---

### 4. Get Available Themes
Retrieves all available theme options for the system.

**Endpoint:** `GET /api/v1/user/settings/themes`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response:**
```json
{
  "message": "Available themes retrieved successfully",
  "code": "200",
  "data": [
    "DARK",
    "LIGHT",
    "DEVICE"
  ]
}
```

**Error Response (500 - Internal Server Error):**
```json
{
  "message": "Failed to retrieve available themes",
  "code": "500",
  "data": null
}
```

---

## Data Models

### UserSettingsRequest
```typescript
interface UserSettingsRequest {
  theme: 'DARK' | 'LIGHT' | 'DEVICE';
}
```

### UserSettingsDto
```typescript
interface UserSettingsDto {
  userId: string;
  theme: 'DARK' | 'LIGHT' | 'DEVICE';
}
```

### Theme Enum
```typescript
enum Theme {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
  DEVICE = 'DEVICE'
}
```

### ApiResponse<T>
```typescript
interface ApiResponse<T> {
  message: string;
  code: string;
  data: T | null;
}
```

---

## Frontend Integration Examples

### React/TypeScript Example

#### 1. Theme Context Provider
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  theme: 'DARK' | 'LIGHT' | 'DEVICE';
  setTheme: (theme: 'DARK' | 'LIGHT' | 'DEVICE') => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'DARK' | 'LIGHT' | 'DEVICE'>('DEVICE');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserTheme();
  }, []);

  const fetchUserTheme = async () => {
    try {
      const response = await fetch('/api/v1/user/settings/theme', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setThemeState(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch user theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTheme = async (newTheme: 'DARK' | 'LIGHT' | 'DEVICE') => {
    try {
      const response = await fetch('/api/v1/user/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: newTheme })
      });
      
      if (response.ok) {
        setThemeState(newTheme);
        // Apply theme to document
        applyTheme(newTheme);
      }
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  const applyTheme = (selectedTheme: 'DARK' | 'LIGHT' | 'DEVICE') => {
    const actualTheme = selectedTheme === 'DEVICE' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT')
      : selectedTheme;
    
    document.documentElement.setAttribute('data-theme', actualTheme.toLowerCase());
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

#### 2. Theme Selector Component
```typescript
import React from 'react';
import { useTheme } from './ThemeContext';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, isLoading } = useTheme();

  if (isLoading) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="theme-selector">
      <label htmlFor="theme-select">Theme:</label>
      <select
        id="theme-select"
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'DARK' | 'LIGHT' | 'DEVICE')}
      >
        <option value="DARK">Dark</option>
        <option value="LIGHT">Light</option>
        <option value="DEVICE">System</option>
      </select>
    </div>
  );
};
```

#### 3. Settings Page Component
```typescript
import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

interface UserSettings {
  userId: string;
  theme: 'DARK' | 'LIGHT' | 'DEVICE';
}

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/v1/user/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.data);
      } else {
        setError('Failed to fetch settings');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (newTheme: 'DARK' | 'LIGHT' | 'DEVICE') => {
    try {
      const response = await fetch('/api/v1/user/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt-token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme: newTheme })
      });
      
      if (response.ok) {
        setTheme(newTheme);
        setSettings(prev => prev ? { ...prev, theme: newTheme } : null);
        setError(null);
      } else {
        setError('Failed to update theme');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="settings-page">
      <h1>User Settings</h1>
      
      <div className="setting-section">
        <h2>Theme Preference</h2>
        <div className="theme-options">
          <label>
            <input
              type="radio"
              name="theme"
              value="DARK"
              checked={theme === 'DARK'}
              onChange={() => handleThemeChange('DARK')}
            />
            Dark Theme
          </label>
          
          <label>
            <input
              type="radio"
              name="theme"
              value="LIGHT"
              checked={theme === 'LIGHT'}
              onChange={() => handleThemeChange('LIGHT')}
            />
            Light Theme
          </label>
          
          <label>
            <input
              type="radio"
              name="theme"
              value="DEVICE"
              checked={theme === 'DEVICE'}
              onChange={() => handleThemeChange('DEVICE')}
            />
            System Default
          </label>
        </div>
        
        <p className="setting-description">
          Choose your preferred theme. "System Default" will automatically follow your device's theme setting.
        </p>
      </div>

      {settings && (
        <div className="current-settings">
          <h3>Current Settings</h3>
          <p><strong>User ID:</strong> {settings.userId}</p>
          <p><strong>Theme:</strong> {settings.theme}</p>
        </div>
      )}
    </div>
  );
};
```

---

## CSS Theme Implementation

### CSS Variables for Themes
```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --border-color: #dee2e6;
  --accent-color: #007bff;
}

:root[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --border-color: #404040;
  --accent-color: #4dabf7;
}

/* Apply theme variables */
body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

.card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.btn-primary {
  background-color: var(--accent-color);
}
```

---

## Error Handling

### Common Error Scenarios

#### 1. Authentication Errors
- **401 Unauthorized**: JWT token missing, expired, or invalid
- **Solution**: Redirect to login page or refresh token

#### 2. Network Errors
- **Connection timeout**: Network connectivity issues
- **Solution**: Retry with exponential backoff, show offline message

#### 3. Validation Errors
- **400 Bad Request**: Invalid theme value
- **Solution**: Show validation message, prevent form submission

#### 4. Server Errors
- **500 Internal Server Error**: Server-side issues
- **Solution**: Show generic error message, log details for debugging

### Error Handling Example
```typescript
const handleApiError = (error: any, fallbackMessage: string) => {
  if (error.response) {
    // Server responded with error status
    switch (error.response.status) {
      case 401:
        // Redirect to login
        window.location.href = '/login';
        break;
      case 400:
        // Show validation error
        setError(error.response.data.message || fallbackMessage);
        break;
      case 500:
        // Show server error
        setError('Server error occurred. Please try again later.');
        break;
      default:
        setError(fallbackMessage);
    }
  } else if (error.request) {
    // Network error
    setError('Network error. Please check your connection.');
  } else {
    // Other error
    setError(fallbackMessage);
  }
};
```

---

## Best Practices

### 1. Theme Persistence
- Store theme preference in user settings
- Apply theme immediately on page load
- Respect system theme changes when using DEVICE option

### 2. Performance Optimization
- Cache user settings to reduce API calls
- Apply theme changes without page reload
- Use CSS transitions for smooth theme switching

### 3. Accessibility
- Ensure sufficient color contrast in both themes
- Support keyboard navigation for theme selection
- Provide theme toggle for users with visual preferences

### 4. User Experience
- Show loading states during API calls
- Provide immediate feedback for theme changes
- Remember user preferences across sessions

---

## Testing

### Unit Tests
```typescript
describe('Theme Selector', () => {
  it('should call setTheme when theme option is selected', () => {
    const mockSetTheme = jest.fn();
    render(<ThemeSelector />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'LIGHT' } });
    
    expect(mockSetTheme).toHaveBeenCalledWith('LIGHT');
  });
});
```

### Integration Tests
```typescript
describe('Settings API Integration', () => {
  it('should update user theme successfully', async () => {
    const response = await fetch('/api/v1/user/settings', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${validToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ theme: 'DARK' })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.theme).toBe('DARK');
  });
});
```

---

## Conclusion

The Theme and Settings APIs provide a robust foundation for implementing user preference management in your frontend application. With proper error handling, loading states, and theme persistence, users can enjoy a personalized experience that adapts to their preferences and device settings.

Key benefits:
- ✅ **Flexible Theme Options**: DARK, LIGHT, and DEVICE (system) themes
- ✅ **Persistent Preferences**: Settings saved and retrieved automatically
- ✅ **Real-time Updates**: Theme changes apply immediately without page reload
- ✅ **System Integration**: Respects device theme preferences
- ✅ **Comprehensive Error Handling**: Graceful fallbacks for all error scenarios
- ✅ **Accessibility Support**: Keyboard navigation and proper contrast ratios

For additional support or questions about the API implementation, refer to the backend service documentation or contact the development team.
