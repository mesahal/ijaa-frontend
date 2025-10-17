import axios from "axios";
import TokenManager from "../../services/auth/TokenManager";

// Get API base URL from environment or use default
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "localhost:8000/ijaa/api/v1";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Queue for failed requests during token refresh
let failedQueue = [];

// Process failed requests queue
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from TokenManager
    const accessToken = TokenManager.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;

      console.log("📤 [AxiosInterceptor] Request with token:", {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: true,
        tokenPreview: accessToken.substring(0, 20) + "...",
        timestamp: new Date().toISOString(),
      });

      // Check if token is about to expire and warn
      try {
        const tokenParts = accessToken.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = payload.exp - now;

          if (timeUntilExpiry < 60) {
            console.warn(
              "⚠️ [AxiosInterceptor] Token expires in less than 1 minute:",
              {
                timeUntilExpiry: timeUntilExpiry + " seconds",
                expiresAt: new Date(payload.exp * 1000).toISOString(),
                currentTime: new Date().toISOString(),
              }
            );
          } else if (timeUntilExpiry < 300) {
            console.log("⏰ [AxiosInterceptor] Token expires soon:", {
              timeUntilExpiry: timeUntilExpiry + " seconds",
              expiresAt: new Date(payload.exp * 1000).toISOString(),
            });
          }
        }
      } catch (error) {
        console.warn(
          "⚠️ [AxiosInterceptor] Could not parse token for expiry check:",
          error.message
        );
      }
    } else {
      console.log("📤 [AxiosInterceptor] Request without token:", {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: false,
        timestamp: new Date().toISOString(),
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ [AxiosInterceptor] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("📥 [AxiosInterceptor] Response received:", {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    console.log("📥 [AxiosInterceptor] Response error:", {
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
        "🔐 [AxiosInterceptor] 401 error detected - attempting token refresh..."
      );

      // Mark request as retry to prevent infinite loops
      originalRequest._retry = true;

      try {
        // Use TokenManager for single refresh promise pattern
        const refreshResponse = await TokenManager.refreshToken();
        const newAccessToken = refreshResponse.accessToken;

        console.log("✅ [AxiosInterceptor] Token refresh successful:", {
          newTokenLength: newAccessToken.length,
          tokenPreview: newAccessToken.substring(0, 20) + "...",
          timestamp: new Date().toISOString(),
        });

        // Update request headers with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request with new token
        console.log(
          "🔄 [AxiosInterceptor] Retrying original request with new token"
        );
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ [AxiosInterceptor] Token refresh failed:", {
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

        console.log("🚪 [AxiosInterceptor] Handling refresh failure:", {
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

          console.log("🔄 [AxiosInterceptor] Redirecting to login page");
          window.location.href = "/signin";
        } else {
          console.log(
            "ℹ️ [AxiosInterceptor] Already on login page - not redirecting"
          );
        }

        return Promise.reject(refreshError);
      }
    }

    console.log("📥 [AxiosInterceptor] Non-401 error - passing through:", {
      status: error.response?.status,
      timestamp: new Date().toISOString(),
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
