import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Video,
  User,
  Mail,
  ExternalLink,
  AlertCircle,
  X,
  CheckCircle,
  Clock,
  UserPlus,
  MessageSquare,
  Filter,
  Send,
  Shield,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { eventApi, PARTICIPATION_STATUS } from "../utils/eventApi";

// Constants
const EVENT_TYPES = [
  { value: "MEETING", label: "Meeting", icon: Users },
  { value: "CELEBRATION", label: "Celebration", icon: Calendar },
  { value: "VIRTUAL_MEETING", label: "Virtual Meeting", icon: Video },
  { value: "WORKSHOP", label: "Workshop", icon: Users },
  { value: "CONFERENCE", label: "Conference", icon: Users },
];

const INITIAL_EVENT_FORM = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  location: "",
  eventType: "MEETING",
  isOnline: false,
  meetingLink: "",
  maxParticipants: 50,
  organizerName: "",
  organizerEmail: "",
  privacy: "PUBLIC",
  inviteMessage: "",
};

const Events = () => {
  const { user } = useAuth();

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [eventForm, setEventForm] = useState(INITIAL_EVENT_FORM);
  
  // New state for enhanced features
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [myParticipations, setMyParticipations] = useState([]);
  const [myInvitations, setMyInvitations] = useState([]);
  const [invitationCounts, setInvitationCounts] = useState({ unreadCount: 0, unrespondedCount: 0 });
  const [eventParticipants, setEventParticipants] = useState([]);
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

  // Load events based on active tab
  const loadEvents = useCallback(async () => {
    if (!user?.token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = activeTab === "my-events" ? "getMyEvents" : "getAllEvents";
      const response = await eventApi[endpoint]();
      const result = response;

      if ((result.code === "200" || result.code === 200) && result.data) {
        if (activeTab === "my-events") {
          setMyEvents(result.data);
        } else {
          setEvents(result.data);
        }
      } else {
        throw new Error(result.message || "Failed to fetch events");
      }
    } catch (err) {
      console.error("Error loading events:", err);
      setError(err.response?.data?.message || err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [activeTab, user?.token]);

  // Load events on component mount and tab change
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Load additional data on component mount
  useEffect(() => {
    const loadAdditionalData = async () => {
      if (!user?.token) return;
      
      try {
        // Load participations and invitations
        const [participationsResponse, invitationsResponse, countsResponse] = await Promise.all([
          eventApi.getMyParticipations(),
          eventApi.getMyInvitations(),
          eventApi.getInvitationCounts()
        ]);

        if (participationsResponse.data) setMyParticipations(participationsResponse.data);
        if (invitationsResponse.data) setMyInvitations(invitationsResponse.data);
        if (countsResponse.data) setInvitationCounts(countsResponse.data);
      } catch (error) {
        console.error('Error loading additional data:', error);
      }
    };

    loadAdditionalData();
  }, [user?.token]);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchQuery("");
    setFilterType("all");
  }, []);

  // Handle search
  const handleSearch = useCallback(() => {
    const currentEvents = activeTab === "my-events" ? myEvents : events;
    return currentEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, myEvents, events, searchQuery]);

  // Handle filter by type
  const handleFilterByType = useCallback((events) => {
    if (filterType === "all") return events;
    return events.filter((event) => event.eventType === filterType);
  }, [filterType]);

  // Get filtered and searched events
  const getDisplayEvents = useCallback(() => {
    let filteredEvents = handleSearch();
    return handleFilterByType(filteredEvents);
  }, [handleSearch, handleFilterByType]);

  // Handle create/update event
  const handleCreateEvent = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!eventForm.title || !eventForm.startDate || !eventForm.endDate || !eventForm.organizerName || !eventForm.organizerEmail) {
        throw new Error("Please fill in all required fields");
      }

      if (new Date(eventForm.startDate) >= new Date(eventForm.endDate)) {
        throw new Error("Start date must be before end date");
      }

      if (eventForm.isOnline && !eventForm.meetingLink) {
        throw new Error("Meeting link is required for online events");
      }

      let response;
      let result;

      if (selectedEvent) {
        // Update existing event
        response = await eventApi.updateEvent(selectedEvent.id, eventForm);
        result = response;
      } else {
        // Create new event
        response = await eventApi.createEvent(eventForm);
        result = response;
      }

      if ((result.code === "201" || result.code === "200" || result.code === 200) && result.data) {
        setShowCreateModal(false);
        setSelectedEvent(null);
        setEventForm(INITIAL_EVENT_FORM);
        await loadEvents();
      } else {
        throw new Error(result.message || "Failed to save event");
      }
    } catch (err) {
      console.error("Error saving event:", err);
      setError(err.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  }, [eventForm, selectedEvent, loadEvents]);

  // Handle delete event
  const handleDeleteEvent = useCallback(async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.deleteEvent(eventId);
      const result = response;

      if ((result.code === "200" || result.code === 200)) {
        await loadEvents();
      } else {
        throw new Error(result.message || "Failed to delete event");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setError(err.message || "Failed to delete event");
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);

  // Handle view event details
  const handleViewEvent = useCallback((event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  }, []);

  // Handle edit event - populate form with current values
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

  // ===== NEW EVENT MANAGEMENT FUNCTIONS =====

  // Handle RSVP to event
  const handleRsvp = useCallback(async (eventId, status, message = '') => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.rsvpToEvent(eventId, status, message);
      if ((response.code === "200" || response.code === 200)) {
        await loadEvents();
        // Refresh participations
        const participationsResponse = await eventApi.getMyParticipations();
        if (participationsResponse.data) setMyParticipations(participationsResponse.data);
      } else {
        throw new Error(response.message || "Failed to RSVP");
      }
    } catch (err) {
      console.error("Error RSVPing to event:", err);
      setError(err.response?.data?.message || err.message || "Failed to RSVP");
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);



  // Handle cancel RSVP
  const handleCancelRsvp = useCallback(async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your RSVP?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.cancelRsvp(eventId);
      if ((response.code === "200" || response.code === 200)) {
        await loadEvents();
        // Refresh participations
        const participationsResponse = await eventApi.getMyParticipations();
        if (participationsResponse.data) setMyParticipations(participationsResponse.data);
      } else {
        throw new Error(response.message || "Failed to cancel RSVP");
      }
    } catch (err) {
      console.error("Error canceling RSVP:", err);
      setError(err.response?.data?.message || err.message || "Failed to cancel RSVP");
    } finally {
      setLoading(false);
    }
  }, [loadEvents]);

  // Handle send invitations
  const handleSendInvitations = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const usernames = inviteForm.usernames.split(',').map(u => u.trim()).filter(u => u);
      if (usernames.length === 0) {
        throw new Error("Please enter at least one username");
      }

      const response = await eventApi.sendInvitations(selectedEvent.id, usernames, inviteForm.personalMessage);
      if ((response.code === "200" || response.code === 200)) {
        setShowInviteModal(false);
        setInviteForm({ usernames: "", personalMessage: "" });
        setSelectedEvent(null);
      } else {
        throw new Error(response.message || "Failed to send invitations");
      }
    } catch (err) {
      console.error("Error sending invitations:", err);
      setError(err.response?.data?.message || err.message || "Failed to send invitations");
    } finally {
      setLoading(false);
    }
  }, [inviteForm, selectedEvent]);

  // Handle accept invitation
  const handleAcceptInvitation = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.acceptInvitation(eventId);
      if ((response.code === "200" || response.code === 200)) {
        // Refresh invitations and participations
        const [invitationsResponse, participationsResponse] = await Promise.all([
          eventApi.getMyInvitations(),
          eventApi.getMyParticipations()
        ]);
        if (invitationsResponse.data) setMyInvitations(invitationsResponse.data);
        if (participationsResponse.data) setMyParticipations(participationsResponse.data);
      } else {
        throw new Error(response.message || "Failed to accept invitation");
      }
    } catch (err) {
      console.error("Error accepting invitation:", err);
      setError(err.response?.data?.message || err.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle decline invitation
  const handleDeclineInvitation = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.declineInvitation(eventId);
      if ((response.code === "200" || response.code === 200)) {
        // Refresh invitations
        const invitationsResponse = await eventApi.getMyInvitations();
        if (invitationsResponse.data) setMyInvitations(invitationsResponse.data);
      } else {
        throw new Error(response.message || "Failed to decline invitation");
      }
    } catch (err) {
      console.error("Error declining invitation:", err);
      setError(err.response?.data?.message || err.message || "Failed to decline invitation");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle search events
  const handleSearchEvents = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Filter out empty values
      const searchCriteria = Object.fromEntries(
        Object.entries(searchForm).filter(([_, value]) => value !== "")
      );

      const response = await eventApi.searchEventsPost(searchCriteria);
      if ((response.code === "200" || response.code === 200) && response.data) {
        setEvents(response.data);
        setShowSearchModal(false);
      } else {
        throw new Error(response.message || "Failed to search events");
      }
    } catch (err) {
      console.error("Error searching events:", err);
      setError(err.response?.data?.message || err.message || "Failed to search events");
    } finally {
      setLoading(false);
    }
  }, [searchForm]);

  // Handle view participants
  const handleViewParticipants = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.getEventParticipants(eventId);
      if ((response.code === "200" || response.code === 200) && response.data) {
        setEventParticipants(response.data);
        setShowParticipantsModal(true);
      } else {
        throw new Error(response.message || "Failed to load participants");
      }
    } catch (err) {
      console.error("Error loading participants:", err);
      setError(err.response?.data?.message || err.message || "Failed to load participants");
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's participation status for an event
  const getMyParticipationStatus = useCallback((eventId) => {
    const participation = myParticipations.find(p => p.eventId === eventId);
    return participation ? participation.status : null;
  }, [myParticipations]);

  // Check if user has been invited to an event
  const getMyInvitationStatus = useCallback((eventId) => {
    const invitation = myInvitations.find(i => i.eventId === eventId);
    return invitation ? { isInvited: true, isRead: invitation.isRead, isResponded: invitation.isResponded } : null;
  }, [myInvitations]);

  // Format date for display
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

  // Get event type label
  const getEventTypeLabel = useCallback((eventType) => {
    const type = EVENT_TYPES.find(t => t.value === eventType);
    return type ? type.label : eventType;
  }, []);

  const displayEvents = getDisplayEvents();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover and manage alumni events
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => handleTabChange("all")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => handleTabChange("my-events")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "my-events"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => handleTabChange("invitations")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === "invitations"
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Invitations
            {invitationCounts.unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {invitationCounts.unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                {EVENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Advanced Search Button */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Search</span>
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === "my-events" 
                ? "You haven't created any events yet." 
                : "No events match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => {
              const isMyEvent = activeTab === "my-events";
               
              return (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow h-80 flex flex-col overflow-hidden"
                >
                  {/* Event Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-1 overflow-hidden flex flex-col">
                    <div className="flex items-start justify-between mb-3 flex-shrink-0">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {getEventTypeLabel(event.eventType)}
                        </span>
                      </div>
                      {isMyEvent && (
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="overflow-hidden flex-1 min-h-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-1 overflow-hidden flex-shrink-0">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate min-w-0 flex-1">{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate min-w-0 flex-1">{event.isOnline ? "Online Event" : event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate min-w-0 flex-1">{event.currentParticipants}/{event.maxParticipants} participants</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Footer */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {event.organizerName}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* Privacy Badge */}
                        {event.privacy && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.privacy === 'PUBLIC' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                              : event.privacy === 'PRIVATE'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                          }`}>
                            {event.privacy === 'PUBLIC' ? <ShieldCheck className="h-3 w-3 inline mr-1" /> : 
                             event.privacy === 'PRIVATE' ? <ShieldX className="h-3 w-3 inline mr-1" /> : 
                             <Shield className="h-3 w-3 inline mr-1" />}
                            {event.privacy}
                          </span>
                        )}
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedEvent(null);
                    setEventForm(INITIAL_EVENT_FORM);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter event title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter event description"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.startDate}
                    onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.endDate}
                    onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Event Type and Online Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Type
                  </label>
                  <select
                    value={eventForm.eventType}
                    onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Format
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!eventForm.isOnline}
                        onChange={() => setEventForm({ ...eventForm, isOnline: false })}
                        className="mr-2"
                      />
                      <span className="text-sm">In-Person</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={eventForm.isOnline}
                        onChange={() => setEventForm({ ...eventForm, isOnline: true })}
                        className="mr-2"
                      />
                      <span className="text-sm">Online</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Location or Meeting Link */}
              {eventForm.isOnline ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Link *
                  </label>
                  <input
                    type="url"
                    required
                    value={eventForm.meetingLink}
                    onChange={(e) => setEventForm({ ...eventForm, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter event location"
                  />
                </div>
              )}

              {/* Max Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Participants *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={eventForm.maxParticipants}
                  onChange={(e) => setEventForm({ ...eventForm, maxParticipants: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Organizer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organizer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventForm.organizerName}
                    onChange={(e) => setEventForm({ ...eventForm, organizerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter organizer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organizer Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={eventForm.organizerEmail}
                    onChange={(e) => setEventForm({ ...eventForm, organizerEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter organizer email"
                  />
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Privacy *
                  </label>
                  <select
                    value={eventForm.privacy}
                    onChange={(e) => setEventForm({ ...eventForm, privacy: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="PUBLIC">Public - Anyone can see and join</option>
                    <option value="PRIVATE">Private - Only invited users can see and join</option>
                    <option value="INVITE_ONLY">Invite Only - Anyone can see but only invited users can join</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Invite Message
                  </label>
                  <input
                    type="text"
                    value={eventForm.inviteMessage}
                    onChange={(e) => setEventForm({ ...eventForm, inviteMessage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Message to show when inviting people"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : selectedEvent ? (
                    <Edit className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>{selectedEvent ? "Update Event" : "Create Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Event Details
                </h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Event Header */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {getEventTypeLabel(selectedEvent.eventType)}
                  </span>
                  {selectedEvent.isOnline && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 text-xs rounded-full">
                      Online
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedEvent.isOnline ? "Online Event" : selectedEvent.location}
                    </p>
                  </div>
                </div>

                {selectedEvent.isOnline && selectedEvent.meetingLink && (
                  <div className="flex items-center space-x-3">
                    <Video className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Link</p>
                      <a
                        href={selectedEvent.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>Join Meeting</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                    <p className="text-gray-900 dark:text-white">
                      {selectedEvent.currentParticipants}/{selectedEvent.maxParticipants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Organizer</p>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.organizerName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.organizerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  {/* View Participants Button */}
                  <button
                    onClick={() => handleViewParticipants(selectedEvent.id)}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                  >
                    <Users className="h-3 w-3" />
                    <span>Participants</span>
                  </button>

                  {/* Invite Button (only for event creator) */}
                  {activeTab === "my-events" && (
                    <button
                      onClick={() => {
                        setShowEventModal(false);
                        setShowInviteModal(true);
                      }}
                      className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-1"
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>Invite</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  {activeTab === "my-events" && (
                    <button
                      onClick={() => handleEditEvent(selectedEvent)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Event</span>
                    </button>
                  )}
                </div>
              </div>

              {/* RSVP Section */}
              {activeTab !== "my-events" && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Response</h4>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const myStatus = getMyParticipationStatus(selectedEvent.id);
                      const invitationStatus = getMyInvitationStatus(selectedEvent.id);
                      
                      if (invitationStatus && !invitationStatus.isResponded) {
                        return (
                          <>
                            <button
                              onClick={() => handleAcceptInvitation(selectedEvent.id)}
                              className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleDeclineInvitation(selectedEvent.id)}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <X className="h-3 w-3" />
                              <span>Decline</span>
                            </button>
                          </>
                        );
                      } else if (myStatus) {
                        return (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Status: <span className="font-medium">{myStatus}</span>
                            </span>
                            <button
                              onClick={() => handleCancelRsvp(selectedEvent.id)}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                              Cancel RSVP
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRsvp(selectedEvent.id, PARTICIPATION_STATUS.GOING)}
                              className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Going</span>
                            </button>
                            <button
                              onClick={() => handleRsvp(selectedEvent.id, PARTICIPATION_STATUS.MAYBE)}
                              className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <Clock className="h-3 w-3" />
                              <span>Maybe</span>
                            </button>
                            <button
                              onClick={() => handleRsvp(selectedEvent.id, PARTICIPATION_STATUS.NOT_GOING)}
                              className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                            >
                              <X className="h-3 w-3" />
                              <span>Not Going</span>
                            </button>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invitations Tab Content */}
      {activeTab === "invitations" && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            My Invitations ({myInvitations.length})
          </h3>
          {myInvitations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No invitations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myInvitations.map((invitation) => (
                <div key={invitation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Invitation to: {invitation.eventTitle || `Event #${invitation.eventId}`}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        From: {invitation.invitedByUsername}
                      </p>
                      {invitation.personalMessage && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          "{invitation.personalMessage}"
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {!invitation.isRead && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400 text-xs rounded-full">
                            New
                          </span>
                        )}
                        {invitation.isResponded ? (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-400 text-xs rounded-full">
                            Responded
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400 text-xs rounded-full">
                            Pending Response
                          </span>
                        )}
                      </div>
                    </div>
                    {!invitation.isResponded && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAcceptInvitation(invitation.eventId)}
                          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleDeclineInvitation(invitation.eventId)}
                          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <X className="h-3 w-3" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Invite People
                </h2>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteForm({ usernames: "", personalMessage: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSendInvitations} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Usernames (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={inviteForm.usernames}
                  onChange={(e) => setInviteForm({ ...inviteForm, usernames: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="username1, username2, username3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personal Message (optional)
                </label>
                <textarea
                  value={inviteForm.personalMessage}
                  onChange={(e) => setInviteForm({ ...inviteForm, personalMessage: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Add a personal message..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Send Invitations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Event Participants
                </h2>
                <button
                  onClick={() => {
                    setShowParticipantsModal(false);
                    setEventParticipants([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {eventParticipants.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No participants found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {eventParticipants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {participant.participantUsername}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Status: {participant.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {participant.status === PARTICIPATION_STATUS.GOING && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {participant.status === PARTICIPATION_STATUS.MAYBE && (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                        {participant.status === PARTICIPATION_STATUS.NOT_GOING && (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Advanced Search
                </h2>
                <button
                  onClick={() => {
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
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSearchEvents} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={searchForm.location}
                    onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Search by location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Type
                  </label>
                  <select
                    value={searchForm.eventType}
                    onChange={(e) => setSearchForm({ ...searchForm, eventType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={searchForm.startDate}
                    onChange={(e) => setSearchForm({ ...searchForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={searchForm.endDate}
                    onChange={(e) => setSearchForm({ ...searchForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Online Status
                  </label>
                  <select
                    value={searchForm.isOnline}
                    onChange={(e) => setSearchForm({ ...searchForm, isOnline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Events</option>
                    <option value="true">Online Only</option>
                    <option value="false">In-Person Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organizer Name
                  </label>
                  <input
                    type="text"
                    value={searchForm.organizerName}
                    onChange={(e) => setSearchForm({ ...searchForm, organizerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Search by organizer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={searchForm.title}
                  onChange={(e) => setSearchForm({ ...searchForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Search in title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={searchForm.description}
                  onChange={(e) => setSearchForm({ ...searchForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Search in description"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>Search Events</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 