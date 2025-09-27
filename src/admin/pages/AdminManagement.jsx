import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from '../../hooks/useAuth';
import { adminApi  } from '../../services/api/adminApi';
import {
  Shield,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Eye,
  EyeOff,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  Filter as FilterIcon,
  Crown,
  Users,
  Activity,
  Calendar,
  Mail,
  TrendingUp,
  UserCheck,
  UserX,
  Settings,
  Lock,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card, Badge, Avatar   } from '../../components/ui';

const AdminManagement = () => {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create admin form state
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllAdmins();
      setAdmins(response.data || response);
    } catch (error) {
      toast.error("Failed to load admin list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentAdmin && currentAdmin.token) {
      fetchAdmins();
    }
  }, [currentAdmin, fetchAdmins]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!validateCreateForm()) {
      return;
    }

    try {
      setActionLoading(true);
      const { confirmPassword, ...adminData } = createForm;
      await adminApi.createAdmin(adminData);

      toast.success("Admin created successfully");
      setShowCreateModal(false);
      resetCreateForm();
      fetchAdmins(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to create admin");
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateAdmin = async (adminId) => {
    try {
      setActionLoading(true);
      await adminApi.activateAdmin(adminId);
      toast.success("Admin activated successfully");
      fetchAdmins(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to activate admin");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateAdmin = async (adminId) => {
    try {
      setActionLoading(true);
      await adminApi.deactivateAdmin(adminId);
      toast.success("Admin deactivated successfully");
      fetchAdmins(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to deactivate admin");
    } finally {
      setActionLoading(false);
    }
  };

  const validateCreateForm = () => {
    const errors = {};

    if (!createForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!createForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(createForm.email)) {
      errors.email = "Email is invalid";
    }

    if (!createForm.password) {
      errors.password = "Password is required";
    } else if (createForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (!createForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (createForm.password !== createForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
    });
    setFormErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = (admin.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      (admin.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "active" && admin.active) ||
      (statusFilter === "inactive" && !admin.active);
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(admin => admin.active).length;
  const inactiveAdmins = admins.filter(admin => !admin.active).length;
  const superAdmins = admins.filter(admin => admin.role === "SUPER_ADMIN").length;
  const recentAdmins = admins.filter(admin => {
    const adminDate = new Date(admin.createdAt || 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return adminDate > weekAgo;
  }).length;

  const getRoleBadge = (role) => {
    const variants = {
      SUPER_ADMIN: "error",
      ADMIN: "primary",
    };
    
    return (
      <Badge variant={variants[role] || "secondary"} size="sm">
        {role === "SUPER_ADMIN" ? (
          <Crown className="h-3 w-3 mr-1" />
        ) : (
          <Shield className="h-3 w-3 mr-1" />
        )}
        {role.replace('_', ' ')}
      </Badge>
    );
  };

  // Check if admin is available
  if (!currentAdmin) {
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
      <div className="space-y-8">
        {/* Enhanced Header - Consistent with AdminUsers */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Admin Management</h1>
              <p className="text-indigo-100 text-lg">
                Manage administrator accounts and permissions
              </p>
              <p className="text-indigo-200 text-sm mt-1">
                Create, activate, and manage admin access levels
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-indigo-200 text-sm">Last Updated</p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchAdmins}
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Admins</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalAdmins}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{activeAdmins}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Inactive</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{inactiveAdmins}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Super Admins</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{superAdmins}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
                  placeholder="Search admins..."
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="all">All Admins</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<UserPlus className="h-4 w-4" />}
                className="h-10 px-4"
              >
                Create Admin
              </Button>
            </div>
          </div>
        </Card>

        {/* Admins Table */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Administrators ({filteredAdmins.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Admin
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
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          size="md"
                          src={admin.profilePicture}
                          alt={admin.name}
                          fallback={admin.name}
                          className="w-10 h-10"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {admin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.batch || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900 dark:text-white">
                          {admin.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(admin.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={admin.active ? "success" : "error"}
                        size="sm"
                      >
                        {admin.active ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {admin.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {new Date(admin.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {admin.id !== currentAdmin?.id && (
                        <div className="flex items-center justify-end space-x-2">
                          {admin.active ? (
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() => handleDeactivateAdmin(admin.id)}
                              disabled={actionLoading}
                              className="h-8 px-3 font-medium"
                              icon={actionLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleActivateAdmin(admin.id)}
                              disabled={actionLoading}
                              className="h-8 px-3 font-medium"
                              icon={actionLoading ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Empty State */}
        {filteredAdmins.length === 0 && (
          <Card className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Shield className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No admins found"
                : "No admins"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating a new admin account."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                icon={<UserPlus className="h-4 w-4" />}
                className="h-10 px-4"
              >
                Create Admin
              </Button>
            )}
          </Card>
        )}

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create New Admin
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    error={formErrors.name}
                    leftIcon={<User className="h-4 w-4" />}
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    placeholder="Enter email address"
                    error={formErrors.email}
                    leftIcon={<Mail className="h-4 w-4" />}
                    required
                  />

                  <Input
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    placeholder="Enter password"
                    error={formErrors.password}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    required
                  />

                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={createForm.confirmPassword}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm password"
                    error={formErrors.confirmPassword}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      value={createForm.role}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, role: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateModal(false)}
                      disabled={actionLoading}
                      className="h-10 px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={actionLoading}
                      icon={<UserPlus className="h-4 w-4" />}
                      className="h-10 px-4"
                    >
                      {actionLoading ? "Creating..." : "Create Admin"}
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
