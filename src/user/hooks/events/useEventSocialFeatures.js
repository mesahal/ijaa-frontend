import { useState, useCallback } from 'react';
import eventService from '../../services/eventService';

/**
 * Custom hook for managing Phase 4: Social Features
 * Handles enhanced comment system, media management, and social interactions
 */
export const useEventSocialFeatures = (eventId, refreshData) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentStats, setCommentStats] = useState(null);
  const [mediaStats, setMediaStats] = useState(null);

  // ===== COMMENT MANAGEMENT =====

  /**
   * Add a new comment or reply
   */
  const addComment = useCallback(async (content, parentCommentId = null) => {
    if (!content.trim()) {
      setError('Comment content cannot be empty');
      return { success: false, error: 'Comment content cannot be empty' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.addEventComment(eventId, content, parentCommentId);
      
      if (response.code === '200' || response.code === '201') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to add comment');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to add comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [eventId, refreshData]);

  /**
   * Update an existing comment
   */
  const updateComment = useCallback(async (commentId, content) => {
    if (!content.trim()) {
      setError('Comment content cannot be empty');
      return { success: false, error: 'Comment content cannot be empty' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.updateEventComment(commentId, content);
      
      if (response.code === '200') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update comment');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  /**
   * Delete a comment
   */
  const deleteComment = useCallback(async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return { success: false, error: 'Cancelled by user' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.deleteEventComment(commentId);
      
      if (response.code === '200') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to delete comment');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  /**
   * Toggle like on a comment
   */
  const toggleCommentLike = useCallback(async (commentId) => {
    try {
      const response = await eventService.toggleCommentLike(commentId);
      
      if (response.code === '200') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to toggle like');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to toggle like';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [refreshData]);

  /**
   * Get comment replies
   */
  const getCommentReplies = useCallback(async (commentId, page = 0, size = 20) => {
    try {
      const response = await eventService.getCommentReplies(commentId, page, size);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get comment replies';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Search comments
   */
  const searchComments = useCallback(async (searchTerm, page = 0, size = 20) => {
    if (!searchTerm.trim()) {
      return { success: false, error: 'Search term cannot be empty' };
    }

    try {
      const response = await eventService.searchComments(eventId, searchTerm, page, size);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to search comments';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [eventId]);

  /**
   * Get comment statistics
   */
  const getCommentStatistics = useCallback(async () => {
    try {
      const response = await eventService.getCommentStatistics(eventId);
      setCommentStats(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get comment statistics';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [eventId]);

  /**
   * Report inappropriate comment
   */
  const reportComment = useCallback(async (commentId, reason) => {
    if (!reason.trim()) {
      setError('Please provide a reason for reporting');
      return { success: false, error: 'Please provide a reason for reporting' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.reportComment(commentId, reason);
      
      if (response.code === '200') {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to report comment');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to report comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== MEDIA MANAGEMENT =====

  /**
   * Upload media
   */
  const uploadMedia = useCallback(async (file, caption = '', type = 'IMAGE') => {
    if (!file) {
      setError('Please select a file to upload');
      return { success: false, error: 'Please select a file to upload' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.uploadEventMedia(eventId, file, caption, type);
      
      if (response.code === '200' || response.code === '201') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to upload media');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to upload media';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [eventId, refreshData]);

  /**
   * Update media caption
   */
  const updateMediaCaption = useCallback(async (mediaId, caption) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventService.updateMediaCaption(mediaId, caption);
      
      if (response.code === '200') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update caption');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to update caption';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  /**
   * Delete media
   */
  const deleteMedia = useCallback(async (mediaId) => {
    if (!window.confirm('Are you sure you want to delete this media? This action cannot be undone.')) {
      return { success: false, error: 'Cancelled by user' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.deleteEventMedia(mediaId);
      
      if (response.code === '200') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to delete media');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete media';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [refreshData]);

  /**
   * Toggle like on media
   */
  const toggleMediaLike = useCallback(async (mediaId) => {
    try {
      const response = await eventService.toggleMediaLike(mediaId);
      
      if (response.code === '200') {
        await refreshData?.();
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to toggle like');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to toggle like';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [refreshData]);

  /**
   * Get media by type
   */
  const getMediaByType = useCallback(async (mediaType) => {
    try {
      const response = await eventService.getMediaByType(eventId, mediaType);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get media by type';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [eventId]);

  /**
   * Get media analytics
   */
  const getMediaAnalytics = useCallback(async () => {
    try {
      const response = await eventService.getMediaAnalytics(eventId);
      setMediaStats(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMessage = err.message || 'Failed to get media analytics';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [eventId]);

  /**
   * Report inappropriate media
   */
  const reportMedia = useCallback(async (mediaId, reason) => {
    if (!reason.trim()) {
      setError('Please provide a reason for reporting');
      return { success: false, error: 'Please provide a reason for reporting' };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventService.reportMedia(mediaId, reason);
      
      if (response.code === '200') {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to report media');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to report media';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    commentStats,
    mediaStats,
    
    // Comment actions
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    getCommentReplies,
    searchComments,
    getCommentStatistics,
    reportComment,
    
    // Media actions
    uploadMedia,
    updateMediaCaption,
    deleteMedia,
    toggleMediaLike,
    getMediaByType,
    getMediaAnalytics,
    reportMedia,
    
    // Utility
    clearError
  };
};

export default useEventSocialFeatures;
