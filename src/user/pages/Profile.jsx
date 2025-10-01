import React, { useEffect, useState } from "react";
import apiClient from '../../services/api/apiClient';
import AuthService from "../../services/auth/AuthService";
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
  Plus,
  Trash2,
  Facebook,
  Calendar,
  User,
  Award,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  Heart,
  Star,
  CheckCircle,
  ExternalLink,
  Users,
  Lock,
  Key,
  Shield,
} from "lucide-react";
import { useAuth } from '../../hooks/useAuth';
import { Card, Button, Avatar, Badge, Input   } from '../../components/ui';
import {
  PhotoDisplay,
  ProfilePhotoUploadButton,
  CoverPhotoUploadButton,
  usePhotoManager,
} from "../components/PhotoManager";
import FeatureFlagWrapper from '../../components/layout/FeatureFlagWrapper';
import { toast } from "react-toastify";
import ThemeSettingsCard from "../../components/common/ThemeSettingsCard";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  };

  const [profileData, setProfileData] = useState({});
  const [visibility, setVisibility] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
  });
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddInterest, setShowAddInterest] = useState(false);

  const [errors, setErrors] = useState({});

  // Password change state
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePhotoUpdate = (type, photoUrl) => {
    // This will be called by the photo manager when photos are updated
  };

  // Photo management
  const {
    profilePhotoUrl,
    coverPhotoUrl,
    loading: photoLoading,
    error: photoError,
    handleFileUpload,
    reloadPhotos,
  } = usePhotoManager({
    userId: user?.userId,
    onPhotoUpdate: handlePhotoUpdate,
  });
  // Set loading to false if photo loading fails
  useEffect(() => {
    if (photoError && loading) {
      setLoading(false);
    }
  }, [photoError, loading]);

  const validateFields = () => {
    const requiredFields = ["name", "profession", "location", "bio", "batch"];
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

      if (!user?.userId) {
        setLoading(false);
        return;
      }

      const response = await apiClient.get(`/users/${user?.userId}`);

      if (!response.data || !response.data.data) {
        throw new Error("Invalid profile response structure");
      }

      const profile = response.data.data;

      if (!profile) {
        throw new Error("No profile data received");
      }

      // Ensure all required fields are present with proper fallbacks
      const profileWithDefaults = {
        userId: profile.userId || user?.userId,
        name: profile.name || user?.name || "",
        profession: profile.profession || user?.profession || "",
        location: profile.location || user?.location || "",
        bio: profile.bio || user?.bio || "",
        phone: profile.phone || user?.phone || "",
        linkedIn: profile.linkedIn || user?.linkedIn || "",
        website: profile.website || user?.website || "",
        batch: profile.batch || user?.batch || "",
        facebook: profile.facebook || user?.facebook || "",
        email: profile.email || user?.email || "",
        connections: profile.connections || user?.connections || 0,
        showPhone: profile.showPhone !== undefined ? profile.showPhone : true,
        showLinkedIn:
          profile.showLinkedIn !== undefined ? profile.showLinkedIn : true,
        showWebsite:
          profile.showWebsite !== undefined ? profile.showWebsite : true,
        showEmail: profile.showEmail !== undefined ? profile.showEmail : true,
        showFacebook:
          profile.showFacebook !== undefined ? profile.showFacebook : true,
        ...profile, // Spread any additional fields
      };

      setProfileData(profileWithDefaults);
      setVisibility({
        showPhone: profileWithDefaults.showPhone,
        showLinkedIn: profileWithDefaults.showLinkedIn,
        showWebsite: profileWithDefaults.showWebsite,
        showEmail: profileWithDefaults.showEmail,
        showFacebook: profileWithDefaults.showFacebook,
      });
    } catch (err) {
      // Set default profile data on error, using user context data as fallback
      const defaultProfile = {
        userId: user?.userId,
        name: user?.name || "",
        profession: user?.profession || "",
        location: user?.location || "",
        bio: user?.bio || "",
        phone: user?.phone || "",
        linkedIn: user?.linkedIn || "",
        website: user?.website || "",
        batch: user?.batch || "",
        facebook: user?.facebook || "",
        email: user?.email || "",
        connections: user?.connections || 0,
        showPhone: true,
        showLinkedIn: true,
        showWebsite: true,
        showEmail: true,
        showFacebook: true,
      };
      setProfileData(defaultProfile);
      setVisibility({
        showPhone: true,
        showLinkedIn: true,
        showWebsite: true,
        showEmail: true,
        showFacebook: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await apiClient.get(`/users/${user?.userId}/experiences`);

      if (!response.data || !response.data.data) {
        setExperiences([]);
        return;
      }

      const experiencesData = response.data.data;

      // Handle different response formats
      if (Array.isArray(experiencesData)) {
        setExperiences(experiencesData);
      } else if (experiencesData && typeof experiencesData === "object") {
        // If it's a single object, wrap it in an array
        setExperiences([experiencesData]);
      } else {
        setExperiences([]);
      }
    } catch (err) {
      setExperiences([]);
    }
  };

  const fetchInterests = async () => {
    try {
      const response = await apiClient.get(`/users/${user?.userId}/interests`);

      if (!response.data || !response.data.data) {
        setInterests([]);
        return;
      }

      const interestsData = response.data.data;

      // Handle different response formats
      if (Array.isArray(interestsData)) {
        setInterests(interestsData);
      } else if (interestsData && typeof interestsData === "object") {
        // If it's a single object, wrap it in an array
        setInterests([interestsData]);
      } else {
        setInterests([]);
      }
    } catch (err) {
      setInterests([]);
    }
  };

  const updateSection = async (sectionName, payload) => {
    try {
      let endpoint;
      let requestPayload;

      if (sectionName === "profile") {
        // For profile update, use PUT /users/{userId} endpoint
        endpoint = `/users/${user?.userId}`;
        requestPayload = {
          ...payload,
          userId: user?.userId,
        };
      } else if (sectionName === "visibility") {
        // For visibility update, use PUT /users/{userId}/profile endpoint
        endpoint = `/users/${user?.userId}/profile`;
        requestPayload = payload; // Don't include userId for visibility
      } else {
        endpoint = `/users/${user?.userId}/${sectionName}`;
        requestPayload = payload;
      }

      const response = await apiClient.put(endpoint, requestPayload);

      const updatedProfile = response.data.data;
      setProfileData(updatedProfile);
      setVisibility({
        showPhone: updatedProfile.showPhone,
        showLinkedIn: updatedProfile.showLinkedIn,
        showWebsite: updatedProfile.showWebsite,
        showEmail: updatedProfile.showEmail,
        showFacebook: updatedProfile.showFacebook,
      });

      setIsEditing(false);
    } catch (err) {
    }
  };

  const addExperience = async () => {
    if (!newExperience.title || !newExperience.company) {
      alert("Title and Company are required");
      return;
    }

    try {
      // According to API docs: POST /experiences with { title, company, period, description }
      const experienceData = {
        title: newExperience.title,
        company: newExperience.company,
        period: newExperience.period,
        description: newExperience.description,
      };

      await apiClient.post(`/users/${user?.userId}/experiences`, experienceData);

      setNewExperience({ title: "", company: "", period: "", description: "" });
      setShowAddExperience(false);
      fetchExperiences();
    } catch (err) {
      alert("Failed to add experience. Please try again.");
    }
  };

  const deleteExperience = async (experienceId) => {
    try {
      // According to API docs: DELETE /experiences/{experienceId}
      await apiClient.delete(`/users/${user?.userId}/experiences/${experienceId}`);
      fetchExperiences();
    } catch (err) {
      alert("Failed to delete experience. Please try again.");
    }
  };

  const addInterest = async () => {
    if (!newInterest.trim()) {
      alert("Interest cannot be empty");
      return;
    }

    try {
      // According to API docs: POST /interests with { interest: "value" }
      await apiClient.post(`/users/${user?.userId}/interests`, { interest: newInterest.trim() });

      // Refresh the interests list
      fetchInterests();
      setNewInterest("");
      setShowAddInterest(false);
    } catch (err) {
      if (err.response?.status === 400) {
        alert("Interest already exists or is invalid");
      } else {
        alert("Failed to add interest. Please try again.");
      }
    }
  };

  const deleteInterest = async (interestId) => {
    try {
      // According to API docs: DELETE /interests/{interestId}
      await apiClient.delete(`/users/${user?.userId}/interests/${interestId}`);

      fetchInterests();
    } catch (err) {
      alert("Failed to delete interest. Please try again.");
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

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    // Update both profile data and visibility settings
    const updatedProfileData = {
      ...profileData,
      ...visibility,
    };

    await updateSection("profile", updatedProfileData);
  };

  // Password change functions
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };



  const validatePasswordForm = () => {
    const errors = {};

    // Current password validation
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
    } else if (passwordData.newPassword.length > 128) {
      errors.newPassword = "New password must be less than 128 characters";
    } else if (!/(?=.*[a-z])/.test(passwordData.newPassword)) {
      errors.newPassword = "New password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
      errors.newPassword = "New password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = "New password must contain at least one number";
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(passwordData.newPassword)) {
      errors.newPassword = "New password must contain at least one special character";
    }

    // Confirm password validation
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is different from current password
    if (passwordData.currentPassword && passwordData.newPassword && 
        passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };



  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      setPasswordLoading(true);

      // Use AuthService for password change with access token
      const accessToken = window.__accessToken;
      if (!accessToken) {
        throw new Error("No access token available. Please log in again.");
      }

      await AuthService.changePassword(passwordData, accessToken);

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});

      // Show success message
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const renderContactField = (
    label,
    value,
    Icon,
    isLink = false,
    isVisible = true
  ) => {
    // Don't show if value doesn't exist or visibility is false
    if (!value || !isVisible) return null;

    return (
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          {isLink ? (
            <a
              href={value}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 truncate block"
              target="_blank"
              rel="noopener noreferrer"
            >
              {label === "Website"
                ? "Visit Website"
                : label === "Facebook"
                ? "View Profile"
                : "View Profile"}
            </a>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {value}
            </p>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (user?.userId) {
      fetchProfile();
      fetchExperiences();
      fetchInterests();

      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
        }
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timeout);
    }
  }, [user?.userId]); // Removed loading from dependency array to prevent infinite loop

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-48 rounded-t-2xl"></div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-b-2xl">
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-emerald-600 relative">
          <PhotoDisplay
            photoUrl={coverPhotoUrl}
            alt="Cover"
            type="cover"
            className="w-full h-full object-cover"
          />
          <CoverPhotoUploadButton
            userId={user?.userId}
            onPhotoUpdate={handlePhotoUpdate}
            onFileUpload={handleFileUpload}
            isEditing={isEditing}
          />
        </div>

        <div className="px-4 sm:px-8 pb-8 relative">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-4 sm:left-8">
            <div className="relative">
              <PhotoDisplay
                photoUrl={profilePhotoUrl}
                alt={profileData.name || "Profile"}
                type="profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
              />
              <ProfilePhotoUploadButton
                userId={user?.userId}
                onPhotoUpdate={handlePhotoUpdate}
                onFileUpload={handleFileUpload}
                isEditing={isEditing}
              />
            </div>
          </div>

          {/* Header Content */}
          <div className="pt-12 sm:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {profileData.name || "Your Name"}
                </h1>

                {/* Profession */}
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {profileData.profession || "Your Profession"}
                </p>

                {/* Location and Batch */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                  {profileData.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}

                  {profileData.batch && (
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-4 w-4" />
                      <span> {profileData.batch}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{profileData.connections || 0} connections</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    icon={<Edit3 className="h-4 w-4" />}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      icon={<Save className="h-4 w-4" />}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      icon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>
                  </div>
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
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h4>
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileData.name || ""}
                    onChange={handleInputChange}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Profession"
                    name="profession"
                    value={profileData.profession || ""}
                    onChange={handleInputChange}
                    error={errors.profession}
                    required
                  />
                  <Input
                    label="Location"
                    name="location"
                    value={profileData.location || ""}
                    onChange={handleInputChange}
                    error={errors.location}
                    leftIcon={<MapPin className="h-4 w-4" />}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Batch <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-4 w-4 text-gray-400" />
                      </div>
                      <select
                        name="batch"
                        value={profileData.batch || ""}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                      >
                        <option value="">Select your batch</option>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(
                          (batchNum) => (
                            <option
                              key={batchNum}
                              value={`${batchNum}${getOrdinalSuffix(
                                batchNum
                              )} Batch`}
                            >
                              {batchNum}
                              {getOrdinalSuffix(batchNum)} Batch
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {errors.batch && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.batch}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Bio
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      About Me <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bio"
                      value={profileData.bio || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h4>

                  {/* Email */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility("showEmail")}
                        icon={
                          visibility.showEmail ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visibility.showEmail ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                    <Input
                      name="email"
                      value={profileData.email || ""}
                      onChange={handleInputChange}
                      leftIcon={<Mail className="h-4 w-4" />}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility("showPhone")}
                        icon={
                          visibility.showPhone ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visibility.showPhone ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                    <Input
                      name="phone"
                      value={profileData.phone || ""}
                      onChange={handleInputChange}
                      leftIcon={<Phone className="h-4 w-4" />}
                      placeholder="+1-555-123-4567"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        LinkedIn Profile
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility("showLinkedIn")}
                        icon={
                          visibility.showLinkedIn ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visibility.showLinkedIn ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                    <Input
                      name="linkedIn"
                      value={profileData.linkedIn || ""}
                      onChange={handleInputChange}
                      leftIcon={<Linkedin className="h-4 w-4" />}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Website
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility("showWebsite")}
                        icon={
                          visibility.showWebsite ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visibility.showWebsite ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                    <Input
                      name="website"
                      value={profileData.website || ""}
                      onChange={handleInputChange}
                      leftIcon={<Globe className="h-4 w-4" />}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  {/* Facebook */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Facebook Profile
                      </label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleVisibility("showFacebook")}
                        icon={
                          visibility.showFacebook ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {visibility.showFacebook ? "Visible" : "Hidden"}
                      </Button>
                    </div>
                    <Input
                      name="facebook"
                      value={profileData.facebook || ""}
                      onChange={handleInputChange}
                      leftIcon={<Facebook className="h-4 w-4" />}
                      placeholder="https://facebook.com/yourprofile"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profileData.bio ||
                  "No bio available. Click edit to add your bio."}
              </p>
            )}
          </div>

          {/* Experience Section */}
          <FeatureFlagWrapper
            featureName="user.experiences"
            showFallback={false}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Experience
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddExperience(true)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Experience
                </Button>
              </div>

            {showAddExperience && (
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Experience
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Job Title"
                    name="title"
                    value={newExperience.title}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Company"
                    name="company"
                    value={newExperience.company}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        company: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Period"
                    name="period"
                    value={newExperience.period}
                    onChange={(e) =>
                      setNewExperience({
                        ...newExperience,
                        period: e.target.value,
                      })
                    }
                    placeholder="e.g., 2020 - Present"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newExperience.description}
                      onChange={(e) =>
                        setNewExperience({
                          ...newExperience,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                      placeholder="Describe your role and achievements..."
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={addExperience}
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add Experience
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowAddExperience(false)}
                      icon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {exp.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {exp.company}
                      </p>
                      {exp.period && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {exp.period}
                        </p>
                      )}
                      {exp.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteExperience(exp.id)}
                      icon={<Trash2 className="h-4 w-4" />}
                      className="text-error-600 hover:text-error-700"
                      data-testid={`delete-experience-${exp.id}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No experience added yet. Click "Add Experience" to get started.
              </div>
            )}
          </div>
          </FeatureFlagWrapper>

          {/* Interests Section */}
          <FeatureFlagWrapper
            featureName="user.interests"
            showFallback={false}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Interests
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddInterest(true)}
                  icon={<Plus className="h-4 w-4" />}
                >
                  Add Interest
                </Button>
              </div>

            {showAddInterest && (
              <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Add Interest
                </h4>
                <div className="space-y-4">
                  <Input
                    label="Interest"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="e.g., Machine Learning, Photography"
                    required
                  />
                  <div className="flex space-x-3">
                    <Button
                      onClick={addInterest}
                      icon={<Plus className="h-4 w-4" />}
                    >
                      Add Interest
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowAddInterest(false)}
                      icon={<X className="h-4 w-4" />}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge
                    key={interest.id}
                    variant="outline"
                    removable
                    onRemove={() => deleteInterest(interest.id)}
                    data-testid={`remove-interest-${interest.id}`}
                  >
                    {interest.interest}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No interests added yet. Click "Add Interest" to get started.
              </div>
            )}
          </div>
          </FeatureFlagWrapper>

          {/* Change Password */}
          <FeatureFlagWrapper
            featureName="user.password-change"
            showFallback={false}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  error={passwordErrors.currentPassword}
                  leftIcon={<Key className="h-4 w-4" />}
                  required
                />

                <Input
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  error={passwordErrors.newPassword}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  error={passwordErrors.confirmPassword}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={passwordLoading}
                  icon={<Save className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {passwordLoading ? "Changing Password..." : "Update Password"}
                </Button>
              </form>

              
            </div>
          </FeatureFlagWrapper>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              {renderContactField(
                "Email",
                profileData.email,
                Mail,
                false,
                visibility.showEmail
              )}
              {renderContactField(
                "Phone",
                profileData.phone,
                Phone,
                false,
                visibility.showPhone
              )}
              {renderContactField(
                "LinkedIn",
                profileData.linkedIn,
                Linkedin,
                true,
                visibility.showLinkedIn
              )}
              {renderContactField(
                "Facebook",
                profileData.facebook,
                Facebook,
                true,
                visibility.showFacebook
              )}
              {renderContactField(
                "Website",
                profileData.website,
                Globe,
                true,
                visibility.showWebsite
              )}
            </div>

            {/* Show message if no contact info is visible */}
            {!visibility.showEmail &&
              !visibility.showPhone &&
              !visibility.showLinkedIn &&
              !visibility.showFacebook &&
              !visibility.showWebsite && (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  Contact information is private
                </div>
              )}
          </div>

          {/* Theme Settings Card */}
          <ThemeSettingsCard />

          
        </div>
      </div>
    </div>
  );
};

export default Profile;
