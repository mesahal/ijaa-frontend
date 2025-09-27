import { useAuth } from '../../hooks/useAuth';

/**
 * Admin-specific authentication hook
 * Provides admin-specific authentication methods and state
 */
export const useAdminAuth = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    // Admin-specific methods can be added here
    isAdminAuthenticated: auth.isAdmin,
    adminUser: auth.admin,
  };
};

export default useAdminAuth;
