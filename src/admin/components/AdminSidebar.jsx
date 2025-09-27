import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Flag,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/**
 * Admin Sidebar Component
 * Navigation sidebar for admin panel
 */
const AdminSidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
    },
    {
      name: 'Feature Flags',
      path: '/admin/feature-flags',
      icon: Flag,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
    },
    {
      name: 'Management',
      path: '/admin/management',
      icon: Shield,
    },
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Admin Panel
            </h2>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
