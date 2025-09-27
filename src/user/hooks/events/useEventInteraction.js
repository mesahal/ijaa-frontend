import { useState, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import eventService from '../../../services/api/eventService';

/**
 * Custom hook for Phase 4: Event Interaction
 * Handles comments, likes, and social features
 */
export const useEventInteraction = (eventId) => {
  const { user } = useAuth();

  // State for comments
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState(null);
  const [commentsPagination, setCommentsPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false
  });

  // State for comment operations
  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [addCommentError, setAddCommentError] = useState(null);
  const [updateCommentLoading, setUpdateCommentLoading] = useState(false);
  const [updateCommentError, setUpdateCommentError] = useState(null);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [deleteCommentError, setDeleteCommentError] = useState(null);
  const [likeCommentLoading, setLikeCommentLoading] = useState(false);
  const [likeCommentError, setLikeCommentError] = useState(null);

  /**
   * Load comments for an event
   */
  const loadComments = useCallback(async (page = 0, size = 10) => {
    if (!user?.token) {
      setComments([]);
      setCommentsLoading(false);
      return;
    }

    if (!eventId) {
      setCommentsError('Event ID is required');
      return;
    }

    setCommentsLoading(true);
    setCommentsError(null);

    try {
      const response = await eventService.getEventComments(eventId, page, size);
      
      if (response && (response.success || response.code === "200")) {
        const commentsData = response.data;
        const paginationData = response.pagination || commentsData;
        
        if (commentsData && commentsData.content && Array.isArray(commentsData.content)) {
          setComments(commentsData.content);
          setCommentsPagination({
            currentPage: paginationData.currentPage || commentsData.number || 0,
            totalPages: paginationData.totalPages || 0,
            totalElements: paginationData.totalElements || 0,
            hasNext: paginationData.hasNext !== undefined ? paginationData.hasNext : !commentsData.last,
            hasPrevious: paginationData.hasPrevious !== undefined ? paginationData.hasPrevious : !commentsData.first
          });
        } else if (Array.isArray(commentsData)) {
          // Handle direct array response
          setComments(commentsData);
          setCommentsPagination({
            currentPage: paginationData.currentPage || 0,
            totalPages: paginationData.totalPages || 1,
            totalElements: paginationData.totalElements || commentsData.length,
            hasNext: paginationData.hasNext !== undefined ? paginationData.hasNext : false,
            hasPrevious: paginationData.hasPrevious !== undefined ? paginationData.hasPrevious : false
          });
        } else {
          setComments([]);
          setCommentsPagination({
            currentPage: paginationData.currentPage || 0,
            totalPages: paginationData.totalPages || 0,
            totalElements: paginationData.totalElements || 0,
            hasNext: paginationData.hasNext !== undefined ? paginationData.hasNext : false,
            hasPrevious: paginationData.hasPrevious !== undefined ? paginationData.hasPrevious : false
          });
        }
      } else {
        setComments([]);
        setCommentsPagination({
          currentPage: 0,
          totalPages: 0,
          totalElements: 0,
          hasNext: false,
          hasPrevious: false
        });
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load comments';
      setCommentsError(errorMessage);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [user?.token]);

  /**
   * Add a comment to an event
   */
  const addComment = useCallback(async (content, parentCommentId = null) => {
    if (!user?.token) {
      setAddCommentError('Authentication required');
      return { success: false, error: 'Authentication required' };
    }

    if (!eventId) {
      setAddCommentError('Event ID is required');
      return { success: false, error: 'Event ID is required' };
    }

    if (!content || content.trim() === '') {
      setAddCommentError('Comment content is required');
      return { success: false, error: 'Comment content cannot be empty' };
    }

    setAddCommentLoading(true);
    setAddCommentError(null);

    try {
      const response = await eventService.addEventComment(eventId, content, parentCommentId);
      
      if (response && (response.success || response.code === "200" || response.code === "201")) {
        // Refresh comments to show the new comment
        await loadComments(commentsPagination.currentPage, 10);
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Failed to add comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to add comment';
      setAddCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAddCommentLoading(false);
    }
  }, [user?.token, loadComments, commentsPagination]);

  /**
   * Update a comment
   */
  const updateComment = useCallback(async (commentId, content) => {
    if (!user?.token) {
      setUpdateCommentError('Authentication required');
      return { success: false, error: 'Authentication required' };
    }

    if (!commentId) {
      setUpdateCommentError('Comment ID is required');
      return { success: false, error: 'Comment ID is required' };
    }

    if (!content || content.trim() === '') {
      setUpdateCommentError('Comment content is required');
      return { success: false, error: 'Comment content cannot be empty' };
    }

    setUpdateCommentLoading(true);
    setUpdateCommentError(null);

    try {
      const response = await eventService.updateComment(commentId, content);
      
      if (response && (response.success || response.code === "200")) {
        // Update the comment in the local state
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: content.trim(), updatedAt: response.data?.updatedAt || new Date().toISOString() }
            : comment
        ));
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Failed to update comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to update comment';
      setUpdateCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdateCommentLoading(false);
    }
  }, [user?.token]);

  /**
   * Delete a comment
   */
  const deleteComment = useCallback(async (commentId) => {
    if (!user?.token) {
      setDeleteCommentError('Authentication required');
      return { success: false, error: 'Authentication required' };
    }

    if (!commentId) {
      setDeleteCommentError('Comment ID is required');
      return { success: false, error: 'Comment ID is required' };
    }

    setDeleteCommentLoading(true);
    setDeleteCommentError(null);

    try {
      const response = await eventService.deleteComment(commentId);
      
      if (response && (response.success || response.code === "200")) {
        // Remove the comment from the local state
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to delete comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to delete comment';
      setDeleteCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setDeleteCommentLoading(false);
    }
  }, [user?.token]);

  /**
   * Toggle like on a comment
   */
  const toggleCommentLike = useCallback(async (commentId) => {
    if (!user?.token) {
      setLikeCommentError('Authentication required');
      return { success: false, error: 'Authentication required' };
    }

    if (!commentId) {
      setLikeCommentError('Comment ID is required');
      return { success: false, error: 'Comment ID is required' };
    }

    setLikeCommentLoading(true);
    setLikeCommentError(null);

    try {
      const response = await eventService.toggleCommentLike(commentId);
      
      if (response && (response.success || response.code === "200")) {
        // Update the comment's like count in the local state
        setComments(prev => prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: response.data?.totalLikes || comment.likes }
            : comment
        ));
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || 'Failed to toggle comment like');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to toggle comment like';
      setLikeCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLikeCommentLoading(false);
    }
  }, [user?.token]);

  /**
   * Go to next page of comments
   */
  const goToNextPage = useCallback(async () => {
    if (commentsPagination.hasNext) {
      await loadComments(commentsPagination.currentPage + 1, 10);
    }
  }, [commentsPagination, loadComments]);

  /**
   * Go to previous page of comments
   */
  const goToPreviousPage = useCallback(async () => {
    if (commentsPagination.hasPrevious) {
      await loadComments(commentsPagination.currentPage - 1, 10);
    }
  }, [commentsPagination, loadComments]);

  /**
   * Go to specific page of comments
   */
  const goToPage = useCallback(async (page) => {
    await loadComments(page, 10);
  }, [loadComments]);

  /**
   * Clear errors
   */
  const clearCommentsError = useCallback(() => {
    setCommentsError(null);
  }, []);

  const clearAddCommentError = useCallback(() => {
    setAddCommentError(null);
  }, []);

  const clearUpdateCommentError = useCallback(() => {
    setUpdateCommentError(null);
  }, []);

  const clearDeleteCommentError = useCallback(() => {
    setDeleteCommentError(null);
  }, []);

  const clearLikeCommentError = useCallback(() => {
    setLikeCommentError(null);
  }, []);

  /**
   * Check if user can edit a comment
   */
  const canEditComment = useCallback((comment, currentUser) => {
    return currentUser?.id && comment?.createdBy && currentUser.id === comment.createdBy;
  }, []);

  /**
   * Check if user can delete a comment
   */
  const canDeleteComment = useCallback((comment, currentUser) => {
    return currentUser?.id && comment?.createdBy && 
           (currentUser.id === comment.createdBy || currentUser.role === 'ADMIN');
  }, []);

  return {
    // Comments state
    comments,
    commentsLoading,
    commentsError,
    commentsPagination,
    loadComments,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    clearCommentsError,
    
    // Add comment operations
    addCommentLoading,
    addCommentError,
    addComment,
    clearAddCommentError,
    
    // Update comment operations
    updateCommentLoading,
    updateCommentError,
    updateComment,
    clearUpdateCommentError,
    
    // Delete comment operations
    deleteCommentLoading,
    deleteCommentError,
    deleteComment,
    clearDeleteCommentError,
    
    // Like comment operations
    likeCommentLoading,
    likeCommentError,
    toggleCommentLike,
    clearLikeCommentError,
    
    // Utility functions
    canEditComment,
    canDeleteComment
  };
};
