import React, { useState, useCallback } from 'react';
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
} from 'lucide-react';

// Import authentication context
import { useUnifiedAuth } from '../context/UnifiedAuthContext';

// Import custom hooks
import { useEvents } from '../hooks/events/useEvents';
import { useEventActions } from '../hooks/events/useEventActions';
import { useEventSearch } from '../hooks/events/useEventSearch';
import { useEventInvitations } from '../hooks/events/useEventInvitations';

// Import components
import EventCard from '../components/events/EventCard';
import EventTabs from '../components/events/EventTabs';
import EventFilters from '../components/events/EventFilters';
import EventForm from '../components/events/EventForm';
import EventDetailsModal from '../components/events/EventDetailsModal';
import InviteModal from '../components/events/InviteModal';
import ParticipantsModal from '../components/events/ParticipantsModal';
import SearchModal from '../components/events/SearchModal';

// Import UI components
import { Button, Card, Badge } from '../components/ui';

// Import constants
import { EVENT_TYPES, EVENT_PRIVACY, PARTICIPATION_STATUS } from '../utils/eventApi';

// Constants
const EVENT_TYPE_OPTIONS = [
  { value: EVENT_TYPES.NETWORKING, label: "Networking" },
  { value: EVENT_TYPES.WORKSHOP, label: "Workshop" },
  { value: EVENT_TYPES.CONFERENCE, label: "Conference" },
  { value: EVENT_TYPES.SOCIAL, label: "Social" },
  { value: EVENT_TYPES.CAREER, label: "Career" },
  { value: EVENT_TYPES.MENTORSHIP, label: "Mentorship" },
];

const INITIAL_EVENT_FORM = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  eventType: EVENT_TYPES.NETWORKING,
  isOnline: false,
  meetingLink: "",
  maxParticipants: 50,
  organizerName: "",
  organizerEmail: "",
  privacy: EVENT_PRIVACY.PUBLIC,
  inviteMessage: "",
};

/**
 * Events Page Component
 * Main page for managing and viewing events
 * Uses custom hooks for state management and business logic
 */
const Events = () => {
  // Get user from authentication context
  const { user } = useUnifiedAuth();
  
  // Custom hooks
  const {
    events,
    myEvents,
    loading: eventsLoading,
    error: eventsError,
    activeTab,
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
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Selected items
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState(INITIAL_EVENT_FORM);
  const [inviteForm, setInviteForm] = useState({ usernames: "", personalMessage: "" });
  const [searchForm, setSearchForm] = useState({
    location: "",
    eventType: "",
    startDate: "",
    endDate: "",
    isOnline: "",
    organizerName: "",
    title: "",
    description: ""
  });

  // Combined loading and error states
  const isLoading = eventsLoading || actionsLoading || searchLoading || invitationsLoading;
  const error = eventsError || actionsError || searchError || invitationsError;

  /**
   * Handle tab change and clear search
   */
  const handleTabChangeWithClear = useCallback((tab) => {
    handleTabChange(tab);
    clearSearch();
  }, [handleTabChange, clearSearch]);

  /**
   * Handle view event details
   */
  const handleViewEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  /**
   * Handle edit event - populate form with current values
   */
  const handleEditEvent = useCallback((event) => {
    // Format dates for datetime-local input (YYYY-MM-DDTHH:MM)
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEventForm({
      title: event.title,
      description: event.description,
      startDate: formatDateForInput(event.startDate),
      endDate: formatDateForInput(event.endDate),
      location: event.location || "",
      eventType: event.eventType,
      isOnline: event.isOnline,
      meetingLink: event.meetingLink || "",
      maxParticipants: event.maxParticipants,
      organizerName: event.organizerName,
      organizerEmail: event.organizerEmail,
      privacy: event.privacy || "PUBLIC",
      inviteMessage: event.inviteMessage || "",
    });
    
    setSelectedEvent(event);
    setShowEventModal(false);
    setShowCreateModal(true);
  }, []);

  /**
   * Handle create/update event form submission
   */
  const handleCreateEventSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await handleCreateEvent(eventForm, selectedEvent);
    
    if (result.success) {
      setShowCreateModal(false);
      setSelectedEvent(null);
      setEventForm(INITIAL_EVENT_FORM);
    }
  }, [eventForm, selectedEvent, handleCreateEvent]);

  /**
   * Handle send invitations
   */
  const handleSendInvitationsSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await sendInvitations(selectedEvent.id, inviteForm.usernames, inviteForm.personalMessage);
    
    if (result.success) {
      setShowInviteModal(false);
      setInviteForm({ usernames: "", personalMessage: "" });
      setSelectedEvent(null);
    }
  }, [selectedEvent, inviteForm, sendInvitations]);

  /**
   * Handle search events
   */
  const handleSearchEventsSubmit = useCallback(async (e) => {
    e.preventDefault();
    const result = await searchEvents(searchForm);
    
    if (result.success) {
      setShowSearchModal(false);
    }
  }, [searchForm, searchEvents]);

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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  /**
   * Get event type label
   */
  const getEventTypeLabel = useCallback((eventType) => {
    const type = EVENT_TYPE_OPTIONS.find(t => t.value === eventType);
    return type ? type.label : eventType;
  }, []);

  // Get filtered events
  const currentEvents = getCurrentEvents();
  const displayEvents = getFilteredEvents(currentEvents) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover and manage alumni events
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              size="lg"
              icon={<Plus className="h-5 w-5" />}
              disabled={!user?.token}
            >
              {user?.token ? "Create Event" : "Sign in to Create Event"}
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
        {!error && !isLoading && displayEvents && displayEvents.length === 0 && (
          <Card className="mb-6 border-warning-200 dark:border-warning-700">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-warning-500 flex-shrink-0" />
                <div>
                  <p className="text-warning-700 dark:text-warning-300 font-medium">
                    Sign in to view and manage events
                  </p>
                  <p className="text-warning-600 dark:text-warning-400 text-sm mt-1">
                    Please sign in to your account to access the events feature.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Tabs */}
        <EventTabs
          activeTab={activeTab}
          onTabChange={handleTabChangeWithClear}
          invitationCounts={invitationCounts}
        />

        {/* Search and Filters */}
        <EventFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchQueryChange}
          filterType={filterType}
          onFilterChange={handleFilterTypeChange}
          onAdvancedSearch={() => setShowSearchModal(true)}
          eventTypeOptions={EVENT_TYPE_OPTIONS}
        />

        {/* Events Grid */}
        {isLoading ? (
          <Card className="p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading events...</span>
            </div>
          </Card>
        ) : (displayEvents && displayEvents.length === 0) ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {!user?.token ? "Sign in to view events" : "No events found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {!user?.token 
                  ? "Please sign in to your account to view and manage events."
                  : activeTab === "my-events" 
                    ? "You haven't created any events yet." 
                    : "No events match your search criteria."}
              </p>
              {!user?.token ? (
                <Button
                  onClick={() => window.location.href = '/signin'}
                  variant="primary"
                  icon={<Calendar className="h-4 w-4" />}
                >
                  Sign In
                </Button>
              ) : activeTab === "my-events" && (
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                >
                  Create Your First Event
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents && displayEvents.map((event) => {
              const isMyEvent = activeTab === "my-events";
               
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  isMyEvent={isMyEvent}
                  onView={handleViewEvent}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                  getEventTypeLabel={getEventTypeLabel}
                  formatDate={formatDate}
                />
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        {displayEvents && displayEvents.length > 0 && (
          <Card className="mt-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Events</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">{displayEvents.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {displayEvents.filter(e => new Date(e.startDate) > new Date()).length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Online Events</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {displayEvents.filter(e => e.isOnline).length}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && user?.token && (
        <EventForm
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedEvent(null);
            setEventForm(INITIAL_EVENT_FORM);
          }}
          onSubmit={handleCreateEventSubmit}
          formData={eventForm}
          setFormData={setEventForm}
          selectedEvent={selectedEvent}
          loading={isLoading}
          eventTypeOptions={EVENT_TYPE_OPTIONS}
        />
      )}

      {showEventModal && selectedEvent && user?.token && (
        <EventDetailsModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          isMyEvent={activeTab === "my-events"}
          onEdit={handleEditEvent}
          onViewParticipants={handleViewParticipants}
          onInvite={() => {
            setShowEventModal(false);
            setShowInviteModal(true);
          }}
          getMyParticipationStatus={getMyParticipationStatus}
          getMyInvitationStatus={getMyInvitationStatus}
          onRsvp={handleRsvp}
          onCancelRsvp={handleCancelRsvp}
          onAcceptInvitation={acceptInvitation}
          onDeclineInvitation={declineInvitation}
          formatDate={formatDate}
          getEventTypeLabel={getEventTypeLabel}
          participationStatus={PARTICIPATION_STATUS}
        />
      )}

      {showInviteModal && selectedEvent && user?.token && (
        <InviteModal
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            setInviteForm({ usernames: "", personalMessage: "" });
          }}
          onSubmit={handleSendInvitationsSubmit}
          formData={inviteForm}
          setFormData={setInviteForm}
          loading={isLoading}
        />
      )}

      {showParticipantsModal && user?.token && (
        <ParticipantsModal
          isOpen={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
          loading={isLoading}
        />
      )}

      {showSearchModal && user?.token && (
        <SearchModal
          isOpen={showSearchModal}
          onClose={() => {
            setShowSearchModal(false);
            setSearchForm({
              location: "",
              eventType: "",
              startDate: "",
              endDate: "",
              isOnline: "",
              organizerName: "",
              title: "",
              description: ""
            });
          }}
          onSubmit={handleSearchEventsSubmit}
          formData={searchForm}
          setFormData={setSearchForm}
          loading={isLoading}
          eventTypeOptions={EVENT_TYPE_OPTIONS}
        />
      )}
    </div>
  );
};

export default Events; 