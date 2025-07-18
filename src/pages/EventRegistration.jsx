import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";

const EventRegistration = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+880 1712-345678",
    specialRequests: "",
  });

  // Dummy event data - replace with API call later
  const dummyEvents = {
    1: {
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
        "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      description:
        "Join us for our biggest alumni gathering of the year! Reconnect with old friends, network with professionals, and celebrate our shared journey. This event will feature keynote speeches, networking sessions, cultural programs, and a grand dinner.",
      organizer: "Alumni Association",
      agenda: [
        { time: "10:00 AM", activity: "Registration & Welcome Coffee" },
        { time: "11:00 AM", activity: "Opening Ceremony" },
        {
          time: "12:00 PM",
          activity: "Keynote Speech by Distinguished Alumni",
        },
        { time: "1:00 PM", activity: "Lunch & Networking" },
        { time: "3:00 PM", activity: "Department-wise Meetups" },
        { time: "5:00 PM", activity: "Cultural Program" },
        { time: "7:00 PM", activity: "Gala Dinner" },
      ],
      requirements: [
        "Valid alumni ID or graduation certificate",
        "Professional attire recommended",
        "Bring business cards for networking",
      ],
    },
    2: {
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
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      description:
        "Enhance your career prospects with our comprehensive workshop covering resume building, interview skills, and networking strategies. Led by industry experts and career counselors.",
      organizer: "Career Services",
      agenda: [
        { time: "2:00 PM", activity: "Welcome & Introduction" },
        { time: "2:15 PM", activity: "Resume Building Workshop" },
        { time: "3:30 PM", activity: "Interview Skills Training" },
        { time: "4:45 PM", activity: "Break" },
        { time: "5:00 PM", activity: "Networking Strategies" },
        { time: "6:00 PM", activity: "Q&A Session" },
      ],
      requirements: [
        "Stable internet connection",
        "Updated resume (optional)",
        "Notebook for taking notes",
      ],
    },
    3: {
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
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1",
      description:
        "Explore the latest developments in artificial intelligence with industry experts and researchers. Learn about cutting-edge AI technologies and their impact on various industries.",
      organizer: "CSE Department Alumni",
      agenda: [
        { time: "6:00 PM", activity: "Registration" },
        { time: "6:30 PM", activity: "Opening Remarks" },
        { time: "6:45 PM", activity: "Keynote: AI in Healthcare" },
        { time: "7:30 PM", activity: "Panel Discussion: AI Ethics" },
        { time: "8:15 PM", activity: "Networking & Refreshments" },
      ],
      requirements: [
        "Basic understanding of technology",
        "Bring questions for Q&A session",
      ],
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const eventData = dummyEvents[eventId];
      setEvent(eventData);
      setLoading(false);
    }, 500);
  }, [eventId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setRegistering(true);

    // Simulate registration process
    setTimeout(() => {
      setRegistering(false);
      setRegistered(true);
    }, 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're trying to register for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            You have successfully registered for <strong>{event.title}</strong>
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{event.location}</span>
              </div>
              {event.price > 0 && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span>{event.price} BDT</span>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            A confirmation email has been sent to{" "}
            <strong>{formData.email}</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/events")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Events
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Events</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Event Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
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

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users className="h-5 w-5" />
                  <span>
                    {event.attendees}/{event.maxAttendees} registered
                  </span>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Event Agenda
                </h3>
                <div className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {item.time}
                      </span>
                      <span className="text-gray-700">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Register for Event
            </h2>

            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any dietary restrictions, accessibility needs, etc."
                />
              </div>

              {event.price > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CreditCard className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      Payment Required
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Registration fee: <strong>{event.price} BDT</strong>
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Payment will be processed after registration
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={registering || event.attendees >= event.maxAttendees}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Registering...</span>
                  </div>
                ) : event.attendees >= event.maxAttendees ? (
                  "Event Full"
                ) : (
                  `Register ${
                    event.price > 0 ? `(${event.price} BDT)` : "(Free)"
                  }`
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Organized by:</strong> {event.organizer}
                </p>
                <p>
                  <strong>Available Spots:</strong>{" "}
                  {event.maxAttendees - event.attendees} remaining
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
