/**
 * TokenManager - Centralized token management with single refresh promise pattern
 * 
 * This class ensures that only one token refresh happens at a time,
 * preventing race conditions and simplifying the refresh logic.
 */

import AuthService from './AuthService';

class TokenManager {
  static refreshPromise = null;
  static isRefreshing = false;
  static accessToken = null;
  static refreshCallbacks = [];

  /**
   * Get current access token
   * @returns {string|null} Current access token
   */
  static getAccessToken() {
    // First check memory, then sessionStorage, then window
    return this.accessToken || 
           sessionStorage.getItem('access_token') || 
           window.__accessToken;
  }

  /**
   * Set access token
   * @param {string} token - Access token to set
   */
  static setAccessToken(token) {
    this.accessToken = token;
    window.__accessToken = token;
    // Store in sessionStorage for persistence across page refreshes
    // sessionStorage is cleared when browser tab closes (more secure than localStorage)
    if (token) {
      sessionStorage.setItem('access_token', token);
    } else {
      sessionStorage.removeItem('access_token');
    }
  }

  /**
   * Clear access token
   */
  static clearAccessToken() {
    this.accessToken = null;
    window.__accessToken = null;
    sessionStorage.removeItem('access_token');
  }

  /**
   * Check if token refresh is in progress
   * @returns {boolean} True if refresh is in progress
   */
  static isTokenRefreshInProgress() {
    return this.isRefreshing;
  }

  /**
   * Refresh token with single promise pattern
   * @returns {Promise<Object>} Refresh response with new access token
   */
  static async refreshToken() {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      console.log('🔄 [TokenManager] Token refresh already in progress - returning existing promise');
      return this.refreshPromise;
    }

    // Check if we have a valid session before attempting refresh
    if (!this.hasValidSession()) {
      console.log('❌ [TokenManager] No valid session found - skipping token refresh');
      throw new Error('No valid session found');
    }

    console.log('🔄 [TokenManager] Starting token refresh...');
    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const result = await this.refreshPromise;
      console.log('✅ [TokenManager] Token refresh successful');
      return result;
    } catch (error) {
      console.error('❌ [TokenManager] Token refresh failed:', error.message);
      throw error;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   * @private
   * @returns {Promise<Object>} Refresh response
   */
  static async performTokenRefresh() {
    try {
      const refreshResponse = await AuthService.refreshToken();
      
      if (!refreshResponse || !refreshResponse.accessToken) {
        throw new Error('Invalid refresh response - no access token received');
      }

      // Update the access token
      this.setAccessToken(refreshResponse.accessToken);
      
      // Notify all waiting callbacks
      this.notifyRefreshCallbacks(null, refreshResponse.accessToken);
      
      return refreshResponse;
    } catch (error) {
      // Clear access token on refresh failure
      this.clearAccessToken();
      
      // Notify all waiting callbacks of the error
      this.notifyRefreshCallbacks(error, null);
      
      throw error;
    }
  }

  /**
   * Check if we have a valid session for token refresh
   * @private
   * @returns {boolean} True if valid session exists
   */
  static hasValidSession() {
    // Check for refresh token cookie (HttpOnly cookie)
    const hasRefreshCookie = document.cookie.includes('refreshToken');
    
    // Check for user data in localStorage (frontend session)
    const hasUserData = localStorage.getItem('alumni_user') || localStorage.getItem('admin_user');
    
    // Check for current access token (memory session)
    const hasAccessToken = this.getAccessToken();
    
    // More lenient session validation - attempt refresh if we have ANY indication of a session:
    // 1. A refresh token cookie (backend session), OR
    // 2. User data in localStorage (frontend session), OR  
    // 3. An access token in memory (current session)
    const hasValidSession = hasRefreshCookie || hasUserData || hasAccessToken;
    
    console.log('🔍 [TokenManager] Session validation:', {
      hasRefreshCookie,
      hasUserData: !!hasUserData,
      hasAccessToken: !!hasAccessToken,
      hasValidSession,
      refreshCookieValue: hasRefreshCookie ? 'present' : 'missing',
      userDataValue: hasUserData ? 'present' : 'missing',
      accessTokenValue: hasAccessToken ? 'present' : 'missing',
      allCookies: document.cookie,
      timestamp: new Date().toISOString()
    });
    
    return hasValidSession;
  }

  /**
   * Add callback to be notified when token refresh completes
   * @param {Function} callback - Callback function to call
   */
  static addRefreshCallback(callback) {
    this.refreshCallbacks.push(callback);
  }

  /**
   * Remove callback from refresh callbacks
   * @param {Function} callback - Callback function to remove
   */
  static removeRefreshCallback(callback) {
    const index = this.refreshCallbacks.indexOf(callback);
    if (index > -1) {
      this.refreshCallbacks.splice(index, 1);
    }
  }

  /**
   * Notify all refresh callbacks
   * @private
   * @param {Error|null} error - Error if refresh failed
   * @param {string|null} token - New token if refresh succeeded
   */
  static notifyRefreshCallbacks(error, token) {
    console.log('📢 [TokenManager] Notifying refresh callbacks:', {
      callbackCount: this.refreshCallbacks.length,
      hasError: !!error,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });

    this.refreshCallbacks.forEach(callback => {
      try {
        callback(error, token);
      } catch (callbackError) {
        console.error('❌ [TokenManager] Error in refresh callback:', callbackError);
      }
    });

    // Clear callbacks after notification
    this.refreshCallbacks = [];
  }

  /**
   * Clear all state and callbacks
   */
  static clear() {
    this.refreshPromise = null;
    this.isRefreshing = false;
    this.accessToken = null;
    this.refreshCallbacks = [];
    this.clearAccessToken();
  }

  /**
   * Get debug information about current state
   * @returns {Object} Debug information
   */
  static getDebugInfo() {
    return {
      isRefreshing: this.isRefreshing,
      hasRefreshPromise: !!this.refreshPromise,
      hasAccessToken: !!this.getAccessToken(),
      hasValidSession: this.hasValidSession(),
      callbackCount: this.refreshCallbacks.length,
      refreshCookie: document.cookie.includes('refreshToken'),
      userData: !!localStorage.getItem('alumni_user'),
      adminData: !!localStorage.getItem('admin_user'),
      sessionStorageToken: !!sessionStorage.getItem('access_token'),
      memoryToken: !!this.accessToken,
      windowToken: !!window.__accessToken,
      allCookies: document.cookie,
      timestamp: new Date().toISOString()
    };
  }
}

export default TokenManager;
