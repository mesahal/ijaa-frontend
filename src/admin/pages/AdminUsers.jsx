import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from '../../hooks/useAuth';
import { adminApi  } from '../../services/api/adminApi';
import { permissions, roleErrorMessages } from '../../utils/constants/roleConstants';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  UserPlus,
  Shield,
  Mail,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Crown,
  GraduationCap,
  Briefcase,
  Star,
  Activity,
  Filter as FilterIcon,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import { Card, Button, Badge   } from '../../components/ui';

const AdminUsers = () => {
  const { admin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name, email, status, joined

  useEffect(() => {
    console.log('AdminUsers useEffect triggered:', { admin, role: admin?.role, fullAdmin: JSON.stringify(admin) });
    // Only fetch users if admin is authenticated and has admin role
    if (admin && admin.role === 'ADMIN') {
      console.log('Fetching users...');
      fetchUsers();
    } else {
      console.log('Not fetching users:', { admin, role: admin?.role });
    }
  }, [admin?.role]); // Only depend on specific admin properties that matter

  // Check if admin has permission to manage users
  if (!permissions.canManageUsers(admin)) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Card className="border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Insufficient Privileges
                </h3>
                <p className="text-red-600 dark:text-red-300">
                  {roleErrorMessages.insufficientPrivileges}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const fetchUsers = async () => {
    try {
      // Check if admin is available
      if (!admin) {
        toast.error("Please login to access users");
        return;
      }

      const data = await adminApi.getUsers();
      
      // Check if data has the expected structure
      if (data && data.data) {
        // Process users to determine blocked status based on 'active' field
        const processedUsers = data.data.map(user => ({
          ...user,
          // User is blocked if active is false, or if any of the other blocked indicators are true
          isBlocked: !user.active || Boolean(user.isBlocked || user.blocked || user.status === 'BLOCKED')
        }));
        setUsers(processedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    setActionLoading(prev => ({ ...prev, [`block_${userId}`]: true }));

    try {
      const result = await adminApi.blockUser(userId);
      toast.success(result.message || "User blocked successfully");
      
      // Update the user's blocked status locally for immediate UI feedback
      setUsers(prevUsers => 
        prevUsers.map(user => {
          const userKey = user.id || user.userId || user.username;
          if (userKey === userId) {
            return { ...user, active: false, isBlocked: true };
          }
          return user;
        })
      );
      
      // Also refresh the full list to ensure consistency
      setTimeout(() => fetchUsers(), 1000);
    } catch (error) {
      toast.error(error.message || "Failed to block user");
    } finally {
      setActionLoading(prev => ({ ...prev, [`block_${userId}`]: false }));
    }
  };

  const handleUnblockUser = async (userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    setActionLoading(prev => ({ ...prev, [`unblock_${userId}`]: true }));

    try {
      const result = await adminApi.unblockUser(userId);
      toast.success(result.message || "User unblocked successfully");
      
      // Update the user's blocked status locally for immediate UI feedback
      setUsers(prevUsers => 
        prevUsers.map(user => {
          const userKey = user.id || user.userId || user.username;
          if (userKey === userId) {
            return { ...user, active: true, isBlocked: false };
          }
          return user;
        })
      );
      
      // Also refresh the full list to ensure consistency
      setTimeout(() => fetchUsers(), 1000);
    } catch (error) {
      toast.error(error.message || "Failed to unblock user");
    } finally {
      setActionLoading(prev => ({ ...prev, [`unblock_${userId}`]: false }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    setActionLoading(prev => ({ ...prev, [`delete_${userId}`]: true }));

    try {
      const result = await adminApi.deleteUser(userId);
      toast.success(result.message || "User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setActionLoading(prev => ({ ...prev, [`delete_${userId}`]: false }));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (user.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !user.isBlocked) ||
      (filterStatus === "blocked" && user.isBlocked);
    return matchesSearch && matchesFilter;
  });

  // Sort users based on selected criteria
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      case "email":
        return (a.email || "").localeCompare(b.email || "");
      case "status":
        return (a.isBlocked ? 1 : 0) - (b.isBlocked ? 1 : 0);
      case "joined":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(user => !user.isBlocked).length;
  const blockedUsers = users.filter(user => user.isBlocked).length;
  const recentUsers = users.filter(user => {
    const userDate = new Date(user.createdAt || 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate > weekAgo;
  }).length;

  const getUserRoleIcon = (user) => {
    // This is a placeholder - you can implement actual role detection logic
    if (user.role === 'admin' || user.role === 'super_admin') {
      return <Crown className="h-4 w-4 text-yellow-500" />;
    } else if (user.role === 'author') {
      return <GraduationCap className="h-4 w-4 text-blue-500" />;
    } else if (user.role === 'reviewer') {
      return <Shield className="h-4 w-4 text-purple-500" />;
    } else {
      return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUserRoleBadge = (user) => {
    const role = user.role || 'user';
    const variants = {
      admin: 'primary',
      super_admin: 'warning',
      author: 'success',
      reviewer: 'secondary',
      user: 'outline'
    };
    
    return (
      <Badge variant={variants[role] || 'outline'} size="sm">
        {getUserRoleIcon(user)}
        <span className="ml-1 capitalize">{role.replace('_', ' ')}</span>
      </Badge>
    );
  };

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

  // Check if users array is valid
  if (!Array.isArray(users)) {
    setUsers([]);
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header - Consistent with AdminFeatureFlags */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">User Management</h1>
              <p className="text-blue-100 text-lg">
                Manage and monitor all registered users
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Control user access, permissions, and account status
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-blue-200 text-sm">Last Updated</p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchUsers}
                icon={<Activity className="h-4 w-4" />}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Users</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{totalUsers}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Users</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{activeUsers}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Blocked Users</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{blockedUsers}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">New This Week</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{recentUsers}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card>
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <FilterIcon className="h-4 w-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="blocked">Blocked Only</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="status">Status</option>
                  <option value="joined">Join Date</option>
                </select>
              </div>

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-600 text-primary-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  <div className="space-y-0.5 w-4 h-4">
                    <div className="bg-current rounded-sm h-0.5"></div>
                    <div className="bg-current rounded-sm h-0.5"></div>
                    <div className="bg-current rounded-sm h-0.5"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Users Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedUsers.map((user) => {
              const userId = user.id || user.userId || user.username;
              const isBlockLoading = actionLoading[`block_${userId}`] || actionLoading[`unblock_${userId}`];
              const isBlocked = Boolean(user.isBlocked);
              
              return (
                <Card key={userId} className="overflow-hidden hover:shadow-lg transition-all duration-200" interactive>
                  <div className="p-6">
                    {/* User Avatar and Basic Info */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                          isBlocked 
                            ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" 
                            : "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                        }`}>
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                        {isBlocked && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                            <UserX className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {user.name || "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email || "No email"}
                        </p>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                        <Badge variant={isBlocked ? "error" : "success"}>
                          {isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
                        {getUserRoleBadge(user)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Joined</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      
                      {user.batch && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Batch</span>
                          <span className="text-sm text-gray-900 dark:text-white">{user.batch}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant={isBlocked ? "success" : "error"}
                        size="sm"
                        onClick={() => {
                          if (isBlocked) {
                            handleUnblockUser(userId);
                          } else {
                            handleBlockUser(userId);
                          }
                        }}
                        disabled={isBlockLoading}
                        className="flex-1 h-9 font-medium"
                        icon={isBlockLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : isBlocked ? (
                          <UserCheck className="h-4 w-4" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                      >
                        {isBlocked ? "Activate" : "Block"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 h-9 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* List View */
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Users ({sortedUsers.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedUsers.map((user) => {
                    const userId = user.id || user.userId || user.username;
                    const isBlockLoading = actionLoading[`block_${userId}`] || actionLoading[`unblock_${userId}`];
                    const isBlocked = Boolean(user.isBlocked);
                    
                    return (
                      <tr key={userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                              isBlocked 
                                ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" 
                                : "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                            }`}>
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.name || "Unknown User"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {user.batch || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900 dark:text-white">
                              {user.email || "No email"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getUserRoleBadge(user)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={isBlocked ? "error" : "success"}>
                            {isBlocked ? "Blocked" : "Active"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant={isBlocked ? "success" : "error"}
                              size="sm"
                              onClick={() => {
                                if (isBlocked) {
                                  handleUnblockUser(userId);
                                } else {
                                  handleBlockUser(userId);
                                }
                              }}
                              disabled={isBlockLoading}
                              className="h-8 px-3 font-medium"
                              icon={isBlockLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : isBlocked ? (
                                <UserCheck className="h-3 w-3" />
                              ) : (
                                <UserX className="h-3 w-3" />
                              )}
                            >
                              {isBlocked ? "Activate" : "Block"}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeleteModal(true);
                              }}
                              className="h-8 px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {sortedUsers.length === 0 && !loading && (
          <Card className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No users have been registered yet."
              }
            </p>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                    <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete User
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </span>? 
                  This will permanently remove their account and all associated data.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedUser(null);
                    }}
                    disabled={actionLoading[`delete_${selectedUser.id || selectedUser.userId || selectedUser.username}`]}
                    className="h-10 px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="error"
                    onClick={() => handleDeleteUser(selectedUser.id || selectedUser.userId || selectedUser.username)}
                    disabled={actionLoading[`delete_${selectedUser.id || selectedUser.userId || selectedUser.username}`]}
                    icon={actionLoading[`delete_${selectedUser.id || selectedUser.userId || selectedUser.username}`] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    className="h-10 px-4"
                  >
                    {actionLoading[`delete_${selectedUser.id || selectedUser.userId || selectedUser.username}`] ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 