// Admin API utility functions with error handling
import { roleErrorMessages } from '../../utils/constants/roleConstants';
import axiosInstance from '../../utils/api/axiosInstance';

const API_BASE = process.env.REACT_APP_API_ADMIN_URL || 'http://localhost:8000/ijaa/api/v1/admin';

// Create a separate axios instance for admin API calls
const adminAxiosInstance = axiosInstance.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for admin token (using user token from memory)
adminAxiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from memory (unified token storage strategy)
    const accessToken = window.__accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      
      console.log('📤 [AdminAxiosInterceptor] Admin request with user token:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: true,
        tokenPreview: accessToken.substring(0, 20) + '...',
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('📤 [AdminAxiosInterceptor] Admin request without token:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: false,
        timestamp: new Date().toISOString()
      });
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and token refresh
adminAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { response } = error;
    
    console.log('📥 [AdminAxiosInterceptor] Response error:', {
      url: originalRequest?.url,
      method: originalRequest?.method?.toUpperCase(),
      status: response?.status,
      statusText: response?.statusText,
      isRetry: originalRequest?._retry,
      timestamp: new Date().toISOString()
    });

    // Check if error is due to expired admin token
    if (response?.status === 401 && !originalRequest._retry) {
      console.log('🔐 [AdminAxiosInterceptor] 401 error detected - checking for admin token refresh...');
      
      try {
        // For admin API, we need to refresh the user token first (admin uses user authentication)
        // Import AuthService dynamically to avoid circular imports
        const { default: AuthService } = await import('../auth/AuthService');
        
        console.log('🔄 [AdminAxiosInterceptor] Attempting user token refresh for admin API...');
        const refreshResponse = await AuthService.refreshToken();
        const newAccessToken = refreshResponse.accessToken;
        
        if (!newAccessToken) {
          throw new Error('No access token received from refresh response');
        }
        
        console.log('✅ [AdminAxiosInterceptor] User token refresh successful for admin API:', {
          newTokenLength: newAccessToken.length,
          tokenPreview: newAccessToken.substring(0, 20) + '...',
          timestamp: new Date().toISOString()
        });
        
        // Update the global access token
        window.__accessToken = newAccessToken;
        
        // Dispatch event to update AuthContext
        window.dispatchEvent(new CustomEvent('tokenRefreshed', {
          detail: { accessToken: newAccessToken }
        }));
        
        // Retry original request with new token
        console.log('🔄 [AdminAxiosInterceptor] Retrying admin request with new user token');
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return adminAxiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error('❌ [AdminAxiosInterceptor] Admin token refresh failed:', {
          error: refreshError.message,
          status: refreshError.response?.status,
          response: refreshError.response?.data,
          timestamp: new Date().toISOString()
        });
        
        // Refresh failed, clear admin auth state and redirect to admin login
        localStorage.removeItem("admin_user");
        
        // Only redirect if not already on admin login page
        const currentPath = window.location.pathname;
        const isOnAdminLoginPage = currentPath.includes('/admin/login');
        
        console.log('🚪 [AdminAxiosInterceptor] Handling admin refresh failure:', {
          currentPath,
          isOnAdminLoginPage,
          willRedirect: !isOnAdminLoginPage,
          timestamp: new Date().toISOString()
        });
        
        if (!isOnAdminLoginPage) {
          console.log('🔄 [AdminAxiosInterceptor] Redirecting to admin login page');
          window.location.href = '/admin/login';
        } else {
          console.log('ℹ️ [AdminAxiosInterceptor] Already on admin login page - not redirecting');
        }
        
        throw new Error("Admin session expired. Please login again.");
      }
    }
    
    // Handle other error cases
    if (response) {
      switch (response.status) {
        case 403:
          throw new Error(roleErrorMessages.insufficientPrivileges);
        case 404:
          throw new Error("Resource not found.");
        case 409:
          throw new Error(response.data?.message || "Conflict occurred.");
        default:
          throw new Error(response.data?.message || "An error occurred.");
      }
    }
    
    return Promise.reject(error);
  }
);

export const adminApiCall = async (endpoint, options = {}) => {
  // Check if user is authenticated (unified token storage strategy)
  const accessToken = window.__accessToken;
  if (!accessToken) {
    throw new Error("No access token found. Please login first.");
  }

  try {
    const response = await adminAxiosInstance({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      ...options
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper functions for common admin operations
export const adminApi = {
  // Dashboard
  getDashboardStats: () => adminApiCall('/dashboard'),
  
  // Users
  getUsers: () => adminApiCall('/users'),
  blockUser: (userId) => adminApiCall(`/users/${userId}/block`, { method: 'POST' }),
  unblockUser: (userId) => adminApiCall(`/users/${userId}/unblock`, { method: 'POST' }),
  deleteUser: (userId) => adminApiCall(`/users/${userId}`, { method: 'DELETE' }),
  
  // Events
  getEvents: () => adminApiCall('/events'),
  createEvent: (eventData) => adminApiCall('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  }),
  updateEvent: (eventId, eventData) => adminApiCall(`/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  }),
  deleteEvent: (eventId) => adminApiCall(`/events/${eventId}`, { method: 'DELETE' }),
  
  
  // ===== FEATURE FLAGS (GROUP 1 & 2) =====
  
  // ===== GROUP 1: BASIC FEATURE FLAG MANAGEMENT =====
  
  // 1.1 Get all feature flags
  getFeatureFlags: () => adminApiCall('/feature-flags/'),
  
  // 1.2 Get specific feature flag
  getFeatureFlag: (featureName) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`),
  
  // 1.2.1 Check if feature flag is enabled
  checkFeatureFlagEnabled: (featureName) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}/enabled`),
  
  // 1.3 Create feature flag
  createFeatureFlag: (featureFlagData) => adminApiCall('/feature-flags/', {
    method: 'POST',
    body: JSON.stringify(featureFlagData)
  }),
  
  // 1.4 Update feature flag
  updateFeatureFlag: (featureName, featureFlagData) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`, {
    method: 'PUT',
    body: JSON.stringify(featureFlagData)
  }),
  
  // 1.5 Delete feature flag
  deleteFeatureFlag: (featureName) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`, { method: 'DELETE' }),
  
  // ===== GROUP 2: FEATURE FLAG STATUS MANAGEMENT =====
  
  // 2.1 Get enabled feature flags
  getEnabledFeatureFlags: () => adminApiCall('/feature-flags/enabled'),
  
  // 2.2 Get disabled feature flags
  getDisabledFeatureFlags: () => adminApiCall('/feature-flags/disabled'),
  
  // 2.3 Refresh feature flag cache
  refreshFeatureFlagCache: () => adminApiCall('/feature-flags/refresh-cache', { method: 'POST' }),
  
  // ===== GROUP 2 ADDITIONAL UTILITY METHODS =====
  
  // 2.3 Get feature flags by status (Utility method)
  getFeatureFlagsByStatus: (enabled) => adminApiCall(`/feature-flags/${enabled ? 'enabled' : 'disabled'}`),
  
  // 2.4 Get feature flags summary (Utility method)
  getFeatureFlagsSummary: async () => {
    try {
      const [enabledResponse, disabledResponse] = await Promise.all([
        adminApiCall('/feature-flags/enabled'),
        adminApiCall('/feature-flags/disabled')
      ]);

      return {
        enabled: enabledResponse.data || [],
        disabled: disabledResponse.data || [],
        total: (enabledResponse.data || []).length + (disabledResponse.data || []).length,
        enabledCount: (enabledResponse.data || []).length,
        disabledCount: (disabledResponse.data || []).length
      };
    } catch (error) {
      throw error;
    }
  },
  
  // Legacy method for backward compatibility
  toggleFeatureFlag: (featureName, enabled) => adminApiCall(`/feature-flags/${encodeURIComponent(featureName)}`, {
    method: 'PUT',
    body: JSON.stringify({ enabled })
  }),
  
  // ===== ADMIN PROFILE & PASSWORD MANAGEMENT =====
  
  // Get current admin profile
  getAdminProfile: () => adminApiCall('/profile'),
  
  // Change admin password
  changeAdminPassword: (passwordData) => adminApiCall('/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  }),
  
  // ===== ADMIN MANAGEMENT =====
  
  // Get all admins
  getAllAdmins: () => adminApiCall('/admins'),
  
  // Create new admin
  createAdmin: (adminData) => adminApiCall('/admins', {
    method: 'POST',
    body: JSON.stringify(adminData)
  }),
  
  // Activate admin
  activateAdmin: (adminId) => adminApiCall(`/admins/${adminId}/activate`, { method: 'POST' }),
  
  // Deactivate admin
  deactivateAdmin: (adminId) => adminApiCall(`/admins/${adminId}/deactivate`, { method: 'POST' }),
}; 