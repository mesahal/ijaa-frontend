import { useState, useCallback, useEffect } from 'react';
import postService from '../../../services/api/postService';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Custom hook for managing post comments
 * Handles comment CRUD operations, likes, and replies for posts
 */
export const usePostComments = (postId) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addCommentLoading, setAddCommentLoading] = useState(false);
  const [addCommentError, setAddCommentError] = useState(null);
  const [updateCommentLoading, setUpdateCommentLoading] = useState(false);
  const [updateCommentError, setUpdateCommentError] = useState(null);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [deleteCommentError, setDeleteCommentError] = useState(null);
  const [likeCommentLoading, setLikeCommentLoading] = useState(false);
  const [likeCommentError, setLikeCommentError] = useState(null);

  // Helper function to enhance comment data with proper display names
  const enhanceCommentData = useCallback((comment) => {
    // If this is the current user's comment and we have their display name, use it
    if (user && comment.username === user.email && user.name) {
      return {
        ...comment,
        authorName: user.name,
        username: comment.username // Keep original username for API compatibility
      };
    }
    return comment;
  }, [user]);

  // Load comments for a post
  const loadComments = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await postService.getPostComments(postId);
      
      if (response.code === '200') {
        // Enhance comment data with proper display names
        const enhancedComments = (response.data || []).map(comment => enhanceCommentData(comment));
        setComments(enhancedComments);
      } else {
        throw new Error(response.message || 'Failed to load comments');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to load comments';
      setError(errorMessage);
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, enhanceCommentData]);

  // Add a new comment
  const addComment = useCallback(async (content, parentCommentId = null) => {
    if (!postId) {
      setAddCommentError('Post ID is required');
      return { success: false, error: 'Post ID is required' };
    }

    if (!content || content.trim() === '') {
      setAddCommentError('Comment content is required');
      return { success: false, error: 'Comment content is required' };
    }

    setAddCommentLoading(true);
    setAddCommentError(null);

    try {
      const response = await postService.createComment(postId, content.trim(), parentCommentId);
      
      if (response.code === '201') {
        // Add the new comment to the state
        const newComment = enhanceCommentData(response.data);
        setComments(prev => {
          if (parentCommentId) {
            // Add as reply to parent comment
            return prev.map(comment => 
              comment.id === parentCommentId 
                ? { 
                    ...comment, 
                    replyCount: comment.replyCount + 1,
                    replies: [...(comment.replies || []), newComment]
                  }
                : comment
            );
          } else {
            // Add as top-level comment
            return [newComment, ...prev];
          }
        });
        return { success: true, data: newComment };
      } else {
        throw new Error(response.message || 'Failed to add comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to add comment';
      setAddCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAddCommentLoading(false);
    }
  }, [postId]);

  // Update a comment
  const updateComment = useCallback(async (commentId, content) => {
    if (!content || content.trim() === '') {
      setUpdateCommentError('Comment content is required');
      return { success: false, error: 'Comment content is required' };
    }

    setUpdateCommentLoading(true);
    setUpdateCommentError(null);

    try {
      const response = await postService.updateComment(commentId, content.trim(), postId);
      
      if (response.code === '200') {
        // Update the comment in the state
        setComments(prev => 
          prev.map(comment => 
            comment.id === commentId 
              ? { ...comment, content: content.trim(), isEdited: true, updatedAt: response.data.updatedAt }
              : comment
          )
        );
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to update comment';
      setUpdateCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setUpdateCommentLoading(false);
    }
  }, [postId]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId) => {
    setDeleteCommentLoading(true);
    setDeleteCommentError(null);

    try {
      const response = await postService.deleteComment(commentId);
      
      if (response.code === '200') {
        // Remove the comment from the state
        setComments(prev => {
          // First, try to find and remove from top-level comments
          const topLevelIndex = prev.findIndex(comment => comment.id === commentId);
          if (topLevelIndex !== -1) {
            return prev.filter(comment => comment.id !== commentId);
          }
          
          // If not found in top-level, search in replies
          return prev.map(comment => ({
            ...comment,
            replies: (comment.replies || []).filter(reply => reply.id !== commentId),
            replyCount: comment.replies ? comment.replies.filter(reply => reply.id !== commentId).length : 0
          }));
        });
        return { success: true };
      } else {
        throw new Error(response.message || 'Failed to delete comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to delete comment';
      setDeleteCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setDeleteCommentLoading(false);
    }
  }, []);

  // Like/unlike a comment
  const likeComment = useCallback(async (commentId) => {
    setLikeCommentLoading(true);
    setLikeCommentError(null);

    try {
      const response = await postService.likeComment(commentId);
      
      if (response.code === '200') {
        // Update the comment's like status in the state
        setComments(prev => 
          prev.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: response.data.likes,
                isLikedByCurrentUser: response.data.isLikedByCurrentUser
              };
            }
            // Also check in replies
            if (comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map(reply => 
                  reply.id === commentId 
                    ? {
                        ...reply,
                        likes: response.data.likes,
                        isLikedByCurrentUser: response.data.isLikedByCurrentUser
                      }
                    : reply
                )
              };
            }
            return comment;
          })
        );
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to like comment');
      }
    } catch (err) {
      const errorMessage = err.message || err.response?.data?.message || 'Failed to like comment';
      setLikeCommentError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLikeCommentLoading(false);
    }
  }, []);

  // Get recent comments
  const getRecentComments = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await postService.getRecentComments(postId);
      return response.data || [];
    } catch (err) {
      console.error('Error fetching recent comments:', err);
      return [];
    }
  }, [postId]);

  // Get popular comments
  const getPopularComments = useCallback(async () => {
    if (!postId) return;

    try {
      const response = await postService.getPopularComments(postId);
      return response.data || [];
    } catch (err) {
      console.error('Error fetching popular comments:', err);
      return [];
    }
  }, [postId]);

  // Clear errors
  const clearError = useCallback(() => setError(null), []);
  const clearAddCommentError = useCallback(() => setAddCommentError(null), []);
  const clearUpdateCommentError = useCallback(() => setUpdateCommentError(null), []);
  const clearDeleteCommentError = useCallback(() => setDeleteCommentError(null), []);
  const clearLikeCommentError = useCallback(() => setLikeCommentError(null), []);

  // Load comments when postId changes
  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId, loadComments]);

  return {
    // State
    comments,
    loading,
    error,
    addCommentLoading,
    addCommentError,
    updateCommentLoading,
    updateCommentError,
    deleteCommentLoading,
    deleteCommentError,
    likeCommentLoading,
    likeCommentError,

    // Actions
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    getRecentComments,
    getPopularComments,

    // Error clearing
    clearError,
    clearAddCommentError,
    clearUpdateCommentError,
    clearDeleteCommentError,
    clearLikeCommentError
  };
};

export default usePostComments;
