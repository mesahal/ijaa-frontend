import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Facebook,
  Users,
  MessageCircle,
  UserPlus,
  UserCheck,
  Eye,
  Calendar,
  Tag,
} from "lucide-react";
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import { PhotoDisplay } from "../components/PhotoManager";
import { getProfilePhotoUrl, getCoverPhotoUrl } from "../utils/photoApi";

const ViewProfile = () => {
  const { userId } = useParams();
  const { user } = useUnifiedAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [interests, setInterests] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null);

  const fetchPhotos = async () => {
    try {
      const [profileData, coverData] = await Promise.all([
        getProfilePhotoUrl(userId),
        getCoverPhotoUrl(userId)
      ]);
      
      // Handle the new response format
      setProfilePhotoUrl(profileData.photoUrl);
      setCoverPhotoUrl(coverData.photoUrl);
    } catch (error) {
      console.error('Failed to load photos:', error);
      // Don't throw error, just log it - photos are optional
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await apiClient.get(`/profile/${userId}`);

      const profile = response.data.data;
      console.log("Fetched Profile:", profile);
      setProfileData(profile);
      setIsConnected(profile.isConnected || false);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      if (err.response?.status === 404) {
        navigate("/search"); // Redirect if profile not found
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      const response = await apiClient.get(`/experiences/${userId}`);

      // Handle both array and object response
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
      const response = await apiClient.get(`/interests/${userId}`);

      // Handle both array and object response
      const interestsData = response.data.data || [];
      console.log("Fetched Interests:", interestsData);
      
      // Ensure we have an array of interest objects
      if (Array.isArray(interestsData)) {
        // Map to ensure each item has the correct structure
        const processedInterests = interestsData.map((item) => {
          if (typeof item === "string") {
            return { id: Math.random(), interest: item };
          } else if (item && typeof item === "object") {
            return {
              id: item.id || Math.random(),
              interest: item.interest || item.name || "Unknown Interest"
            };
          }
          return { id: Math.random(), interest: "Unknown Interest" };
        });
        setInterests(processedInterests);
      } else if (interestsData && typeof interestsData === 'object') {
        // If it's a single object, wrap it in an array
        const processedInterest = {
          id: interestsData.id || Math.random(),
          interest: interestsData.interest || interestsData.name || "Unknown Interest"
        };
        setInterests([processedInterest]);
      } else {
        setInterests([]);
      }
    } catch (err) {
      console.error("Failed to fetch interests", err);
      setInterests([]);
    }
  };

  const handleConnect = async () => {
    if (connectionLoading) return;

    setConnectionLoading(true);
    try {
      const response = await apiClient.post(`/connections/request`, {
        recipientUsername: userId,
      });

      if (response.data.code === "200" || response.data.code === 200) {
        setIsConnected(true);
        // Update profile data to reflect the connection
        setProfileData((prev) => ({
          ...prev,
          connections: (prev.connections || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Error connecting with alumni:", err);
      alert("Failed to send connection request. Please try again.");
    } finally {
      setConnectionLoading(false);
    }
  };

  const handleMessage = () => {
    // Chat functionality removed
    alert("Chat feature has been removed from this application.");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (userId && user?.token) {
      fetchProfile();
      fetchExperiences();
      fetchInterests();
      fetchPhotos();
    }
  }, [userId, user?.token]);

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
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Search</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-emerald-600 relative">
          <PhotoDisplay
            photoUrl={coverPhotoUrl}
            alt="Cover"
            type="cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="px-4 sm:px-8 pb-8 relative">
          {/* Profile Picture */}
          <div className="absolute -top-16 left-4 sm:left-8">
            <PhotoDisplay
              photoUrl={profilePhotoUrl}
              alt={profileData.name}
              type="profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
            />
          </div>

          {/* Header Content */}
          <div className="pt-12 sm:pt-20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {profileData.name || "Unknown User"}
                </h1>

                {/* Profession */}
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {profileData.profession || "Profession not specified"}
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
                      <span>Batch {profileData.batch}</span>
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
                {isConnected ? (
                  <>
                    <button
                      onClick={handleMessage}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                    <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-lg">
                      <UserCheck className="h-4 w-4" />
                      <span className="font-medium">Connected</span>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={handleConnect}
                    disabled={connectionLoading}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>
                      {connectionLoading ? "Connecting..." : "Connect"}
                    </span>
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
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {profileData.bio || "No bio available"}
            </p>
          </div>

          {/* Experience Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Experience
            </h2>

            {experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <Briefcase className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-1" />
                    <div>
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No experience information available
              </div>
            )}
          </div>

          {/* Interests Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Interests
            </h2>

            {interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <div
                    key={interest.id || index}
                    className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{interest.interest}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                No interests information available
              </div>
            )}
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
              {renderContactField(
                "Email",
                profileData.email,
                Mail,
                false,
                profileData.showEmail
              )}
              {renderContactField(
                "Phone",
                profileData.phone,
                Phone,
                false,
                profileData.showPhone
              )}
              {renderContactField(
                "LinkedIn",
                profileData.linkedIn,
                Linkedin,
                true,
                profileData.showLinkedIn
              )}
              {renderContactField(
                "Facebook",
                profileData.facebook,
                Facebook,
                true,
                profileData.showFacebook
              )}
              {renderContactField(
                "Website",
                profileData.website,
                Globe,
                true,
                profileData.showWebsite
              )}
            </div>

            {/* Show message if no contact info is visible */}
            {!profileData.showEmail &&
              !profileData.showPhone &&
              !profileData.showLinkedIn &&
              !profileData.showFacebook &&
              !profileData.showWebsite && (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                  Contact information is private
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
