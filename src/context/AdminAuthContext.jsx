import React, { createContext, useContext, useState, useEffect } from "react";
import { ADMIN_ROLE } from "../utils/roleConstants";
import sessionManager from "../utils/sessionManager";

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get API base URL from environment or use default
  const API_BASE =
    process.env.REACT_APP_API_ADMIN_URL ||
    "http://localhost:8000/ijaa/api/v1/admin";

  useEffect(() => {
    // Check for existing admin session using session manager
    try {
      // Clean up old session variables
      sessionManager.cleanupOldVariables();
      
      const adminSession = sessionManager.getAdminSession();
      if (adminSession) {
        const adminData = adminSession.data;
        // Validate that the admin data has required fields
        if (adminData && adminData.token && adminData.email) {
          setAdmin(adminData);
        } else {
          // Clear invalid admin data
          sessionManager.clearAdmin();
        }
      }
    } catch (error) {
      console.error("Error loading admin session:", error);
      // Clear corrupted admin data
      sessionManager.clearAdmin();
    } finally {
      setLoading(false);
    }

    // Listen for storage changes (cross-tab synchronization)
    const unsubscribe = sessionManager.onStorageChange((session) => {
      if (session.type === 'admin') {
        setAdmin(session.data);
      } else {
        setAdmin(null);
      }
    });

    // Cleanup event listener
    return () => {
      unsubscribe();
    };
  }, []);

  const adminSignIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
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
      return adminData;
    } catch (err) {
      throw new Error(err.message || "Admin login failed");
    }
  };

  const adminSignOut = () => {
    setAdmin(null);
    sessionManager.clearAdmin();
  };

  const value = {
    admin,
    adminSignIn,
    adminSignOut,
    loading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
