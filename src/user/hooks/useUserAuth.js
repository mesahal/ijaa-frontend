import { useAuth } from '../../hooks/useAuth';

/**
 * User-specific authentication hook
 * Provides user-specific authentication methods and state
 */
export const useUserAuth = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    // User-specific methods can be added here
    isUserAuthenticated: auth.isUser,
    currentUser: auth.user,
  };
};

export default useUserAuth;
