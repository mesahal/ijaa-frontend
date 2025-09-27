import React, { useEffect } from 'react';
import { MessageCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import { useEventInteraction } from '../../hooks/events/useEventInteraction';

const CommentsSection = ({ eventId }) => {
  const {
    comments,
    commentsLoading,
    commentsError,
    commentsPagination,
    loadComments,
    loadNextCommentsPage,
    loadPreviousCommentsPage,
    clearCommentsError,
    addComment,
    addCommentLoading,
    addCommentError,
    clearAddCommentError,
    updateComment,
    updateCommentLoading,
    updateCommentError,
    clearUpdateCommentError,
    deleteComment,
    deleteCommentLoading,
    deleteCommentError,
    clearDeleteCommentError,
    toggleCommentLike,
    likeCommentLoading,
    likeCommentError,
    clearLikeCommentError,
    canEditComment,
    canDeleteComment
  } = useEventInteraction();

  useEffect(() => {
    if (eventId) {
      loadComments(eventId);
    }
  }, [eventId, loadComments]);

  const handleAddComment = async (eventId, content, parentCommentId) => {
    const result = await addComment(eventId, content, parentCommentId);
    if (result) {
      clearAddCommentError();
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    const result = await updateComment(commentId, content);
    if (result) {
      clearUpdateCommentError();
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await deleteComment(commentId);
    if (result) {
      clearDeleteCommentError();
    }
  };

  const handleLikeComment = async (commentId) => {
    const result = await toggleCommentLike(commentId);
    if (result) {
      clearLikeCommentError();
    }
  };

  const handleLoadNextPage = () => {
    if (!commentsPagination.last) {
      loadComments(eventId, commentsPagination.page + 1, commentsPagination.size);
    }
  };

  const handleLoadPreviousPage = () => {
    if (!commentsPagination.first) {
      loadComments(eventId, commentsPagination.page - 1, commentsPagination.size);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Comments</h3>
          {commentsPagination.totalElements > 0 && (
            <span className="text-sm text-gray-500">
              ({commentsPagination.totalElements})
            </span>
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      <CommentForm
        eventId={eventId}
        onAddComment={handleAddComment}
        loading={addCommentLoading}
        error={addCommentError}
      />

      {/* Comments List */}
      <div className="space-y-4">
        {commentsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading comments...</span>
          </div>
        ) : commentsError ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">Error loading comments</div>
            <div className="text-sm text-gray-500 mb-4">{commentsError}</div>
            <button
              onClick={() => {
                clearCommentsError();
                loadComments(eventId);
              }}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Try again
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <div className="text-gray-500">No comments yet</div>
            <div className="text-sm text-gray-400">Be the first to comment!</div>
          </div>
        ) : (
          <>
            {/* Comments */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onLike={handleLikeComment}
                  onEdit={handleUpdateComment}
                  onDelete={handleDeleteComment}
                  onReply={handleAddComment}
                  canEdit={canEditComment(comment)}
                  canDelete={canDeleteComment(comment)}
                  likeLoading={likeCommentLoading}
                  editLoading={updateCommentLoading}
                  deleteLoading={deleteCommentLoading}
                />
              ))}
            </div>

            {/* Pagination */}
            {commentsPagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Page {commentsPagination.page + 1} of {commentsPagination.totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadPreviousPage}
                    disabled={commentsPagination.first}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleLoadNextPage}
                    disabled={commentsPagination.last}
                    className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error Messages */}
      {updateCommentError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {updateCommentError}
        </div>
      )}
      
      {deleteCommentError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {deleteCommentError}
        </div>
      )}
      
      {likeCommentError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {likeCommentError}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;























