import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthService from "../services/auth/AuthService";
import TokenManager from "../services/auth/TokenManager";
import SessionManager from "../services/auth/SessionManager";
import apiClient from "../services/api/apiClient";
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
    const initializeAuth = async () => {
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
              console.log('✅ [AuthContext] User session found, checking for refresh token...');
              
              // Check if we have a refresh token cookie
              const hasRefreshCookie = document.cookie.includes('refreshToken');
              console.log('🍪 [AuthContext] Refresh token cookie check:', {
                hasRefreshCookie,
                allCookies: document.cookie,
                timestamp: new Date().toISOString()
              });
              
              if (hasRefreshCookie) {
                console.log('🔄 [AuthContext] Refresh token found, checking if token refresh is needed...');
                
                // Check if we have a valid access token in memory first
                const existingToken = TokenManager.getAccessToken();
                let needsRefresh = true;
                
                if (existingToken) {
                  try {
                    // Check if token is still valid (not expired)
                    const tokenParts = existingToken.split('.');
                    if (tokenParts.length === 3) {
                      const payload = JSON.parse(atob(tokenParts[1]));
                      const now = Math.floor(Date.now() / 1000);
                      const timeUntilExpiry = payload.exp - now;
                      
                      // Token is valid if it expires in more than 5 minutes
                      if (timeUntilExpiry > 300) {
                        console.log('✅ [AuthContext] Existing access token is still valid, using it');
                        setAccessToken(existingToken);
                        setUser(parsedUserData);
                        needsRefresh = false;
                      } else {
                        console.log('⏰ [AuthContext] Access token expires soon, refreshing...');
                      }
                    }
                  } catch (error) {
                    console.warn('⚠️ [AuthContext] Could not parse existing token, will refresh:', error.message);
                  }
                }
                
                // Only refresh if needed
                if (needsRefresh) {
                  try {
                    const refreshResponse = await AuthService.refreshToken();
                    if (refreshResponse && refreshResponse.accessToken) {
                      console.log('✅ [AuthContext] Token refresh successful, restoring user session');
                      setAccessToken(refreshResponse.accessToken);
                      TokenManager.setAccessToken(refreshResponse.accessToken);
                      window.__accessToken = refreshResponse.accessToken;
                      setUser(parsedUserData);
                    } else {
                      throw new Error('No access token in refresh response');
                    }
                  } catch (refreshError) {
                    console.warn('⚠️ [AuthContext] Token refresh failed, clearing session:', refreshError.message);
                    SessionManager.clearUser();
                  }
                }
              } else {
                console.warn('⚠️ [AuthContext] No refresh token cookie found, but user data exists. This might indicate a backend issue with cookie setting.');
                console.log('🔍 [AuthContext] Available cookies:', document.cookie);
                console.log('🔍 [AuthContext] User data:', parsedUserData);
                
                // Try to restore session anyway - the user will be prompted to login when they try to make API calls
                console.log('🔄 [AuthContext] Attempting to restore session without access token...');
                setUser(parsedUserData);
                
                // Set a flag to indicate this is a partial session restoration
                console.log('⚠️ [AuthContext] Session restored without access token. User will need to login again for API access.');
              }
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
              console.log('✅ [AuthContext] Admin session found, checking for refresh token...');
              
              // Check if we have a refresh token cookie
              const hasRefreshCookie = document.cookie.includes('refreshToken');
              console.log('🍪 [AuthContext] Admin refresh token cookie check:', {
                hasRefreshCookie,
                allCookies: document.cookie,
                timestamp: new Date().toISOString()
              });
              
              if (hasRefreshCookie) {
                console.log('🔄 [AuthContext] Admin refresh token found, checking if token refresh is needed...');
                
                // Check if we have a valid access token in memory first
                const existingToken = TokenManager.getAccessToken();
                let needsRefresh = true;
                
                if (existingToken) {
                  try {
                    // Check if token is still valid (not expired)
                    const tokenParts = existingToken.split('.');
                    if (tokenParts.length === 3) {
                      const payload = JSON.parse(atob(tokenParts[1]));
                      const now = Math.floor(Date.now() / 1000);
                      const timeUntilExpiry = payload.exp - now;
                      
                      // Token is valid if it expires in more than 5 minutes
                      if (timeUntilExpiry > 300) {
                        console.log('✅ [AuthContext] Existing admin access token is still valid, using it');
                        setAccessToken(existingToken);
                        setAdmin(parsedAdminData);
                        needsRefresh = false;
                      } else {
                        console.log('⏰ [AuthContext] Admin access token expires soon, refreshing...');
                      }
                    }
                  } catch (error) {
                    console.warn('⚠️ [AuthContext] Could not parse existing admin token, will refresh:', error.message);
                  }
                }
                
                // Only refresh if needed
                if (needsRefresh) {
                  try {
                    const refreshResponse = await AuthService.refreshToken();
                    if (refreshResponse && refreshResponse.accessToken) {
                      console.log('✅ [AuthContext] Admin token refresh successful, restoring admin session');
                      setAccessToken(refreshResponse.accessToken);
                      TokenManager.setAccessToken(refreshResponse.accessToken);
                      window.__accessToken = refreshResponse.accessToken;
                      setAdmin(parsedAdminData);
                    } else {
                      throw new Error('No access token in refresh response');
                    }
                  } catch (refreshError) {
                    console.warn('⚠️ [AuthContext] Admin token refresh failed, clearing session:', refreshError.message);
                    SessionManager.clearAdmin();
                  }
                }
              } else {
                console.warn('⚠️ [AuthContext] No refresh token cookie found for admin, but admin data exists. This might indicate a backend issue with cookie setting.');
                console.log('🔍 [AuthContext] Available cookies:', document.cookie);
                console.log('🔍 [AuthContext] Admin data:', parsedAdminData);
                
                // Try to restore session anyway - the admin will be prompted to login when they try to make API calls
                console.log('🔄 [AuthContext] Attempting to restore admin session without access token...');
                setAdmin(parsedAdminData);
                
                // Set a flag to indicate this is a partial session restoration
                console.log('⚠️ [AuthContext] Admin session restored without access token. Admin will need to login again for API access.');
              }
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
  const signUp = async (userData) => {
    try {
      console.log('📝 [AuthContext] Starting user registration process:', { email: userData.email });
      
      const registerResponse = await AuthService.register(userData);
      
      console.log('✅ [AuthContext] Registration successful:', {
        message: registerResponse.message,
        email: userData.email
      });
      
      return registerResponse;
    } catch (err) {
      console.error('❌ [AuthContext] Registration failed:', err.message);
      throw err;
    }
  };

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

      // Store access token first
      setAccessToken(loginResponse.accessToken);
      TokenManager.setAccessToken(loginResponse.accessToken);
      window.__accessToken = loginResponse.accessToken;

      // Fetch user profile data to get the name field
      let userData = {
        email: email,
        userId: loginResponse.userId,
        username: loginResponse.username,
      };

      try {
        console.log('🔄 [AuthContext] Fetching user profile data...');
        const profileResponse = await apiClient.get(`/users/${loginResponse.userId}`);
        
        if (profileResponse.data && profileResponse.data.data) {
          const profile = profileResponse.data.data;
          userData = {
            ...userData,
            name: profile.name || profile.username || email,
            profession: profile.profession || '',
            bio: profile.bio || '',
            phone: profile.phone || '',
            linkedIn: profile.linkedIn || '',
            website: profile.website || '',
            batch: profile.batch || '',
            facebook: profile.facebook || '',
            connections: profile.connections || 0,
            countryName: profile.countryName || '',
            cityName: profile.cityName || '',
            // Add other profile fields as needed
          };
          console.log('✅ [AuthContext] User profile data fetched and merged:', {
            name: userData.name,
            profession: userData.profession
          });
        }
      } catch (profileError) {
        console.warn('⚠️ [AuthContext] Failed to fetch user profile, using basic data:', profileError.message);
        // Continue with basic user data if profile fetch fails
      }
      
      // Store user session with enhanced data
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

  const signOut = async () => {
    console.log('🚪 [AuthContext] Signing out user');
    
    try {
      // Call AuthService logout to clear refresh token on server
      await AuthService.logout();
    } catch (error) {
      console.warn('⚠️ [AuthContext] Logout request failed, but continuing with local cleanup:', error);
    }
    
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

      console.log('✅ [AuthContext] Admin login response received:', {
        hasAccessToken: !!loginResponse.accessToken,
        adminId: loginResponse.adminId,
        username: loginResponse.username
      });

      const adminData = {
        email: loginResponse.email || email,
        adminId: loginResponse.adminId,
        username: loginResponse.username,
        name: loginResponse.name,
        role: loginResponse.role || ADMIN_ROLE.ADMIN,
        active: loginResponse.active,
      };

      // Store access token and admin data
      setAccessToken(loginResponse.accessToken);
      TokenManager.setAccessToken(loginResponse.accessToken);
      window.__accessToken = loginResponse.accessToken;

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

  const adminSignOut = async () => {
    console.log('🚪 [AuthContext] Signing out admin');
    
    try {
      // Call AuthService logout to clear refresh token on server
      await AuthService.logout();
    } catch (error) {
      console.warn('⚠️ [AuthContext] Logout request failed, but continuing with local cleanup:', error);
    }
    
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

  // Listen for cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only respond to changes in our authentication keys
      if (event.key === 'alumni_user' || event.key === 'admin_user' || event.key === 'session_type') {
        console.log('🔄 [AuthContext] Cross-tab storage change detected:', {
          key: event.key,
          newValue: event.newValue,
          oldValue: event.oldValue,
          timestamp: new Date().toISOString()
        });
        
        // Re-initialize authentication state based on current localStorage
        const userData = localStorage.getItem('alumni_user');
        const adminData = localStorage.getItem('admin_user');
        const sessionType = localStorage.getItem('session_type');
        
        console.log('🔍 [AuthContext] Cross-tab localStorage state:', {
          hasUserData: !!userData,
          hasAdminData: !!adminData,
          sessionType,
          timestamp: new Date().toISOString()
        });
        
        // Update state based on current localStorage
        if (sessionType === 'user' && userData) {
          try {
            const parsedUserData = JSON.parse(userData);
            if (parsedUserData && parsedUserData.email) {
              console.log('✅ [AuthContext] Cross-tab user session restored:', {
                email: parsedUserData.email,
                userId: parsedUserData.userId
              });
              setUser(parsedUserData);
              setAdmin(null);
            } else {
              console.log('❌ [AuthContext] Cross-tab invalid user data, clearing session');
              setUser(null);
              setAdmin(null);
            }
          } catch (error) {
            console.error('❌ [AuthContext] Cross-tab error parsing user data:', error);
            setUser(null);
            setAdmin(null);
          }
        } else if (sessionType === 'admin' && adminData) {
          try {
            const parsedAdminData = JSON.parse(adminData);
            if (parsedAdminData && parsedAdminData.email) {
              console.log('✅ [AuthContext] Cross-tab admin session restored:', {
                email: parsedAdminData.email,
                adminId: parsedAdminData.adminId
              });
              setAdmin(parsedAdminData);
              setUser(null);
            } else {
              console.log('❌ [AuthContext] Cross-tab invalid admin data, clearing session');
              setUser(null);
              setAdmin(null);
            }
          } catch (error) {
            console.error('❌ [AuthContext] Cross-tab error parsing admin data:', error);
            setUser(null);
            setAdmin(null);
          }
        } else {
          console.log('ℹ️ [AuthContext] Cross-tab no valid session found, clearing state');
          setUser(null);
          setAdmin(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
    signUp,
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
