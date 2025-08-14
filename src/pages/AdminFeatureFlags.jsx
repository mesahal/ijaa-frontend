import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  Flag,
  ToggleLeft,
  ToggleRight,
  Settings,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  X,
  Filter,
} from "lucide-react";
import { adminApi } from "../utils/adminApi";

const AdminFeatureFlags = () => {
  const { admin } = useAdminAuth();
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'enabled', 'disabled'
  const [featureFlagsSummary, setFeatureFlagsSummary] = useState({
    enabled: 0,
    disabled: 0,
    total: 0
  });
  const [createForm, setCreateForm] = useState({
    featureName: "",
    description: "",
    enabled: false
  });

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  useEffect(() => {
    if (featureFlags.length > 0) {
      const summary = {
        enabled: featureFlags.filter(f => f.enabled).length,
        disabled: featureFlags.filter(f => !f.enabled).length,
        total: featureFlags.length
      };
      setFeatureFlagsSummary(summary);
    }
  }, [featureFlags]);

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      let response;
      
      // Use Group 2 functionality based on filter
      switch (filterStatus) {
        case 'enabled':
          response = await adminApi.getEnabledFeatureFlags();
          break;
        case 'disabled':
          response = await adminApi.getDisabledFeatureFlags();
          break;
        default:
          response = await adminApi.getFeatureFlags();
          break;
      }
      
      setFeatureFlags(response.data || []);
    } catch (error) {
      console.error("Feature flags error:", error);
      // Show error message
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (status) => {
    setFilterStatus(status);
    await fetchFeatureFlags();
  };

  const handleToggleFeature = async (featureName, enabled) => {
    try {
      setSaving(true);
      const updateData = {
        enabled
      };
      
      await adminApi.updateFeatureFlag(featureName, updateData);
      fetchFeatureFlags(); // Refresh the list
    } catch (error) {
      console.error("Failed to update feature flag:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleCreateFeatureFlag = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.createFeatureFlag(createForm);
      setShowCreateModal(false);
      setCreateForm({
        featureName: "",
        description: "",
        enabled: false
      });
      fetchFeatureFlags();
    } catch (error) {
      console.error("Failed to create feature flag:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFeatureFlag = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminApi.updateFeatureFlag(selectedFlag.featureName, createForm);
      setShowEditModal(false);
      setSelectedFlag(null);
      setCreateForm({
        featureName: "",
        description: "",
        enabled: false
      });
      fetchFeatureFlags();
    } catch (error) {
      console.error("Failed to update feature flag:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFeatureFlag = async (featureName) => {
    if (!window.confirm("Are you sure you want to delete this feature flag?")) {
      return;
    }

    try {
      setSaving(true);
      await adminApi.deleteFeatureFlag(featureName);
      fetchFeatureFlags();
    } catch (error) {
      console.error("Failed to delete feature flag:", error);
      // Show error message
    } finally {
      setSaving(false);
    }
  };

  const handleEditFeatureFlag = (flag) => {
    setSelectedFlag(flag);
    setCreateForm({
      featureName: flag.featureName,
      description: flag.description || "",
      enabled: flag.enabled
    });
    setShowEditModal(true);
  };

  const getFeatureIcon = (featureName) => {
    switch (featureName.toLowerCase()) {
      case "new_ui":
        return "🎨";
      case "chat_feature":
        return "💬";
      case "event_registration":
        return "📅";
      case "payment_integration":
        return "💳";
      case "social_login":
        return "🔗";
      case "dark_mode":
        return "🌙";
      case "notifications":
        return "🔔";
      case "advanced_search":
        return "🔍";
      case "alumni_directory":
        return "👥";
      case "mentorship_program":
        return "🎓";
      default:
        return "⚙️";
    }
  };

  const getFeatureDescription = (featureName) => {
    switch (featureName.toLowerCase()) {
      case "new_ui":
        return "Modern user interface with enhanced design";
      case "chat_feature":
        return "Real-time chat functionality";
      case "event_registration":
        return "Event registration system";
      case "payment_integration":
        return "Payment processing integration";
      case "social_login":
        return "Social media login options";
      case "dark_mode":
        return "Dark mode theme";
      case "notifications":
        return "Push notifications and alerts";
      case "advanced_search":
        return "Advanced search with filters";
      case "alumni_directory":
        return "Public alumni directory";
      case "mentorship_program":
        return "Mentorship program matching";
      default:
        return "Feature flag for system functionality";
    }
  };

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Feature Flags
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enable or disable system features
            </p>
          </div>
          <div className="flex space-x-2">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700"
              >
                <option value="all">All Flags</option>
                <option value="enabled">Enabled Only</option>
                <option value="disabled">Disabled Only</option>
              </select>
            </div>
            <button
              onClick={fetchFeatureFlags}
              disabled={saving}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Flag
            </button>
          </div>
        </div>

        {/* Feature Flags List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              System Features ({featureFlags.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {featureFlags.length === 0 ? (
              <div className="p-8 text-center">
                <Flag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No feature flags found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Feature flags will appear here when configured.
                </p>
              </div>
            ) : (
              featureFlags.map((feature) => (
                <div
                  key={feature.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getFeatureIcon(feature.featureName)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {feature.featureName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description || getFeatureDescription(feature.featureName)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-sm font-medium ${
                        feature.enabled
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {feature.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <button
                      onClick={() =>
                        handleToggleFeature(feature.featureName, !feature.enabled)
                      }
                      disabled={saving}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                        feature.enabled
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          feature.enabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleEditFeatureFlag(feature)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit Feature Flag"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeatureFlag(feature.featureName)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Feature Flag"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-start">
            <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                About Feature Flags
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                Feature flags allow you to enable or disable specific functionality
                across the application. Changes take effect immediately and affect
                all users. Use this feature carefully as it can impact user
                experience.
              </p>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        {featureFlags.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Feature Status Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {featureFlagsSummary.enabled}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Enabled Features
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {featureFlagsSummary.disabled}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Disabled Features
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {featureFlagsSummary.total}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Features
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Feature Flag Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create Feature Flag
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateFeatureFlag} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.featureName}
                    onChange={(e) => setCreateForm({ ...createForm, featureName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., NEW_UI"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe what this feature does..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.enabled}
                      onChange={(e) => setCreateForm({ ...createForm, enabled: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Enabled by default</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>Create Flag</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Feature Flag Modal */}
        {showEditModal && selectedFlag && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Edit Feature Flag
                  </h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedFlag(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpdateFeatureFlag} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Feature Name
                  </label>
                  <input
                    type="text"
                    value={createForm.featureName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe what this feature does..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={createForm.enabled}
                      onChange={(e) => setCreateForm({ ...createForm, enabled: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedFlag(null);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {saving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Update Flag</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeatureFlags; 