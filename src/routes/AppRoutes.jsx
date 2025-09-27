import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import UserRoutes from '../user/routes/UserRoutes';
import AdminRoutes from '../admin/routes/AdminRoutes';

// Lazy load components for better performance
const LandingPage = React.lazy(() => import('../user/pages/LandingPage'));
const SignIn = React.lazy(() => import('../user/pages/SignIn'));
const SignUp = React.lazy(() => import('../user/pages/SignUp'));
const ForgotPassword = React.lazy(() => import('../user/pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../user/pages/ResetPassword'));
const TermsAndConditions = React.lazy(() => import('../user/pages/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('../user/pages/PrivacyPolicy'));
const Maintenance = React.lazy(() => import('../user/pages/Maintenance'));
const NotFound = React.lazy(() => import('../user/pages/NotFound'));

/**
 * Main App Routes Component
 * Handles routing for the entire application with lazy loading
 */
const AppRoutes = () => {
  const { loading, isUser, isAdmin, isInitialized } = useAuth();

  // Show loading spinner while checking authentication
  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/signin" 
          element={
            isUser() ? <Navigate to="/user/dashboard" replace /> : <SignIn />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isUser() ? <Navigate to="/user/dashboard" replace /> : <SignUp />
          } 
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/maintenance" element={<Maintenance />} />

        {/* User Routes */}
        <Route path="/user/*" element={<UserRoutes />} />

        {/* Legacy Routes - Redirect to new structure */}
        <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="/profile" element={<Navigate to="/user/profile" replace />} />
        <Route path="/profile/:userId" element={<Navigate to="/user/profile/:userId" replace />} />
        <Route path="/search" element={<Navigate to="/user/search" replace />} />
        <Route path="/events" element={<Navigate to="/user/events" replace />} />
        <Route path="/events/create" element={<Navigate to="/user/events/create" replace />} />
        <Route path="/events/edit/:eventId" element={<Navigate to="/user/events/edit/:eventId" replace />} />
        <Route path="/events/:eventId" element={<Navigate to="/user/events/:eventId" replace />} />
        <Route path="/notifications" element={<Navigate to="/user/notifications" replace />} />
        <Route path="/contact-support" element={<Navigate to="/user/contact-support" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
