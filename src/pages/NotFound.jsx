import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search, GraduationCap } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-3">
            <GraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IIT JU Alumni</h1>
            <p className="text-sm text-gray-500">Jahangirnagar University</p>
          </div>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-600">
              Oops! The page you're looking for seems to have graduated and
              moved on. Let's get you back to familiar territory.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go to Dashboard</span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>

            <Link
              to="/search"
              className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">


            <Link
              to="/profile"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
