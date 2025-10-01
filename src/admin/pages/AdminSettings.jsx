import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from '../../hooks/useAuth';
import { adminApi  } from '../../services/api/adminApi';
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
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  Linkedin,
  Globe,
  Facebook,
  Users,
  MessageCircle,
  UserPlus,
  UserCheck,
  Tag,
  RefreshCw,
  Activity,
  Database,
  Bell,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card, Badge, Avatar   } from '../../components/ui';
import FeatureFlagWrapper from '../../components/layout/FeatureFlagWrapper';

const AdminSettings = () => {
  const { admin } = useAuth();
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

  const fetchAdminProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAdminProfile();
      setProfile(response.data || response);
    } catch (error) {
      toast.error("Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (admin) {
      fetchAdminProfile();
    }
  }, [admin, fetchAdminProfile]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
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
      await adminApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Check if admin is available
  if (!admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading admin data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header - Consistent with AdminUsers */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Settings</h1>
              <p className="text-purple-100 text-lg">
                Manage your account and security preferences
              </p>
              <p className="text-purple-200 text-sm mt-1">
                Update your profile, password, and system settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-purple-200 text-sm">Last Updated</p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchAdminProfile}
                icon={<Activity className="h-4 w-4" />}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Profile Information */}
        {profile && (
          <Card className="overflow-hidden">
            <div className="relative">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"></div>
              
              <div className="relative p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {profile.name}
                    </h1>

                    {/* Role */}
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <Badge variant="primary" size="sm">
                        {profile.role}
                      </Badge>
                    </div>

                    {/* Status and Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{profile.active ? "Active" : "Inactive"}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined{" "}
                          {new Date(profile.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{profile.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Security Settings */}
        <FeatureFlagWrapper
          featureName="admin.auth"
          showFallback={false}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Update your account password
                  </p>
                </div>
              </div>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                error={passwordErrors.currentPassword}
                leftIcon={<Key className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                required
              />

              <Input
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                error={passwordErrors.newPassword}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                required
              />

              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={passwordLoading}
                icon={<Save className="h-4 w-4" />}
                iconPosition="left"
              >
                {passwordLoading ? "Changing Password..." : "Update Password"}
              </Button>
            </form>

            {/* Security Tips */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                Security Tips
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Use at least 8 characters</p>
                <p>• Include uppercase, lowercase, numbers, and symbols</p>
                <p>• Don't share your password with anyone</p>
                <p>• Change your password regularly</p>
              </div>
            </div>
          </div>
        </Card>
        </FeatureFlagWrapper>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
