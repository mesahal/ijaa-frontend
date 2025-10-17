import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  MapPin,
  Bell,
  Search,
  Plus,
  UserPlus,
  Clock,
  Activity,
  Loader2,
} from "lucide-react";
import { Card, Button, Avatar, Badge   } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { useEventDiscovery } from "../hooks/events/useEventDiscovery";
import { useEventParticipation } from "../hooks/events/useEventParticipation";
import { usePhotoManager } from "../components/PhotoManager";
import { getProfilePhotoUrl  } from '../../services/api/photoApi';
import apiClient from '../../services/api/apiClient';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Real data hooks
  const { profileData, loading: profileLoading } = useCurrentUserProfile();
  const {
    upcomingEvents,
    upcomingLoading,
    loadUpcomingEvents,
  } = useEventDiscovery();
  const {
    participations,
    participationsLoading,
    loadMyParticipations,
  } = useEventParticipation();
  
  // Photo management
  const {
    profilePhotoUrl,
    loading: photoLoading,
  } = usePhotoManager({
    userId: user?.userId,
  });

  // Local state for additional data
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [stats, setStats] = useState({
    totalConnections: 0,
    eventsAttended: 0,
  });

  // Load real data on component mount
  useEffect(() => {
    if (user) {
      loadUpcomingEvents(30, 0, 5); // Load next 5 upcoming events
      loadMyParticipations('CONFIRMED', 0, 10); // Load confirmed participations
      loadRecentAlumni();
      loadUserStats();
    }
  }, [user, loadUpcomingEvents, loadMyParticipations]);

  // Load recent alumni for suggested connections
  const loadRecentAlumni = async () => {
    if (!user) return;
    
    setAlumniLoading(true);
    try {
      const response = await apiClient.post('/alumni/search', {
        searchQuery: null,
        batch: null,
        profession: null,
        location: null,
        sortBy: "relevance",
        page: 0,
        size: 4,
      });

      if (response.data?.data?.content) {
        // Process alumni data and fetch profile photos for each
        const alumniWithPhotos = await Promise.all(
          response.data.data.content.map(async (alumni) => {
            try {
              const photoData = await getProfilePhotoUrl(alumni.userId);
              return {
                ...alumni,
                profilePhotoUrl: photoData.hasPhoto ? photoData.photoUrl : null,
              };
            } catch (error) {
              return {
                ...alumni,
                profilePhotoUrl: null,
              };
            }
          })
        );
        setRecentAlumni(alumniWithPhotos);
      }
    } catch (error) {
    } finally {
      setAlumniLoading(false);
    }
  };

  // Load user statistics
  const loadUserStats = async () => {
    if (!user) return;
    
    try {
      // Get connections count from profile
      const connectionsCount = profileData?.connections || 0;
      
      // Get events attended count from participations
      const eventsAttended = participations?.length || 0;
      
      setStats({
        totalConnections: connectionsCount,
        eventsAttended: eventsAttended,
      });
    } catch (error) {
    }
  };

  // Quick actions
  const quickActions = [
    {
      id: 1,
      title: "Create Event",
      description: "Organize a new event",
      icon: Plus,
      color: "blue",
      action: () => navigate('/user/events/create'),
    },
    {
      id: 2,
      title: "Find Alumni",
      description: "Discover new connections",
      icon: UserPlus,
      color: "green",
      action: () => navigate('/search'),
    },
    {
      id: 3,
      title: "Browse Events",
      description: "View all events",
      icon: Calendar,
      color: "purple",
      action: () => navigate('/events'),
    },
    {
      id: 4,
      title: "My Profile",
      description: "Update your profile",
      icon: Users,
      color: "orange",
      action: () => navigate('/profile'),
    },
  ];

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    const colors = {
      NETWORKING: "primary",
      WORKSHOP: "success",
      CONFERENCE: "warning",
      SOCIAL: "secondary",
      CAREER: "error",
      MENTORSHIP: "purple",
    };
    return colors[type] || "secondary";
  };

  // Handle connection request
  const handleConnect = async (alumniId) => {
    try {
      const response = await apiClient.post('/connections/request', {
        recipientUsername: alumniId,
      });

      if (response.data.code === "200" || response.data.code === 200) {
        // Update the alumni list to show connected status
        setRecentAlumni(prev => 
          prev.map(alumni => 
            alumni.userId === alumniId 
              ? { ...alumni, isConnected: true }
              : alumni
          )
        );
      }
    } catch (error) {
    }
  };

  // Loading state
  if (profileLoading || photoLoading) {
    console.log('🔄 [Dashboard] Still loading:', { profileLoading, photoLoading });
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          <p className="text-xs text-gray-500 mt-2">
            Profile: {profileLoading ? 'Loading...' : 'Loaded'} | 
            Photos: {photoLoading ? 'Loading...' : 'Loaded'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {profileData?.name || user?.name || "Alumni"}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here's what's happening in your network today
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/notifications')}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Connections
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalConnections}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  From your network
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Events Attended
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.eventsAttended}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This year
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions & Profile Summary */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 text-left group"
                  >
                    <div className={`inline-flex p-2 rounded-lg bg-${action.color}-100 dark:bg-${action.color}-900/20 mb-3 group-hover:bg-${action.color}-200 dark:group-hover:bg-${action.color}-900/40 transition-colors duration-200`}>
                      <action.icon className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {action.description}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Profile Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Your Profile
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={profilePhotoUrl || "/dp.png"}
                    alt={profileData?.name || "Profile"}
                    size="md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {profileData?.name || "Your Name"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profileData?.profession || "Profession"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {profileData?.cityName && profileData?.countryName
                        ? `${profileData.cityName}, ${profileData.countryName}`
                        : profileData?.cityName || profileData?.countryName || "Location"}
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Connections</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stats.totalConnections}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Batch</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {profileData?.batch || "N/A"}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>

          {/* Center Column - Recent Activities & Upcoming Events */}
          <div className="lg:col-span-2">
            {/* Upcoming Events */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upcoming Events
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                  View All
                </Button>
              </div>
              
              {upcomingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading events...</span>
                </div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {event.title}
                            </h4>
                            <Badge variant={getEventTypeColor(event.eventType)} size="sm">
                              {event.eventType}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(event.startDate)} at {formatTime(event.startDate)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>{event.currentParticipants || 0}/{event.maxParticipants || '∞'} attending</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <Button size="sm" onClick={() => navigate(`/user/events/${event.id}`)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No upcoming events
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Check out all events to find something interesting
                  </p>
                  <Button onClick={() => navigate('/events')}>
                    Browse Events
                  </Button>
                </div>
              )}
            </Card>

            {/* Recent Participations */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Recent Activities
                </h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
                  View All
                </Button>
              </div>
              
              {participationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">Loading activities...</span>
                </div>
              ) : participations && participations.length > 0 ? (
                <div className="space-y-4">
                  {participations.slice(0, 3).map((participation) => (
                    <div
                      key={participation.id}
                      className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    >
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                        <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          You registered for {participation.eventTitle}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(participation.eventStartDate)} • {participation.eventLocation}
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge variant="success" size="sm">
                            {participation.status}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(participation.joinedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No recent activities
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start participating in events to see your activities here
                  </p>
                  <Button onClick={() => navigate('/events')}>
                    Find Events
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Bottom Section - Suggested Connections */}
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suggested Connections
              </h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
                View All
              </Button>
            </div>
            
            {alumniLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading connections...</span>
              </div>
            ) : recentAlumni && recentAlumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentAlumni.map((alumni) => (
                  <div
                    key={alumni.userId}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={alumni.profilePhotoUrl || "/dp.png"}
                        alt={alumni.name || "Alumni"}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {alumni.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {alumni.profession}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {alumni.location}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Batch {alumni.batch}
                          </span>
                        </div>
                        <div className="mt-3">
                          {alumni.isConnected ? (
                            <Badge variant="success" size="sm" className="w-full justify-center">
                              Connected
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full"
                              onClick={() => handleConnect(alumni.userId)}
                            >
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No suggested connections
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Search for alumni to find new connections
                </p>
                <Button onClick={() => navigate('/search')}>
                  Search Alumni
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
