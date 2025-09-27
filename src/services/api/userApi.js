import apiClient from './apiClient';

/**
 * User API Service
 * Handles all user-related API calls
 */
class UserApi {
  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise} User profile data
   */
  async getUserProfile(userId) {
    try {
      const response = await apiClient.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile data
   */
  async updateUserProfile(userId, profileData) {
    try {
      const response = await apiClient.put(`/profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Get user settings
   * @returns {Promise} User settings data
   */
  async getUserSettings() {
    try {
      const response = await apiClient.get('/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  /**
   * Update user settings
   * @param {Object} settings - Settings to update
   * @returns {Promise} Updated settings data
   */
  async updateUserSettings(settings) {
    try {
      const response = await apiClient.put('/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @returns {Promise} Success response
   */
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Delete user account
   * @param {string} userId - User ID
   * @returns {Promise} Success response
   */
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

// Create singleton instance
const userApi = new UserApi();

export default userApi;
