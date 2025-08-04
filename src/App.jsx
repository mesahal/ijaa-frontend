import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import Search from "./pages/Search";
import Events from "./pages/Events";
import EditProfile from "./pages/EditProfile";
import PrivacySettings from "./pages/PrivacySettings";
import AccountSettings from "./pages/AccountSettings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Maintenance from "./pages/Maintenance";
import ContactSupport from "./pages/ContactSupport";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Notifications from "./pages/Notifications";
// Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminReports from "./pages/AdminReports";
import AdminFeatureFlags from "./pages/AdminFeatureFlags";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function AppRoutes() {
  const { user, loading } = useAuth();
  const { admin, loading: adminLoading } = useAdminAuth();
  const location = useLocation();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Show navbar for regular users only, never for admin users or admin pages */}
      {user && !admin && !location.pathname.startsWith('/admin') && <Navbar />}

      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={admin ? <Navigate to="/admin/dashboard" /> : <AdminLogin />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute requiredPermission="canManageUsers">
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <AdminRoute requiredPermission="canManageAnnouncements">
              <AdminAnnouncements />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute requiredPermission="canManageReports">
              <AdminReports />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/feature-flags"
          element={
            <AdminRoute requiredPermission="canManageFeatureFlags">
              <AdminFeatureFlags />
            </AdminRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/dashboard" /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignUp />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/dashboard" /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate to="/dashboard" /> : <ResetPassword />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/privacy"
          element={
            <ProtectedRoute>
              <PrivacySettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/account"
          element={
            <ProtectedRoute>
              <AccountSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Public pages */}
        <Route path="/support" element={<ContactSupport />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
