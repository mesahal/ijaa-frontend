import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  User,
  Shield,
  Sparkles,
} from "lucide-react";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import { Button, Input, Card } from "../components/ui";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useUnifiedAuth();

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

    try {
      await signIn(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      // Handle specific error messages
      if (err.message.includes("credentials")) {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider) => {
    // Simulate social sign in
    console.log(`Sign in with ${provider}`);
  };

  const features = [
    {
      icon: User,
      title: "Connect with Alumni",
      description: "Build meaningful connections with fellow graduates",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Sparkles,
      title: "Stay Updated",
      description: "Get the latest news and events from your alma mater",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-1 bg-white transition-all duration-300 group-hover:scale-105 rounded-md shadow-sm">
                <img
                  src="/logo-2.png"
                  alt="IIT JU Alumni Logo"
                  className="h-10 w-10 object-contain"
                />
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to your alumni account to continue
            </p>
          </div>

          <Card className="p-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-700 dark:text-error-400 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="h-4 w-4" />}
                placeholder="Enter your password"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Sign In */}
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => handleSocialSignIn("google")}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                variant="outline"
                fullWidth
                onClick={() => handleSocialSignIn("facebook")}
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-center px-12">
          <div className="max-w-lg text-white">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Connect with Your Alumni Network
              </h2>
              <p className="text-xl text-primary-100 leading-relaxed">
                Stay connected with fellow graduates, discover opportunities,
                and grow your professional network.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-primary-100">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full"></div>
            <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
