import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { adminMenuItems } from "../utils/roleConstants";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Flag,
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { adminSignOut, admin } = useAdminAuth();

  // Map menu items to icons
  const iconMap = {
    dashboard: LayoutDashboard,
    users: Users,
    announcements: Megaphone,
    reports: FileText,
    settings: Flag,
  };

  // Filter navigation items based on admin role
  const navigation = adminMenuItems
    .filter(item => item.visible(admin))
    .map(item => ({
      name: item.label,
      href: item.path,
      icon: iconMap[item.icon] || LayoutDashboard,
    }));

  const handleLogout = () => {
    adminSignOut();
    navigate("/admin/login");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-white text-xl font-bold">Admin Panel</h1>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href)
                        ? "text-white"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default AdminSidebar; 