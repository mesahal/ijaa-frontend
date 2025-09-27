import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  CheckCircle,
  Link as LinkIcon,
  MessageCircle,
  ArrowLeft,
  User,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import eventService from '../../services/api/eventService';
import CommentCard from '../components/events/CommentCard';
import useEventBanner from '../hooks/events/useEventBanner';
import BannerUpload from '../components/events/BannerUpload';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showBannerUpload, setShowBannerUpload] = useState(false);

  // Banner management
  const { 
    bannerUrl, 
    bannerExists, 
    loading: bannerLoading, 
    error: bannerError, 
    loadBannerUrl, 
    uploadBanner, 
    deleteBanner, 
    clearError: clearBannerError 
  } = useEventBanner(eventId);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEventById(eventId);
        
        // The response is the event data directly
        if (response && response.data) {
          setEvent(response.data);
        } else if (response) {
          // If response is the event object directly
          setEvent(response);
        } else {
          setError('Failed to load event details');
        }
        
        // Load comments for the event
        await loadComments();
        
        // Load banner URL
        await loadBannerUrl();
      } catch (err) {
        
        // Fallback to mock data for development/testing
        const mockEvent = {
          id: eventId,
          title: "Tutorial Session: The Fusion of Intelligence and Scale",
          description: "The Internet of Bio-Nano Things (IoBNT) is a novel paradigm that integrates biological and nanoscale devices with traditional networking and communication technologies. This emerging field has the potential to revolutionize various applications, particularly in medicine, where nanodevices can be deployed inside the human body for targeted drug delivery, disease monitoring, and therapeutic interventions. The IoBNT ecosystem consists of biological and artificial nanodevices that communicate through molecular communication (MC) channels, creating a complex network of interconnected systems. Neural networks (NNs) play a crucial role in this ecosystem by enabling intelligent decision-making, pattern recognition, and adaptive behavior in these bio-nano networks.",
          location: "Ehrenbergstraße 29, Ilmenau, Thüringen, DE, 98693",
          venue: "International Conference on Networked Systems, NetSys 2025",
          startDate: "2025-09-01T13:30:00",
          endDate: "2025-09-01T16:30:00",
          maxParticipants: 50,
          currentParticipants: 23,
          organizerName: "Jorge Torres Gómez",
          category: "EDUCATIONAL",
          eventType: "TUTORIAL",
          isOnline: false,
          eventLink: "https://kuvs.de/netsys/2025/program/netsys-2025-tutorial-on-the-internet-of-bio-nano-things-iobn",
          eventId: "c107384",
          isPublic: true,
          requiresApproval: false,
          createdAt: "2024-11-01T10:00:00",
          updatedAt: "2024-11-01T10:00:00"
        };
        
        setEvent(mockEvent);
        
        // Load comments for the event
        loadComments();
        
        // Load banner URL
        loadBannerUrl();
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeUntilEvent = (startDate) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1) return `${diffDays} days`;
    return 'Past';
  };

  const handleRsvp = async (status) => {
    if (!user?.token) {
      navigate('/signin');
      return;
    }

    try {
      setRsvpLoading(true);
      const response = await eventService.rsvpToEvent({
        eventId: parseInt(eventId),
        status,
        message: `I will ${status.toLowerCase()} this event`
      });
      
      if (response && response.success) {
        // Refresh event data to update participant count
        const eventResponse = await eventService.getEventById(eventId);
        if (eventResponse && eventResponse.data) {
          setEvent(eventResponse.data);
        } else if (eventResponse) {
          setEvent(eventResponse);
        }
      }
    } catch (err) {
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const loadComments = async () => {
    if (!eventId) return;
    
    try {
      setCommentsLoading(true);
      setCommentError(null);
      
      const response = await eventService.getEventComments(eventId);
      
      if (response && response.data) {
        setComments(response.data);
      } else if (response) {
        setComments(response);
      } else {
        setComments([]);
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to load comments');
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user?.token || !eventId) return;

    try {
      setCommentLoading(true);
      setCommentError(null);
      
      const response = await eventService.createComment({
        eventId: parseInt(eventId),
        content: newComment.trim(),
        parentCommentId: null
      });
      
      if (response && response.data) {
        // Add the new comment to the beginning of the list (only if it's a top-level comment)
        if (!response.data.parentCommentId) {
          setComments(prev => [response.data, ...prev]);
        }
        setNewComment('');
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleEditComment = async (commentId, content) => {
    if (!content.trim() || !eventId) return;

    try {
      setCommentLoading(true);
      setCommentError(null);
      
      const response = await eventService.updateComment(commentId, {
        eventId: parseInt(eventId),
        content: content.trim()
      });
      
      if (response && response.data) {
        // Update the comment in the list
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? response.data : comment
        ));
        setEditingComment(null);
        setEditContent('');
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to update comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setCommentLoading(true);
      setCommentError(null);
      
      await eventService.deleteComment(commentId);
      
      // Remove the comment from the list
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setCommentError(err.message || 'Failed to delete comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user?.token) return;

    try {
      setCommentError(null);
      
      const response = await eventService.toggleCommentLike(commentId);
      
      if (response && response.data) {
        // Update the comment in the list
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? response.data : comment
        ));
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to like comment');
    }
  };

  const handleReplyToComment = async (parentCommentId, content) => {
    if (!content.trim() || !user?.token || !eventId) return;

    try {
      setCommentLoading(true);
      setCommentError(null);
      
      const response = await eventService.createComment({
        eventId: parseInt(eventId),
        content: content.trim(),
        parentCommentId: parentCommentId
      });
      
      if (response && response.data) {
        // Reload comments to get the updated structure with replies
        await loadComments();
      }
    } catch (err) {
      setCommentError(err.message || 'Failed to add reply');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEditComment = (comment) => {
    return user?.username === comment.username || user?.name === comment.authorName;
  };

  const canDeleteComment = (comment) => {
    return user?.username === comment.username || user?.name === comment.authorName;
  };

  // Banner upload handlers
  const handleBannerUpload = async (file) => {
    try {
      await uploadBanner(file);
      setShowBannerUpload(false);
    } catch (err) {
    }
  };

  const handleBannerDelete = async () => {
    try {
      await deleteBanner();
    } catch (err) {
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
          <Button onClick={() => navigate('/events')} variant="outline">
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Events</span>
        </button>

        {/* Main Event Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
          {/* Cover Photo/Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-emerald-600 relative" style={{
            backgroundImage: `url(${bannerUrl || event.coverImage || event.image || '/cover.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {event.title}
                </h1>
                <p className="text-lg text-white/90">
                  {formatDate(event.startDate)} • {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 pb-8">
            {/* Header Content */}
            <div className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Event Title */}
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {event.title}
                  </h1>

                  {/* Event Type/Category */}
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {event.category || 'Event'}
                  </p>

                  {/* Event Details */}
                  <div className="flex flex-col space-y-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {/* Date & Time and Location - Side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Date & Time</span>
                          <div className="text-gray-500 dark:text-gray-400">
                            {formatDate(event.startDate)}, {formatTime(event.startDate)} - {formatTime(event.endDate)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Location</span>
                          <div className="text-gray-500 dark:text-gray-400">
                            {event.location}
                            {event.venue && (
                              <div className="text-gray-400 dark:text-gray-500">{event.venue}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Attendance and Organizer - Side by side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Attendance</span>
                          <div className="text-gray-500 dark:text-gray-400">
                            {event.currentParticipants || 0} of {event.maxParticipants || '∞'} attending
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Organizer</span>
                          <div className="text-gray-500 dark:text-gray-400">
                            {event.organizerName}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status - Full width */}
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Status</span>
                        <div className="text-gray-500 dark:text-gray-400">
                          {event.status || 'Active'} • {getTimeUntilEvent(event.startDate)}
                        </div>
                      </div>
                    </div>

                    {/* Event Link - Full width (if available) */}
                    {event.eventLink && (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Event Link</span>
                          <div className="text-gray-500 dark:text-gray-400">
                            <a 
                              href={event.eventLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                            >
                              {event.eventLink}
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRsvp('CONFIRMED')}
                    disabled={rsvpLoading}
                    className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>
                      {rsvpLoading ? "Loading..." : "Join"}
                    </span>
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Share
                  </Button>
                  
                                     {/* Banner Upload Button (for event organizers) */}
                   {event.organizerName === user?.username && (
                     <Button
                       onClick={() => setShowBannerUpload(!showBannerUpload)}
                       variant="outline"
                       className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors"
                     >
                       {bannerExists ? 'Edit Banner' : 'Add Banner'}
                     </Button>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
            {/* Banner Upload Section (for event organizers) */}
            {showBannerUpload && event.organizerName === user?.username && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Event Banner
                </h2>
                <BannerUpload
                  eventId={eventId}
                  currentBannerUrl={bannerUrl}
                  onUpload={handleBannerUpload}
                  onDelete={handleBannerDelete}
                  loading={bannerLoading}
                  error={bannerError}
                  onErrorClear={clearBannerError}
                />
              </div>
            )}

            {/* About Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                About this event
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {event.description || "No description available for this event."}
              </p>
            </div>

            {/* Comments Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Comments
              </h2>
              
              {/* Error Message */}
              {commentError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-300 text-sm">{commentError}</p>
                </div>
              )}

              {/* Add Comment Form */}
              {user?.token && (
                <div className="mb-6">
                  <form onSubmit={handleAddComment} className="space-y-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || commentLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {commentsLoading ? (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading comments...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  comments
                    .filter(comment => !comment.parentCommentId) // Only show top-level comments
                    .map((comment) => {
                      // Add permission flags to comment object
                      const commentWithPermissions = {
                        ...comment,
                        canEdit: canEditComment(comment),
                        canDelete: canDeleteComment(comment)
                      };

                      return (
                        <CommentCard
                          key={comment.id}
                          comment={commentWithPermissions}
                          onEdit={(commentId, content) => {
                            setEditingComment(commentId);
                            setEditContent(content);
                          }}
                          onDelete={handleDeleteComment}
                          onLike={handleLikeComment}
                          onReply={handleReplyToComment}
                          onCancelEdit={() => {
                            setEditingComment(null);
                            setEditContent('');
                          }}
                          isEditing={editingComment === comment.id}
                          editContent={editContent}
                          setEditContent={setEditContent}
                          loading={commentLoading}
                        />
                      );
                    })
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
