// Session Manager for handling single user type at a time
class SessionManager {
  constructor() {
    this.userKey = 'alumni_user';
    this.adminKey = 'admin_user';
    this.sessionTypeKey = 'session_type';
  }

  // Get current session type
  getSessionType() {
    return localStorage.getItem(this.sessionTypeKey);
  }

  // Set session type
  setSessionType(type) {
    localStorage.setItem(this.sessionTypeKey, type);
  }

  // Clean up old session variables
  cleanupOldVariables() {
    localStorage.removeItem('user_active');
    localStorage.removeItem('admin_active');
  }

  // Get user data
  getUser() {
    try {
      const userData = localStorage.getItem(this.userKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  // Get admin data
  getAdmin() {
    try {
      const adminData = localStorage.getItem(this.adminKey);
      return adminData ? JSON.parse(adminData) : null;
    } catch (error) {
      return null;
    }
  }

  // Set user session (without access token for security)
  setUser(userData) {
    // Create user data without access token for localStorage storage
    const userDataForStorage = {
      ...userData,
      token: undefined // Remove token from localStorage storage
    };
    localStorage.setItem(this.userKey, JSON.stringify(userDataForStorage));
    this.setSessionType('user');
    // Clear admin session when setting user session
    localStorage.removeItem(this.adminKey);
  }

  // Set admin session (without access token for security)
  setAdmin(adminData) {
    // Create admin data without access token for localStorage storage
    const adminDataForStorage = {
      ...adminData,
      token: undefined // Remove token from localStorage storage
    };
    localStorage.setItem(this.adminKey, JSON.stringify(adminDataForStorage));
    this.setSessionType('admin');
    // Clear user session when setting admin session
    localStorage.removeItem(this.userKey);
  }

  // Clear user session
  clearUser() {
    localStorage.removeItem(this.userKey);
    if (this.getSessionType() === 'user') {
      localStorage.removeItem(this.sessionTypeKey);
    }
  }

  // Clear admin session
  clearAdmin() {
    localStorage.removeItem(this.adminKey);
    if (this.getSessionType() === 'admin') {
      localStorage.removeItem(this.sessionTypeKey);
    }
  }

  // Clear all sessions
  clearAll() {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.adminKey);
    localStorage.removeItem(this.sessionTypeKey);
    // Clean up old variables from previous multi-session system
    localStorage.removeItem('user_active');
    localStorage.removeItem('admin_active');
  }

  // Get current active session (without token validation since tokens are not stored)
  getCurrentSession() {
    const sessionType = this.getSessionType();
    if (sessionType === 'user') {
      const user = this.getUser();
      return user && user.email ? { type: 'user', data: user } : { type: null, data: null };
    } else if (sessionType === 'admin') {
      const admin = this.getAdmin();
      return admin && admin.email ? { type: 'admin', data: admin } : { type: null, data: null };
    }
    return { type: null, data: null };
  }

  // Get user session if active (without token validation)
  getUserSession() {
    if (this.getSessionType() === 'user') {
      const user = this.getUser();
      return user && user.email ? { type: 'user', data: user } : null;
    }
    return null;
  }

  // Get admin session if active (without token validation)
  getAdminSession() {
    if (this.getSessionType() === 'admin') {
      const admin = this.getAdmin();
      return admin && admin.email ? { type: 'admin', data: admin } : null;
    }
    return null;
  }

  // Check if user is logged in (without token validation)
  isUserLoggedIn() {
    const user = this.getUser();
    return user && user.email && this.getSessionType() === 'user';
  }

  // Check if admin is logged in (without token validation)
  isAdminLoggedIn() {
    const admin = this.getAdmin();
    return admin && admin.email && this.getSessionType() === 'admin';
  }

  // Handle session conflicts - only one session at a time
  handleSessionConflict(newType) {
    const currentSession = this.getCurrentSession();
    
    if (currentSession.type && currentSession.type !== newType) {
      // Clear the other session type
      if (newType === 'user') {
        this.clearAdmin();
      } else if (newType === 'admin') {
        this.clearUser();
      }
    }
    
    // Ensure session type is set correctly
    this.setSessionType(newType);
  }

  // Listen for storage changes (for cross-tab synchronization)
  onStorageChange(callback) {
    const handleStorageChange = (event) => {
      if (event.key === this.userKey || event.key === this.adminKey || 
          event.key === this.sessionTypeKey) {
        callback(this.getCurrentSession());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager; 