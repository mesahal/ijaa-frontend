import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Mail,
  Lock,
  User,
  Calendar,
  MapPin,
  Briefcase,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Card   } from '../../components/ui';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signUp, isUser, loading: authLoading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && isUser()) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [isUser, authLoading, navigate]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't render sign up page if user is authenticated
  if (isUser()) {
    return null;
  }

  const features = [
    {
      icon: Users,
      title: "Connect with Alumni",
      description: "Build your professional network with fellow graduates",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
    },
    {
      icon: Sparkles,
      title: "Exclusive Benefits",
      description: "Access to events, mentorship, and career opportunities",
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear specific error when user starts typing
    if (errors && errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Enhanced email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);

    try {
      await signUp(formData);
      // After successful registration, redirect to sign in page
      navigate("/signin");
    } catch (err) {
      // Handle specific error cases
      if (err.message.includes("already exists")) {
        setErrors({ email: "Email already registered" });
      } else {
        setErrors({
          general: err.message || "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = (provider) => {
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="p-1 bg-white transition-all duration-300 group-hover:scale-105 rounded-md shadow-sm">
                <img
                  src="/logo.png"
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Join Our Community
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create your alumni account and start connecting
            </p>
          </div>

          {/* Error Alert */}
          {errors.general && (
            <div className="mb-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700 text-error-700 dark:text-error-300 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <Input
              label="First Name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              leftIcon={<User className="h-5 w-5" />}
              error={errors.firstName}
              required
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              leftIcon={<User className="h-5 w-5" />}
              error={errors.lastName}
              required
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              leftIcon={<Mail className="h-5 w-5" />}
              error={errors.email}
              required
            />

            {/* Password */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              leftIcon={<Lock className="h-5 w-5" />}
              error={errors.password}
              required
            />

            {/* Confirm Password */}
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              leftIcon={<Lock className="h-5 w-5" />}
              error={errors.confirmPassword}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          {/* Social Sign Up */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialSignUp("google")}
                className="w-full"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </Button>

              <Button
                variant="outline"
                onClick={() => handleSocialSignUp("facebook")}
                className="w-full"
              >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2">Facebook</span>
              </Button>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative h-full flex items-center justify-center px-12">
          <div className="max-w-lg text-white">
            <div className="mb-12">
              <h3 className="text-4xl font-bold mb-4">
                Welcome to Your Alumni Network
              </h3>
              <p className="text-xl opacity-90 leading-relaxed">
                Join thousands of graduates and unlock exclusive opportunities
                for networking, mentorship, and career growth.
              </p>
            </div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-white/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
