import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  Users,

  UserX,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    participationCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  const API_BASE =
    process.env.REACT_APP_API_ADMIN_URL ||
    "http://localhost:8000/ijaa/api/v1/admin";

  useEffect(() => {
    if (admin && admin.token) {
      fetchDashboardData();
    }
  }, [admin]);

  const fetchDashboardData = async () => {
    try {
      // Check if admin is available
      if (!admin || !admin.token) {
        console.error("Admin not authenticated");
        toast.error("Please login to access dashboard");
        return;
      }

      const response = await fetch(`${API_BASE}/dashboard`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if data has the expected structure
      if (data && data.data) {
        setStats(data.data);
      } else {
        console.warn("Unexpected data structure:", data);
        setStats({
          totalUsers: 0,
          blockedUsers: 0,
          participationCount: 0,
        });
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
      
      // Set default stats on error
      setStats({
        totalUsers: 0,
        blockedUsers: 0,
        participationCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },

    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      color: "bg-red-500",
      textColor: "text-red-500",
    },
    {
      title: "Participation",
      value: stats.participationCount,
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
  ];

  // Check if admin is available
  if (!admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading admin data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {admin?.name || admin?.email}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full ${stat.color} bg-opacity-10`}
                  >
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {(stat.value || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">

                <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Manage Users
                  </p>
                </button>
                <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    View Reports
                  </p>
                </button>
                <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                  <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    System Status
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 