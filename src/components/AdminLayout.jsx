import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-64">
          {/* Top bar for mobile */}
          <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 