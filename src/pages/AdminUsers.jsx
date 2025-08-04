import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import { permissions, roleErrorMessages } from "../utils/roleConstants";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const API_BASE =
    process.env.REACT_APP_API_ADMIN_URL ||
    "http://localhost:8000/ijaa/api/v1/admin";

  useEffect(() => {
    if (admin && admin.token && permissions.canManageUsers(admin)) {
      fetchUsers();
    }
  }, [admin]);

  // Check if admin has permission to manage users
  if (!permissions.canManageUsers(admin)) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Insufficient Privileges
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{roleErrorMessages.insufficientPrivileges}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const fetchUsers = async () => {
    try {
      // Check if admin is available
      if (!admin || !admin.token) {
        console.error("Admin not authenticated");
        toast.error("Please login to access users");
        return;
      }

      const response = await fetch(`${API_BASE}/users`, {
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
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if data has the expected structure
      if (data && data.data) {
        setUsers(data.data);
      } else {
        console.warn("Unexpected data structure:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Users error:", error);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/block`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to block user");
      }

      toast.success("User blocked successfully");
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/unblock`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      }

      toast.success("User unblocked successfully");
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast.success("User deleted successfully");
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete user");
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

  // Check if users array is valid
  if (!Array.isArray(users)) {
    console.warn("Users data is not an array:", users);
    setUsers([]);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all registered users
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Users ({filteredUsers.length})
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </span>
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
                      <div className="text-sm text-gray-900 dark:text-white">
                        {user.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isBlocked
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            if (user.isBlocked) {
                              handleUnblockUser(user.id);
                            } else {
                              handleBlockUser(user.id);
                            }
                          }}
                          className={`p-2 rounded-md ${
                            user.isBlocked
                              ? "text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200"
                              : "text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          }`}
                          title={user.isBlocked ? "Unblock User" : "Block User"}
                        >
                          {user.isBlocked ? (
                            <UserCheck className="h-4 w-4" />
                          ) : (
                            <UserX className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Delete User
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-medium">{selectedUser.name}</span>? This
                action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 