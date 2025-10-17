import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Edit3,
  Trash2,
  Reply,
  Check,
  X,
  MoreHorizontal,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import UserAvatar from '../../../components/common/UserAvatar';

const CommentCard = ({
  comment,
  onEdit,
  onDelete,
  onLike,
  onReply,
  onCancelEdit,
  isEditing,
  editContent,
  setEditContent,
  loading = false,
  depth = 0,
  canEdit = false,
  canDelete = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showActions, setShowActions] = useState(false);

  // Check if this is a root/parent comment (no parentCommentId)
  const isRootComment = !comment.parentCommentId;

  const handleEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
  };

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  const handleCancelReply = () => {
    setReplyContent('');
    setShowReplyForm(false);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return commentDate.toLocaleDateString();
  };

  const getAuthorName = (comment) => {
    return comment.authorName || comment.username || 'Anonymous';
  };

  const getAuthorInitial = (comment) => {
    const name = getAuthorName(comment);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`${depth > 0 ? 'ml-8' : ''} mb-3 relative`}>
      {/* Visual hierarchy lines */}
      {depth > 0 ? (
        <div className="absolute left-0 top-0 bottom-0 w-8 flex items-start justify-center">
          <div className="w-px bg-gray-300 dark:bg-gray-600 h-full"></div>
          <div className="absolute top-6 left-0 w-8 h-px bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      ) : (
        <div className="absolute left-4 top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
      )}
      <div className="flex items-start space-x-3 relative">
        {/* Author Avatar */}
        <UserAvatar
          userId={comment.userId}
          username={comment.username}
          name={comment.authorName}
          size="sm"
          className="flex-shrink-0"
        />

        {/* Comment Content */}
        <div className="flex-1 min-w-0 bg-transparent">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">{getAuthorName(comment)}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatTimeAgo(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-gray-500 dark:text-gray-400 text-xs">• Edited</span>
              )}
            </div>

            {/* Action Menu */}
            {(canEdit || canDelete) && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>

                {showActions && (
                  <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-32">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          onEdit(comment.id, comment.content);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          setShowActions(false);
                          handleDelete();
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={3}
                placeholder="Edit your comment..."
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleEdit}
                  disabled={loading || !editContent.trim()}
                  size="sm"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={onCancelEdit}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-white mb-2 leading-relaxed text-sm">{comment.content}</p>
          )}

          {/* Comment Actions */}
          {!isEditing && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center space-x-1 text-xs font-medium transition-colors ${
                  comment.isLikedByCurrentUser
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <Heart className={`h-3 w-3 ${comment.isLikedByCurrentUser ? 'fill-current' : ''}`} />
                <span>{comment.likes || 0}</span>
              </button>

              {/* Only show reply button for root/parent comments */}
              {isRootComment && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center space-x-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  <span>Reply</span>
                </button>
              )}

              {isRootComment && comment.replyCount > 0 && (
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>
          )}

          {/* Reply Form - Only show for root comments */}
          {showReplyForm && !isEditing && isRootComment && (
            <div className="mt-3 space-y-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={2}
                placeholder="Write a reply..."
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleReply}
                  disabled={loading || !replyContent.trim()}
                  size="sm"
                >
                  Reply
                </Button>
                <Button
                  onClick={handleCancelReply}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies - Only show for root comments, display vertically */}
      {isRootComment && comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="ml-8 mb-3 relative">
              <CommentCard
                comment={reply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                onReply={onReply}
                onCancelEdit={onCancelEdit}
                isEditing={isEditing}
                editContent={editContent}
                setEditContent={setEditContent}
                loading={loading}
                depth={depth + 1}
                canEdit={canEdit}
                canDelete={canDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
