import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  GraduationCap,
  AlertCircle,
  Shield,
  Key,
} from "lucide-react";
import { Button, Input, Card } from "../components/ui";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    }, 2000);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="bg-error-100 dark:bg-error-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-error-600 dark:text-error-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invalid Reset Link
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Button
            as={Link}
            to="/forgot-password"
            variant="primary"
            size="lg"
            fullWidth
          >
            Request New Link
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md w-full p-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    IIT Alumni Association
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Jahangirnagar University
                  </p>
                </div>
              </div>

              <div className="bg-success-100 dark:bg-success-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success-600 dark:text-success-400" />
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Password Reset Successful
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Redirecting to sign in page in 3 seconds...
              </p>
            </div>

            <div className="mt-8">
              <Button
                as={Link}
                to="/signin"
                variant="primary"
                size="lg"
                fullWidth
              >
                Sign In Now
              </Button>
            </div>
          </Card>
        </div>

        <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative h-full flex items-center justify-center px-12">
            <div className="max-w-lg text-white text-center">
              <div className="mb-8">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Welcome Back!</h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  Your account is now secure with your new password. You're all
                  set to continue your alumni journey.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">✓</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Password Updated</h4>
                    <p className="text-white/80 text-sm">
                      Your new password is now active
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">✓</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Account Secure</h4>
                    <p className="text-white/80 text-sm">
                      Your account is protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">✓</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Ready to Connect</h4>
                    <p className="text-white/80 text-sm">
                      Access your alumni network
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  IIT Alumni Association
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jahangirnagar University
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700 text-error-700 dark:text-error-300 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="New Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              leftIcon={<Lock className="h-5 w-5" />}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              leftIcon={<Lock className="h-5 w-5" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Button as={Link} to="/signin" variant="ghost" size="sm">
              Back to Sign In
            </Button>
          </div>
        </Card>
      </div>

      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative h-full flex items-center justify-center px-12">
          <div className="max-w-lg text-white text-center">
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Create a Strong Password
              </h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Choose a secure password to protect your alumni account and keep
                your personal information safe.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">🔒</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">At least 6 characters</h4>
                  <p className="text-white/80 text-sm">
                    Make it longer for better security
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">🔤</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Mix of characters</h4>
                  <p className="text-white/80 text-sm">
                    Use letters, numbers, and symbols
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">🚫</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Avoid common patterns</h4>
                  <p className="text-white/80 text-sm">
                    Don't use obvious sequences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
