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
      console.error('Error parsing user data:', error);
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
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Login with test credentials
  loginWithTestUser: async () => {
    try {
      console.log('🔐 Attempting to login with test user...');
      
      // First try to register a test user
      const registerResponse = await apiClient.post('/signup', {
        username: 'testuser3',
        password: 'password123'
      });
      
      console.log('✅ Test user registered/verified');
      
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
      
      console.log('✅ Login successful');
      console.log('User ID:', userData.userId);
      console.log('Token:', userData.token.substring(0, 50) + '...');
      
      return userData;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('alumni_user');
    console.log('✅ Logged out');
  },

  // Test API connectivity
  testAPIConnectivity: async () => {
    try {
      console.log('🔍 Testing API connectivity...');
      
      // Test if user is logged in
      if (!authHelper.isLoggedIn()) {
        console.log('⚠️ No user logged in, attempting login...');
        await authHelper.loginWithTestUser();
      }
      
      // Test events API
      const userEventApi = await import('./userEventApi');
      const response = await userEventApi.userEventApi.getAllEvents();
      
      console.log('✅ API connectivity test successful');
      console.log('Events count:', response.data?.length || 0);
      
      return true;
    } catch (error) {
      console.error('❌ API connectivity test failed:', error);
      return false;
    }
  }
};

export default authHelper; 