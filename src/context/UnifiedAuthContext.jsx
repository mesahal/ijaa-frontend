// Compatibility wrapper for legacy imports in tests
// Re-export the current AuthContext API under the legacy UnifiedAuthContext name
import React from "react";
import { AuthProvider, useAuth } from "./AuthContext";

export const UnifiedAuthProvider = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

export const useUnifiedAuth = () => useAuth();

export default {
  UnifiedAuthProvider,
  useUnifiedAuth,
};


