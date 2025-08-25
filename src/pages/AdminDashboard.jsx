import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Megaphone,
  FileText,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Zap,
  Target,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import { Card, Badge, Button } from "../components/ui";

const AdminDashboard = () => {
  const { admin } = useUnifiedAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalAdmins: 0,
    activeAdmins: 0,
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    totalReports: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

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
          activeUsers: 0,
          blockedUsers: 0,
          totalAdmins: 0,
          activeAdmins: 0,
          totalAnnouncements: 0,
          activeAnnouncements: 0,
          totalReports: 0,
          pendingReports: 0,
        });
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");

      // Set default stats on error
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        totalAdmins: 0,
        activeAdmins: 0,
        totalAnnouncements: 0,
        activeAnnouncements: 0,
        totalReports: 0,
        pendingReports: 0,
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
      gradient: "from-blue-500 to-indigo-600",
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      description: "Currently active users",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      gradient: "from-red-500 to-pink-600",
      bgGradient:
        "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
      description: "Suspended accounts",
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      icon: Shield,
      gradient: "from-purple-500 to-violet-600",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      description: "Administrator accounts",
    },
    {
      title: "Active Admins",
      value: stats.activeAdmins,
      icon: ShieldCheck,
      gradient: "from-cyan-500 to-blue-600",
      bgGradient:
        "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      description: "Currently active admins",
    },
    {
      title: "Total Announcements",
      value: stats.totalAnnouncements,
      icon: Megaphone,
      gradient: "from-orange-500 to-amber-600",
      bgGradient:
        "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600 dark:text-orange-400",
      description: "All announcements",
    },
    {
      title: "Active Announcements",
      value: stats.activeAnnouncements,
      icon: Megaphone,
      gradient: "from-yellow-500 to-orange-600",
      bgGradient:
        "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      description: "Currently active announcements",
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: FileText,
      gradient: "from-slate-500 to-gray-600",
      bgGradient:
        "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
      iconBg: "bg-slate-500/10",
      iconColor: "text-slate-600 dark:text-slate-400",
      description: "All submitted reports",
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: TrendingUp,
      gradient: "from-rose-500 to-red-600",
      bgGradient:
        "from-rose-50 to-red-50 dark:from-rose-900/20 dark:to-red-900/20",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600 dark:text-rose-400",
      description: "Reports awaiting review",
    },
  ];

  // Check if admin is available
  if (!admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading admin data...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-primary-100 text-lg">
                Welcome back, {admin?.name || admin?.email}
              </p>
              <p className="text-primary-200 text-sm mt-1">
                Here's what's happening with your platform today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-primary-200 text-sm">Last Updated</p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchDashboardData}
                icon={<Activity className="h-4 w-4" />}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                Refresh Data
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 ${stat.bgGradient}`}
                interactive
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative p-6">
                  {/* Header with icon and trend */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3 rounded-xl ${stat.iconBg} backdrop-blur-sm`}
                    >
                      <Icon className={`h-7 w-7 ${stat.iconColor}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {(stat.value || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </p>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
