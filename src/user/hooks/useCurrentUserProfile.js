import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../services/api/apiClient';

export const useCurrentUserProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      console.log('🔄 [useCurrentUserProfile] Starting profile fetch...', {
        userId: user?.userId,
        hasToken: !!(window.__accessToken || sessionStorage.getItem('access_token'))
      });

      if (!user?.userId) {
        console.log('❌ [useCurrentUserProfile] No user ID, setting loading to false');
        setLoading(false);
        return;
      }

      const response = await apiClient.get(`/users/${user?.userId}`);
      console.log('📥 [useCurrentUserProfile] Profile response received:', response?.data);

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
        countryId: profile.countryId || user?.countryId || null,
        cityId: profile.cityId || user?.cityId || null,
        countryName: profile.countryName || user?.countryName || "",
        cityName: profile.cityName || user?.cityName || "",
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

      setProfileData(profileWithDefaults);
      setError(null);
      console.log('✅ [useCurrentUserProfile] Profile data set successfully');
    } catch (err) {
      console.error('❌ [useCurrentUserProfile] Profile fetch failed:', err);
      setError(err);
      // Set default profile data on error, using user context data as fallback
      const defaultProfile = {
        userId: user?.userId,
        name: user?.name || "",
        profession: user?.profession || "",
        countryId: user?.countryId || null,
        cityId: user?.cityId || null,
        countryName: user?.countryName || "",
        cityName: user?.cityName || "",
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
      console.log('🔄 [useCurrentUserProfile] Using default profile data due to error');
    } finally {
      console.log('🏁 [useCurrentUserProfile] Profile fetch completed, setting loading to false');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userId) {
      // Check if we have an access token (either in memory or sessionStorage)
      const hasToken = window.__accessToken || sessionStorage.getItem('access_token');
      
      if (hasToken) {
        console.log('🔍 [useCurrentUserProfile] Token found, fetching profile...');
        fetchProfile();
      } else {
        // Wait for access token to be set (with timeout to prevent infinite waiting)
        console.log('⏳ [useCurrentUserProfile] Waiting for access token...');
        let attempts = 0;
        const maxAttempts = 100; // 5 seconds max wait time
        
        const checkToken = () => {
          attempts++;
          const hasToken = window.__accessToken || sessionStorage.getItem('access_token');
          
          if (hasToken) {
            console.log('✅ [useCurrentUserProfile] Token found after waiting, fetching profile...');
            fetchProfile();
          } else if (attempts < maxAttempts) {
            setTimeout(checkToken, 50);
          } else {
            console.warn('⚠️ [useCurrentUserProfile] Timeout waiting for token, setting loading to false');
            setLoading(false);
          }
        };
        checkToken();
      }
    } else {
      console.log('ℹ️ [useCurrentUserProfile] No user ID, setting loading to false');
      setLoading(false);
    }
  }, [user?.userId]); // Removed fetchProfile from dependencies to prevent infinite loop

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

