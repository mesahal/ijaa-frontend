import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { toast } from "react-toastify";
import AuthService from "../services/auth/AuthService";
import TokenManager from "../services/auth/TokenManager";
import SessionManager from "../services/auth/SessionManager";
import { ADMIN_ROLE } from "../utils/constants/roleConstants";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs for stable values in intervals and callbacks
  const accessTokenRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const userRef = useRef(null);
  const adminRef = useRef(null);

  // Update refs when state changes
  useEffect(() => {
    accessTokenRef.current = accessToken;
    TokenManager.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    adminRef.current = admin;
  }, [admin]);

  /**
   * Handle automatic logout from token expiry
   */
  const handleAutoLogout = (event) => {
    const { reason } = event.detail;

    console.log("🚪 [AuthContext] Handling auto logout:", { reason });

    // Clear all auth state
    setUser(null);
    setAdmin(null);
    setAccessToken(null);
    TokenManager.clearAccessToken();
    SessionManager.clearAll();
    // No local refresh token to clear; rely on HttpOnly cookie

    // Show appropriate message
    if (reason === "token_expired") {
      toast.info("Session expired. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  /**
   * Proactive token refresh using TokenManager
   */
  const checkAndRefreshToken = async () => {
    const currentToken = accessTokenRef.current;
    const currentUser = userRef.current;

    console.log("🔍 [AuthContext] Periodic token check:", {
      hasToken: !!currentToken,
      hasUser: !!currentUser,
      hasRefreshCookie: document.cookie.includes("refreshToken"),
      timestamp: new Date().toISOString(),
    });

    // Skip if already refreshing
    if (TokenManager.isTokenRefreshInProgress()) {
      console.log(
        "⏳ [AuthContext] Token refresh already in progress - skipping check"
      );
      return;
    }

    // Only attempt refresh if we have a user session
    if (!currentUser) {
      console.log("❌ [AuthContext] No user session - skipping check");
      return;
    }

    let shouldRefresh = false;

    if (currentToken) {
      try {
        const tokenParts = currentToken.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          const timeUntilExpiry = payload.exp - now;

          console.log("🔍 [AuthContext] Token expiry analysis:", {
            timeUntilExpiry: timeUntilExpiry + " seconds",
            isExpired: timeUntilExpiry <= 0,
            expiresAt: new Date(payload.exp * 1000).toISOString(),
            currentTime: new Date().toISOString(),
          });

          // Refresh if token expires in less than 5 minutes (300 seconds)
          if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
            shouldRefresh = true;
            console.log("⏰ [AuthContext] Token expires soon - will refresh");
          } else if (timeUntilExpiry <= 0) {
            console.log(
              "⚠️ [AuthContext] Token already expired - will refresh"
            );
            shouldRefresh = true;
          }
        }
      } catch (error) {
        console.warn(
          "⚠️ [AuthContext] Could not parse token for expiry check:",
          error.message
        );
        shouldRefresh = true;
      }
    } else {
      console.log("❌ [AuthContext] No current token - will refresh");
      shouldRefresh = true;
    }

    if (shouldRefresh) {
      try {
        console.log("🔄 [AuthContext] Starting proactive token refresh...");
        setIsRefreshing(true);

        const refreshResponse = await TokenManager.refreshToken();
        const newAccessToken = refreshResponse.accessToken;

        console.log("✅ [AuthContext] Proactive refresh successful:", {
          newTokenLength: newAccessToken.length,
          tokenPreview: newAccessToken.substring(0, 20) + "...",
          timestamp: new Date().toISOString(),
        });

        setAccessToken(newAccessToken);

        return newAccessToken;
      } catch (error) {
        console.error("❌ [AuthContext] Proactive refresh failed:", {
          error: error.message,
          timestamp: new Date().toISOString(),
        });

        // If refresh fails, trigger logout
        setUser(null);
        setAdmin(null);
        setAccessToken(null);
        TokenManager.clearAccessToken();
        SessionManager.clearAll();

        // Dispatch logout event
        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: { reason: "token_expired" },
          })
        );

        throw error;
      } finally {
        setIsRefreshing(false);
      }
    } else {
      console.log("✅ [AuthContext] Token is still valid - no refresh needed");
    }
  };

  /**
   * Initialize authentication state
   */
  useEffect(() => {
    if (isInitialized) return; // Prevent multiple initializations

    const initializeSession = async () => {
      try {
        console.log("🚀 [AuthContext] Initializing session...");
        setLoading(true);

        // Clean up old session variables
        SessionManager.cleanupOldVariables();

        // Check for existing session using session manager
        const currentSession = SessionManager.getCurrentSession();

        console.log("🔍 [AuthContext] Current session check:", {
          sessionType: currentSession.type,
          hasData: !!currentSession.data,
          hasRefreshCookie: document.cookie.includes("refreshToken"),
          localStorageUser: localStorage.getItem("alumni_user"),
          localStorageAdmin: localStorage.getItem("admin_user"),
          sessionType: localStorage.getItem("session_type"),
          allCookies: document.cookie,
          timestamp: new Date().toISOString(),
        });

        // Debug: Check if we have user data but session type is wrong
        const rawUserData = localStorage.getItem("alumni_user");
        const rawSessionType = localStorage.getItem("session_type");
        console.log("🔍 [AuthContext] Raw localStorage check:", {
          rawUserData: rawUserData ? JSON.parse(rawUserData) : null,
          rawSessionType,
          hasUserData: !!rawUserData,
          hasSessionType: !!rawSessionType,
        });

        if (currentSession.type === "user" && currentSession.data) {
          const userData = currentSession.data;

          if (userData && userData.email) {
            console.log("👤 [AuthContext] User session found:", {
              email: userData.email,
              userId: userData.userId,
              timestamp: new Date().toISOString(),
            });

            setUser(userData);

            // Set user data without trying to refresh token during initialization
            // Token refresh will be handled by axios interceptor when needed
            console.log(
              "ℹ️ [AuthContext] User session restored, token refresh will happen on API calls"
            );
          } else {
            console.log(
              "❌ [AuthContext] Invalid user data - clearing session"
            );
            SessionManager.clearUser();
            setUser(null);
            setAccessToken(null);
            window.__accessToken = null;
          }
        } else if (currentSession.type === "admin" && currentSession.data) {
          const adminData = currentSession.data;
          if (adminData && adminData.email) {
            console.log("👨‍💼 [AuthContext] Admin session found:", {
              email: adminData.email,
              adminId: adminData.adminId,
              role: adminData.role,
              timestamp: new Date().toISOString(),
            });
            setAdmin(adminData);
          } else {
            console.log(
              "❌ [AuthContext] Invalid admin data - clearing session"
            );
            SessionManager.clearAdmin();
          }
        } else {
          console.log("ℹ️ [AuthContext] No existing session found");

          // Fallback: Check if there's user data in localStorage but no session type
          const rawUserData = localStorage.getItem("alumni_user");
          if (rawUserData) {
            try {
              const userData = JSON.parse(rawUserData);
              if (userData && userData.email) {
                console.log(
                  "🔄 [AuthContext] Fallback: Found user data without session type, restoring session"
                );
                SessionManager.setSessionType("user");
                setUser(userData);
                console.log(
                  "✅ [AuthContext] Fallback session restoration successful"
                );
              }
            } catch (error) {
              console.error(
                "❌ [AuthContext] Fallback: Error parsing user data:",
                error
              );
            }
          }
        }
      } catch (error) {
        console.error("❌ [AuthContext] Session initialization error:", error);
        SessionManager.clearAll();
      } finally {
        console.log("🏁 [AuthContext] Session initialization completed");
        console.log("🔍 [AuthContext] Final state after initialization:", {
          user: user,
          admin: admin,
          loading: false,
          isInitialized: true,
          timestamp: new Date().toISOString(),
        });
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeSession();

    // Listen for automatic logout events
    window.addEventListener("auth:logout", handleAutoLogout);

    // Listen for visibility changes to check token when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden && (userRef.current || adminRef.current)) {
        console.log(
          "👁️ [AuthContext] Tab became visible - checking token status"
        );
        checkAndRefreshToken().catch((error) => {
          console.error(
            "❌ [AuthContext] Visibility change token check failed:",
            error
          );
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for focus events to check token when window regains focus
    const handleFocus = () => {
      if (userRef.current || adminRef.current) {
        console.log("🎯 [AuthContext] Window focused - checking token status");
        checkAndRefreshToken().catch((error) => {
          console.error("❌ [AuthContext] Focus token check failed:", error);
        });
      }
    };

    window.addEventListener("focus", handleFocus);

    // Set up periodic token check (every 30 seconds)
    const tokenCheckInterval = setInterval(() => {
      checkAndRefreshToken().catch((error) => {
        console.error("❌ [AuthContext] Periodic token check failed:", error);
      });
    }, 30000);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("auth:logout", handleAutoLogout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      clearInterval(tokenCheckInterval);
    };
  }, [isInitialized]);

  // Ensure loading is false when auth state is set
  useEffect(() => {
    if ((user || admin) && loading) {
      setLoading(false);
    }
  }, [user, admin, loading]);

  /**
   * User Authentication Methods
   */
  const signIn = async (email, password) => {
    try {
      console.log("🔐 [AuthContext] Starting user sign-in process:", {
        email,
        timestamp: new Date().toISOString(),
      });

      const loginResponse = await AuthService.login({
        username: email,
        password,
      });

      console.log("✅ [AuthContext] Login response received:", {
        hasAccessToken: !!loginResponse.accessToken,
        userId: loginResponse.userId,
        username: loginResponse.username,
        timestamp: new Date().toISOString(),
      });

      const userData = {
        email: email,
        userId: loginResponse.userId,
        username: loginResponse.username,
      };

      console.log("💾 [AuthContext] Storing user data and token:", {
        userData,
        tokenLength: loginResponse.accessToken?.length,
        tokenPreview: loginResponse.accessToken?.substring(0, 20) + "...",
        timestamp: new Date().toISOString(),
      });

      // Store access token and user data
      setAccessToken(loginResponse.accessToken);
      TokenManager.setAccessToken(loginResponse.accessToken);

      SessionManager.handleSessionConflict("user");
      SessionManager.setUser(userData);
      setUser(userData);
      setAdmin(null);

      setLoading(false);
      setIsInitialized(true);

      console.log("🎉 [AuthContext] Sign-in completed successfully");
      return userData;
    } catch (err) {
      console.error("❌ [AuthContext] Sign-in failed:", {
        error: err.message,
        timestamp: new Date().toISOString(),
      });

      setUser(null);
      setAccessToken(null);
      TokenManager.clearAccessToken();
      SessionManager.clearUser();
      throw new Error(err.message || "Sign-in failed");
    }
  };

  const signUp = async ({ email, password, firstName, lastName }) => {
    try {
      const registerResponse = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
      });

      return registerResponse;
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  };

  const signOut = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.warn(
        "⚠️ [AuthContext] Logout request failed, but continuing with local cleanup"
      );
    } finally {
      setUser(null);
      setAdmin(null);
      setAccessToken(null);
      TokenManager.clearAccessToken();
      SessionManager.clearAll();

      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  /**
   * Admin Authentication Methods
   */
  const adminSignIn = async (email, password) => {
    try {
      console.log("🔐 [AuthContext] Starting admin sign-in process:", {
        email,
        timestamp: new Date().toISOString(),
      });

      const adminData = await AuthService.adminLogin({
        email,
        password,
      });

      if (!adminData.email) {
        throw new Error("Invalid admin data received from server");
      }

      if (adminData.role !== ADMIN_ROLE) {
        throw new Error("Invalid admin role. Only ADMIN role is supported.");
      }

      SessionManager.handleSessionConflict("admin");
      SessionManager.setAdmin(adminData);
      setAdmin(adminData);
      setUser(null);

      console.log("🎉 [AuthContext] Admin sign-in completed successfully");
      return adminData;
    } catch (err) {
      console.error("❌ [AuthContext] Admin sign-in failed:", {
        error: err.message,
        timestamp: new Date().toISOString(),
      });
      throw new Error(err.message || "Admin login failed");
    }
  };

  const adminSignOut = () => {
    setUser(null);
    setAdmin(null);
    SessionManager.clearAll();
  };

  /**
   * Helper Methods
   */
  const isAuthenticated = () => {
    return !!(user || admin);
  };

  const isUser = () => {
    const result = !!user;
    console.log("🔍 [AuthContext] isUser() called:", {
      user: user,
      result: result,
      timestamp: new Date().toISOString(),
      callCount: Date.now(),
    });
    return result;
  };

  const isAdmin = () => {
    return !!admin;
  };

  const getCurrentUser = () => {
    return user || admin;
  };

  const getCurrentUserType = () => {
    if (user) return "user";
    if (admin) return "admin";
    return null;
  };

  const getAccessToken = () => {
    return accessToken || TokenManager.getAccessToken();
  };

  const testTokenRefresh = async () => {
    try {
      const refreshResponse = await AuthService.refreshToken();
      return refreshResponse;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    // State
    user,
    admin,
    loading,
    accessToken,
    isRefreshing,

    // User methods
    signIn,
    signUp,
    signOut,

    // Admin methods
    adminSignIn,
    adminSignOut,

    // Helper methods
    isAuthenticated,
    isUser,
    isAdmin,
    getCurrentUser,
    getCurrentUserType,
    getAccessToken,

    // Debug methods
    testTokenRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
