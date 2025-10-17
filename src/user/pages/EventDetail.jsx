import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  CheckCircle,
  MessageCircle,
  ArrowLeft,
  User,
  Star,
  MoreHorizontal,
  Globe,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import DropdownMenu from '../../components/ui/DropdownMenu';
import { useAuth } from '../../hooks/useAuth';
import eventService from '../../services/api/eventService';
import postService from '../../services/api/postService';
import PostCard from '../components/events/PostCard';
import PostModal from '../components/events/PostModal';
import CreatePost from '../components/events/CreatePost';
import ShareModal from '../components/events/ShareModal';
import useEventBanner from '../hooks/events/useEventBanner';
import BannerUpload from '../components/events/BannerUpload';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, accessToken, getAccessToken } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [showBannerUpload, setShowBannerUpload] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [canCreatePosts, setCanCreatePosts] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const createPostRef = useRef(null);

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
    const loadEvent = async () => {
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
        
        // Load posts for the event
        await loadPosts();
      } catch (err) {
        console.error('Error loading event:', err);
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
          category: "Conference",
          status: "Active",
          eventLink: "https://example.com/event",
          isOnline: false
        };
        setEvent(mockEvent);
        
        // Load mock posts for development
        await loadMockPosts();
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  // Separate useEffect for banner loading that depends on user token
  useEffect(() => {
    const token = accessToken || getAccessToken();
    console.log('🔄 [EventDetail] Banner useEffect triggered', { 
      eventId, 
      hasToken: !!token, 
      hasLoadBannerUrl: !!loadBannerUrl 
    });
    
    if (eventId && token) {
      console.log('🔄 [EventDetail] Loading banner URL now that token is available');
      loadBannerUrl();
    } else {
      console.log('❌ [EventDetail] Not loading banner - missing eventId or token', { 
        eventId, 
        hasToken: !!token 
      });
    }
  }, [eventId, accessToken, loadBannerUrl]);

  // Separate useEffect for feature flag check
  useEffect(() => {
    const checkFeatureFlag = async () => {
      if (!user) return;
      
      try {
        console.log('🔍 [EventDetail] Checking events.posts.create feature flag...');
        const canCreate = await postService.checkFeatureFlag('events.posts.create');
        console.log('🔍 [EventDetail] Feature flag result:', canCreate);
        setCanCreatePosts(canCreate);
      } catch (err) {
        console.error('❌ [EventDetail] Error checking feature flag:', err);
        setCanCreatePosts(false);
      }
    };

    checkFeatureFlag();
  }, [user]);

  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      setPostError(null);
      const response = await postService.getEventPosts(eventId);
      setPosts(response.content || []);
    } catch (err) {
      console.error('Error loading posts:', err);
      setPostError('Failed to load posts');
    } finally {
      setPostsLoading(false);
    }
  };

  const loadMockPosts = async () => {
    // Mock posts for development
    const mockPosts = [
      {
        id: 1,
        eventId: parseInt(eventId),
        username: "john_doe",
        content: "This looks like an amazing event! Looking forward to attending and learning about the latest developments in the field.",
        postType: "TEXT",
        isEdited: false,
        isDeleted: false,
        likes: 5,
        commentsCount: 3,
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        likedByCurrentUser: false,
        mediaUrls: []
      },
      {
        id: 2,
        eventId: parseInt(eventId),
        username: "jane_smith",
        content: "Great topic! Will there be any hands-on sessions? I'm particularly interested in the practical applications.",
        postType: "TEXT",
        isEdited: false,
        isDeleted: false,
        likes: 8,
        commentsCount: 2,
        createdAt: "2024-01-15T14:20:00Z",
        updatedAt: "2024-01-15T14:20:00Z",
        likedByCurrentUser: true,
        mediaUrls: []
      },
      {
        id: 3,
        eventId: parseInt(eventId),
        username: "alex_wilson",
        content: "Excited to be part of this event! The agenda looks fantastic.",
        postType: "TEXT",
        isEdited: false,
        isDeleted: false,
        likes: 12,
        commentsCount: 5,
        createdAt: "2024-01-15T16:45:00Z",
        updatedAt: "2024-01-15T16:45:00Z",
        likedByCurrentUser: false,
        mediaUrls: []
      }
    ];
    
    setPosts(mockPosts);
  };

  const handleRsvp = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    try {
      setRsvpLoading(true);
      // Add RSVP logic here
      console.log('RSVP clicked for event:', eventId);
    } catch (err) {
      console.error('Error with RSVP:', err);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    try {
      setPostLoading(true);
      const response = await postService.createPost(eventId, postData.content, postData.files);
      setPosts(prev => [response, ...prev]);
      
      // Clear the form after successful post creation
      setTimeout(() => {
        if (createPostRef.current) {
          console.log('EventDetail: Calling resetForm via ref');
          createPostRef.current.resetForm();
        } else {
          console.log('EventDetail: createPostRef.current is null');
        }
      }, 100);
    } catch (err) {
      console.error('Error creating post:', err);
      // You might want to show a toast notification here
    } finally {
      setPostLoading(false);
    }
  };

  const handleEditPost = (postId, content) => {
    setEditingPost(postId);
    setEditPostContent(content);
  };

  const handleSavePost = async (postId) => {
    if (!editPostContent.trim()) return;

    try {
      await postService.updatePost(postId, editPostContent.trim());
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, content: editPostContent.trim(), isEdited: true }
          : post
      ));
      setEditingPost(null);
      setEditPostContent('');
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleCancelPost = () => {
    setEditingPost(null);
    setEditPostContent('');
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await postService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes: response.likes,
              isLikedByUser: response.isLikedByUser,
              likedByCurrentUser: response.likedByCurrentUser
            }
          : post
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleCommentPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const canEditPost = (post) => {
    return user?.username === post.username;
  };

  const canDeletePost = (post) => {
    return user?.username === post.username;
  };

  // Check if current user is the event creator
  const isEventCreator = () => {
    if (!user || !event) {
      console.log('🔍 [isEventCreator] Missing user or event', { hasUser: !!user, hasEvent: !!event });
      return false;
    }
    
    const isCreator = user.username === event.organizerName || user.email === event.organizerEmail;
    console.log('🔍 [isEventCreator] Checking creator status', {
      userUsername: user.username,
      userEmail: user.email,
      eventOrganizerName: event.organizerName,
      eventOrganizerEmail: event.organizerEmail,
      isCreator
    });
    
    return isCreator;
  };

  // Banner upload handlers
  const handleBannerUpload = async (file) => {
    try {
      await uploadBanner(file);
      setShowBannerUpload(false);
    } catch (err) {
      console.error('Error uploading banner:', err);
    }
  };

  const handleBannerDelete = async () => {
    try {
      await deleteBanner();
    } catch (err) {
      console.error('Error deleting banner:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
          <div className="h-64 bg-gradient-to-r from-blue-600 to-emerald-600 relative" style={{
            backgroundImage: `url(${bannerUrl || event.coverImage || event.image || '/cover.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}>
          </div>

          {/* Event Summary Section */}
          <div className="px-6 py-6">
            {/* Date and Time */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-red-500 font-semibold text-sm">
                    {event.endDate ? (() => {
                      const start = new Date(event.startDate);
                      const end = new Date(event.endDate);
                      const isSameDay = start.toDateString() === end.toDateString();
                      
                      if (isSameDay) {
                        // Same day: "Wednesday, October 15, 2025 at 11:00 AM - 2:00 PM"
                        return `${formatDate(event.startDate)} at ${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
                      } else {
                        // Different days: "Wednesday, October 15, 2025 at 11:00 AM - Thursday, October 16, 2025 at 11:00 AM"
                        return `${formatDate(event.startDate)} at ${formatTime(event.startDate)} - ${formatDate(event.endDate)} at ${formatTime(event.endDate)}`;
                      }
                    })() : 
                      `${formatDate(event.startDate)} at ${formatTime(event.startDate)}`
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Event Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
              <MapPin className="h-4 w-4" />
              <span>{event.location || event.venue || "Location TBD"}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors">
                <Star className="h-4 w-4" />
                <span>Interested</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <CheckCircle className="h-4 w-4" />
                <span>Going</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>Invite</span>
              </button>
              <DropdownMenu
                align="right"
                items={[
                  {
                    label: 'Share Event',
                    icon: <Share2 className="h-4 w-4" />,
                    onClick: () => setShowShareModal(true)
                  }
                ]}
                trigger={
                  <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                }
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('about')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'discussion'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Discussion
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-6">
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Details Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{event.currentParticipants || 0} people responded</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4" />
                      <span>Event by {event.organizerName || "Organizer"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location || event.venue || "Location TBD"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Duration: {event.startDate && event.endDate ? 
                        Math.ceil((new Date(event.endDate) - new Date(event.startDate)) / (1000 * 60 * 60 * 24)) : 1} days</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can view</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {event.description || "No description available for this event."}
                  </p>
                  {event.location && (
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {event.location.split(',')[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-6">
                {/* Posts Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Discussion</h2>
                  
                  {/* Create Post Form - Only for event creators */}
                  {user && canCreatePosts && isEventCreator() && (
                    <CreatePost
                      ref={createPostRef}
                      onSubmit={handleCreatePost}
                      loading={postLoading}
                    />
                  )}


                  {/* Posts List */}
                  <div className="space-y-4">
                    {postsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading posts...</p>
                      </div>
                    ) : posts.length > 0 ? (
                      posts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          onLike={handleLikePost}
                          onComment={handleCommentPost}
                          onEdit={handleEditPost}
                          onDelete={handleDeletePost}
                          onShare={() => {/* Handle share */}}
                          canEdit={canEditPost(post)}
                          canDelete={canDeletePost(post)}
                          isLiked={post.isLikedByUser || post.likedByCurrentUser}
                          isEditing={editingPost === post.id}
                          editContent={editPostContent}
                          setEditContent={setEditPostContent}
                          onSaveEdit={handleSavePost}
                          onCancelEdit={handleCancelPost}
                          onOpenModal={handleOpenPostModal}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No posts yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Banner Upload Section (for event organizers) */}
        {showBannerUpload && event.organizerName === user?.username && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
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

        {/* Post Modal */}
        <PostModal
          post={selectedPost}
          isOpen={showPostModal}
          onClose={handleClosePostModal}
          onLike={handleLikePost}
          onEdit={handleEditPost}
          onDelete={handleDeletePost}
          canEdit={selectedPost ? canEditPost(selectedPost) : false}
          canDelete={selectedPost ? canDeletePost(selectedPost) : false}
          isLiked={selectedPost?.isLikedByUser || selectedPost?.likedByCurrentUser || false}
          isEditing={editingPost === selectedPost?.id}
          editContent={editPostContent}
          setEditContent={setEditPostContent}
          onSaveEdit={handleSavePost}
          onCancelEdit={handleCancelPost}
        />

        {/* Share Modal */}
        {event && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            event={event}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetail;