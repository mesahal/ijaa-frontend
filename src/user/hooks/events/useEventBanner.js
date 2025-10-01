import { useState, useCallback } from 'react';
import eventService from '../../../services/api/eventService';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for managing event banners
 * Provides upload, get, and delete functionality for event banner images
 */
const useEventBanner = (eventId) => {
  const { user } = useAuth();
  const [bannerUrl, setBannerUrl] = useState(null);
  const [bannerExists, setBannerExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load event banner URL
   */
  const loadBannerUrl = useCallback(async () => {
    if (!eventId || !user?.token) {
      setBannerUrl(null);
      setBannerExists(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.getEventBannerUrl(eventId);
      
      if (response && response.success && response.data) {
        if (response.data.exists && response.data.photoUrl) {
          setBannerUrl(response.data.photoUrl);
          setBannerExists(true);
        } else {
          setBannerUrl(null);
          setBannerExists(false);
        }
      } else {
        setBannerUrl(null);
        setBannerExists(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to load banner');
      setBannerUrl(null);
      setBannerExists(false);
    } finally {
      setLoading(false);
    }
  }, [eventId, user?.token]);

  /**
   * Upload event banner
   */
  const uploadBanner = useCallback(async (file) => {
    if (!eventId || !user?.token || !file) {
      throw new Error('Missing required parameters for banner upload');
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await eventService.uploadEventBanner(eventId, file);
      
      if (response && response.success && response.data) {
        setBannerUrl(response.data.fileUrl);
        setBannerExists(true);
        return response.data;
      } else {
        throw new Error('Invalid response from banner upload');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload banner');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [eventId, user?.token]);

  /**
   * Delete event banner
   */
  const deleteBanner = useCallback(async () => {
    if (!eventId || !user?.token) {
      throw new Error('Missing required parameters for banner deletion');
    }

    try {
      setLoading(true);
      setError(null);
      
      await eventService.deleteEventBanner(eventId);
      
      setBannerUrl(null);
      setBannerExists(false);
    } catch (err) {
      setError(err.message || 'Failed to delete banner');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [eventId, user?.token]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get full banner URL for display
   */
  const getFullBannerUrl = useCallback(() => {
    if (!bannerUrl) return null;
    
    // If it's already a full URL, return as is
    if (bannerUrl.startsWith('http')) {
      return bannerUrl;
    }
    
    // If it's a relative URL, make it absolute using the base domain
    if (bannerUrl.startsWith('/')) {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/ijaa/api/v1";
      let domainBase = baseUrl;
      
      // Extract just the domain and port (remove /ijaa/api/v1 part)
      if (baseUrl.includes('/ijaa/')) {
        domainBase = baseUrl.split('/ijaa/')[0];
      }
      
      return `${domainBase}${bannerUrl}`;
    }
    
    return bannerUrl;
  }, [bannerUrl]);

  return {
    // State
    bannerUrl: getFullBannerUrl(),
    bannerExists,
    loading,
    error,
    
    // Actions
    loadBannerUrl,
    uploadBanner,
    deleteBanner,
    clearError,
  };
};

export default useEventBanner;
