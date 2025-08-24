import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { permissions, roleErrorMessages } from '../utils/roleConstants';
import { toast } from 'react-toastify';

const AdminRoute = ({ children, requiredPermission = null }) => {
  const { admin, loading, isAdmin } = useUnifiedAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no admin, redirect to login
  if (!isAdmin()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If admin is not active, redirect to login
  if (!admin.active) {
    toast.error("Your admin account has been deactivated.");
    return <Navigate to="/admin/login" replace />;
  }

  // Check specific permission if required
  if (requiredPermission && !permissions[requiredPermission](admin)) {
    toast.error(roleErrorMessages.insufficientPrivileges);
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If admin exists and has required permissions, render the component
  return children;
};

export default AdminRoute; 