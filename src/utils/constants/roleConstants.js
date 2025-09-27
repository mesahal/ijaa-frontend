// Simplified Role System Constants

export const ADMIN_ROLE = 'ADMIN';
export const USER_ROLE = 'USER';

// Role display names for simplified system
export const getRoleDisplayName = (role) => {
  switch(role) {
    case ADMIN_ROLE:
      return 'Administrator';
    case USER_ROLE:
      return 'User';
    default:
      return 'User';
  }
};

// Permission checks for simplified role system
export const permissions = {
  // Admin permissions - all require ADMIN role
  canManageUsers: (user) => user?.role === ADMIN_ROLE,
  canManageAdmins: (user) => user?.role === ADMIN_ROLE,
  canManageContent: (user) => user?.role === ADMIN_ROLE,
  canModerate: (user) => user?.role === ADMIN_ROLE,
  canManageFeatureFlags: (user) => user?.role === ADMIN_ROLE,
  canManageSettings: (user) => user?.role === ADMIN_ROLE,
  canManageSystem: (user) => user?.role === ADMIN_ROLE,
  
  // User permissions
  canAccessUserFeatures: (user) => user?.role === USER_ROLE || user?.role === ADMIN_ROLE,
  
  // Role checks
  isAdmin: (user) => user?.role === ADMIN_ROLE,
  isUser: (user) => user?.role === USER_ROLE,
};

// Memoized permission functions for better performance
export const memoizedPermissions = {
  canManageUsers: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  canManageAdmins: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  canManageContent: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  canModerate: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  canManageFeatureFlags: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  canManageSettings: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  canManageSystem: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  
  // User permissions
  canAccessUserFeatures: (user) => {
    if (!user) return false;
    return user.role === USER_ROLE || user.role === ADMIN_ROLE;
  },
  
  // Role checks
  isAdmin: (user) => {
    if (!user) return false;
    return user.role === ADMIN_ROLE;
  },
  isUser: (user) => {
    if (!user) return false;
    return user.role === USER_ROLE;
  },
};

// Error messages for simplified role system
export const roleErrorMessages = {
  insufficientPrivileges: 'This action requires Administrator privileges.',
  adminOnly: 'This feature is only available to Administrators.',
  unauthorized: 'You must be an Administrator to access this resource.',
  userOnly: 'This feature is only available to regular users.',
};

// Admin menu items with simplified permissions
export const adminMenuItems = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    path: '/admin/dashboard',
    visible: (admin) => permissions.isAdmin(admin)
  },
  {
    label: 'User Management',
    icon: 'users',
    path: '/admin/users',
    visible: (admin) => permissions.canManageUsers(admin)
  },
  {
    label: 'Feature Flags',
    icon: 'settings',
    path: '/admin/feature-flags',
    visible: (admin) => permissions.canManageFeatureFlags(admin)
  }
]; 