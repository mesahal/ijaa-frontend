import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  Grid3X3,
  List,
  Bell,
  Bookmark,
  X,
} from 'lucide-react';

// Import authentication context
import { useAuth } from '../../hooks/useAuth';

// Import custom hooks
import { useEvents } from '../hooks/events/useEvents';
import { useEventActions } from '../hooks/events/useEventActions';
import { useEventSearch } from '../hooks/events/useEventSearch';
import { useEventDiscovery } from '../hooks/events/useEventDiscovery';
import { useEventParticipation } from '../hooks/events/useEventParticipation';
import { useEventInvitations } from '../hooks/events/useEventInvitations';

// Import components
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import EventForm from '../components/events/EventForm';
import EventDetailsModal from '../components/events/EventDetailsModal';
import InviteModal from '../components/events/InviteModal';
import ParticipantsModal from '../components/events/ParticipantsModal';
import UpcomingEvents from '../components/events/UpcomingEvents';
import TrendingEvents from '../components/events/TrendingEvents';
import AdvancedSearch from '../components/events/AdvancedSearch';
import RSVPButtons from '../components/events/RSVPButtons';
import MyParticipations from '../components/events/MyParticipations';

// Import UI components
import { Button, Card, Badge, Pagination   } from '../../components/ui';

// Import constants
import { EVENT_CATEGORIES, EVENT_TYPES, EVENT_PRIVACY, PARTICIPATION_STATUS  } from '../../services/api/eventApi';

// Constants
const EVENT_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CAREER', label: 'Career' },
  { value: 'MENTORSHIP', label: 'Mentorship' }
];

const EVENT_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CAREER', label: 'Career' },
  { value: 'MENTORSHIP', label: 'Mentorship' }
];

const INITIAL_EVENT_FORM = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  maxParticipants: '',
  eventType: 'NETWORKING',
  isOnline: false,
  meetingLink: '',
  privacy: 'PUBLIC',
  inviteMessage: ''
};

/**
 * Events Page Component
 * Main events management page with modern Facebook-style design
 * 
 * Features:
 * - Modern card-based layout
 * - Facebook-style event cards
 * - Responsive design
 * - Enhanced visual hierarchy
 * - Modern buttons and interactions
 * - Improved spacing and typography
 * 
 * Uses custom hooks for state management and business logic
 */
const Events = () => {
  const navigate = useNavigate();
  // Get user from authentication context
  const { user, loading: authLoading } = useAuth();
  
  // View mode state (grid/list)
  const [viewMode, setViewMode] = useState('grid');
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    location: "",
    eventType: "",
    startDate: "",
    endDate: "",
    isOnline: "",
    organizerName: "",
    title: "",
    description: ""
  });
  
  // Custom hooks
  const {
    events,
    myEvents,
    loading: eventsLoading,
    error: eventsError,
    activeTab,
    pagination: eventsPagination,
    loadEvents,
    refreshEvents,
    handleTabChange,
    getCurrentEvents,
  } = useEvents();

  const {
    loading: actionsLoading,
    error: actionsError,
    handleCreateEvent,
    handleDeleteEvent,
    handleRsvp,
    handleCancelRsvp,
    clearError: clearActionsError,
  } = useEventActions(refreshEvents);

  const {
    searchQuery,
    filterType,
    loading: searchLoading,
    error: searchError,
    handleSearchQueryChange,
    handleFilterTypeChange,
    searchEvents,
    clearSearch,
    getFilteredEvents,
  } = useEventSearch();

  // Phase 2: Event Discovery & Search
  const {
    upcomingEvents,
    upcomingLoading,
    upcomingError,
    upcomingPagination,
    loadUpcomingEvents,
    loadNextUpcomingPage,
    loadPreviousUpcomingPage,
    trendingEvents,
    trendingLoading,
    trendingError,
    loadTrendingEvents,
    searchResults,
    searchLoading: discoverySearchLoading,
    searchError: discoverySearchError,
    searchPagination,
    searchEvents: discoverySearchEvents,
    clearSearch: clearDiscoverySearch,
    loadNextSearchPage,
    loadPreviousSearchPage
  } = useEventDiscovery();

  // Phase 3: Event Participation
  const {
    participations,
    participationsLoading,
    participationsError,
    participationsPagination,
    loadMyParticipations,
    loadNextParticipationsPage,
    loadPreviousParticipationsPage,
    clearParticipationsError,
    rsvpLoading,
    rsvpError,
    rsvpToEvent,
    clearRsvpError,
    updateLoading,
    updateError,
    updateParticipation,
    clearUpdateError,
    joinEvent,
    maybeAttendEvent,
    cancelRsvp,
    getParticipationStatus,
    getParticipation,
    isParticipating,
    isMaybeAttending,
    hasDeclined
  } = useEventParticipation();

  const {
    myParticipations,
    myInvitations,
    invitationCounts,
    loading: invitationsLoading,
    error: invitationsError,
    sendInvitations,
    acceptInvitation,
    declineInvitation,
    getEventParticipants,
    clearError: clearInvitationsError,
    getMyParticipationStatus,
    getMyInvitationStatus,
  } = useEventInvitations();

  // Local state for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  
  // Selected items
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState(INITIAL_EVENT_FORM);
  const [inviteForm, setInviteForm] = useState({ usernames: "", personalMessage: "" });

  // Combined loading and error states
  const isLoading = eventsLoading || actionsLoading || searchLoading || invitationsLoading;
  const error = eventsError || actionsError || searchError || invitationsError;

  // Pagination state for main events
  const [pageSizeOptions] = useState([6, 12, 24, 48]);

  /**
   * Handle tab change and clear search
   */
  const handleTabChangeWithClear = useCallback((tab) => {
    handleTabChange(tab);
    clearSearch();
  }, [handleTabChange, clearSearch]);



  /**
   * Handle edit event - populate form with current values
   */
  const handleEditEvent = useCallback((event) => {
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      location: event.location || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      maxParticipants: event.maxParticipants?.toString() || '',
      eventType: event.eventType || event.category || 'NETWORKING',
      isOnline: event.isOnline || false,
      meetingLink: event.meetingLink || '',
      privacy: event.privacy || 'PUBLIC',
      inviteMessage: event.inviteMessage || ''
    });
    setSelectedEvent(event);
    setShowCreateModal(true);
  }, []);

  /**
   * Handle delete event
   */
  const handleDeleteEventCallback = useCallback(async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      const result = await handleDeleteEvent(eventId);
      if (result.success) {
        // Event deleted successfully
      }
    }
  }, [handleDeleteEvent]);

  /**
   * Handle create event form submission
   */
  const handleCreateEventSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await handleCreateEvent(eventForm);
    
    if (result.success) {
      setShowCreateModal(false);
      setEventForm(INITIAL_EVENT_FORM);
    }
  }, [eventForm, handleCreateEvent]);

  /**
   * Handle search events
   */

  /**
   * Handle view participants
   */
  const handleViewParticipants = useCallback(async (eventId) => {
    const result = await getEventParticipants(eventId);
    
    if (result.success) {
      setShowParticipantsModal(true);
    }
  }, [getEventParticipants]);

  /**
   * Format date for display
   */
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  /**
   * Format time for display
   */
  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }, []);

  /**
   * Format date and time range for display
   */
  const formatDateTimeRange = useCallback((startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if it's the same day
    const isSameDay = start.toDateString() === end.toDateString();
    
    if (isSameDay) {
      // Same day: "Monday, October 13, 2025 at 3:43 AM - 3:43 PM"
      const dateStr = start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const startTime = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const endTime = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${dateStr} at ${startTime} - ${endTime}`;
    } else {
      // Different days: "Monday, October 13, 2025 at 3:43 AM - Tuesday, October 14, 2025 at 3:43 PM"
      const startDateStr = start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const endDateStr = end.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const startTime = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      const endTime = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${startDateStr} at ${startTime} - ${endDateStr} at ${endTime}`;
    }
  }, []);

  /**
   * Format event date and time with proper day handling
   */
  const formatEventDateTime = useCallback((event) => {
    if (!event.endDate) {
      return `${formatDate(event.startDate)} at ${formatTime(event.startDate)}`;
    }
    
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
  }, [formatDate, formatTime]);

  /**
   * Get event category label
   */
  const getEventCategoryLabel = useCallback((category) => {
    const cat = EVENT_CATEGORY_OPTIONS.find(c => c.value === category);
    return cat ? cat.label : category;
  }, []);

  /**
   * Handle page change for pagination
   */
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 0 && newPage < eventsPagination.totalPages && !isLoading) {
      loadEvents(newPage, eventsPagination.size);
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [eventsPagination, isLoading, loadEvents]);

  /**
   * Handle page size change for pagination
   */
  const handlePageSizeChange = useCallback((newSize) => {
    if (eventsPagination && newSize !== eventsPagination.size && !isLoading) {
      // Reset to first page when changing page size
      loadEvents(0, newSize);
      // Scroll to top when changing page size
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [eventsPagination?.size, isLoading, loadEvents]);

  // Pagination component using the reusable Pagination component
  const PaginationComponent = () => {
    // Only show pagination for main events (all, my-events, my-active-events)
    if (activeTab !== 'all' && activeTab !== 'my-events' && activeTab !== 'my-active-events') return null;
    if (!eventsPagination || eventsPagination.totalElements === 0) return null;

    return (
      <div className="mt-8">
        <Pagination
          currentPage={eventsPagination.page || 0}
          totalPages={eventsPagination.totalPages || 0}
          totalElements={eventsPagination.totalElements || 0}
          pageSize={eventsPagination.size || 10}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          loading={isLoading}
          showPageSizeSelector={true}
          showInfo={false} // We show info in the results section instead
          className=""
        />
      </div>
    );
  };

  // Load Phase 2 data when component mounts
  React.useEffect(() => {
    if (user) {
      loadUpcomingEvents();
      loadTrendingEvents();
    }
  }, [user, loadUpcomingEvents, loadTrendingEvents]);

  // Load Phase 3 data when component mounts
  React.useEffect(() => {
    if (user) {
      loadMyParticipations();
    }
  }, [user, loadMyParticipations]);

  // Get filtered events
  const currentEvents = getCurrentEvents();
  const displayEvents = getFilteredEvents(currentEvents) || [];

  // Advanced filter handlers
  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      location: "",
      eventType: "",
      startDate: "",
      endDate: "",
      isOnline: "",
      organizerName: "",
      title: "",
      description: ""
    });
  };

  const hasAdvancedFilters = Object.values(advancedFilters).some(value => value !== "");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Updated to support both light and dark themes */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Discover events
          </h1>
          
          {/* Create Event Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => navigate('/user/events/create')}
              disabled={!user}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{user ? "Create Event" : "Sign in to Create"}</span>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-error-200 dark:border-error-700">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
                <p className="text-error-700 dark:text-error-300">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Authentication Required Message */}
        {!error && !isLoading && !authLoading && !user && (
          <Card className="mb-6 border-warning-200 dark:border-warning-700">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-warning-100 dark:bg-warning-900/50 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-warning-800 dark:text-warning-200">
                    Sign in to view events
                  </h3>
                  <p className="text-warning-700 dark:text-warning-300 mt-1">
                    Please sign in to your account to access the events feature.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filter Form */}
        <Card className="mb-6">
          <div className="p-6">
            <div>
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Search events by title, description, or location..."
                      value={searchQuery}
                      onChange={(e) => handleSearchQueryChange(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                      aria-label="Search events"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => handleSearchQueryChange('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Filter */}
                <div className="lg:w-48">
                  <div className="relative">
                    <select
                      value={filterType}
                      onChange={(e) => handleFilterTypeChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm appearance-none transition-colors hover:border-gray-400 dark:hover:border-gray-500"
                      aria-label="Filter events by type"
                    >
                      <option value="all">All Categories</option>
                      {EVENT_TYPE_OPTIONS.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Advanced Filter Toggle Button */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
                  aria-label="Toggle advanced filters"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Search by location"
                        value={advancedFilters.location}
                        onChange={(e) => handleAdvancedFilterChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Event Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Event Type
                      </label>
                      <select
                        value={advancedFilters.eventType}
                        onChange={(e) => handleAdvancedFilterChange('eventType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Types</option>
                        {EVENT_TYPE_OPTIONS.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Start Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={advancedFilters.startDate}
                        onChange={(e) => handleAdvancedFilterChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* End Date Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={advancedFilters.endDate}
                        onChange={(e) => handleAdvancedFilterChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Online Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Online Status
                      </label>
                      <select
                        value={advancedFilters.isOnline}
                        onChange={(e) => handleAdvancedFilterChange('isOnline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">All Events</option>
                        <option value="true">Online Only</option>
                        <option value="false">In-Person Only</option>
                      </select>
                    </div>

                    {/* Organizer Name Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Organizer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Search by organizer"
                        value={advancedFilters.organizerName}
                        onChange={(e) => handleAdvancedFilterChange('organizerName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Title Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Search in title"
                        value={advancedFilters.title}
                        onChange={(e) => handleAdvancedFilterChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Description Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Search in description"
                        value={advancedFilters.description}
                        onChange={(e) => handleAdvancedFilterChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={clearAdvancedFilters}
                      className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Clear Filters</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Active Filters Display */}
              {(searchQuery || (filterType && filterType !== 'all') || hasAdvancedFilters) && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          Search: "{searchQuery}"
                          <button
                            onClick={() => handleSearchQueryChange('')}
                            className="ml-1 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {filterType && filterType !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                          Category: {EVENT_TYPE_OPTIONS.find(t => t.value === filterType)?.label || filterType}
                          <button
                            onClick={() => handleFilterTypeChange('all')}
                            className="ml-1 p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {hasAdvancedFilters && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                          Advanced filters active
                          <button
                            onClick={clearAdvancedFilters}
                            className="ml-1 p-0.5 hover:bg-green-200 dark:hover:bg-green-800 rounded-full transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-gray-600 dark:text-gray-300">Loading events...</span>
              </span>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Found {eventsPagination?.totalElements || displayEvents?.length || 0} event{(eventsPagination?.totalElements || displayEvents?.length || 0) !== 1 ? 's' : ''}
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
                {eventsPagination?.totalElements > 0 && (activeTab === 'all' || activeTab === 'my-events' || activeTab === 'my-active-events') && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    (Page {(eventsPagination.page || 0) + 1} of {eventsPagination.totalPages || 0})
                  </p>
                )}
              </div>
            )}
          </div>

          {displayEvents && displayEvents.length > 0 && !isLoading && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">View:</span>
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {eventsPagination?.totalElements > 0 && !isLoading && (activeTab === 'all' || activeTab === 'my-events' || activeTab === 'my-active-events') && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>
                Showing {(eventsPagination.page || 0) * (eventsPagination.size || 10) + 1} to{" "}
                {Math.min(((eventsPagination.page || 0) + 1) * (eventsPagination.size || 10), eventsPagination.totalElements)} of{" "}
                {eventsPagination.totalElements} results
              </span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <span className="text-gray-400 dark:text-gray-500">
                {eventsPagination.size || 10} per page
              </span>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {(() => {
          // Phase 1: Core Event Management
          if (activeTab === 'all' || activeTab === 'my-events' || activeTab === 'my-active-events') {
            return (
              <>
                {/* Events Grid */}
                <div className="relative">
                  <div className={viewMode === 'grid' 
                    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }>
                    {displayEvents && displayEvents.map((event) => {
                      const isMyEvent = activeTab === "my-events";
                      const currentParticipationStatus = getParticipationStatus(event.id);
                       
                      return (
                        <EventCard
                          key={event.id}
                          event={event}
                          isMyEvent={isMyEvent}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEventCallback}
                          getEventTypeLabel={getEventCategoryLabel}
                          formatDate={formatDate}
                          formatTime={formatTime}
                          // Phase 3: Event Participation props
                          onRsvp={rsvpToEvent}
                          onUpdateRsvp={updateParticipation}
                          rsvpLoading={rsvpLoading}
                          currentParticipationStatus={currentParticipationStatus}
                          showRsvpButtons={true}
                          viewMode={viewMode}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Loading State */}
                {isLoading && displayEvents && displayEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading events...
                    </p>
                  </div>
                )}

                {/* Loading Overlay for Pagination */}
                {isLoading && displayEvents && displayEvents.length > 0 && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-300">Loading...</span>
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!isLoading && displayEvents && displayEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {!user ? "Sign in to view events" : "No events found"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {!user 
                        ? "Please sign in to your account to view and manage events."
                        : activeTab === "my-events" 
                          ? "You haven't created any events yet. Start by creating your first event!" 
                          : "Try adjusting your search criteria or filters"}
                    </p>
                    {!user ? (
                      <Button onClick={() => window.location.href = '/signin'} variant="outline">
                        Sign In
                      </Button>
                    ) : activeTab === "my-events" && (
                      <Button onClick={() => setShowCreateModal(true)} variant="outline">
                        Create Your First Event
                      </Button>
                    )}
                  </div>
                )}



                {/* Pagination */}
                <PaginationComponent />
              </>
            );
          }

          // Phase 2: Event Discovery & Search
          if (activeTab === 'upcoming') {
            return (
                             <UpcomingEvents
                 events={upcomingEvents}
                 loading={upcomingLoading}
                 error={upcomingError}
                 pagination={upcomingPagination}
                 onLoadMore={loadNextUpcomingPage}
                 onLoadPrevious={loadPreviousUpcomingPage}
                 getEventTypeLabel={getEventCategoryLabel}
                 formatDate={formatDate}
                 formatTime={formatTime}
                 onEditEvent={handleEditEvent}
                 onDeleteEvent={handleDeleteEventCallback}
                 // Phase 3: Event Participation props
                 onRsvp={rsvpToEvent}
                 onUpdateRsvp={updateParticipation}
                 rsvpLoading={rsvpLoading}
                 getParticipationStatus={getParticipationStatus}
               />
            );
          }

          if (activeTab === 'trending') {
            return (
                           <TrendingEvents
               events={trendingEvents}
               loading={trendingLoading}
               error={trendingError}
               getEventTypeLabel={getEventCategoryLabel}
               formatDate={formatDate}
               formatTime={formatTime}
               onEditEvent={handleEditEvent}
               onDeleteEvent={handleDeleteEventCallback}
               // Phase 3: Event Participation props
               onRsvp={rsvpToEvent}
               onUpdateRsvp={updateParticipation}
               rsvpLoading={rsvpLoading}
               getParticipationStatus={getParticipationStatus}
             />
            );
          }

          if (activeTab === 'search') {
            return (
                           <AdvancedSearch
               searchResults={searchResults}
               loading={discoverySearchLoading}
               error={discoverySearchError}
               pagination={searchPagination}
               onSearch={discoverySearchEvents}
               onClear={clearDiscoverySearch}
               onLoadMore={loadNextSearchPage}
               onLoadPrevious={loadPreviousSearchPage}
               getEventTypeLabel={getEventCategoryLabel}
               formatDate={formatDate}
               formatTime={formatTime}
               onEditEvent={handleEditEvent}
               onDeleteEvent={handleDeleteEventCallback}
               // Phase 3: Event Participation props
               onRsvp={rsvpToEvent}
               onUpdateRsvp={updateParticipation}
               rsvpLoading={rsvpLoading}
               getParticipationStatus={getParticipationStatus}
             />
            );
          }

          // Phase 3: Event Participation
          if (activeTab === 'participations') {
            return (
                           <MyParticipations
               participations={participations}
               loading={participationsLoading}
               error={participationsError}
               pagination={participationsPagination}
               onLoadMore={loadNextParticipationsPage}
               onLoadPrevious={loadPreviousParticipationsPage}
               onClearError={clearParticipationsError}
               getEventTypeLabel={getEventCategoryLabel}
               formatDate={formatDate}
               formatTime={formatTime}
               onEditEvent={handleEditEvent}
               onDeleteEvent={handleDeleteEventCallback}
               // Phase 3: Event Participation props
               onRsvp={rsvpToEvent}
               onUpdateRsvp={updateParticipation}
               rsvpLoading={rsvpLoading}
               getParticipationStatus={getParticipationStatus}
             />
            );
          }

          // Phase 3: Event Invitations
          if (activeTab === 'invitations') {
            return (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Event Invitations
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Manage your event invitations
                    </p>
                  </div>
                </div>

                {invitationsLoading ? (
                  <Card className="p-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                      <span className="ml-3 text-gray-600 dark:text-gray-400">Loading invitations...</span>
                    </div>
                  </Card>
                ) : invitationsError ? (
                  <Card className="p-6 border-error-200 dark:border-error-700">
                    <div className="text-center">
                      <p className="text-error-700 dark:text-error-300">{invitationsError}</p>
                    </div>
                  </Card>
                ) : myInvitations && myInvitations.length === 0 ? (
                  <Card className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No invitations
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        You don't have any pending event invitations.
                      </p>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myInvitations && myInvitations.map((invitation) => {
                      const currentParticipationStatus = getParticipationStatus ? getParticipationStatus(invitation.eventId) : null;
                      return (
                        <EventCard
                          key={invitation.id}
                          event={invitation.event}
                          isMyEvent={false}
                          onEdit={handleEditEvent}
                          onDelete={handleDeleteEventCallback}
                          getEventTypeLabel={getEventCategoryLabel}
                          formatDate={formatDate}
                          formatTime={formatTime}
                          // Phase 3: Event Participation props
                          onRsvp={rsvpToEvent}
                          onUpdateRsvp={updateParticipation}
                          rsvpLoading={rsvpLoading}
                          currentParticipationStatus={currentParticipationStatus}
                          showRsvpButtons={true}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return null;
        })()}
      </div>

      {/* Modals */}
      {showCreateModal && user && (
        <EventForm
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setEventForm(INITIAL_EVENT_FORM);
          }}
          onSubmit={handleCreateEventSubmit}
          formData={eventForm}
          setFormData={setEventForm}
          event={selectedEvent}
          loading={isLoading}
        />
      )}

      {showEventModal && selectedEvent && (
        <EventDetailsModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEventCallback}
          onInvite={() => setShowInviteModal(true)}
          onViewParticipants={handleViewParticipants}
          getEventTypeLabel={getEventCategoryLabel}
          formatDate={formatDate}
          formatTime={formatTime}
          // Phase 3: Event Participation props
          onRsvp={rsvpToEvent}
          onUpdateRsvp={updateParticipation}
          rsvpLoading={rsvpLoading}
          getParticipationStatus={getParticipationStatus}
          loading={isLoading}
        />
      )}

      {showInviteModal && selectedEvent && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            setInviteForm({ usernames: "", personalMessage: "" });
          }}
          onSubmit={sendInvitations}
          formData={inviteForm}
          setFormData={setInviteForm}
          event={selectedEvent}
          loading={isLoading}
        />
      )}

      {showParticipantsModal && selectedEvent && (
        <ParticipantsModal
          isOpen={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
          event={selectedEvent}
          loading={isLoading}
        />
      )}

    </div>
  );
};

export default Events; 