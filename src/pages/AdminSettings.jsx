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

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword =
        "New password must be different from current password";
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-t-2xl"></div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-b-2xl">
              <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>

        {profile && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  {/* <Shield className="h-16 w-16 mx-auto mb-2 opacity-80" /> */}
                  {/* <h2 className="text-2xl font-bold">Admin Panel</h2> */}
                  {/* <p className="text-primary-100">System Administration</p> */}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-8 pb-8 relative">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-4 sm:left-8">
                <Avatar
                  size="xl"
                  src={`/logo-2.jpg`}
                  alt={profile.name}
                  fallback={profile.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                />
              </div>

              {/* Header Content */}
              <div className="pt-12 sm:pt-20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    {/* Name */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {profile.name}
                    </h1>

                    {/* Role */}
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      {profile.role}
                    </p>

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
          </div>
        )}

        <div className="space-y-8">
          {/* Security Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                error={passwordErrors.currentPassword}
                leftIcon={<Key className="h-4 w-4" />}
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
                leftIcon={<Lock className="h-4 w-4" />}
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
                leftIcon={<Lock className="h-4 w-4" />}
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
