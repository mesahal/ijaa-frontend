import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Calendar,
  Edit,
  Trash2,
  Image as ImageIcon,
  Video,
  FileText,
  Play,
  Pause,
  MoreVertical
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import UserAvatar from '../../../components/common/UserAvatar';
import AuthenticatedMedia from '../../../components/common/AuthenticatedMedia';
import { convertPostMediaUrl } from '../../../utils/mediaUrlUtils';

const PostCard = ({ 
  post, 
  onLike, 
  onComment, 
  onEdit, 
  onDelete, 
  onShare,
  canEdit,
  canDelete,
  isLiked,
  isEditing,
  editContent,
  setEditContent,
  onSaveEdit,
  onCancelEdit,
  onOpenModal
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const speedMenuRef = useRef(null);

  // Debug: Log post data to see what we're receiving
  console.log('PostCard received post:', post);
  if (post.mediaFiles && post.mediaFiles.length > 0) {
    console.log('PostCard media files:', post.mediaFiles);
  } else {
    console.log('PostCard: No media files found for post', post.id);
  }

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
      case 'MIXED':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleLike = () => {
    if (onLike) {
      onLike(post.id);
    }
  };

  const handleComment = () => {
    if (onOpenModal) {
      onOpenModal(post);
    } else if (onComment) {
      onComment(post.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(post.id, post.content);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post.id);
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post.id);
    }
  };

  const handleSaveEdit = () => {
    if (onSaveEdit) {
      onSaveEdit(post.id);
    }
  };

  const handleCancelEdit = () => {
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleVideoPlay = (videoElement) => {
    if (videoElement.paused) {
      videoElement.play();
      setIsVideoPlaying(true);
    } else {
      videoElement.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    setShowSpeedMenu(false);
  };

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Close speed menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target)) {
        setShowSpeedMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <UserAvatar
            userId={post.userId}
            username={post.username}
            name={post.creatorName}
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
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  {canEdit && (
                    <button
                      onClick={handleEdit}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                </div>
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
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
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

      {/* Post Media - Show only first media with count indicator */}
      {post.mediaFiles && post.mediaFiles.length > 0 && (
        <div className="mb-4">
          <div className="relative group cursor-pointer transform hover:scale-[1.02] transition-transform duration-200" onClick={() => onOpenModal && onOpenModal(post)}>
            {(() => {
              const firstMedia = post.mediaFiles.sort((a, b) => a.fileOrder - b.fileOrder)[0];
              
              // Use the utility function to convert media URL
              const fullUrl = convertPostMediaUrl(firstMedia.fileUrl, post.id, firstMedia.fileName);

              return (
                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 w-full aspect-video max-h-80 shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-600">
                  {firstMedia.mediaType === 'VIDEO' ? (
                    <div className="relative w-full h-full group">
                      <AuthenticatedMedia
                        mediaUrl={fullUrl}
                        mediaType={firstMedia.mediaType}
                        fileName={firstMedia.fileName}
                        alt={firstMedia.fileName}
                        className="w-full h-full object-cover custom-video-player"
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      
                      {/* Custom Video Controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {/* Play/Pause Button in Center */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenModal) {
                              onOpenModal(post);
                            } else if (onComment) {
                              onComment(post.id);
                            }
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary-600/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary-700/90 transition-all duration-200 cursor-pointer shadow-lg"
                        >
                          {isVideoPlaying ? (
                            <Pause className="h-8 w-8 text-white" />
                          ) : (
                            <Play className="h-8 w-8 text-white ml-1" />
                          )}
                        </button>
                        
                        {/* Three Dots Menu for Speed Control */}
                        <div className="absolute top-4 right-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSpeedMenu(!showSpeedMenu);
                            }}
                            className="w-8 h-8 bg-primary-600/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary-700/80 transition-all duration-200 shadow-lg"
                          >
                            <MoreVertical className="h-4 w-4 text-white" />
                          </button>
                          
                          {/* Speed Menu Dropdown */}
                          {showSpeedMenu && (
                            <div ref={speedMenuRef} className="absolute top-10 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                              <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                Playback Speed
                              </div>
                              {speedOptions.map((speed) => (
                                <button
                                  key={speed}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSpeedChange(speed);
                                  }}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                    playbackRate === speed 
                                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {speed}x
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : firstMedia.mediaType === 'IMAGE' ? (
                    <AuthenticatedMedia
                      mediaUrl={fullUrl}
                      mediaType={firstMedia.mediaType}
                      fileName={firstMedia.fileName}
                      alt={firstMedia.fileName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Error fallback */}
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center hidden">
                    {firstMedia.mediaType === 'IMAGE' ? (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    ) : (
                      <Video className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Multiple media indicator */}
                  {post.mediaFiles.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      +{post.mediaFiles.length - 1}
                    </div>
                  )}
                  
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Post Actions */}
      {!isEditing && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isLiked || post.isLikedByUser
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Heart className={`h-5 w-5 ${(isLiked || post.isLikedByUser) ? 'fill-current' : ''}`} />
              <span className="text-sm font-semibold">{post.likes || 0}</span>
            </button>
            
            <button
              onClick={handleComment}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{post.commentsCount || 0}</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-semibold">Share</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
