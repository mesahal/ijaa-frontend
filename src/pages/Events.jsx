import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Search,
  Plus,
  Star,
  Video,
  DollarSign,
} from "lucide-react";
import MyEvents from "./MyEvents";

const Events = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  // Check if we should show My Events tab based on URL
  React.useEffect(() => {
    if (location.pathname === "/my-events") {
      setActiveTab("my-events");
    }
  }, [location.pathname]);

  const events = [
    {
      id: 1,
      title: "Annual Alumni Reunion 2025",
      date: "2025-03-15",
      time: "10:00 AM",
      location: "IIT JU Campus",
      type: "reunion",
      price: 0,
      attendees: 150,
      maxAttendees: 200,
      isVirtual: false,
      featured: true,
      image:
        "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      description:
        "Join us for our biggest alumni gathering of the year! Reconnect with old friends, network with professionals, and celebrate our shared journey.",
      organizer: "Alumni Association",
      registered: false,
    },
    {
      id: 2,
      title: "Career Development Workshop",
      date: "2025-03-22",
      time: "2:00 PM",
      location: "Virtual Event",
      type: "workshop",
      price: 500,
      attendees: 89,
      maxAttendees: 100,
      isVirtual: true,
      featured: false,
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      description:
        "Enhance your career prospects with our comprehensive workshop covering resume building, interview skills, and networking strategies.",
      organizer: "Career Services",
      registered: true,
    },
    {
      id: 3,
      title: "Tech Talk: Future of AI",
      date: "2025-04-05",
      time: "6:00 PM",
      location: "Engineering Auditorium",
      type: "seminar",
      price: 0,
      attendees: 75,
      maxAttendees: 120,
      isVirtual: false,
      featured: false,
      image:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      description:
        "Explore the latest developments in artificial intelligence with industry experts and researchers.",
      organizer: "CSE Department Alumni",
      registered: false,
    },
    {
      id: 4,
      title: "Alumni Sports Tournament",
      date: "2025-04-12",
      time: "9:00 AM",
      location: "University Sports Complex",
      type: "sports",
      price: 200,
      attendees: 45,
      maxAttendees: 80,
      isVirtual: false,
      featured: false,
      image:
        "https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      description:
        "Friendly competition in cricket, football, and badminton. Relive your university sports days!",
      organizer: "Sports Committee",
      registered: false,
    },
    {
      id: 5,
      title: "Startup Pitch Competition",
      date: "2025-04-20",
      time: "11:00 AM",
      location: "Business Incubator",
      type: "competition",
      price: 1000,
      attendees: 32,
      maxAttendees: 50,
      isVirtual: false,
      featured: true,
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      description:
        "Present your startup ideas to a panel of investors and win funding opportunities.",
      organizer: "Entrepreneurship Cell",
      registered: false,
    },
    {
      id: 6,
      title: "Virtual Networking Mixer",
      date: "2025-05-03",
      time: "7:00 PM",
      location: "Online Platform",
      type: "networking",
      price: 0,
      attendees: 125,
      maxAttendees: 200,
      isVirtual: true,
      featured: false,
      image:
        "https://images.pexels.com/photos/1181435/pexels-photo-1181435.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1",
      description:
        "Connect with alumni from around the world in our virtual networking event.",
      organizer: "Global Alumni Network",
      registered: false,
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || event.type === filterType;
    const matchesLocation =
      filterLocation === "all" ||
      (filterLocation === "virtual" && event.isVirtual) ||
      (filterLocation === "physical" && !event.isVirtual);

    return matchesSearch && matchesType && matchesLocation;
  });

  const handleRegister = (eventId) => {
    navigate(`/events/${eventId}/register`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alumni Events</h1>
            <p className="text-gray-600 mt-2">
              Discover and join upcoming alumni events
            </p>
          </div>
          <Link
            to="/events/create"
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab("browse");
                navigate("/events");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "browse"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Browse Events
            </button>
            <button
              onClick={() => {
                setActiveTab("my-events");
                navigate("/my-events");
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "my-events"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Events
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "my-events" ? (
        <MyEvents />
      ) : (
        <>
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {/* Location Filter */}
              <div>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  <option value="physical">In-Person</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Events */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Featured Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredEvents
                .filter((event) => event.featured)
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                          <Star className="h-4 w-4" />
                          <span>Featured</span>
                        </span>
                      </div>
                      {event.isVirtual && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                            <Video className="h-4 w-4" />
                            <span>Virtual</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {event.type}
                        </span>
                        {event.price > 0 && (
                          <span className="flex items-center space-x-1 text-green-600 font-medium">
                            <DollarSign className="h-4 w-4" />
                            <span>{event.price} BDT</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.attendees}/{event.maxAttendees} registered
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          by {event.organizer}
                        </span>
                        {event.registered ? (
                          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium">
                            Registered
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRegister(event.id)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* All Events */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Events
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredEvents
                .filter((event) => !event.featured)
                .map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="flex">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium capitalize">
                              {event.type}
                            </span>
                            {event.isVirtual && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                                <Video className="h-3 w-3" />
                                <span>Virtual</span>
                              </span>
                            )}
                          </div>
                          {event.price > 0 && (
                            <span className="text-green-600 font-medium text-sm">
                              {event.price} BDT
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>

                        <div className="space-y-1 mb-3 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(event.date)} at {event.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>
                              {event.attendees}/{event.maxAttendees} registered
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            by {event.organizer}
                          </span>
                          {event.registered ? (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-medium">
                              Registered
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegister(event.id)}
                              className="bg-blue-600 text-white px-4 py-1 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                            >
                              Register
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find more events.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
