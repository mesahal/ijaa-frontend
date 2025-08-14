import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, GraduationCap, MapPin, Users, Calendar, HelpCircle } from "lucide-react";
import { Button, Card, Badge } from "../components/ui";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-primary-900/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IIT JU Alumni</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Jahangirnagar University</p>
          </div>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4 animate-pulse">404</div>
          <Card className="p-6 mb-6">
            <div className="text-6xl mb-4 animate-bounce">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Oops! The page you're looking for seems to have graduated and
              moved on. Let's get you back to familiar territory.
            </p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            as={Link}
            to="/dashboard"
            variant="primary"
            size="lg"
            fullWidth
            icon={<Home className="h-5 w-5" />}
            iconPosition="left"
          >
            Go to Dashboard
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => window.history.back()}
              icon={<ArrowLeft className="h-4 w-4" />}
              iconPosition="left"
            >
              Go Back
            </Button>

            <Button
              as={Link}
              to="/search"
              variant="outline"
              size="md"
              icon={<Search className="h-4 w-4" />}
              iconPosition="left"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Quick Navigation */}
        <Card className="mt-8 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Quick Navigation
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Users, label: "Alumni", path: "/search", color: "primary" },
              { icon: Calendar, label: "Events", path: "/events", color: "success" },
              { icon: MapPin, label: "Profile", path: "/profile", color: "warning" },
              { icon: HelpCircle, label: "Support", path: "/contact", color: "error" }
            ].map((item, index) => (
              <Button
                key={index}
                as={Link}
                to={item.path}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <item.icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
                <span className="text-xs">{item.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { label: "Profile", path: "/profile" },
              { label: "Events", path: "/events" },
              { label: "Search", path: "/search" },
              { label: "Support", path: "/contact" }
            ].map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Error Details */}
        <Card className="mt-6 p-4 border-error-200 dark:border-error-700 bg-error-50 dark:bg-error-900/10">
          <div className="text-xs text-error-700 dark:text-error-300">
            <p className="font-medium mb-1">Error Details:</p>
            <p>Page not found (404) • URL: {window.location.pathname}</p>
            <p className="mt-1">If you believe this is an error, please contact support.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;

