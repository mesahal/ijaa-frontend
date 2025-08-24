import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Heart,
  Reply,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Loader2,
  AlertCircle,
  User,
  Clock,
  Flag,
  Search,
  BarChart3,
} from 'lucide-react';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import useEventSocialFeatures from '../../hooks/events/useEventSocialFeatures';

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
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showReplies, setShowReplies] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showReportModal, setShowReportModal] = useState(null);
  const [reportReason, setReportReason] = useState('');

  // Use the enhanced social features hook
  const {
    addComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    getCommentReplies,
    searchComments,
    getCommentStatistics,
    reportComment,
    commentStats,
    clearError
  } = useEventSocialFeatures(eventId, () => loadComments());

  // Load comments on component mount
  useEffect(() => {
    if (eventId) {
      loadComments();
      getCommentStatistics();
    }
  }, [eventId]);

  // Clear error when component unmounts or error changes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  /**
   * Load comments for the event
   */
  const loadComments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/v1/user/events/comments/event/${eventId}?page=0&size=50`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
          'X-USER_ID': btoa(JSON.stringify({
            username: user?.username,
            userId: user?.id
          }))
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load comments');
      }

      const data = await response.json();
      setComments(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search comments
   */
  const handleSearchComments = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    const result = await searchComments(searchTerm);
    
    if (result.success) {
      setComments(result.data || []);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  /**
   * Handle report comment
   */
  const handleReportComment = async () => {
    if (!showReportModal || !reportReason.trim()) return;

    const result = await reportComment(showReportModal.id, reportReason);
    
    if (result.success) {
      setShowReportModal(null);
      setReportReason('');
      // Show success message
      setError(null);
    } else {
      setError(result.error);
    }
  };

  /**
   * Load comment replies
   */
  const loadCommentReplies = async (commentId) => {
    const result = await getCommentReplies(commentId);
    
    if (result.success) {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: result.data }
          : comment
      ));
    }
  };

  /**
   * Add a new comment
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const result = await addComment(newComment.trim(), replyTo?.id || null);
    
    if (result.success) {
      if (replyTo) {
        // Add reply to parent comment
        setComments(prev => prev.map(comment => 
          comment.id === replyTo.id 
            ? { ...comment, replies: [...(comment.replies || []), result.data] }
            : comment
        ));
        setReplyTo(null);
        setReplyContent('');
      } else {
        // Add new top-level comment
        setComments(prev => [result.data, ...prev]);
      }

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
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: result.data.content, updatedAt: result.data.updatedAt }
          : comment
      ));

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
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      onCommentDeleted?.(commentId);
    }
  };

  /**
   * Toggle like on a comment
   */
  const handleToggleLike = async (commentId) => {
    const result = await toggleCommentLike(commentId);
    
    if (result.success) {
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { 
              ...comment, 
              isLiked: result.data.isLiked,
              likeCount: result.data.likeCount 
            }
          : comment
      ));
    }
  };

  /**
   * Toggle replies visibility
   */
  const toggleReplies = (commentId) => {
    setShowReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        // Load replies when showing
        loadCommentReplies(commentId);
      }
      return newSet;
    });
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
            
            <div className="flex items-center space-x-2">
              {/* Report Button */}
              {!canEdit && (
                <button
                  onClick={() => setShowReportModal(comment)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Report comment"
                >
                  <Flag className="w-4 h-4" />
                </button>
              )}
              
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
                  disabled={loading}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update'}
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

            {!isReply && (
              <button
                onClick={() => {
                  setReplyTo(comment);
                  setReplyContent('');
                }}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                <Reply className="w-4 h-4" />
                <span>Reply</span>
              </button>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => toggleReplies(comment.id)}
                className="text-sm text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
              >
                {showReplies.has(comment.id) ? 'Hide' : 'Show'} {comment.replies.length} replies
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyTo?.id === comment.id && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={2}
                  placeholder={`Reply to ${comment.createdByUsername || 'Anonymous'}...`}
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={loading || !replyContent.trim()}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-1"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    <span>Reply</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1 text-gray-600 dark:text-gray-400 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && showReplies.has(comment.id) && (
            <div className="mt-3 space-y-2">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && comments.length === 0) {
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
          {commentStats && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-4 h-4" />
              <span>{commentStats.totalLikes || 0} total likes</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            title="Search comments"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search comments..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearchComments()}
          />
          <button
            onClick={handleSearchComments}
            disabled={!searchTerm.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearchTerm('');
              setShowSearch(false);
              loadComments();
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
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
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Post Comment</span>
          </button>
          
          {replyTo && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Replying to {replyTo.createdByUsername || 'Anonymous'}</span>
              <button
                type="button"
                onClick={() => {
                  setReplyTo(null);
                  setNewComment('');
                }}
                className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-400"
              >
                Cancel
              </button>
            </div>
          )}
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

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Report Comment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Help us understand why you're reporting this comment.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for reporting
                </label>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={3}
                  placeholder="Please describe the issue..."
                  required
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={handleReportComment}
                  disabled={!reportReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Report Comment
                </button>
                <button
                  onClick={() => {
                    setShowReportModal(null);
                    setReportReason('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventComments;
