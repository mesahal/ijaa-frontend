import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import sessionManager from "../utils/sessionManager";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get API base URL from environment or use default
  const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8000/ijaa/api/v1/user";

  // Handle automatic logout from token expiry
  const handleAutoLogout = (event) => {
    const { reason } = event.detail;
    
    // Clear user state
    setUser(null);
    
    // Show appropriate message
    if (reason === 'token_expired') {
      toast.info("Session expired. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Clean up old session variables
        sessionManager.cleanupOldVariables();
        
        // Check for existing user session using session manager
        const userSession = sessionManager.getUserSession();
        if (userSession && userSession.data) {
          const userData = userSession.data;
          // Validate that the user data has required fields
          if (userData && userData.token && userData.email) {
            setUser(userData);
          } else {
            // Clear invalid user data
            sessionManager.clearUser();
          }
        }
      } catch (error) {
        console.error("Error loading user session:", error);
        // Clear corrupted user data
        sessionManager.clearUser();
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    // Listen for automatic logout events
    window.addEventListener('auth:logout', handleAutoLogout);

    // Listen for storage changes (cross-tab synchronization)
    const unsubscribe = sessionManager.onStorageChange((session) => {
      if (session.type === 'user') {
        setUser(session.data);
      } else {
        setUser(null);
      }
    });

    // Cleanup event listeners
    return () => {
      window.removeEventListener('auth:logout', handleAutoLogout);
      unsubscribe();
    };
  }, []);

  // Ensure loading is false when user state is set
  useEffect(() => {
    if (user && loading) {
      setLoading(false);
    }
  }, [user, loading]);

  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed");
      }

      // Backend returns { message, code, data: { token, userId } }
      const userData = {
        email: email,
        token: data.data.token,
        userId: data.data.userId,
      };

      // Handle session conflict and set user session
      sessionManager.handleSessionConflict('user');
      sessionManager.setUser(userData);
      setUser(userData);
      
      // Ensure loading is false after successful login
      setLoading(false);
      
      return userData;
    } catch (err) {
      throw new Error(err.message || "Sign-in failed");
    }
  };

  const signUp = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes from backend
        if (
          response.status === 409 ||
          data.message?.includes("already exists")
        ) {
          throw new Error("User already exists");
        }
        throw new Error(data.message || "Registration failed");
      }

      // Backend returns { message, code, data: { token, userId } }
      const userData = {
        email: email,
        token: data.data.token,
        userId: data.data.userId,
      };

      // Handle session conflict and set user session
      sessionManager.handleSessionConflict('user');
      sessionManager.setUser(userData);
      setUser(userData);
      
      // Ensure loading is false after successful signup
      setLoading(false);
      
      return userData;
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  };

  const signOut = () => {
    setUser(null);
    sessionManager.clearUser();
    
    // Show logout message
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
