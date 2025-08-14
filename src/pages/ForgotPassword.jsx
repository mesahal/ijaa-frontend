import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, GraduationCap, Shield, Lock } from "lucide-react";
import { Button, Input, Card } from "../components/ui";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (isSubmitted) {
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
                    IIT JU Alumni
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
                Check Your Email
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                We've sent a password reset link to <strong className="text-gray-900 dark:text-white">{email}</strong>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="primary"
                size="lg"
                fullWidth
              >
                Try Different Email
              </Button>

              <Button
                as={Link}
                to="/signin"
                variant="outline"
                size="lg"
                fullWidth
              >
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
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Secure Password Reset
                </h3>
                <p className="text-lg opacity-90 leading-relaxed">
                  Your account security is our priority. We'll help you get back to your alumni network safely.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">1</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Enter your email</h4>
                    <p className="text-white/80 text-sm">Provide the email associated with your account</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">2</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Check your inbox</h4>
                    <p className="text-white/80 text-sm">We'll send you a secure reset link</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">3</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold">Reset your password</h4>
                    <p className="text-white/80 text-sm">Create a new secure password</p>
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
                  IIT JU Alumni
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jahangirnagar University
                </p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Forgot Password?
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-700 text-error-700 dark:text-error-300 px-4 py-3 rounded-lg">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              leftIcon={<Mail className="h-5 w-5" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Button
              as={Link}
              to="/signin"
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="h-4 w-4" />}
              iconPosition="left"
            >
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
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Secure Account Recovery
              </h3>
              <p className="text-lg opacity-90 leading-relaxed">
                Don't worry! We'll help you regain access to your alumni account with our secure password reset process.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">1</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Enter your email</h4>
                  <p className="text-white/80 text-sm">Provide the email associated with your account</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">2</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Check your inbox</h4>
                  <p className="text-white/80 text-sm">We'll send you a secure reset link</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Reset your password</h4>
                  <p className="text-white/80 text-sm">Create a new secure password</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
