import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Shield,
  Users,
  Globe,
  Lock,
} from "lucide-react";

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    profileVisibility: "public", // public, alumni, private
    email: "alumni", // public, alumni, private
    phone: "private",
    location: "public",
    profession: "public",
    company: "public",
    linkedin: "public",
    website: "public",
    bio: "public",
    experience: "alumni",
    education: "alumni",
    skills: "public",
    connections: "alumni",

    searchable: true,
    allowMessages: "alumni", // everyone, alumni, connections

    showOnlineStatus: true,
    allowProfileViews: true,
  });

  const visibilityOptions = [
    {
      value: "public",
      label: "Public",
      icon: Globe,
      description: "Visible to everyone",
    },
    {
      value: "alumni",
      label: "Alumni Only",
      icon: Users,
      description: "Visible to IIT JU alumni only",
    },
    {
      value: "private",
      label: "Private",
      icon: Lock,
      description: "Only visible to you",
    },
  ];

  const messageOptions = [
    {
      value: "everyone",
      label: "Everyone",
      icon: Globe,
      description: "Anyone can message you",
    },
    {
      value: "alumni",
      label: "Alumni Only",
      icon: Users,
      description: "Only IIT JU alumni can message you",
    },
    {
      value: "connections",
      label: "Connections Only",
      icon: Shield,
      description: "Only your connections can message you",
    },
  ];

  const handleSettingChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Show success message or redirect
    }, 2000);
  };

  const VisibilitySelector = ({
    value,
    onChange,
    options = visibilityOptions,
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`p-4 border-2 rounded-lg text-left transition-colors ${
            value === option.value
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50"
              : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
          }`}
        >
          <div className="flex items-center space-x-3 mb-2">
            <option.icon
              className={`h-5 w-5 ${
                value === option.value
                  ? "text-blue-600"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            />
            <span
              className={`font-medium ${
                value === option.value
                  ? "text-blue-900 dark:text-blue-100"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {option.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {option.description}
          </p>
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Privacy Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Control who can see your information
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Profile Visibility */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Profile Visibility
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Choose who can view your profile
          </p>
          <VisibilitySelector
            value={settings.profileVisibility}
            onChange={(value) =>
              handleSettingChange("profileVisibility", value)
            }
          />
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Contact Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Email Address
              </label>
              <VisibilitySelector
                value={settings.email}
                onChange={(value) => handleSettingChange("email", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Phone Number
              </label>
              <VisibilitySelector
                value={settings.phone}
                onChange={(value) => handleSettingChange("phone", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Location
              </label>
              <VisibilitySelector
                value={settings.location}
                onChange={(value) => handleSettingChange("location", value)}
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Professional Information
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Profession & Company
              </label>
              <VisibilitySelector
                value={settings.profession}
                onChange={(value) => handleSettingChange("profession", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Work Experience
              </label>
              <VisibilitySelector
                value={settings.experience}
                onChange={(value) => handleSettingChange("experience", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Skills
              </label>
              <VisibilitySelector
                value={settings.skills}
                onChange={(value) => handleSettingChange("skills", value)}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Social Links
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                LinkedIn Profile
              </label>
              <VisibilitySelector
                value={settings.linkedin}
                onChange={(value) => handleSettingChange("linkedin", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Personal Website
              </label>
              <VisibilitySelector
                value={settings.website}
                onChange={(value) => handleSettingChange("website", value)}
              />
            </div>
          </div>
        </div>

        {/* Activity & Connections */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Activity & Connections
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Connections List
              </label>
              <VisibilitySelector
                value={settings.connections}
                onChange={(value) => handleSettingChange("connections", value)}
              />
            </div>




          </div>
        </div>

        {/* Communication Preferences */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Communication Preferences
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Who can message you
              </label>
              <VisibilitySelector
                value={settings.allowMessages}
                onChange={(value) =>
                  handleSettingChange("allowMessages", value)
                }
                options={messageOptions}
              />
            </div>




          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Additional Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Searchable Profile
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Allow others to find you in search results
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange("searchable", !settings.searchable)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.searchable ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.searchable ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Show Online Status
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Let others see when you're online
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "showOnlineStatus",
                    !settings.showOnlineStatus
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.showOnlineStatus ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showOnlineStatus
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Profile View Notifications
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get notified when someone views your profile
                </p>
              </div>
              <button
                onClick={() =>
                  handleSettingChange(
                    "allowProfileViews",
                    !settings.allowProfileViews
                  )
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.allowProfileViews ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.allowProfileViews
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
