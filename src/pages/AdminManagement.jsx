import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import { adminApi } from "../utils/adminApi";
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
} from "lucide-react";
import { toast } from "react-toastify";
import { Button, Input, Card, Badge, Avatar } from "../components/ui";

const AdminManagement = () => {
  const { admin: currentAdmin } = useUnifiedAuth();
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

  useEffect(() => {
    if (currentAdmin && currentAdmin.token) {
      fetchAdmins();
    }
  }, [currentAdmin]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllAdmins();
      setAdmins(response.data || response);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      toast.error("Failed to load admin list");
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Failed to create admin:", error);
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
      console.error("Failed to activate admin:", error);
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
      console.error("Failed to deactivate admin:", error);
      toast.error(error.message || "Failed to deactivate admin");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
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
      errors.email = "Please enter a valid email address";
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

  // Filter admins based on search and status
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
                         (statusFilter === "active" && admin.active) ||
                         (statusFilter === "inactive" && !admin.active);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-3 shadow-lg">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Admin Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage admin accounts and permissions
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowCreateModal(true)}
              icon={<Plus className="h-5 w-5" />}
              iconPosition="left"
            >
              Add Admin
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400">
                {filteredAdmins.length} of {admins.length} admins
              </div>
            </div>
          </div>
        </Card>

        {/* Admins Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar
                          size="lg"
                          src={`/logo.png`}
                          alt={admin.name}
                          fallback={admin.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {admin.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={admin.role === "SUPER_ADMIN" ? "error" : admin.role === "ADMIN" ? "primary" : "success"}
                        size="sm"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {admin.role}
                      </Badge>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(admin.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {admin.id !== currentAdmin?.id && (
                        <div className="flex items-center justify-end space-x-2">
                          {admin.active ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeactivateAdmin(admin.id)}
                              disabled={actionLoading}
                              icon={<XCircle className="h-3 w-3" />}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivateAdmin(admin.id)}
                              disabled={actionLoading}
                              icon={<CheckCircle className="h-3 w-3" />}
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

          {/* Empty State */}
          {filteredAdmins.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Shield className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {searchTerm || statusFilter !== "all" ? "No admins found" : "No admins"}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating a new admin account."
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="mt-6">
                  <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    icon={<Plus className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Add Admin
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-2xl bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Admin
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  icon={<XCircle className="h-6 w-6" />}
                />
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  value={createForm.name}
                  onChange={handleFormChange}
                  placeholder="Enter admin name"
                  error={formErrors.name}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleFormChange}
                  placeholder="Enter admin email"
                  error={formErrors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleFormChange}
                  placeholder="Enter password"
                  error={formErrors.password}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={createForm.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm password"
                  error={formErrors.confirmPassword}
                  required
                />

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={actionLoading}
                    icon={<UserPlus className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    {actionLoading ? "Creating..." : "Create Admin"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminManagement;
