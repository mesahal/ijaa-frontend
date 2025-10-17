import axios from "axios";
import TokenManager from "../auth/TokenManager";

// Get API base URL from environment or use default
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "localhost:8000/ijaa/api/v1";

/**
 * Centralized API Client
 * Handles all API requests with automatic token management
 * Implements request/response interceptors for authentication
 */
class ApiClient {
  constructor() {
    this.client = this.createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Create Axios Instance
   * @returns {Object} Configured axios instance
   */
  createAxiosInstance() {
    return axios.create({
      baseURL: API_BASE,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Important for HttpOnly cookies
    });
  }

  /**
   * Setup Request and Response Interceptors
   */
  setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const accessToken = TokenManager.getAccessToken();

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;

          console.log("📤 [ApiClient] Request with token:", {
            url: config.url,
            method: config.method?.toUpperCase(),
            hasToken: true,
            tokenPreview: accessToken.substring(0, 20) + "...",
            timestamp: new Date().toISOString(),
          });

          // Check if token is about to expire and warn
          this.checkTokenExpiry(accessToken);
        } else {
          console.log("📤 [ApiClient] Request without token:", {
            url: config.url,
            method: config.method?.toUpperCase(),
            hasToken: false,
            timestamp: new Date().toISOString(),
          });
        }

        return config;
      },
      (error) => {
        console.error("❌ [ApiClient] Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => {
        console.log("📥 [ApiClient] Response received:", {
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          status: response.status,
          timestamp: new Date().toISOString(),
        });
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        console.log("📥 [ApiClient] Response error:", {
          url: originalRequest?.url,
          method: originalRequest?.method?.toUpperCase(),
          status: error.response?.status,
          statusText: error.response?.statusText,
          isRetry: originalRequest?._retry,
          timestamp: new Date().toISOString(),
        });

        // Check if error is due to expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log(
            "🔐 [ApiClient] 401 error detected - attempting token refresh..."
          );

          // Mark request as retry to prevent infinite loops
          originalRequest._retry = true;

          try {
            // Use TokenManager for single refresh promise pattern
            const refreshResponse = await TokenManager.refreshToken();
            const newAccessToken = refreshResponse.accessToken;

            console.log("✅ [ApiClient] Token refresh successful:", {
              newTokenLength: newAccessToken.length,
              tokenPreview: newAccessToken.substring(0, 20) + "...",
              timestamp: new Date().toISOString(),
            });

            // Update request headers with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry original request with new token
            console.log(
              "🔄 [ApiClient] Retrying original request with new token"
            );
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error("❌ [ApiClient] Token refresh failed:", {
              error: refreshError.message,
              status: refreshError.response?.status,
              response: refreshError.response?.data,
              timestamp: new Date().toISOString(),
            });

            // Clear access token on refresh failure
            TokenManager.clearAccessToken();

            // Only redirect to login if not already on login page
            const currentPath = window.location.pathname;
            const isOnLoginPage =
              currentPath.includes("/login") || currentPath.includes("/signin");

            console.log("🚪 [ApiClient] Handling refresh failure:", {
              currentPath,
              isOnLoginPage,
              willRedirect: !isOnLoginPage,
              timestamp: new Date().toISOString(),
            });

            if (!isOnLoginPage) {
              // Dispatch logout event for auth context to handle
              window.dispatchEvent(
                new CustomEvent("auth:logout", {
                  detail: { reason: "token_expired" },
                })
              );

              console.log("🔄 [ApiClient] Redirecting to login page");
              window.location.href = "/signin";
            } else {
              console.log(
                "ℹ️ [ApiClient] Already on login page - not redirecting"
              );
            }

            return Promise.reject(refreshError);
          }
        }

        console.log("📥 [ApiClient] Non-401 error - passing through:", {
          status: error.response?.status,
          timestamp: new Date().toISOString(),
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Check Token Expiry and Log Warnings
   * @param {string} token - JWT token to check
   */
  checkTokenExpiry(token) {
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;

        if (timeUntilExpiry < 60) {
          console.warn("⚠️ [ApiClient] Token expires in less than 1 minute:", {
            timeUntilExpiry: timeUntilExpiry + " seconds",
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            currentTime: new Date().toISOString(),
          });
        } else if (timeUntilExpiry < 300) {
          console.log("⏰ [ApiClient] Token expires soon:", {
            timeUntilExpiry: timeUntilExpiry + " seconds",
            expiresAt: new Date(payload.exp * 1000).toISOString(),
          });
        }
      }
    } catch (error) {
      console.warn(
        "⚠️ [ApiClient] Could not parse token for expiry check:",
        error.message
      );
    }
  }

  /**
   * Get Request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config
   * @returns {Promise} Axios response
   */
  get(url, config = {}) {
    return this.client.get(url, config);
  }

  /**
   * Post Request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} Axios response
   */
  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /**
   * Put Request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} Axios response
   */
  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  /**
   * Patch Request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Axios config
   * @returns {Promise} Axios response
   */
  patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  /**
   * Delete Request
   * @param {string} url - Request URL
   * @param {Object} config - Axios config
   * @returns {Promise} Axios response
   */
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  /**
   * Upload File Request
   * @param {string} url - Request URL
   * @param {FormData} formData - Form data with file
   * @param {Object} config - Axios config
   * @returns {Promise} Axios response
   */
  upload(url, formData, config = {}) {
    return this.client.post(url, formData, {
      ...config,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config.headers,
      },
    });
  }

  /**
   * Get Debug Information
   * @returns {Object} Debug information about API client
   */
  getDebugInfo() {
    return {
      baseURL: this.client.defaults.baseURL,
      timeout: this.client.defaults.timeout,
      withCredentials: this.client.defaults.withCredentials,
      tokenInfo: TokenManager.getDebugInfo(),
      timestamp: new Date().toISOString(),
    };
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
