import axios from "axios";
import TokenManager from "./TokenManager";

// Get API base URL from environment or use default
const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "localhost:8000/ijaa/api/v1";
const ADMIN_API_BASE =
  process.env.REACT_APP_API_ADMIN_URL ||
  "http://localhost:8000/ijaa/api/v1/admin";

// Create axios instance for authentication
const authClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Create axios instance for admin authentication
const adminAuthClient = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for HttpOnly cookies
});

// Note: We use a separate authClient for auth operations to avoid circular dependencies
// The main axiosInstance with interceptors is used for regular API calls

/**
 * Authentication Service
 * Handles login, logout, and token refresh operations
 */
class AuthService {
  /**
   * Login user with credentials
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.username - Username/email
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} Login response with access token
   */
  static async login(credentials) {
    try {
      console.log(
        "🔐 [AuthService] Starting login process for:",
        credentials.username
      );

      // Log cookies before login
      console.log("🍪 [AuthService] Cookies BEFORE login:", {
        allCookies: document.cookie,
        hasRefreshToken: document.cookie.includes("refreshToken"),
        cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
        timestamp: new Date().toISOString(),
      });

      // Use authClient for login (no token needed)
      const response = await authClient.post("/auth/login", {
        username: credentials.username,
        password: credentials.password,
      });

      const responseData = response.data;

      // Log cookies after login
      console.log("🍪 [AuthService] Cookies AFTER login:", {
        allCookies: document.cookie,
        hasRefreshToken: document.cookie.includes("refreshToken"),
        cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
        refreshTokenCookie: document.cookie
          .split(";")
          .find((c) => c.includes("refreshToken")),
        timestamp: new Date().toISOString(),
      });

      // Log response headers for Set-Cookie
      console.log("📋 [AuthService] Response headers:", {
        setCookie: response.headers["set-cookie"],
        allHeaders: Object.keys(response.headers),
        timestamp: new Date().toISOString(),
      });

      console.log("✅ [AuthService] Login successful:", {
        hasAccessToken: !!responseData.data.accessToken,
        tokenType: responseData.data.tokenType || "Bearer",
        userId: responseData.data.userId,
        username: credentials.username,
        timestamp: new Date().toISOString(),
      });

      return {
        accessToken: responseData.data.accessToken, // Backend returns 'accessToken' in data.data
        tokenType: responseData.data.tokenType || "Bearer",
        userId: responseData.data.userId,
        username: credentials.username,
      };
    } catch (error) {
      console.error("❌ [AuthService] Login failed:", {
        error: error.message,
        status: error.response?.status,
        response: error.response?.data,
        timestamp: new Date().toISOString(),
      });

      throw new Error(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  }

  /**
   * Refresh access token using HttpOnly cookie
   * @returns {Promise<string>} New access token
   */
  static async refreshToken() {
    try {
      console.log("🔄 [AuthService] Starting token refresh...", {
        hasRefreshCookie: document.cookie.includes("refreshToken"),
        currentTime: new Date().toISOString(),
        allCookies: document.cookie,
        refreshTokenCookies: document.cookie
          .split(";")
          .filter((c) => c.includes("refreshToken")),
        cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
      });

      // Use authClient for refresh (no token needed, uses HttpOnly cookie)
      const response = await authClient.post("/auth/refresh");

      const responseData = response.data;

      console.log("📊 [AuthService] Refresh response received:", {
        hasData: !!responseData,
        hasAccessToken: !!responseData?.data?.accessToken,
        tokenType: responseData?.data?.tokenType,
        userId: responseData?.data?.userId,
        timestamp: new Date().toISOString(),
      });

      // Log cookies after refresh
      console.log("🍪 [AuthService] Cookies AFTER refresh:", {
        allCookies: document.cookie,
        hasRefreshToken: document.cookie.includes("refreshToken"),
        refreshTokenCookie: document.cookie
          .split(";")
          .find((c) => c.includes("refreshToken")),
        cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
        timestamp: new Date().toISOString(),
      });

      // Validate response structure
      if (
        !responseData ||
        !responseData.data ||
        !responseData.data.accessToken
      ) {
        console.error(
          "❌ [AuthService] Invalid refresh response structure:",
          responseData
        );
        throw new Error("Invalid refresh response from server");
      }

      console.log("✅ [AuthService] Token refresh successful:", {
        newTokenLength: responseData.data.accessToken.length,
        tokenPreview: responseData.data.accessToken.substring(0, 20) + "...",
        tokenType: responseData.data.tokenType || "Bearer",
        userId: responseData.data.userId,
        timestamp: new Date().toISOString(),
      });

      return {
        accessToken: responseData.data.accessToken, // Backend returns 'accessToken' in data.data
        tokenType: responseData.data.tokenType || "Bearer",
        userId: responseData.data.userId,
      };
    } catch (error) {
      console.error("❌ [AuthService] Token refresh failed:", {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        response: error.response?.data,
        hasRefreshCookie: document.cookie.includes("refreshToken"),
        allCookies: document.cookie,
        timestamp: new Date().toISOString(),
      });

      // Provide more specific error messages
      let errorMessage = "Token refresh failed. Please login again.";

      if (error.response?.status === 401) {
        errorMessage = "Refresh token expired. Please login again.";
        console.warn(
          "⚠️ [AuthService] Refresh token expired - user needs to login again"
        );
      } else if (error.response?.status === 403) {
        errorMessage = "Refresh token invalid. Please login again.";
        console.warn(
          "⚠️ [AuthService] Refresh token invalid - user needs to login again"
        );
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Logout user and clear refresh token cookie
   * @returns {Promise<void>}
   */
  static async logout() {
    try {
      console.log("🚪 [AuthService] Starting logout process...", {
        hasRefreshCookie: document.cookie.includes("refreshToken"),
        timestamp: new Date().toISOString(),
      });

      // Get the current access token for authentication
      const accessToken = TokenManager.getAccessToken();

      if (accessToken) {
        // Include access token in the logout request
        await authClient.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(
          "✅ [AuthService] Logout successful - refresh token cleared on server"
        );
      } else {
        console.warn(
          "⚠️ [AuthService] No access token found, skipping server logout"
        );
      }
    } catch (error) {
      console.warn(
        "⚠️ [AuthService] Logout request failed, but continuing with local cleanup:",
        {
          error: error.message,
          status: error.response?.status,
          timestamp: new Date().toISOString(),
        }
      );
      // Even if logout fails on server, we should clear local state
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  static async register(userData) {
    try {
      const response = await authClient.post("/auth/register", {
        username: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }

  /**
   * Admin login with credentials
   * @param {Object} credentials - Admin login credentials
   * @param {string} credentials.username - Admin username/email
   * @param {string} credentials.password - Admin password
   * @returns {Promise<Object>} Admin login response with access token
   */
  static async adminLogin(credentials) {
    try {
      console.log(
        "👨‍💼 [AuthService] Starting admin login process for:",
        credentials.username
      );

      // Log cookies before admin login
      console.log("🍪 [AuthService] Cookies BEFORE admin login:", {
        allCookies: document.cookie,
        hasRefreshToken: document.cookie.includes("refreshToken"),
        cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
        timestamp: new Date().toISOString(),
      });

      // Use adminAuthClient for admin login (no token needed)
      const response = await adminAuthClient.post("/login", {
        email: credentials.username,
        password: credentials.password,
      });

      const responseData = response.data;

      // Log cookies after admin login
      console.log("🍪 [AuthService] Cookies AFTER admin login:", {
        allCookies: document.cookie,
        hasRefreshToken: document.cookie.includes("refreshToken"),
        cookieCount: document.cookie.split(";").filter((c) => c.trim()).length,
        refreshTokenCookie: document.cookie
          .split(";")
          .find((c) => c.includes("refreshToken")),
        timestamp: new Date().toISOString(),
      });

      // Log response headers for Set-Cookie
      console.log("📋 [AuthService] Admin login response headers:", {
        setCookie: response.headers["set-cookie"],
        allHeaders: Object.keys(response.headers),
        timestamp: new Date().toISOString(),
      });

      console.log("✅ [AuthService] Admin login successful:", {
        hasAccessToken: !!responseData.data.accessToken,
        tokenType: responseData.data.tokenType || "Bearer",
        adminId: responseData.data.adminId,
        username: credentials.username,
        timestamp: new Date().toISOString(),
      });

      return {
        accessToken: responseData.data.accessToken, // Backend returns 'accessToken' in data.data
        tokenType: responseData.data.tokenType || "Bearer",
        adminId: responseData.data.adminId,
        username: credentials.username,
        name: responseData.data.name,
        email: responseData.data.email,
        role: responseData.data.role,
        active: responseData.data.active,
      };
    } catch (error) {
      console.error("❌ [AuthService] Admin login failed:", {
        error: error.message,
        status: error.response?.status,
        response: error.response?.data,
        timestamp: new Date().toISOString(),
      });

      throw new Error(
        error.response?.data?.message ||
          "Admin login failed. Please check your credentials."
      );
    }
  }

  /**
   * Change user password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} accessToken - User's access token
   * @returns {Promise<Object>} Password change response
   */
  static async changePassword(passwordData, accessToken) {
    try {
      const response = await authClient.post(
        "/auth/change-password",
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Password change failed. Please try again."
      );
    }
  }
}

export default AuthService;
