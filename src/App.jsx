import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import EventRegistration from "./pages/EventRegistration";
import Events from "./pages/Events";
import MyEvents from "./pages/MyEvents";
import Groups from "./pages/Groups";
import Chat from "./pages/Chat";
import Search from "./pages/Search";
import EditProfile from "./pages/EditProfile";
import PrivacySettings from "./pages/PrivacySettings";
import AccountSettings from "./pages/AccountSettings";
import CreateEvent from "./pages/CreateEvent";
import CreateGroup from "./pages/CreateGroup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Maintenance from "./pages/Maintenance";
import ContactSupport from "./pages/ContactSupport";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Notifications from "./pages/Notifications";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {user && <Navbar />}

      <Routes>
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
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/edit"
          element={user ? <EditProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:userId"
          element={user ? <ViewProfile /> : <Navigate to="/" />}
        />
        <Route
          path="/events/:eventId/register"
          element={user ? <EventRegistration /> : <Navigate to="/" />}
        />
        <Route
          path="/events"
          element={user ? <Events /> : <Navigate to="/" />}
        />
        <Route
          path="/my-events"
          element={user ? <Events /> : <Navigate to="/" />}
        />
        <Route
          path="/events/create"
          element={user ? <CreateEvent /> : <Navigate to="/" />}
        />
        <Route
          path="/groups"
          element={user ? <Groups /> : <Navigate to="/" />}
        />
        <Route
          path="/groups/create"
          element={user ? <CreateGroup /> : <Navigate to="/" />}
        />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/" />} />
        <Route
          path="/chat/:userId"
          element={user ? <Chat /> : <Navigate to="/" />}
        />
        <Route
          path="/search"
          element={user ? <Search /> : <Navigate to="/" />}
        />
        <Route
          path="/settings/privacy"
          element={user ? <PrivacySettings /> : <Navigate to="/" />}
        />
        <Route
          path="/settings/account"
          element={user ? <AccountSettings /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={user ? <Notifications /> : <Navigate to="/" />}
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
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
