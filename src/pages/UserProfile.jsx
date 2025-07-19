import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Camera,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Globe,
  MessageCircle,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dummy user data - replace with API call later
  const dummyUsers = {
    1: {
      id: 1,
      name: "Sarah Ahmed",
      email: "sarah.ahmed@example.com",
      batch: "2019",
      department: "Computer Science & Engineering",
      profession: "Data Scientist",
      company: "Google",
      location: "San Francisco, USA",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      coverImage:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&dpr=1",
      bio: "Passionate about machine learning and AI. Love connecting with fellow alumni and sharing knowledge about data science and technology trends.",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/sarahahmed",
      website: "https://sarahahmed.dev",
      skills: [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "TensorFlow",
        "SQL",
      ],
      connections: 156,
      isConnected: false,
      experience: [
        {
          title: "Senior Data Scientist",
          company: "Google",
          period: "2021 - Present",
          description:
            "Leading ML initiatives for search ranking algorithms and user behavior analysis.",
        },
        {
          title: "Data Scientist",
          company: "Facebook",
          period: "2019 - 2021",
          description:
            "Developed recommendation systems and analyzed user engagement metrics.",
        },
      ],
    },
    2: {
      id: 2,
      name: "Rakib Hassan",
      email: "rakib.hassan@example.com",
      batch: "2018",
      department: "Electrical & Electronic Engineering",
      profession: "Hardware Engineer",
      company: "Intel",
      location: "Dhaka, Bangladesh",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      coverImage:
        "https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&dpr=1",
      bio: "Working on next-generation processors and chip design. Always excited to help fellow engineers and share knowledge about hardware development.",
      phone: "+880 1712-345678",
      linkedin: "https://linkedin.com/in/rakibhassan",
      website: "https://rakibhassan.tech",
      skills: [
        "VLSI Design",
        "Digital Circuits",
        "Embedded Systems",
        "Verilog",
        "FPGA",
      ],
      connections: 89,
      isConnected: true,
      experience: [
        {
          title: "Senior Hardware Engineer",
          company: "Intel",
          period: "2020 - Present",
          description:
            "Designing and optimizing processor architectures for mobile and desktop platforms.",
        },
        {
          title: "Hardware Engineer",
          company: "Qualcomm",
          period: "2018 - 2020",
          description:
            "Worked on mobile chipset development and power optimization.",
        },
      ],
    },
    3: {
      id: 3,
      name: "Fatima Khan",
      email: "fatima.khan@example.com",
      batch: "2020",
      department: "Mechanical Engineering",
      profession: "Product Manager",
      company: "Tesla",
      location: "Austin, USA",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      coverImage:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&dpr=1",
      bio: "Leading product development for sustainable transportation solutions. Passionate about clean energy and innovative automotive technologies.",
      phone: "+1 (555) 987-6543",
      linkedin: "https://linkedin.com/in/fatimakhan",
      website: "https://fatimakhan.com",
      skills: [
        "Product Strategy",
        "Automotive",
        "Sustainability",
        "Project Management",
        "Innovation",
      ],
      connections: 234,
      isConnected: false,
      experience: [
        {
          title: "Senior Product Manager",
          company: "Tesla",
          period: "2022 - Present",
          description:
            "Leading product strategy for electric vehicle charging infrastructure.",
        },
        {
          title: "Product Manager",
          company: "Ford",
          period: "2020 - 2022",
          description:
            "Managed product development for hybrid vehicle systems.",
        },
      ],
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userData = dummyUsers[userId];
      setUser(userData);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleConnect = () => {
    console.log("Connecting with user:", userId);
    // Update connection status
    setUser((prev) => ({ ...prev, isConnected: true }));
  };

  const handleMessage = () => {
    navigate(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The user profile you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-emerald-600 relative mb-16">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-8 pb-8 relative">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-6 -mt-16 sm:-mt-16">
            {/* Profile Picture */}
            <div className="relative mb-4 sm:mb-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                    {user.profession}
                  </p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {user.company}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        Batch {user.batch} • {user.department}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0 w-full sm:w-auto">
                  {user.isConnected ? (
                    <button
                      onClick={handleMessage}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleConnect}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {user.bio}
            </p>
          </div>

          {/* Experience Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Experience
            </h2>
            <div className="space-y-6">
              {user.experience.map((exp, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {exp.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {exp.period}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Email
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Phone
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.phone}
                  </p>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-start space-x-3">
                <Linkedin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    LinkedIn
                  </p>
                  <a
                    href={user.linkedin}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all"
                  >
                    View Profile
                  </a>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Website
                  </p>
                  <a
                    href={user.website}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Network
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Connections
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.connections}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Department
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.department}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Batch Year
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.batch}
                </span>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div
            className={`rounded-xl border p-6 ${
              user.isConnected
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            }`}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {user.isConnected ? "Connected" : "Connect"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {user.isConnected
                ? "You are connected with this alumni member"
                : "Send a connection request to start networking"}
            </p>
            {user.isConnected ? (
              <button
                onClick={handleMessage}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Send Request</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
