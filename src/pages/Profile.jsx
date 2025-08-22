import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
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
} from "lucide-react";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import { Card, Button, Avatar, Badge, Input } from "../components/ui";

const Profile = () => {
  const { user } = useUnifiedAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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
      const response = await apiClient.get(`/profile/${user?.userId}`);

      const profile = response.data.data;
      console.log("Fetched Profile:", profile);
      
      // Ensure all required fields are present
      const profileWithDefaults = {
        userId: profile.userId || user?.userId,
        name: profile.name || "",
        profession: profile.profession || "",
        location: profile.location || "",
        bio: profile.bio || "",
        phone: profile.phone || "",
        linkedIn: profile.linkedIn || "",
        website: profile.website || "",
        batch: profile.batch || "",
        facebook: profile.facebook || "",
        email: profile.email || "",
        connections: profile.connections || 0,
        showPhone: profile.showPhone !== undefined ? profile.showPhone : true,
        showLinkedIn: profile.showLinkedIn !== undefined ? profile.showLinkedIn : true,
        showWebsite: profile.showWebsite !== undefined ? profile.showWebsite : true,
        showEmail: profile.showEmail !== undefined ? profile.showEmail : true,
        showFacebook: profile.showFacebook !== undefined ? profile.showFacebook : true,
        ...profile // Spread any additional fields
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
      console.error("Failed to fetch profile", err);
      // Set default profile data on error
      setProfileData({
        userId: user?.userId,
        name: "",
        profession: "",
        location: "",
        bio: "",
        phone: "",
        linkedIn: "",
        website: "",
        batch: "",
        facebook: "",
        email: "",
        connections: 0,
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
      const response = await apiClient.get(`/experiences/${user?.userId}`);
      const experiencesData = response.data.data || [];
      console.log("Fetched Experiences:", experiencesData);
      
      // Ensure we have an array of experience objects
      if (Array.isArray(experiencesData)) {
        setExperiences(experiencesData);
      } else if (experiencesData && typeof experiencesData === 'object') {
        // If it's a single object, wrap it in an array
        setExperiences([experiencesData]);
      } else {
        setExperiences([]);
      }
    } catch (err) {
      console.error("Failed to fetch experiences", err);
      setExperiences([]);
    }
  };

  const fetchInterests = async () => {
    try {
      const response = await apiClient.get(`/interests/${user?.userId}`);
      const interestsData = response.data.data || [];
      console.log("Fetched Interests:", interestsData);
      
      // Ensure we have an array of interest objects
      if (Array.isArray(interestsData)) {
        setInterests(interestsData);
      } else if (interestsData && typeof interestsData === 'object') {
        // If it's a single object, wrap it in an array
        setInterests([interestsData]);
      } else {
        setInterests([]);
      }
    } catch (err) {
      console.error("Failed to fetch interests", err);
      setInterests([]);
    }
  };

  const updateSection = async (sectionName, payload) => {
    try {
      let endpoint;
      let requestPayload;

      if (sectionName === "profile") {
        // For profile update, use PUT /profile endpoint
        endpoint = "/profile";
        requestPayload = {
          ...payload,
          userId: user?.userId,
        };
      } else if (sectionName === "visibility") {
        // For visibility update, use PUT /visibility endpoint
        endpoint = "/visibility";
        requestPayload = payload; // Don't include userId for visibility
      } else {
        endpoint = `/${sectionName}`;
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
      console.error(`Failed to update ${sectionName}`, err);
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

      await apiClient.post(`/experiences`, experienceData);

      setNewExperience({ title: "", company: "", period: "", description: "" });
      setShowAddExperience(false);
      fetchExperiences();
    } catch (err) {
      console.error("Failed to add experience", err);
      alert("Failed to add experience. Please try again.");
    }
  };

  const deleteExperience = async (experienceId) => {
    try {
      // According to API docs: DELETE /experiences/{experienceId}
      await apiClient.delete(`/experiences/${experienceId}`);
      fetchExperiences();
    } catch (err) {
      console.error("Failed to delete experience", err);
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
      await apiClient.post(`/interests`, { interest: newInterest.trim() });

      // Refresh the interests list
      fetchInterests();
      setNewInterest("");
      setShowAddInterest(false);
    } catch (err) {
      console.error("Failed to add interest", err);
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
      await apiClient.delete(`/interests/${interestId}`);

      fetchInterests();
    } catch (err) {
      console.error("Failed to delete interest", err);
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
    setVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    if (!validateFields()) {
      return;
    }

    // Update both profile data and visibility settings
    const updatedProfileData = {
      ...profileData,
      ...visibility
    };

    await updateSection("profile", updatedProfileData);
  };

  useEffect(() => {
    if (user?.userId) {
      fetchProfile();
      fetchExperiences();
      fetchInterests();
    }
  }, [user?.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section - Full width cover image */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 h-64">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative h-full flex items-end pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-end space-x-6">
              <div className="relative">
                <Avatar 
                  size="3xl" 
                  src={profileData.profilePicture || "/dp.png"} 
                  alt={profileData.name || "Profile"} 
                  className="border-4 border-white dark:border-gray-800 shadow-xl"
                />
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full p-2"
                    aria-label="Change photo"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profileData.name || "Your Name"}
                </h1>
                <p className="text-xl text-white/90 mb-2">
                  {profileData.profession || "Your Profession"}
                </p>
                <div className="flex items-center space-x-4 text-white/80">
                  {profileData.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  {profileData.batch && (
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>Batch {profileData.batch}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>About</Card.Title>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      icon={<Edit3 className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </Card.Header>
              <Card.Content>
                {isEditing ? (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h4>
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
                      <Input
                        label="Batch"
                        name="batch"
                        value={profileData.batch || ""}
                        onChange={handleInputChange}
                        leftIcon={<GraduationCap className="h-4 w-4" />}
                        placeholder="e.g., 2020"
                      />
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Bio</h4>
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
                        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h4>
                      
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
                            onClick={() => toggleVisibility('showEmail')}
                            icon={visibility.showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {visibility.showEmail ? 'Visible' : 'Hidden'}
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
                            onClick={() => toggleVisibility('showPhone')}
                            icon={visibility.showPhone ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {visibility.showPhone ? 'Visible' : 'Hidden'}
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
                            onClick={() => toggleVisibility('showLinkedIn')}
                            icon={visibility.showLinkedIn ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {visibility.showLinkedIn ? 'Visible' : 'Hidden'}
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
                            onClick={() => toggleVisibility('showWebsite')}
                            icon={visibility.showWebsite ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {visibility.showWebsite ? 'Visible' : 'Hidden'}
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
                            onClick={() => toggleVisibility('showFacebook')}
                            icon={visibility.showFacebook ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {visibility.showFacebook ? 'Visible' : 'Hidden'}
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

                    <div className="flex space-x-3 pt-4">
                      <Button onClick={handleSave} icon={<Save className="h-4 w-4" />}>
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profileData.bio || "No bio available. Click edit to add your bio."}
                    </p>
                    
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      {visibility.showEmail && profileData.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {profileData.email}
                          </span>
                        </div>
                      )}
                      {visibility.showPhone && profileData.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {profileData.phone}
                          </span>
                        </div>
                      )}
                      {visibility.showLinkedIn && profileData.linkedIn && (
                        <div className="flex items-center space-x-3">
                          <Linkedin className="h-4 w-4 text-gray-400" />
                          <a
                            href={profileData.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          >
                            <span>LinkedIn Profile</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {visibility.showWebsite && profileData.website && (
                        <div className="flex items-center space-x-3">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          >
                            <span>Website</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {visibility.showFacebook && profileData.facebook && (
                        <div className="flex items-center space-x-3">
                          <Facebook className="h-4 w-4 text-gray-400" />
                          <a
                            href={profileData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                          >
                            <span>Facebook Profile</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Experience Section */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>Experience</Card.Title>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddExperience(true)}
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Add Experience
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
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
                        onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                        required
                      />
                      <Input
                        label="Company"
                        name="company"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                        required
                      />
                      <Input
                        label="Period"
                        name="period"
                        value={newExperience.period}
                        onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                        placeholder="e.g., 2020 - Present"
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                          placeholder="Describe your role and achievements..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button onClick={addExperience} icon={<Plus className="h-4 w-4" />}>
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
                  <div className="space-y-6">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                          <Briefcase className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exp.title}
                          </h4>
                          <p className="text-primary-600 dark:text-primary-400 font-medium">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.period}
                          </p>
                          {exp.description && (
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
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
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No experience added yet. Click "Add Experience" to get started.
                  </p>
                )}
              </Card.Content>
            </Card>

            {/* Interests Section */}
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title>Interests</Card.Title>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddInterest(true)}
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Add Interest
                  </Button>
                </div>
              </Card.Header>
              <Card.Content>
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
                        <Button onClick={addInterest} icon={<Plus className="h-4 w-4" />}>
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
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No interests added yet. Click "Add Interest" to get started.
                  </p>
                )}
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <Card>
              <Card.Header>
                <Card.Title>Profile Stats</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                    <span className="font-semibold text-gray-900 dark:text-white">1,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Connections</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {profileData.connections || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Events Attended</span>
                    <span className="font-semibold text-gray-900 dark:text-white">23</span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <Card.Title>Quick Actions</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button variant="outline" fullWidth icon={<MessageCircle className="h-4 w-4" />}>
                    Send Message
                  </Button>
                  <Button variant="outline" fullWidth icon={<User className="h-4 w-4" />}>
                    Connect
                  </Button>
                  <Button variant="outline" fullWidth icon={<Share2 className="h-4 w-4" />}>
                    Share Profile
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
