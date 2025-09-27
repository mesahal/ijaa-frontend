/**
 * Token Debug Utilities
 * Comprehensive debugging tools for token expiry and refresh functionality
 */

import AuthService from '../services/AuthService';

/**
 * Token Debug Utility Class
 * Provides comprehensive debugging tools for token management
 */
class TokenDebugUtils {
  constructor() {
    this.logPrefix = '🐛 [TokenDebug]';
    this.isEnabled = process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEBUG === 'true';
  }

  /**
   * Log a debug message with timestamp and context
   */
  log(message, data = null) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `${this.logPrefix} ${message}`;
    
    if (data) {
      console.log(logMessage, { ...data, timestamp });
    } else {
      console.log(logMessage, { timestamp });
    }
  }

  /**
   * Log an error message with timestamp and context
   */
  error(message, error = null) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `${this.logPrefix} ❌ ${message}`;
    
    if (error) {
      console.error(logMessage, { error: error.message, stack: error.stack, timestamp });
    } else {
      console.error(logMessage, { timestamp });
    }
  }

  /**
   * Log a warning message with timestamp and context
   */
  warn(message, data = null) {
    if (!this.isEnabled) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = `${this.logPrefix} ⚠️ ${message}`;
    
    if (data) {
      console.warn(logMessage, { ...data, timestamp });
    } else {
      console.warn(logMessage, { timestamp });
    }
  }

  /**
   * Get comprehensive token information
   */
  getTokenInfo() {
    const token = window.__accessToken;
    
    if (!token) {
      this.log('No access token found');
      return {
        hasToken: false,
        token: null,
        isExpired: true,
        timeUntilExpiry: 0,
        expiresAt: null,
        payload: null,
        header: null
      };
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.error('Invalid token format - not a JWT');
        return {
          hasToken: true,
          token: token.substring(0, 20) + '...',
          isExpired: true,
          timeUntilExpiry: 0,
          expiresAt: null,
          payload: null,
          header: null,
          error: 'Invalid JWT format'
        };
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - now;
      const isExpired = timeUntilExpiry <= 0;

      const tokenInfo = {
        hasToken: true,
        token: token.substring(0, 20) + '...',
        tokenLength: token.length,
        isExpired,
        timeUntilExpiry,
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        currentTime: new Date().toISOString(),
        expiresInMinutes: Math.floor(timeUntilExpiry / 60),
        payload: {
          ...payload,
          exp: new Date(payload.exp * 1000).toISOString(),
          iat: new Date(payload.iat * 1000).toISOString()
        },
        header
      };

      this.log('Token information retrieved', tokenInfo);
      return tokenInfo;
    } catch (error) {
      this.error('Error parsing token', error);
      return {
        hasToken: true,
        token: token.substring(0, 20) + '...',
        isExpired: true,
        timeUntilExpiry: 0,
        expiresAt: null,
        payload: null,
        header: null,
        error: error.message
      };
    }
  }

  /**
   * Get refresh status information
   */
  getRefreshStatus() {
    const status = {
      hasToken: !!window.__accessToken,
      isRefreshing: window.__isRefreshing || false,
      hasUser: !!localStorage.getItem('alumni_user'),
      hasAdmin: !!localStorage.getItem('admin_user'),
      hasRefreshCookie: document.cookie.includes('refreshToken'),
      currentTime: new Date().toISOString(),
      cookies: document.cookie.split(';').filter(c => c.trim()),
      userAgent: navigator.userAgent,
      currentUrl: window.location.href
    };

    this.log('Refresh status retrieved', status);
    return status;
  }

  /**
   * Test token refresh functionality
   */
  async testTokenRefresh() {
    this.log('Starting token refresh test...');
    
    try {
      const beforeStatus = this.getRefreshStatus();
      this.log('Status before refresh', beforeStatus);

      const refreshResponse = await AuthService.refreshToken();
      
      const afterStatus = this.getRefreshStatus();
      this.log('Status after refresh', afterStatus);

      this.log('Token refresh test successful', {
        beforeToken: beforeStatus.hasToken,
        afterToken: afterStatus.hasToken,
        refreshResponse: {
          hasAccessToken: !!refreshResponse.accessToken,
          tokenType: refreshResponse.tokenType,
          userId: refreshResponse.userId
        }
      });

      return {
        success: true,
        beforeStatus,
        afterStatus,
        refreshResponse
      };
    } catch (error) {
      this.error('Token refresh test failed', error);
      return {
        success: false,
        error: error.message,
        status: this.getRefreshStatus()
      };
    }
  }

  /**
   * Simulate token expiry by clearing the token
   */
  simulateTokenExpiry() {
    this.log('Simulating token expiry...');
    
    const beforeToken = window.__accessToken;
    window.__accessToken = null;
    
    this.log('Token cleared for simulation', {
      hadToken: !!beforeToken,
      tokenPreview: beforeToken ? beforeToken.substring(0, 20) + '...' : null
    });

    return {
      success: true,
      message: 'Token cleared - next API call should trigger refresh',
      hadToken: !!beforeToken
    };
  }

  /**
   * Test API call to trigger token refresh
   */
  async testApiCall(endpoint = '/profile') {
    this.log(`Testing API call to ${endpoint}...`);
    
    try {
      // Import axiosInstance dynamically to avoid circular imports
      const { default: axiosInstance } = await import('./axiosInstance');
      
      const beforeStatus = this.getRefreshStatus();
      this.log('Status before API call', beforeStatus);

      const response = await axiosInstance.get(endpoint);
      
      const afterStatus = this.getRefreshStatus();
      this.log('Status after API call', afterStatus);

      this.log('API call test successful', {
        status: response.status,
        beforeToken: beforeStatus.hasToken,
        afterToken: afterStatus.hasToken,
        dataReceived: !!response.data
      });

      return {
        success: true,
        response: {
          status: response.status,
          data: response.data
        },
        beforeStatus,
        afterStatus
      };
    } catch (error) {
      this.error('API call test failed', error);
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText
      };
    }
  }

  /**
   * Monitor token expiry in real-time
   */
  startTokenMonitoring(intervalMs = 5000) {
    if (this.monitoringInterval) {
      this.warn('Token monitoring already active');
      return;
    }

    this.log(`Starting token monitoring (every ${intervalMs}ms)...`);
    
    this.monitoringInterval = setInterval(() => {
      const tokenInfo = this.getTokenInfo();
      
      if (tokenInfo.hasToken) {
        if (tokenInfo.isExpired) {
          this.warn('Token has expired!', {
            expiredAt: tokenInfo.expiresAt,
            timeSinceExpiry: Math.abs(tokenInfo.timeUntilExpiry)
          });
        } else if (tokenInfo.timeUntilExpiry < 60) {
          this.warn('Token expires in less than 1 minute!', {
            timeUntilExpiry: tokenInfo.timeUntilExpiry,
            expiresAt: tokenInfo.expiresAt
          });
        } else if (tokenInfo.timeUntilExpiry < 300) {
          this.log('Token expires soon', {
            timeUntilExpiry: tokenInfo.timeUntilExpiry,
            expiresAt: tokenInfo.expiresAt
          });
        } else {
          this.log('Token is valid', {
            timeUntilExpiry: tokenInfo.timeUntilExpiry,
            expiresAt: tokenInfo.expiresAt
          });
        }
      } else {
        this.log('No token found');
      }
    }, intervalMs);

    return this.monitoringInterval;
  }

  /**
   * Stop token monitoring
   */
  stopTokenMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      this.log('Token monitoring stopped');
    } else {
      this.warn('No active token monitoring to stop');
    }
  }

  /**
   * Run comprehensive token diagnostics
   */
  async runDiagnostics() {
    this.log('Running comprehensive token diagnostics...');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      tokenInfo: this.getTokenInfo(),
      refreshStatus: this.getRefreshStatus(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        debugMode: process.env.REACT_APP_DEBUG,
        apiBaseUrl: process.env.REACT_APP_API_BASE_URL
      }
    };

    // Test token refresh if we have a refresh cookie
    if (diagnostics.refreshStatus.hasRefreshCookie) {
      this.log('Testing token refresh as part of diagnostics...');
      try {
        const refreshTest = await this.testTokenRefresh();
        diagnostics.refreshTest = refreshTest;
      } catch (error) {
        diagnostics.refreshTest = { success: false, error: error.message };
      }
    } else {
      this.log('No refresh cookie found - skipping refresh test');
      diagnostics.refreshTest = { skipped: true, reason: 'No refresh cookie' };
    }

    this.log('Diagnostics completed', diagnostics);
    return diagnostics;
  }

  /**
   * Create a test scenario for token refresh
   */
  async createTestScenario() {
    this.log('Creating token refresh test scenario...');
    
    const scenario = {
      name: 'Token Refresh Test Scenario',
      steps: [],
      results: []
    };

    // Step 1: Check initial status
    scenario.steps.push('Check initial token status');
    const initialStatus = this.getRefreshStatus();
    scenario.results.push({ step: 1, status: initialStatus });

    // Step 2: Get token info
    scenario.steps.push('Get current token information');
    const tokenInfo = this.getTokenInfo();
    scenario.results.push({ step: 2, tokenInfo });

    // Step 3: Simulate token expiry if we have a token
    if (tokenInfo.hasToken) {
      scenario.steps.push('Simulate token expiry');
      const expiryResult = this.simulateTokenExpiry();
      scenario.results.push({ step: 3, expiryResult });
    }

    // Step 4: Test API call (should trigger refresh)
    scenario.steps.push('Test API call to trigger refresh');
    const apiTest = await this.testApiCall();
    scenario.results.push({ step: 4, apiTest });

    // Step 5: Check final status
    scenario.steps.push('Check final status after test');
    const finalStatus = this.getRefreshStatus();
    scenario.results.push({ step: 5, status: finalStatus });

    this.log('Test scenario completed', scenario);
    return scenario;
  }
}

// Create singleton instance
const tokenDebugUtils = new TokenDebugUtils();

// Export both the class and the instance
export { TokenDebugUtils };
export default tokenDebugUtils;

// Add to window for easy access in development
if (process.env.NODE_ENV === 'development') {
  window.tokenDebug = tokenDebugUtils;
  console.log('🐛 Token debug utilities available at window.tokenDebug');
}

