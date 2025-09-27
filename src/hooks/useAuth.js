import { useAuth as useAuthContext } from '../context/AuthContext';

/**
 * Main Authentication Hook
 * Provides access to authentication state and methods
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
