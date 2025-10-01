import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthService from "../services/auth/AuthService";
import TokenManager from "../services/auth/TokenManager";
import SessionManager from "../services/auth/SessionManager";
import { ADMIN_ROLE } from '../utils/constants/roleConstants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Simplified state management
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Simplified authentication initialization
   */
  useEffect(() => {
    const initializeAuth = () => {
      console.log('🚀 [AuthContext] Initializing authentication...');
      setLoading(true);
      
      try {
        // Check localStorage for user data
        const userData = localStorage.getItem('alumni_user');
        const adminData = localStorage.getItem('admin_user');
        const sessionType = localStorage.getItem('session_type');
        
        console.log('🔍 [AuthContext] localStorage check:', {
          hasUserData: !!userData,
          hasAdminData: !!adminData,
          sessionType,
          timestamp: new Date().toISOString()
        });
        
        if (sessionType === 'user' && userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData && parsedUserData.email) {
              console.log('✅ [AuthContext] User session restored:', {
                email: parsedUserData.email,
                userId: parsedUserData.userId
              });
              setUser(parsedUserData);
            } else {
              console.log('❌ [AuthContext] Invalid user data, clearing session');
              SessionManager.clearUser();
            }
          } catch (error) {
            console.error('❌ [AuthContext] Error parsing user data:', error);
            SessionManager.clearUser();
          }
        } else if (sessionType === 'admin' && adminData) {
          try {
            const parsedAdminData = JSON.parse(adminData);
            if (parsedAdminData && parsedAdminData.email) {
              console.log('✅ [AuthContext] Admin session restored:', {
                email: parsedAdminData.email,
                adminId: parsedAdminData.adminId
              });
              setAdmin(parsedAdminData);
            } else {
              console.log('❌ [AuthContext] Invalid admin data, clearing session');
              SessionManager.clearAdmin();
            }
          } catch (error) {
            console.error('❌ [AuthContext] Error parsing admin data:', error);
            SessionManager.clearAdmin();
          }
        } else {
          console.log('ℹ️ [AuthContext] No valid session found');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Authentication initialization error:', error);
        // Clear any corrupted data
        SessionManager.clearAll();
      } finally {
        console.log('🏁 [AuthContext] Authentication initialization completed');
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  /**
   * User Authentication Methods
   */
  const signIn = async (email, password) => {
    try {
      console.log('🔐 [AuthContext] Starting user sign-in process:', { email });
      
      const loginResponse = await AuthService.login({
        username: email,
        password,
      });

      console.log('✅ [AuthContext] Login response received:', {
        hasAccessToken: !!loginResponse.accessToken,
        userId: loginResponse.userId,
        username: loginResponse.username
      });

      const userData = {
        email: email,
        userId: loginResponse.userId,
        username: loginResponse.username,
      };

      // Store access token and user data
      setAccessToken(loginResponse.accessToken);
      TokenManager.setAccessToken(loginResponse.accessToken);
      window.__accessToken = loginResponse.accessToken;
      
      // Store user session
      SessionManager.handleSessionConflict('user');
      SessionManager.setUser(userData);
      setUser(userData);
      setAdmin(null);
      
      console.log('🎉 [AuthContext] Sign-in completed successfully');
      return userData;
    } catch (err) {
      console.error('❌ [AuthContext] Sign-in failed:', err.message);
      throw err;
    }
  };

  const signOut = () => {
    console.log('🚪 [AuthContext] Signing out user');
    
    // Clear all authentication data
    setUser(null);
    setAdmin(null);
    setAccessToken(null);
    TokenManager.clearAccessToken();
    window.__accessToken = null;
    
    // Clear session data
    SessionManager.clearAll();
    
    console.log('✅ [AuthContext] Sign-out completed');
  };

  /**
   * Admin Authentication Methods
   */
  const adminSignIn = async (email, password) => {
    try {
      console.log('👨‍💼 [AuthContext] Starting admin sign-in process:', { email });
      
      const loginResponse = await AuthService.adminLogin({
        username: email,
        password,
      });

      const adminData = {
        email: loginResponse.email || email,
        adminId: loginResponse.adminId,
        username: loginResponse.username,
        name: loginResponse.name,
        role: loginResponse.role || ADMIN_ROLE.ADMIN,
        active: loginResponse.active,
      };

      // Store admin session
      SessionManager.handleSessionConflict('admin');
      SessionManager.setAdmin(adminData);
      setAdmin(adminData);
      setUser(null);
      
      console.log('🎉 [AuthContext] Admin sign-in completed successfully');
      return adminData;
    } catch (err) {
      console.error('❌ [AuthContext] Admin sign-in failed:', err.message);
      throw err;
    }
  };

  const adminSignOut = () => {
    console.log('🚪 [AuthContext] Signing out admin');
    
    // Clear all authentication data
    setUser(null);
    setAdmin(null);
    setAccessToken(null);
    TokenManager.clearAccessToken();
    window.__accessToken = null;
    
    // Clear session data
    SessionManager.clearAll();
    
    console.log('✅ [AuthContext] Admin sign-out completed');
  };

  /**
   * Authentication State Getters
   */
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

  const getAccessToken = () => {
    return accessToken || TokenManager.getAccessToken();
  };

  /**
   * Auto-logout handler
   */
  const handleAutoLogout = (event) => {
    console.log('🔄 [AuthContext] Auto-logout triggered:', event.detail);
    signOut();
  };

  // Listen for auto-logout events
  useEffect(() => {
    window.addEventListener('auth:logout', handleAutoLogout);
    return () => {
      window.removeEventListener('auth:logout', handleAutoLogout);
    };
  }, []);

  const value = {
    // State
    user,
    admin,
    loading,
    accessToken,
    isInitialized,
    
    // User methods
    signIn,
    signOut,
    
    // Admin methods
    adminSignIn,
    adminSignOut,
    
    // State getters
    isAuthenticated,
    isUser,
    isAdmin,
    getCurrentUser,
    getCurrentUserType,
    getAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
