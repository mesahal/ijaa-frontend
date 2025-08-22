import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import { adminApi } from "../utils/adminApi";
import {
  User,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Key,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card, Badge, Avatar } from "../components/ui";

const AdminSettings = () => {
  const { admin } = useUnifiedAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Password change form state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (admin && admin.token) {
      fetchAdminProfile();
    }
  }, [admin]);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminProfile();
      setProfile(response.data || response);
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      toast.error("Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setPasswordLoading(true);
      await adminApi.changeAdminPassword(passwordForm);
      
      toast.success("Password changed successfully");
      
      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
              <SettingsIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your admin profile and security settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Profile Information
                  </h2>
                  <p className="text-primary-100 text-sm">
                    Your admin account details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {profile && (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="text-center mb-6">
                    <Avatar
                      size="xl"
                      src={`/logo.png`}
                      alt={profile.name}
                      fallback={profile.name}
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profile.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {profile.email}
                    </p>
                  </div>

                  {/* Name */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="bg-primary-100 dark:bg-primary-900/50 rounded-lg p-2">
                      <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Full Name
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profile.name}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="bg-success-100 dark:bg-success-900/50 rounded-lg p-2">
                      <Mail className="h-5 w-5 text-success-600 dark:text-success-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Email Address
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {profile.email}
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="bg-secondary-100 dark:bg-secondary-900/50 rounded-lg p-2">
                      <Shield className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Role
                      </label>
                      <Badge 
                        variant={profile.role === "SUPER_ADMIN" ? "error" : profile.role === "ADMIN" ? "primary" : "success"}
                        size="sm"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {profile.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="bg-warning-100 dark:bg-warning-900/50 rounded-lg p-2">
                      <CheckCircle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Account Status
                      </label>
                      <Badge 
                        variant={profile.active ? "success" : "error"}
                        size="sm"
                      >
                        {profile.active ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {profile.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="bg-primary-100 dark:bg-primary-900/50 rounded-lg p-2">
                      <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Created At
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="bg-success-100 dark:bg-success-900/50 rounded-lg p-2">
                      <Calendar className="h-5 w-5 text-success-600 dark:text-success-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Last Updated
                      </label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Password Change */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-secondary-600 to-secondary-700 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 rounded-xl p-2">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Change Password
                  </h2>
                  <p className="text-secondary-100 text-sm">
                    Update your admin password
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  error={passwordErrors.currentPassword}
                  leftIcon={<Key className="h-5 w-5" />}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  error={passwordErrors.newPassword}
                  leftIcon={<Lock className="h-5 w-5" />}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  error={passwordErrors.confirmPassword}
                  leftIcon={<Lock className="h-5 w-5" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={passwordLoading}
                  icon={<Save className="h-5 w-5" />}
                  iconPosition="left"
                >
                  {passwordLoading ? "Changing Password..." : "Change Password"}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
