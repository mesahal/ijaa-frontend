import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  User,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminAnnouncements = () => {
  const { admin } = useAdminAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
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
      resetForm();
      fetchAnnouncements();
    } catch (error) {
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
      resetForm();
      fetchAnnouncements();
    } catch (error) {
      toast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
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
      toast.error("Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "NORMAL",
    });
  };

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || "NORMAL",
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const AnnouncementModal = ({ isOpen, onClose, onSubmit, title, submitText }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter announcement title"
              />
            </div>

                         <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Content
               </label>
               <textarea
                 required
                 rows={6}
                 value={formData.content}
                 onChange={(e) =>
                   setFormData({ ...formData, content: e.target.value })
                 }
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                 placeholder="Enter announcement content"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 Priority
               </label>
               <select
                 value={formData.priority}
                 onChange={(e) =>
                   setFormData({ ...formData, priority: e.target.value })
                 }
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
               >
                 <option value="LOW">Low</option>
                 <option value="NORMAL">Normal</option>
                 <option value="HIGH">High</option>
                 <option value="URGENT">Urgent</option>
               </select>
             </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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

  // Check if announcements array is valid
  if (!Array.isArray(announcements)) {
    console.warn("Announcements data is not an array:", announcements);
    setAnnouncements([]);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Announcements
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage announcements for alumni
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Announcement
          </button>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No announcements yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first announcement to keep alumni informed.
              </p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Announcement
              </button>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
              >
                                 <div className="flex justify-between items-start mb-4">
                   <div className="flex-1">
                     <div className="flex items-center space-x-2 mb-2">
                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                         {announcement.title}
                       </h3>
                       {announcement.priority && (
                         <span
                           className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                             announcement.priority === "URGENT"
                               ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                               : announcement.priority === "HIGH"
                               ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                               : announcement.priority === "NORMAL"
                               ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                               : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                           }`}
                         >
                           {announcement.priority}
                         </span>
                       )}
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                       {announcement.content}
                     </p>
                   </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => openEditModal(announcement)}
                      className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                      title="Edit Announcement"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                      title="Delete Announcement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {announcement.author || "Admin"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Announcement Modal */}
        <AnnouncementModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAnnouncement}
          title="Create New Announcement"
          submitText="Create Announcement"
        />

        {/* Edit Announcement Modal */}
        <AnnouncementModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAnnouncement(null);
          }}
          onSubmit={handleEditAnnouncement}
          title="Edit Announcement"
          submitText="Update Announcement"
        />
      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncements; 