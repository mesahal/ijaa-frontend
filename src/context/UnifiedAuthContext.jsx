import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ADMIN_ROLE } from "../utils/roleConstants";
import sessionManager from "../utils/sessionManager";

const UnifiedAuthContext = createContext();

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error("useUnifiedAuth must be used within a UnifiedAuthProvider");
  }
  return context;
};

export const UnifiedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get API base URLs from environment or use defaults
  const USER_API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/ijaa/api/v1/user";
  const ADMIN_API_BASE = process.env.REACT_APP_API_ADMIN_URL || "http://localhost:8000/ijaa/api/v1/admin";

  // Handle automatic logout from token expiry
  const handleAutoLogout = (event) => {
    const { reason } = event.detail;
    
    // Clear all auth state
    setUser(null);
    setAdmin(null);
    
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
        
        // Check for existing session using session manager
        const currentSession = sessionManager.getCurrentSession();
        
        if (currentSession.type === 'user' && currentSession.data) {
          const userData = currentSession.data;
          // Validate that the user data has required fields
          if (userData && userData.token && userData.email) {
            setUser(userData);
          } else {
            // Clear invalid user data
            sessionManager.clearUser();
          }
        } else if (currentSession.type === 'admin' && currentSession.data) {
          const adminData = currentSession.data;
          // Validate that the admin data has required fields
          if (adminData && adminData.token && adminData.email) {
            setAdmin(adminData);
          } else {
            // Clear invalid admin data
            sessionManager.clearAdmin();
          }
        }
      } catch (error) {
        console.error("Error loading session:", error);
        // Clear corrupted session data
        sessionManager.clearAll();
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
        setAdmin(null); // Clear admin when user session is set
      } else if (session.type === 'admin') {
        setAdmin(session.data);
        setUser(null); // Clear user when admin session is set
      } else {
        setUser(null);
        setAdmin(null);
      }
    });

    // Cleanup event listeners
    return () => {
      window.removeEventListener('auth:logout', handleAutoLogout);
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Ensure loading is false when auth state is set
  useEffect(() => {
    if ((user || admin) && loading) {
      setLoading(false);
    }
  }, [user, admin, loading]);

  // User authentication methods
  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${USER_API_BASE}/signin`, {
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
      setAdmin(null); // Clear admin session
      
      // Ensure loading is false after successful login
      setLoading(false);
      
      return userData;
    } catch (err) {
      throw new Error(err.message || "Sign-in failed");
    }
  };

  const signUp = async ({ email, password }) => {
    try {
      const response = await fetch(`${USER_API_BASE}/signup`, {
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
      setAdmin(null); // Clear admin session
      
      // Ensure loading is false after successful signup
      setLoading(false);
      
      return userData;
    } catch (err) {
      throw new Error(err.message || "Registration failed");
    }
  };

  const signOut = () => {
    setUser(null);
    setAdmin(null);
    sessionManager.clearAll();
    
    // Show logout message
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  // Admin authentication methods
  const adminSignIn = async (email, password) => {
    try {
      const response = await fetch(`${ADMIN_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      // Backend returns { message, code, data: { token, adminId, name, email, role, active } }
      const adminData = {
        email: data.data.email,
        name: data.data.name,
        token: data.data.token,
        adminId: data.data.adminId,
        role: data.data.role || ADMIN_ROLE, // Use role directly from backend
        active: data.data.active,
      };

      // Validate required fields
      if (!adminData.token || !adminData.email) {
        throw new Error("Invalid admin data received from server");
      }

      // Validate role - ensure it's ADMIN
      if (adminData.role !== ADMIN_ROLE) {
        throw new Error("Invalid admin role. Only ADMIN role is supported.");
      }

      // Handle session conflict and set admin session
      sessionManager.handleSessionConflict('admin');
      sessionManager.setAdmin(adminData);
      setAdmin(adminData);
      setUser(null); // Clear user session
      
      return adminData;
    } catch (err) {
      throw new Error(err.message || "Admin login failed");
    }
  };

  const adminSignOut = () => {
    setUser(null);
    setAdmin(null);
    sessionManager.clearAll();
  };

  // Helper methods
  const isAuthenticated = () => {
    return !!(user || admin);
  };

  const isUser = () => {
    return !!user;
  };

  const isAdmin = () => {
    return !!admin;
  };

  const getCurrentUser = () => {
    return user || admin;
  };

  const getCurrentUserType = () => {
    if (user) return 'user';
    if (admin) return 'admin';
    return null;
  };

  const value = {
    // State
    user,
    admin,
    loading,
    
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
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};
