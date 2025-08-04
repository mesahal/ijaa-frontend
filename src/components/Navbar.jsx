import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  Moon,
  Sun,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/events", icon: Calendar, label: "Events" },
    { path: "/search", icon: Search, label: "Search" },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg p-2">
                <User className="h-6 w-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  IIT JU Alumni
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Jahangirnagar University
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <img
                  src={user?.avatar || "/dp.png"}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.name}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/profile/edit"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Link>
                  <Link
                    to="/settings/privacy"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Privacy Settings</span>
                  </Link>
                  <Link
                    to="/settings/account"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
