import { useMemo } from 'react';
import { ADMIN_ROLE, USER_ROLE   } from '../../../utils/constants/roleConstants';

/**
 * Custom hook for efficient permission checking
 * Prevents unnecessary re-renders by memoizing permission checks
 */
export const usePermissions = (user) => {
  const permissions = useMemo(() => ({
    // Admin permissions
    canManageUsers: user?.role === ADMIN_ROLE,
    canManageAdmins: user?.role === ADMIN_ROLE,
    canManageContent: user?.role === ADMIN_ROLE,
    canModerate: user?.role === ADMIN_ROLE,
    canManageFeatureFlags: user?.role === ADMIN_ROLE,
    canManageSettings: user?.role === ADMIN_ROLE,
    canManageSystem: user?.role === ADMIN_ROLE,
    
    // User permissions
    canAccessUserFeatures: user?.role === USER_ROLE || user?.role === ADMIN_ROLE,
    
    // Role checks
    isAdmin: user?.role === ADMIN_ROLE,
    isUser: user?.role === USER_ROLE,
    
    // Utility functions
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role),
    hasAllRoles: (roles) => roles.every(role => user?.role === role),
  }), [user?.role]);

  return permissions;
};
