// Example usage of the new apiClient with automatic token expiry handling

import apiClient from './apiClient';

// Example API functions using the new apiClient
export const apiExamples = {
  // Get user profile - automatically handles auth headers and token expiry
  getProfile: async (userId) => {
    try {
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      // If token is expired, the interceptor will automatically:
      // 1. Clear localStorage
      // 2. Dispatch auth:logout event
      // 3. Redirect to /signin
      // 4. Show "Session expired" toast
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/basic', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search alumni
  searchAlumni: async (searchParams) => {
    try {
      const response = await apiClient.post('/alumni/search', searchParams);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add experience
  addExperience: async (experienceData) => {
    try {
      const response = await apiClient.post('/experiences', experienceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete experience
  deleteExperience: async (experienceId) => {
    try {
      const response = await apiClient.delete(`/experiences/${experienceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send connection request
  sendConnectionRequest: async (recipientUsername) => {
    try {
      const response = await apiClient.post('/connections/request', { recipientUsername });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

/*
HOW THE AUTOMATIC LOGOUT WORKS:

1. **Request Interceptor**: Automatically adds Authorization header and X-USER_ID header
2. **Response Interceptor**: Catches 401/403 errors and triggers automatic logout
3. **AuthContext**: Listens for 'auth:logout' events and updates state
4. **ProtectedRoute**: Guards routes and redirects unauthenticated users

FLOW WHEN TOKEN EXPIRES:
1. User makes API call → apiClient adds auth headers
2. Backend returns 401/403 → Response interceptor catches it
3. Interceptor clears localStorage and dispatches 'auth:logout' event
4. AuthContext receives event and clears user state
5. User sees "Session expired" toast and is redirected to /signin
6. ProtectedRoute prevents access to protected pages

BENEFITS:
- No raw error messages shown to users
- Automatic cleanup of expired sessions
- Seamless redirect to login
- Centralized auth header management
- Consistent error handling across the app
*/ 