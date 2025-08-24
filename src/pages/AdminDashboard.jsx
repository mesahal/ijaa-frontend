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
      color: "primary",
      description: "All registered users",
      trend: "+12%",
      trendType: "up"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "success",
      description: "Currently active users",
      trend: "+8%",
      trendType: "up"
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      icon: UserX,
      color: "error",
      description: "Suspended accounts",
      trend: "-3%",
      trendType: "down"
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      icon: Shield,
      color: "secondary",
      description: "Administrator accounts",
      trend: "+2",
      trendType: "up"
    },
    {
      title: "Active Admins",
      value: stats.activeAdmins,
      icon: ShieldCheck,
      color: "primary",
      description: "Currently active admins",
      trend: "100%",
      trendType: "up"
    },
    {
      title: "Total Announcements",
      value: stats.totalAnnouncements,
      icon: Megaphone,
      color: "warning",
      description: "All announcements",
      trend: "+5",
      trendType: "up"
    },
    {
      title: "Active Announcements",
      value: stats.activeAnnouncements,
      icon: Megaphone,
      color: "success",
      description: "Currently active announcements",
      trend: "+3",
      trendType: "up"
    },
    {
      title: "Total Reports",
      value: stats.totalReports,
      icon: FileText,
      color: "secondary",
      description: "All submitted reports",
      trend: "+15%",
      trendType: "up"
    },
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: TrendingUp,
      color: "error",
      description: "Reports awaiting review",
      trend: "+7",
      trendType: "up"
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user_registration",
      message: "New user registered: john.doe@example.com",
      time: "2 minutes ago",
      status: "success"
    },
    {
      id: 2,
      type: "report_submitted",
      message: "New report submitted for review",
      time: "5 minutes ago",
      status: "warning"
    },
    {
      id: 3,
      type: "user_blocked",
      message: "User account blocked: spam@example.com",
      time: "10 minutes ago",
      status: "error"
    },
    {
      id: 4,
      type: "announcement_published",
      message: "New announcement published: Alumni Meet 2025",
      time: "15 minutes ago",
      status: "success"
    }
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      color: "primary",
      path: "/admin/users"
    },
    {
      title: "Review Reports",
      description: "Handle pending reports",
      icon: FileText,
      color: "error",
      path: "/admin/reports"
    },
    {
      title: "Create Announcement",
      description: "Publish new announcements",
      icon: Megaphone,
      color: "warning",
      path: "/admin/announcements"
    },
    {
      title: "System Settings",
      description: "Configure system settings",
      icon: Shield,
      color: "secondary",
      path: "/admin/settings"
    }
  ];

  // Check if admin is available
  if (!admin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {admin?.name || admin?.email}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchDashboardData}
            icon={<Activity className="h-4 w-4" />}
          >
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <Badge 
                      variant={stat.trendType === "up" ? "success" : "error"} 
                      size="sm"
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {(stat.value || 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Overview */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  System Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users", value: stats.totalUsers, color: "primary" },
                    { label: "Active Users", value: stats.activeUsers, color: "success" },
                    { label: "Administrators", value: stats.totalAdmins, color: "secondary" },
                    { label: "Pending Reports", value: stats.pendingReports, color: "error" }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start h-auto p-3"
                        as="a"
                        href={action.path}
                      >
                        <Icon className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400 mr-3`} />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">{action.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activities */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`p-2 rounded-full bg-${activity.status}-100 dark:bg-${activity.status}-900/20`}>
                    {activity.status === "success" && <CheckCircle className="h-4 w-4 text-success-600 dark:text-success-400" />}
                    {activity.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning-600 dark:text-warning-400" />}
                    {activity.status === "error" && <UserX className="h-4 w-4 text-error-600 dark:text-error-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status} size="sm">
                    {activity.type.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 