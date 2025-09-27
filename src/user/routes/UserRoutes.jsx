import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/layout/ProtectedRoute';
import FeatureFlagWrapper from '../../components/layout/FeatureFlagWrapper';
import LoadingSpinner from '../../components/layout/LoadingSpinner';
import Navbar from '../../components/layout/Navbar';

// Lazy load user pages for better performance
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Profile = React.lazy(() => import('../pages/Profile'));
const ViewProfile = React.lazy(() => import('../pages/ViewProfile'));
const Search = React.lazy(() => import('../pages/Search'));
const Events = React.lazy(() => import('../pages/Events'));
const EventDetail = React.lazy(() => import('../pages/EventDetail'));
const CreateEvent = React.lazy(() => import('../pages/CreateEvent'));
const Notifications = React.lazy(() => import('../pages/Notifications'));
const ContactSupport = React.lazy(() => import('../pages/ContactSupport'));

/**
 * User Routes Component
 * Handles all user-specific routes with feature flag protection
 */
const UserRoutes = () => {
  const { isUser, loading, isInitialized } = useAuth();

  // Show loading while authentication is being initialized
  if (loading || !isInitialized) {
    return <LoadingSpinner />;
  }

  // Check if user is authenticated
  if (!isUser()) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="user.profile"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Dashboard Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Dashboard features are currently disabled. Please contact support for assistance.
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
                <Dashboard />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* User Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="user.profile"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Profile Management Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Profile management features are currently disabled. Please contact support for assistance.
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
                <Profile />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* View Profile */}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="user.profile"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Profile View Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Profile viewing features are currently disabled. Please contact support for assistance.
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
                <ViewProfile />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Alumni Search */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="alumni.search"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Alumni Search Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The alumni search feature is currently disabled. Please check back later or contact support for assistance.
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
                <Search />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Events */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="events"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Events Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The events feature is currently disabled. Please check back later or contact support for assistance.
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
                defaultValue={true}
              >
                <Events />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Create Event */}
        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="events"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Events Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The events feature is currently disabled. Please check back later or contact support for assistance.
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
                defaultValue={true}
              >
                <CreateEvent />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Edit Event */}
        <Route
          path="/events/edit/:eventId"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="events"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Events Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The events feature is currently disabled. Please check back later or contact support for assistance.
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
                defaultValue={true}
              >
                <CreateEvent />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Event Detail */}
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="events"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Events Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The events feature is currently disabled. Please check back later or contact support for assistance.
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
                defaultValue={true}
              >
                <EventDetail />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <FeatureFlagWrapper 
                featureName="notifications"
                fallback={
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.19A4 4 0 0 0 4 6v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H8a4 4 0 0 0-3.81 2.19z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Notifications Unavailable
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The notifications feature is currently disabled. Please check back later or contact support for assistance.
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
                <Notifications />
              </FeatureFlagWrapper>
            </ProtectedRoute>
          }
        />

        {/* Contact Support */}
        <Route
          path="/contact-support"
          element={
            <ProtectedRoute>
              <ContactSupport />
            </ProtectedRoute>
          }
        />

        {/* Default redirect for user routes */}
        <Route path="/" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default UserRoutes;
