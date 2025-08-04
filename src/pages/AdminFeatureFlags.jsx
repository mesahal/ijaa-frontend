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
} from "lucide-react";
import { toast } from "react-toastify";

const AdminFeatureFlags = () => {
  const { admin } = useAdminAuth();
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API_BASE =
    process.env.REACT_APP_API_ADMIN_URL ||
    "http://localhost:8000/ijaa/api/v1/admin";

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      const response = await fetch(`${API_BASE}/feature-flags`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch feature flags");
      }

      const data = await response.json();
      setFeatureFlags(data.data);
    } catch (error) {
      toast.error("Failed to load feature flags");
      console.error("Feature flags error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async (featureName, enabled) => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/feature-flags/${featureName}?enabled=${enabled}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update feature flag");
      }

      toast.success(
        `Feature ${enabled ? "enabled" : "disabled"} successfully`
      );
      fetchFeatureFlags(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update feature flag");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/feature-flags/batch`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${admin.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: featureFlags }),
      });

      if (!response.ok) {
        throw new Error("Failed to save feature flags");
      }

      toast.success("All feature flags saved successfully");
    } catch (error) {
      toast.error("Failed to save feature flags");
    } finally {
      setSaving(false);
    }
  };

  const getFeatureIcon = (featureName) => {
    switch (featureName.toLowerCase()) {


      case "enableprofileedit":
        return "👤";

      case "enablenotifications":
        return "🔔";
      case "enablesearch":
        return "🔍";
      default:
        return "⚙️";
    }
  };

  const getFeatureDescription = (featureName) => {
    switch (featureName.toLowerCase()) {


      case "enableprofileedit":
        return "Allow users to edit their profile information";

      case "enablenotifications":
        return "Enable push notifications and alerts";
      case "enablesearch":
        return "Enable alumni search functionality";
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
            <button
              onClick={fetchFeatureFlags}
              disabled={saving}
              className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Refresh
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              Save All
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
                      {getFeatureIcon(feature.name)}
                    </div>
                    <div className="flex-1">
                                           <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                       {feature.featureName}
                     </h4>
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                       {getFeatureDescription(feature.featureName)}
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
                  {featureFlags.filter((f) => f.enabled).length}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Enabled Features
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {featureFlags.filter((f) => !f.enabled).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Disabled Features
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {featureFlags.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Features
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeatureFlags; 