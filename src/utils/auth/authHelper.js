// Authentication helper for testing events functionality
import apiClient from './apiClient';

export const authHelper = {
  // Check if user is currently logged in
  isLoggedIn: () => {
    const userData = localStorage.getItem('alumni_user');
    if (!userData) return false;
    
    try {
      const user = JSON.parse(userData);
      return !!(user.token && user.username);
    } catch (error) {
      return false;
    }
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('alumni_user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch (error) {
      return null;
    }
  },

  // Login with test credentials
  loginWithTestUser: async () => {
    try {
      
      // First try to register a test user
      const registerResponse = await apiClient.post('/signup', {
        username: 'testuser3',
        password: 'password123'
      });
      
      
      // Then login
      const loginResponse = await apiClient.post('/signin', {
        username: 'testuser3',
        password: 'password123'
      });
      
      const userData = {
        username: 'testuser3',
        email: 'testuser3@example.com',
        token: loginResponse.data.data.token,
        userId: loginResponse.data.data.userId
      };
      
      // Store in localStorage
      localStorage.setItem('alumni_user', JSON.stringify(userData));
      
      
      return userData;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('alumni_user');
  },

  // Test API connectivity
  testAPIConnectivity: async () => {
    try {
      
      // Test if user is logged in
      if (!authHelper.isLoggedIn()) {
        await authHelper.loginWithTestUser();
      }
      
      // Test events API
      const userEventApi = await import('./userEventApi');
      const response = await userEventApi.userEventApi.getAllEvents();
      
      
      return true;
    } catch (error) {
      return false;
    }
  }
};

export default authHelper; 