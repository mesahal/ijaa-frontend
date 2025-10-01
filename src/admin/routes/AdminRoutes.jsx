import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminRoute from '../../components/layout/AdminRoute';
import FeatureFlagWrapper from '../../components/layout/FeatureFlagWrapper';
import LoadingSpinner from '../../components/layout/LoadingSpinner';

// Lazy load admin pages for better performance
const AdminLogin = React.lazy(() => import('../pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('../pages/AdminDashboard'));
const AdminUsers = React.lazy(() => import('../pages/AdminUsers'));
const AdminFeatureFlags = React.lazy(() => import('../pages/AdminFeatureFlags'));
const AdminSettings = React.lazy(() => import('../pages/AdminSettings'));
const AdminManagement = React.lazy(() => import('../pages/AdminManagement'));

/**
 * Admin Routes Component
 * Handles all admin-specific routes with permission and feature flag protection
 */
const AdminRoutes = () => {
  const { isAdmin, admin } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Admin Login */}
        <Route
          path="/login"
          element={
            admin ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <FeatureFlagWrapper 
                featureName="admin.features"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Admin Features Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Admin features are currently disabled. Please contact a super administrator for assistance.
                      </p>
                      <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                }
                defaultValue={false}
              >
                <AdminDashboard />
              </FeatureFlagWrapper>
            </AdminRoute>
          }
        />

        {/* Admin Users Management */}
        <Route
          path="/users"
          element={
            <AdminRoute requiredPermission="canManageUsers">
              <FeatureFlagWrapper 
                featureName="admin.user-management"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        User Management Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        User management features are currently disabled. Please contact a super administrator for assistance.
                      </p>
                      <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                }
                defaultValue={false}
              >
                <AdminUsers />
              </FeatureFlagWrapper>
            </AdminRoute>
          }
        />

        {/* Admin Feature Flags */}
        <Route
          path="/feature-flags"
          element={
            <AdminRoute requiredPermission="canManageFeatureFlags">
              <AdminFeatureFlags />
            </AdminRoute>
          }
        />

        {/* Admin Settings */}
        <Route
          path="/settings"
          element={
            <AdminRoute requiredPermission="canManageSettings">
              <FeatureFlagWrapper 
                featureName="admin.auth"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Admin Settings Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Admin settings features are currently disabled. Please contact a super administrator for assistance.
                      </p>
                      <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                }
                defaultValue={false}
              >
                <AdminSettings />
              </FeatureFlagWrapper>
            </AdminRoute>
          }
        />

        {/* Admin Management */}
        <Route
          path="/management"
          element={
            <AdminRoute requiredPermission="canManageSystem">
              <FeatureFlagWrapper 
                featureName="admin.features"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        System Management Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        System management features are currently disabled. Please contact a super administrator for assistance.
                      </p>
                      <button 
                        onClick={() => window.history.back()} 
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                }
                defaultValue={false}
              >
                <AdminManagement />
              </FeatureFlagWrapper>
            </AdminRoute>
          }
        />

        {/* Default redirect for admin routes */}
        <Route 
          path="/" 
          element={
            isAdmin() ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/admin/login" replace />
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
