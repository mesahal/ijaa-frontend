import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Eye, EyeOff, Shield, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card, Badge } from "../components/ui";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminSignIn } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminSignIn(email, password);
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const securityFeatures = [
    {
      icon: Shield,
      title: "Secure Access",
      description: "Two-factor authentication enabled"
    },
    {
      icon: CheckCircle,
      title: "Audit Trail",
      description: "All actions are logged and monitored"
    },
    {
      icon: AlertTriangle,
      title: "Admin Only",
      description: "Restricted to authorized administrators"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-primary-900/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Login
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Access the admin panel
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                leftIcon={<Shield className="h-5 w-5" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-5 w-5" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={<Lock className="h-5 w-5" />}
                iconPosition="left"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-warning-50 dark:bg-warning-900/10 border border-warning-200 dark:border-warning-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning-800 dark:text-warning-200">
                    Security Notice
                  </p>
                  <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
                    This area is restricted to authorized administrators only. Unauthorized access attempts will be logged and reported.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Feature Showcase */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Admin Panel
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Complete administrative control over the IIT JU Alumni platform. Manage users, content, and system settings with powerful tools.
              </p>
            </div>

            <div className="space-y-4">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                        <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Admin Capabilities */}
            <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Administrative Capabilities
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "User Management", color: "primary" },
                  { label: "Content Moderation", color: "warning" },
                  { label: "System Settings", color: "secondary" },
                  { label: "Analytics", color: "success" }
                ].map((capability, index) => (
                  <Badge key={index} variant={capability.color} size="sm">
                    {capability.label}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Contact Support */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Need help accessing the admin panel?
              </p>
              <Button
                variant="outline"
                size="sm"
                as="a"
                href="mailto:admin@iitju-alumni.org"
              >
                Contact System Administrator
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 