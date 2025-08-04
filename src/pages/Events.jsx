import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../utils/apiClient";

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
};

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  // Load events based on active tab
  const loadEvents = useCallback(async () => {
    if (!user?.token) {
      setError("Authentication required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = activeTab === "my-events" ? "/events/my-events" : "/events/all-events";
      const response = await apiClient.get(endpoint);
      const result = response.data;

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
        response = await apiClient.put(`/events/my-events/${selectedEvent.id}`, eventForm);
        result = response.data;
      } else {
        // Create new event
        response = await apiClient.post("/events/create", eventForm);
        result = response.data;
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
      const response = await apiClient.delete(`/events/my-events/${eventId}`);
      const result = response.data;

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
    });
    
    setSelectedEvent(event);
    setShowEventModal(false);
    setShowCreateModal(true);
  }, []);

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
                      <button
                        onClick={() => handleViewEvent(event)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium flex-shrink-0 ml-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
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
              {activeTab === "my-events" && (
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleEditEvent(selectedEvent)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Event</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events; 