import { useState, useEffect, useCallback } from 'react';
import { useUnifiedAuth } from '../context/UnifiedAuthContext';
import apiClient from '../utils/apiClient';

export const useCurrentUserProfile = () => {
  const { user } = useUnifiedAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      console.log("Fetching profile for user:", user?.userId);

      if (!user?.userId) {
        console.error("No user ID available");
        setLoading(false);
        return;
      }

      const response = await apiClient.get(`/profile/${user?.userId}`);
      console.log("Profile API Response:", response);

      if (!response.data || !response.data.data) {
        console.error("Invalid profile response structure:", response);
        throw new Error("Invalid profile response structure");
      }

      const profile = response.data.data;
      console.log("Fetched Profile:", profile);

      if (!profile) {
        console.error("No profile data received");
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
        ...profile, // Spread any additional fields
      };

      console.log("Profile with defaults:", profileWithDefaults);
      setProfileData(profileWithDefaults);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError(err);
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
      };
      setProfileData(defaultProfile);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userId) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user?.userId, fetchProfile]);

  const refetch = () => {
    setLoading(true);
    fetchProfile();
  };

  return {
    profileData,
    loading,
    error,
    refetch
  };
};

