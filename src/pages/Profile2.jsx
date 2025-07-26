import React, { useState } from "react";
import {
  Camera,
  Edit3,
  MapPin,
  Briefcase,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  Linkedin,
  Globe,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    profession: user?.profession || "",
    location: user?.location || "",
    bio: "Passionate software engineer with 5+ years of experience in full-stack development. Alumni of IIT Jahangirnagar University, actively contributing to the tech community.",
    phone: "+880 1712-345678",
    linkedin: "https://linkedin.com/in/johndoe",
    website: "https://johndoe.dev",
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Ltd.",
        period: "2022 - Present",
        description:
          "Leading a team of 5 developers in building scalable web applications.",
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        period: "2020 - 2022",
        description:
          "Developed full-stack applications using React and Node.js.",
      },
    ],
  });
  const [visibility, setVisibility] = useState({
    email: true,
    phone: false,
    linkedin: true,
    website: true,
  });

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // Save profile data logic here
    setIsEditing(false);
  };

  const toggleVisibility = (field) => {
    setVisibility({
      ...visibility,
      [field]: !visibility[field],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-emerald-600 relative">
          <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
            <Camera className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-4 sm:px-8 pb-8 relative">
          <div className="flex flex-col items-center sm:flex-row sm:items-end sm:space-x-6 -mt-16 sm:-mt-16">
            {/* Profile Picture */}
            <div className="relative mb-4 sm:mb-0">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {user?.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                    {profileData.profession}
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>
                        Batch {user?.batch} • {user?.department}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
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
            {isEditing ? (
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {profileData.bio}
              </p>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Experience
            </h2>
            <div className="space-y-6">
              {profileData.experience.map((exp, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {exp.title}
                    </h3>
                    <p className="text-blue-600 font-medium">{exp.company}</p>
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
              {profileData.skills.map((skill, index) => (
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
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibility("email")}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-2"
                >
                  {visibility.email ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Phone
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="text-sm text-gray-600 dark:text-gray-300 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {profileData.phone}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibility("phone")}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-2"
                >
                  {visibility.phone ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* LinkedIn */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Linkedin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      LinkedIn
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleInputChange}
                        className="text-sm text-gray-600 dark:text-gray-300 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full"
                      />
                    ) : (
                      <a
                        href={profileData.linkedin}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all"
                      >
                        View Profile
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibility("linkedin")}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-2"
                >
                  {visibility.linkedin ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Website */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Website
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="website"
                        value={profileData.website}
                        onChange={handleInputChange}
                        className="text-sm text-gray-600 dark:text-gray-300 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 outline-none w-full"
                      />
                    ) : (
                      <a
                        href={profileData.website}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 break-all"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibility("website")}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 ml-2"
                >
                  {visibility.website ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            )}
          </div>

          {/* Profile Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Profile Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Profile Views
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  156
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Connections
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  124
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Groups Joined
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  8
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Events Attended
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  12
                </span>
              </div>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Profile Completion
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              85% complete
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "85%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add more details to improve your profile visibility
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
