import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  RefreshCw,
  Filter as FilterIcon,
  Search,
  Bell,
  MessageSquare,
  Eye,
  EyeOff,
  Activity,
} from "lucide-react";
import { toast } from "react-toastify";
import { Card, Button, Badge } from "../components/ui";

const AdminAnnouncements = () => {
  const { admin } = useUnifiedAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "NORMAL",
  });

  const API_BASE =
    process.env.REACT_APP_API_ADMIN_URL ||
    "http://localhost:8000/ijaa/api/v1/admin";

  useEffect(() => {
    if (admin && admin.token) {
      fetchAnnouncements();
    }
  }, [admin]);

  const fetchAnnouncements = async () => {
    try {
      // Check if admin is available
      if (!admin || !admin.token) {
        console.error("Admin not authenticated");
        toast.error("Please login to access announcements");
        return;
      }

      const response = await fetch(`${API_BASE}/announcements`, {
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
        throw new Error(`Failed to fetch announcements: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if data has the expected structure
      if (data && data.data) {
        setAnnouncements(data.data);
      } else {
        console.warn("Unexpected data structure:", data);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Announcements error:", error);
      toast.error("Failed to load announcements");
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/announcements`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          priority: formData.priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      toast.success("Announcement created successfully");
      setShowCreateModal(false);
      setFormData({ title: "", content: "", priority: "NORMAL" });
      fetchAnnouncements();
    } catch (error) {
      console.error("Create announcement error:", error);
      toast.error("Failed to create announcement");
    }
  };

  const handleEditAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_BASE}/announcements/${selectedAnnouncement.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${admin.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update announcement");
      }

      toast.success("Announcement updated successfully");
      setShowEditModal(false);
      setSelectedAnnouncement(null);
      setFormData({ title: "", content: "", priority: "NORMAL" });
      fetchAnnouncements();
    } catch (error) {
      console.error("Update announcement error:", error);
      toast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/announcements/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${admin.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      toast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Delete announcement error:", error);
      toast.error("Failed to delete announcement");
    }
  };

  const openCreateModal = () => {
    setFormData({ title: "", content: "", priority: "NORMAL" });
    setShowCreateModal(true);
  };

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
    });
    setShowEditModal(true);
  };

  // Filter announcements based on search and priority
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterPriority === "all" || announcement.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalAnnouncements = announcements.length;
  const urgentAnnouncements = announcements.filter(a => a.priority === "URGENT").length;
  const highPriorityAnnouncements = announcements.filter(a => a.priority === "HIGH").length;
  const recentAnnouncements = announcements.filter(announcement => {
    const announcementDate = new Date(announcement.createdAt || 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return announcementDate > weekAgo;
  }).length;

  const getPriorityBadge = (priority) => {
    const variants = {
      URGENT: "error",
      HIGH: "warning",
      NORMAL: "primary",
      LOW: "secondary"
    };
    
    return (
      <Badge variant={variants[priority] || "secondary"} size="sm">
        {priority}
      </Badge>
    );
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "URGENT":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "HIGH":
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case "NORMAL":
        return <Bell className="h-4 w-4 text-blue-500" />;
      case "LOW":
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
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

  // Check if announcements array is valid
  if (!Array.isArray(announcements)) {
    console.warn("Announcements data is not an array:", announcements);
    setAnnouncements([]);
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header - Consistent with AdminUsers */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Announcements</h1>
              <p className="text-orange-100 text-lg">
                Manage and broadcast important messages
              </p>
              <p className="text-orange-200 text-sm mt-1">
                Keep alumni informed with timely announcements
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-orange-200 text-sm">Last Updated</p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={fetchAnnouncements}
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
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Announcements</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{totalAnnouncements}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Urgent</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">{urgentAnnouncements}</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">High Priority</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{highPriorityAnnouncements}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">This Week</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{recentAnnouncements}</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
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
                  placeholder="Search announcements..."
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
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                >
                  <option value="all">All Priorities</option>
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="NORMAL">Normal</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <Button
                variant="primary"
                onClick={openCreateModal}
                icon={<Plus className="h-4 w-4" />}
                className="h-10 px-4"
              >
                Create Announcement
              </Button>
            </div>
          </div>
        </Card>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.length === 0 ? (
            <Card className="text-center py-12">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No announcements found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterPriority !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first announcement to keep alumni informed."
                }
              </p>
              {!searchTerm && filterPriority === "all" && (
                <Button
                  variant="primary"
                  onClick={openCreateModal}
                  icon={<Plus className="h-4 w-4" />}
                  className="h-10 px-4"
                >
                  Create Announcement
                </Button>
              )}
            </Card>
          ) : (
            filteredAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden hover:shadow-lg transition-all duration-200" interactive>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        {getPriorityIcon(announcement.priority)}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {announcement.title}
                        </h3>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                        {announcement.content}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(announcement)}
                        icon={<Edit className="h-4 w-4" />}
                        title="Edit Announcement"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        icon={<Trash2 className="h-4 w-4" />}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        title="Delete Announcement"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{announcement.author || "Admin"}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Create/Edit Announcement Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {showCreateModal ? "Create New Announcement" : "Edit Announcement"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setSelectedAnnouncement(null);
                      setFormData({ title: "", content: "", priority: "NORMAL" });
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={showCreateModal ? handleCreateAnnouncement : handleEditAnnouncement} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Announcement Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Enter announcement title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
                      placeholder="Enter announcement content"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setSelectedAnnouncement(null);
                        setFormData({ title: "", content: "", priority: "NORMAL" });
                      }}
                      className="h-10 px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={<Plus className="h-4 w-4" />}
                      className="h-10 px-4"
                    >
                      {showCreateModal ? "Create Announcement" : "Update Announcement"}
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

export default AdminAnnouncements; 