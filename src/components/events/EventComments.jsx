import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  User,
} from 'lucide-react';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { useEventInteraction } from '../../hooks/events/useEventInteraction';

/**
 * EventComments Component
 * Handles event comments with replies and likes functionality
 * Enhanced with Phase 4 social features
 */
const EventComments = ({ 
  eventId, 
  onCommentAdded, 
  onCommentUpdated, 
  onCommentDeleted 
}) => {
  const { user } = useUnifiedAuth();

  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Use the event interaction hook
  const {
    comments,
    commentsLoading,
    commentsError,
    loadComments,
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    clearCommentsError
  } = useEventInteraction(eventId);

  // Load comments on component mount
  useEffect(() => {
    if (eventId) {
      loadComments();
    }
  }, [eventId, loadComments]);

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (commentsError) {
      const timer = setTimeout(() => clearCommentsError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [commentsError, clearCommentsError]);





  /**
   * Add a new comment
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const result = await addComment(newComment.trim());
    
    if (result.success) {
      setNewComment('');
      onCommentAdded?.(result.data);
    }
  };

  /**
   * Update a comment
   */
  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    const result = await updateComment(commentId, editContent.trim());
    
    if (result.success) {
      setEditingComment(null);
      setEditContent('');
      onCommentUpdated?.(result.data);
    }
  };

  /**
   * Delete a comment
   */
  const handleDeleteComment = async (commentId) => {
    const result = await deleteComment(commentId);
    
    if (result.success) {
      onCommentDeleted?.(commentId);
    }
  };

  /**
   * Toggle like on a comment
   */
  const handleToggleLike = async (commentId) => {
    await toggleCommentLike(commentId);
  };



  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  /**
   * Render a single comment
   */
  const renderComment = (comment, isReply = false) => {
    const canEdit = user?.id === comment.createdBy;
    const canDelete = user?.id === comment.createdBy || user?.role === 'ADMIN';
    const isEditing = editingComment?.id === comment.id;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {comment.createdByUsername || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(comment.createdAt)}
                  {comment.updatedAt !== comment.createdAt && ' (edited)'}
                </p>
              </div>
            </div>
            
            {/* Action Menu */}
            {(canEdit || canDelete) && (
              <div className="relative">
                <button
                  onClick={() => setEditingComment(comment)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {editingComment?.id === comment.id && (
                  <div className="absolute right-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-[120px]">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditContent(comment.content);
                          setEditingComment(comment);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Content */}
          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                rows={3}
                placeholder="Edit your comment..."
              />
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => handleUpdateComment(comment.id)}
                  disabled={commentsLoading}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {commentsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update'}
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              {comment.content}
            </p>
          )}

          {/* Comment Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleToggleLike(comment.id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.isLiked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likeCount || 0}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (commentsLoading && comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading comments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Comments ({comments.length})
          </h3>
        </div>
      </div>

      {/* Error Display */}
      {commentsError && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400 text-sm">{commentsError}</span>
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
          rows={3}
          placeholder="Add a comment..."
          disabled={commentsLoading}
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={commentsLoading || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {commentsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default EventComments;
