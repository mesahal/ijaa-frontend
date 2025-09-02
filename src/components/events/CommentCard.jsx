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
import Button from '../ui/Button';

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
  depth = 0
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showActions, setShowActions] = useState(false);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorName = (comment) => {
    return comment.authorName || comment.userName || 'Anonymous';
  };

  const getAuthorInitial = (comment) => {
    const name = getAuthorName(comment);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={`bg-gray-700 rounded-lg p-4 ${depth > 0 ? 'ml-8 border-l-2 border-gray-600' : ''}`}>
      <div className="flex items-start space-x-3">
        {/* Author Avatar */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            {getAuthorInitial(comment)}
          </span>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{getAuthorName(comment)}</span>
              <span className="text-gray-400 text-sm">
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-gray-500 text-xs">(edited)</span>
              )}
            </div>

            {/* Action Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {showActions && (
                <div className="absolute right-0 top-6 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-32">
                  {comment.canEdit && (
                    <button
                      onClick={() => {
                        setShowActions(false);
                        onEdit(comment.id, comment.content);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Edit3 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                  )}
                  {comment.canDelete && (
                    <button
                      onClick={() => {
                        setShowActions(false);
                        handleDelete();
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 resize-none"
                rows={3}
                placeholder="Edit your comment..."
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleEdit}
                  disabled={loading || !editContent.trim()}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button
                  onClick={onCancelEdit}
                  disabled={loading}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-300 mb-3">{comment.content}</p>
          )}

          {/* Comment Actions */}
          {!isEditing && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={loading}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Heart className={`h-4 w-4 ${comment.isLiked ? 'text-red-500 fill-current' : ''}`} />
                <span className="text-sm">{comment.likes || 0}</span>
              </button>

              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Reply className="h-4 w-4" />
                <span className="text-sm">Reply</span>
              </button>

              {comment.replyCount > 0 && (
                <span className="text-gray-500 text-sm">
                  {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && !isEditing && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 resize-none"
                rows={2}
                placeholder="Write a reply..."
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleReply}
                  disabled={loading || !replyContent.trim()}
                  className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700"
                >
                  Reply
                </Button>
                <Button
                  onClick={handleCancelReply}
                  disabled={loading}
                  variant="outline"
                  className="px-3 py-1 text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
