import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Camera,
  Edit3,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Save,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profileData, setProfileData] = useState({});
  const [visibility, setVisibility] = useState({});

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const requiredFields = ["name", "profession", "location", "bio"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!profileData[field] || profileData[field].trim() === "") {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE}/profile`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const profile = response.data.data;
      console.log("Fetched Profile:", profile);
      setProfileData(profile);
      setVisibility({
        showPhone: profile.showPhone,
        showLinkedIn: profile.showLinkedIn,
        showWebsite: profile.showWebsite,
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSection = async (sectionName, payload) => {
    try {
      const response = await axios.put(`${API_BASE}/${sectionName}`, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      const updatedProfile = response.data.data;
      setProfileData(updatedProfile);
      setVisibility({
        showPhone: updatedProfile.showPhone,
        showLinkedIn: updatedProfile.showLinkedIn,
        showWebsite: updatedProfile.showWebsite,
      });

      setIsEditing(false);
    } catch (err) {
      console.error(`Failed to update ${sectionName}`, err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    // Combine profile data with visibility settings
    const payload = {
      ...profileData,
      ...visibility,
    };

    await updateSection("basic", payload);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset to original data
    fetchProfile();
  };

  const toggleVisibility = async (field) => {
    const updated = { ...visibility, [field]: !visibility[field] };
    setVisibility(updated);

    if (!isEditing) {
      await updateSection("visibility", updated);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  const renderField = (
    label,
    name,
    Icon,
    isLink = false,
    visibilityKey = null
  ) => {
    const value = profileData[name];
    const showVisibilityToggle =
      visibilityKey &&
      ["showPhone", "showLinkedIn", "showWebsite"].includes(visibilityKey);
    console.log(label, name, value, isEditing, visibilityKey, visibility);
    if (!value && !isEditing) return null;

    return (
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {label}
            </p>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name={name}
                  value={value || ""}
                  onChange={handleInputChange}
                  className="text-sm text-gray-600 dark:text-gray-300 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full"
                />
                {errors[name] && (
                  <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
                )}
              </div>
            ) : isLink ? (
              <a
                href={value}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate block"
                target="_blank"
                rel="noopener noreferrer"
              >
                {label === "Website" ? "Visit Website" : "View Profile"}
              </a>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {value}
              </p>
            )}
          </div>
        </div>
        {showVisibilityToggle && (
          <button
            onClick={() => toggleVisibility(visibilityKey)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-2"
          >
            {visibility[visibilityKey] ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-emerald-600 relative">
          <img
            src="/cover-image.jpg"
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <button className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-lg">
            <Camera className="h-5 w-5" />
          </button>
        </div>

        <div className="px-4 sm:px-8 pb-8 relative">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-4 sm:left-8">
            <img
              src={user?.avatar || "/dp.jpg"}
              alt={profileData.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Header Content */}
          <div className="pt-12 sm:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Name */}
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name || ""}
                      onChange={handleInputChange}
                      className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full"
                      placeholder="Your Name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {profileData.name}
                  </h1>
                )}

                {/* Profession */}
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="profession"
                      value={profileData.profession || ""}
                      onChange={handleInputChange}
                      className="text-lg text-gray-600 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full"
                      placeholder="Your Profession"
                    />
                    {errors.profession && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.profession}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {profileData.profession}
                  </p>
                )}

                {/* Location and Batch */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <input
                        type="text"
                        name="location"
                        value={profileData.location || ""}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none"
                        placeholder="Location"
                      />
                      {errors.location && (
                        <p className="text-xs text-red-500 ml-2">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  ) : (
                    profileData.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profileData.location}</span>
                      </div>
                    )
                  )}

                  {profileData.batch && (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        Batch {profileData.batch} • {profileData.department}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h2>
            {isEditing ? (
              <div>
                <textarea
                  name="bio"
                  value={profileData.bio || ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full border rounded-lg p-3 dark:bg-gray-700 dark:text-white focus:border-blue-500 outline-none"
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="text-sm text-red-500 mt-2">{errors.bio}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profileData.bio || "No bio available"}
              </p>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Experience
              </h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  + Add Experience
                </button>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              No experience added yet
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Skills
              </h2>
              {isEditing && (
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  + Add Skills
                </button>
              )}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-center py-8">
              No skills added yet
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              {renderField("Email", "email", Mail)}
              {renderField("Phone", "phone", Phone, false, "showPhone")}
              {renderField(
                "LinkedIn",
                "linkedIn",
                Linkedin,
                true,
                "showLinkedIn"
              )}
              {renderField("Website", "website", Globe, true, "showWebsite")}
            </div>
          </div>

          {/* Profile Stats - NOT EDITABLE */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Profile Views
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  156
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Connections
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  124
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Groups Joined
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  8
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Events Attended
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  12
                </span>
              </div>
            </div>
          </div>

          {/* Profile Completion - NOT EDITABLE */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile Completion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              85% complete
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add more details to improve your profile visibility
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
