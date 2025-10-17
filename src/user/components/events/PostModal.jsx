import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  User, 
  Calendar,
  Edit,
  Trash2,
  Send,
  Image as ImageIcon,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MoreVertical,
  Maximize,
  Minimize,
  Volume2,
  VolumeX
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import CommentCard from './CommentCard';
import AuthenticatedMedia from '../../../components/common/AuthenticatedMedia';
import UserAvatar from '../../../components/common/UserAvatar';
import { usePostComments } from '../../hooks/events/usePostComments';
import { convertPostMediaUrl } from '../../../utils/mediaUrlUtils';
import { useAuth } from '../../../hooks/useAuth';

const PostModal = ({ 
  post, 
  isOpen, 
  onClose, 
  onLike, 
  onEdit, 
  onDelete,
  canEdit,
  canDelete,
  isLiked,
  isEditing,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit
}) => {
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [maxMediaHeight, setMaxMediaHeight] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  // Media navigation functions
  const nextMedia = () => {
    if (post.mediaFiles && post.mediaFiles.length > 0) {
      setCurrentMediaIndex((prev) => (prev + 1) % post.mediaFiles.length);
    }
  };

  const prevMedia = () => {
    if (post.mediaFiles && post.mediaFiles.length > 0) {
      setCurrentMediaIndex((prev) => (prev - 1 + post.mediaFiles.length) % post.mediaFiles.length);
    }
  };

  // Reset media index when post changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
  }, [post]);

  // Reset video playing state when media changes
  useEffect(() => {
    setIsVideoPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    // Reset video ref when media changes
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [currentMediaIndex]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle video playing state changes
  useEffect(() => {
    if (!isVideoPlaying) {
      // When video is paused, always show controls
      setShowControls(true);
    } else {
      // When video is playing, hide controls initially
      setShowControls(false);
    }
  }, [isVideoPlaying]);

  // Calculate maximum media height when post changes
  useEffect(() => {
    if (post?.mediaFiles && post.mediaFiles.length > 0) {
      // For posts with multiple media, set a fixed height to prevent modal resizing
      // This ensures smooth transitions between different sized media
      if (post.mediaFiles.length > 1) {
        setMaxMediaHeight(70); // 70vh as the maximum height for multi-media posts
      } else {
        setMaxMediaHeight(70); // Same height for consistency
      }
    }
  }, [post]);

  // Video control functions
  const handleVideoPlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Simple hover handlers
  const handleMouseEnter = () => {
    if (isVideoPlaying) {
      setShowControls(true);
    }
  };

  const handleMouseLeave = () => {
    if (isVideoPlaying) {
      setShowControls(false);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Use the post comments hook
  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    addCommentLoading,
    updateCommentLoading,
    deleteCommentLoading,
    likeCommentLoading
  } = usePostComments(post?.id);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const result = await addComment(newComment.trim());
    if (result.success) {
      setNewComment('');
    }
  };

  const handleEditComment = (commentId, content) => {
    setEditingComment(commentId);
    setEditCommentContent(content);
  };

  const handleSaveComment = async (commentId) => {
    if (!editCommentContent.trim()) return;

    const result = await updateComment(commentId, editCommentContent.trim());
    if (result.success) {
      setEditingComment(null);
      setEditCommentContent('');
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await deleteComment(commentId);
    if (result.success) {
      // Comment will be removed from state by the hook
    }
  };

  const handleLikeComment = async (commentId) => {
    await likeComment(commentId);
  };

  const handleReplyToComment = async (commentId, replyContent) => {
    const result = await addComment(replyContent.trim(), commentId);
    if (result.success) {
      // Reply will be added to state by the hook
    }
  };

  const canEditComment = (comment) => {
    const currentUser = localStorage.getItem('username');
    return currentUser === comment.username;
  };

  const canDeleteComment = (comment) => {
    const currentUser = localStorage.getItem('username');
    return currentUser === comment.username;
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`;
    return postDate.toLocaleDateString();
  };

  const getPostTypeIcon = (postType) => {
    switch (postType) {
      case 'IMAGE':
        return <ImageIcon className="h-4 w-4" />;
      case 'VIDEO':
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[95vh] min-h-[50vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Post Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto flex-1 transition-all duration-300 ease-in-out">
          {/* Post Content */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <UserAvatar 
                  userId={post.userId} 
                  username={post.username || post.creatorName}
                  size="md"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {post.creatorName || post.username || 'Unknown User'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    {post.isEdited && (
                      <span className="text-xs">• Edited</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getPostTypeIcon(post.postType)}
                {(canEdit || canDelete) && (
                  <div className="flex items-center gap-1">
                    {canEdit && (
                      <button
                        onClick={() => onEdit(post.id, post.content)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <Edit className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(post.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                    placeholder="What's on your mind?"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={onSaveEdit}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              )}
            </div>

            {/* Post Media with Navigation */}
            {post.mediaFiles && post.mediaFiles.length > 0 && (
              <div className="mb-4">
                <div 
                  className="relative flex justify-center items-center"
                  style={{ height: `${maxMediaHeight}vh`, minHeight: '300px' }}
                >
                  <div 
                    key={`media-${currentMediaIndex}`}
                    className="relative rounded-lg bg-gray-100 dark:bg-gray-700 w-full max-w-2xl mx-auto shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 ease-in-out animate-fade-in transform hover:scale-[1.01] flex items-center justify-center"
                    style={{ maxHeight: `${maxMediaHeight}vh` }}
                  >
                    
                    {(() => {
                      const currentMedia = post.mediaFiles.sort((a, b) => a.fileOrder - b.fileOrder)[currentMediaIndex];
                      const fullUrl = convertPostMediaUrl(currentMedia.fileUrl, post.id, currentMedia.fileName);

                      if (currentMedia.mediaType === 'IMAGE') {
                        return (
                          <AuthenticatedMedia
                            mediaUrl={fullUrl}
                            mediaType={currentMedia.mediaType}
                            fileName={currentMedia.fileName}
                            alt={currentMedia.fileName}
                            className="w-full h-auto object-contain transition-all duration-300 ease-in-out"
                            style={{ maxHeight: `${maxMediaHeight}vh` }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        );
                      }

                      if (currentMedia.mediaType === 'VIDEO') {
                        return (
                          <div 
                            ref={videoContainerRef}
                            className="relative w-full group transition-all duration-300 ease-in-out flex items-center justify-center cursor-pointer"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={handleVideoPlay}
                          >
                            <AuthenticatedMedia
                              ref={videoRef}
                              mediaUrl={fullUrl}
                              mediaType={currentMedia.mediaType}
                              fileName={currentMedia.fileName}
                              alt={currentMedia.fileName}
                              className="w-full h-auto object-contain custom-video-player transition-all duration-300 ease-in-out"
                              style={{ maxHeight: `${maxMediaHeight}vh` }}
                              onPlay={() => setIsVideoPlaying(true)}
                              onPause={() => setIsVideoPlaying(false)}
                              onTimeUpdate={handleTimeUpdate}
                              onLoadedMetadata={handleLoadedMetadata}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            
                            {/* Video Controls Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
                              showControls || !isVideoPlaying ? 'opacity-100' : 'opacity-0'
                            } pointer-events-none group-hover:pointer-events-auto`}>
                              {/* Play Button - Always visible when paused */}
                              {!isVideoPlaying && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVideoPlay();
                                  }}
                                  className="absolute inset-0 flex items-center justify-center text-white hover:text-primary-400 transition-colors duration-200 pointer-events-auto"
                                >
                                  <Play className="w-16 h-16 opacity-80 hover:opacity-100" />
                                </button>
                              )}
                              
                              {/* Bottom Controls - Only show when video is playing and controls are visible */}
                              {isVideoPlaying && showControls && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                                {/* Progress Bar */}
                                <div 
                                  className="w-full bg-white/20 rounded-full h-2 mb-3 cursor-pointer hover:h-3 transition-all duration-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSeek(e);
                                  }}
                                >
                                  <div 
                                    className="bg-primary-500 h-full rounded-full transition-all duration-200 relative"
                                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                                  >
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200" />
                                  </div>
                                </div>
                                
                                {/* Control Buttons */}
                                <div className="flex items-center justify-between text-white">
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleVideoPlay();
                                      }}
                                      className="hover:text-primary-400 transition-colors duration-200"
                                    >
                                      {isVideoPlaying ? (
                                        <Pause className="w-5 h-5" />
                                      ) : (
                                        <Play className="w-5 h-5" />
                                      )}
                                    </button>
                                    
                                    <span className="text-sm font-medium">
                                      {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {/* Speed Control */}
                                    <div className="relative">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowSpeedMenu(!showSpeedMenu);
                                        }}
                                        className="hover:text-primary-400 transition-colors duration-200 text-sm font-medium px-2 py-1 rounded hover:bg-white/20"
                                      >
                                        {playbackRate}x
                                      </button>
                                      
                                      {showSpeedMenu && (
                                        <div className="absolute bottom-8 left-0 bg-black/80 backdrop-blur-sm rounded-lg p-2 space-y-1 min-w-[80px] z-10">
                                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                                            <button
                                              key={speed}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleSpeedChange(speed);
                                              }}
                                              className={`w-full text-left px-3 py-1 rounded text-sm hover:bg-white/20 transition-colors duration-200 ${
                                                playbackRate === speed ? 'text-primary-400 font-medium' : 'text-white'
                                              }`}
                                            >
                                              {speed}x
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    
                                    {/* Fullscreen Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleFullscreen();
                                      }}
                                      className="hover:text-primary-400 transition-colors duration-200"
                                    >
                                      {isFullscreen ? (
                                        <Minimize className="w-5 h-5" />
                                      ) : (
                                        <Maximize className="w-5 h-5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                </div>
                              )}
                              
                              {/* Error fallback */}
                              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center hidden">
                                <Video className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                          <FileText className="h-8 w-8" />
                        </div>
                      );
                    })()}
                    
                    {/* Navigation Arrows - Only show if more than 1 media */}
                    {post.mediaFiles.length > 1 && (
                      <>
                        {/* Left Arrow */}
                        <button
                          onClick={prevMedia}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        {/* Right Arrow */}
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                        {/* Media Counter */}
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {currentMediaIndex + 1} / {post.mediaFiles.length}
                        </div>
                      </>
                    )}
                    
                  </div>
                </div>
              </div>
            )}

            {/* Post Actions */}
            {!isEditing && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-8">
                  <button
                    onClick={() => onLike(post.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isLiked
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-semibold">{post.likes || 0}</span>
                  </button>
                  
                  <div className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{post.commentsCount || 0}</span>
                  </div>
                  
                  <button
                    onClick={() => {/* Handle share */}}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="text-sm font-semibold">Share</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Comments ({post.commentsCount || 0})
            </h3>

            {/* Add Comment Form */}
            <div className="mb-6">
              <div className="flex gap-3">
                <UserAvatar 
                  userId={currentUser?.userId} 
                  username={currentUser?.email || currentUser?.username}
                  size="sm"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      loading={addCommentLoading}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {commentsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
                </div>
              ) : commentsError ? (
                <div className="text-center py-4">
                  <p className="text-red-500 dark:text-red-400">{commentsError}</p>
                </div>
              ) : comments.length > 0 ? (
                // Filter to show only root comments (comments without parentCommentId)
                comments
                  .filter(comment => !comment.parentCommentId)
                  .map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onEdit={handleEditComment}
                      onDelete={handleDeleteComment}
                      onSaveEdit={handleSaveComment}
                      onCancelEdit={() => {
                        setEditingComment(null);
                        setEditCommentContent('');
                      }}
                      isEditing={editingComment === comment.id}
                      editContent={editCommentContent}
                      setEditContent={setEditCommentContent}
                      canEdit={canEditComment(comment)}
                      canDelete={canDeleteComment(comment)}
                      onLike={handleLikeComment}
                      onReply={handleReplyToComment}
                      loading={addCommentLoading || updateCommentLoading || deleteCommentLoading || likeCommentLoading}
                    />
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
