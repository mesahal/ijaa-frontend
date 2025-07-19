import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Filter,
  Search,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const MyEvents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  const registeredEvents = [
    {
      id: 1,
      title: "Annual Alumni Reunion 2025",
      date: "2025-03-15",
      time: "10:00 AM",
      location: "IIT JU Campus",
      type: "reunion",
      price: 0,
      status: "confirmed",
      registrationDate: "2025-01-10",
      image:
        "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      organizer: "Alumni Association",
      canCancel: true,
    },
    {
      id: 2,
      title: "Career Development Workshop",
      date: "2025-03-22",
      time: "2:00 PM",
      location: "Virtual Event",
      type: "workshop",
      price: 500,
      status: "confirmed",
      registrationDate: "2025-01-15",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      organizer: "Career Services",
      canCancel: true,
    },
    {
      id: 3,
      title: "Tech Talk: Future of AI",
      date: "2025-04-05",
      time: "6:00 PM",
      location: "Engineering Auditorium",
      type: "seminar",
      price: 0,
      status: "waitlisted",
      registrationDate: "2025-01-20",
      image:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      organizer: "CSE Department Alumni",
      canCancel: true,
    },
    {
      id: 4,
      title: "Alumni Sports Tournament",
      date: "2024-12-15",
      time: "9:00 AM",
      location: "University Sports Complex",
      type: "sports",
      price: 200,
      status: "attended",
      registrationDate: "2024-11-10",
      image:
        "https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      organizer: "Sports Committee",
      canCancel: false,
    },
    {
      id: 5,
      title: "Startup Pitch Competition",
      date: "2024-11-20",
      time: "11:00 AM",
      location: "Business Incubator",
      type: "competition",
      price: 1000,
      status: "cancelled",
      registrationDate: "2024-10-15",
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      organizer: "Entrepreneurship Cell",
      canCancel: false,
    },
  ];

  const filteredEvents = registeredEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || event.status === filterStatus;
    const matchesType = filterType === "all" || event.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCancelRegistration = (eventId) => {
    console.log("Cancelling registration for event:", eventId);
    // Handle cancellation logic
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        label: "Confirmed",
      },
      waitlisted: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        label: "Waitlisted",
      },
      attended: {
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
        label: "Attended",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: X,
        label: "Cancelled",
      },
    };

    const config = statusConfig[status] || statusConfig.confirmed;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="waitlisted">Waitlisted</option>
              <option value="attended">Attended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="reunion">Reunion</option>
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="sports">Sports</option>
              <option value="competition">Competition</option>
              <option value="networking">Networking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-64 h-48 lg:h-auto">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {event.type}
                    </span>
                    {getStatusBadge(event.status)}
                  </div>
                  {event.price > 0 && (
                    <span className="flex items-center space-x-1 text-green-600 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>{event.price} BDT</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {event.title}
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <Users className="h-4 w-4" />
                    <span>by {event.organizer}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Registered on{" "}
                    {new Date(event.registrationDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/events/${event.id}/register`)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Details
                    </button>

                    {event.canCancel && event.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelRegistration(event.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Cancel Registration
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No events found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {searchQuery || filterStatus !== "all" || filterType !== "all"
              ? "Try adjusting your search or filters to find more events."
              : "You haven't registered for any events yet."}
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
