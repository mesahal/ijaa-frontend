import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import { themeApi } from '../utils/themeApi';
import ThemeSelector from '../components/ThemeSelector';
import { Settings, User, Shield, Palette, Save, AlertCircle } from 'lucide-react';

const UserSettings = () => {
  const { theme, setTheme, isLoading: themeLoading, error: themeError } = useTheme();
  const { user, isUser } = useUnifiedAuth();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (isUser) {
      fetchUserSettings();
    } else {
      setIsLoading(false);
    }
  }, [isUser]);

  const fetchUserSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await themeApi.getUserSettings();
      
      if (response.code === "200" && response.data) {
        setSettings(response.data);
      } else {
        setError('Failed to fetch user settings');
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      setError(error.message || 'Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (newTheme) => {
    try {
      setError(null);
      setSuccessMessage(null);
      
      await setTheme(newTheme);
      setSuccessMessage('Theme updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      setError('Failed to update theme');
    }
  };

  if (!isUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You must be logged in to access user settings.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              User Settings
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Save className="w-5 h-5 text-green-600" />
              <span className="text-green-800 dark:text-green-200">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Theme Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Palette className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Theme & Appearance
                </h2>
              </div>
              
              <ThemeSelector 
                showLabel={false}
                size="large"
                className="mb-4"
              />
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  <strong>Current Theme:</strong> {theme === 'DEVICE' ? 'System Default' : theme}
                </p>
                <p>
                  Your theme preference will be saved and synchronized across all your devices.
                </p>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account Information
                </h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    User ID
                  </label>
                  <p className="text-gray-900 dark:text-white">{user?.userId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Settings Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Current Settings
                </h3>
              </div>
              
              {settings && (
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme:</span>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {settings.theme === 'DEVICE' ? 'System Default' : settings.theme}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">User ID:</span>
                    <p className="text-gray-900 dark:text-white font-medium">{settings.userId}</p>
                  </div>
                </div>
              )}
              
              {!settings && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No settings data available
                </p>
              )}
            </div>

            {/* Help & Support */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Need Help?
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                If you have questions about your settings or need assistance, our support team is here to help.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;




