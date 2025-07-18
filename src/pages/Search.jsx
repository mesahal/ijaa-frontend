import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  UserPlus,
  Users,
  Calendar,
  Star,
} from "lucide-react";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    batch: "",
    department: "",
    profession: "",
    location: "",
    sortBy: "relevance",
  });
  const [showFilters, setShowFilters] = useState(false);

  const alumni = [
    {
      id: 1,
      name: "Sarah Ahmed",
      batch: "2019",
      department: "Computer Science & Engineering",
      profession: "Data Scientist",
      company: "Google",
      location: "San Francisco, USA",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      bio: "Passionate about machine learning and AI. Love connecting with fellow alumni.",
      connections: 156,
      isConnected: false,
      skills: ["Python", "Machine Learning", "Data Analysis"],
    },
    {
      id: 2,
      name: "Rakib Hassan",
      batch: "2018",
      department: "Electrical & Electronic Engineering",
      profession: "Hardware Engineer",
      company: "Intel",
      location: "Dhaka, Bangladesh",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      bio: "Working on next-generation processors. Always excited to help fellow engineers.",
      connections: 89,
      isConnected: true,
      skills: ["VLSI Design", "Digital Circuits", "Embedded Systems"],
    },
    {
      id: 3,
      name: "Fatima Khan",
      batch: "2020",
      department: "Mechanical Engineering",
      profession: "Product Manager",
      company: "Tesla",
      location: "Austin, USA",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      bio: "Leading product development for sustainable transportation solutions.",
      connections: 234,
      isConnected: false,
      skills: ["Product Strategy", "Automotive", "Sustainability"],
    },
    {
      id: 4,
      name: "Ahmed Rahman",
      batch: "2017",
      department: "Civil Engineering",
      profession: "Structural Engineer",
      company: "AECOM",
      location: "Dubai, UAE",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      bio: "Designing sustainable infrastructure for smart cities.",
      connections: 112,
      isConnected: false,
      skills: ["Structural Design", "AutoCAD", "Project Management"],
    },
    {
      id: 5,
      name: "Nadia Islam",
      batch: "2019",
      department: "Chemical Engineering",
      profession: "Research Scientist",
      company: "Pfizer",
      location: "New York, USA",
      avatar:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      bio: "Developing innovative pharmaceutical solutions for global health challenges.",
      connections: 178,
      isConnected: false,
      skills: ["Drug Development", "Research", "Biochemistry"],
    },
    {
      id: 6,
      name: "Karim Uddin",
      batch: "2021",
      department: "Computer Science & Engineering",
      profession: "Software Engineer",
      company: "Microsoft",
      location: "Seattle, USA",
      avatar:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      bio: "Building cloud solutions and passionate about open source development.",
      connections: 67,
      isConnected: false,
      skills: ["Cloud Computing", "JavaScript", "Azure"],
    },
  ];

  const departments = [
    "Computer Science & Engineering",
    "Electrical & Electronic Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Industrial & Production Engineering",
    "Materials & Metallurgical Engineering",
    "Biomedical Engineering",
  ];

  const filteredAlumni = alumni.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBatch = !filters.batch || person.batch === filters.batch;
    const matchesDepartment =
      !filters.department || person.department === filters.department;
    const matchesProfession =
      !filters.profession ||
      person.profession
        .toLowerCase()
        .includes(filters.profession.toLowerCase());
    const matchesLocation =
      !filters.location ||
      person.location.toLowerCase().includes(filters.location.toLowerCase());

    return (
      matchesSearch &&
      matchesBatch &&
      matchesDepartment &&
      matchesProfession &&
      matchesLocation
    );
  });

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleConnect = (alumniId) => {
    console.log("Connecting with alumni:", alumniId);
  };

  const handleMessage = (alumniId) => {
    console.log("Messaging alumni:", alumniId);
    navigate(`/chat/${alumniId}`);
  };

  const handleViewProfile = (alumniId) => {
    navigate(`/profile/${alumniId}`);
  };

  const clearFilters = () => {
    setFilters({
      batch: "",
      department: "",
      profession: "",
      location: "",
      sortBy: "relevance",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Alumni</h1>
        <p className="text-gray-600 mt-2">
          Connect with fellow graduates from IIT Jahangirnagar University
        </p>
      </div>
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, profession, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2020"
                  value={filters.batch}
                  onChange={(e) => handleFilterChange("batch", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer"
                  value={filters.profession}
                  onChange={(e) =>
                    handleFilterChange("profession", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dhaka"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="batch">Batch Year</option>
                  <option value="connections">Connections</option>
                </select>
              </div>

              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          Found {filteredAlumni.length} alumni
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>
      {/* Alumni Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewProfile(person.id)}
          >
            <div className="flex items-start space-x-4">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {person.name}
                </h3>
                <p className="text-blue-600 font-medium">{person.profession}</p>
                <p className="text-gray-600 text-sm">{person.company}</p>
              </div>

              {person.isConnected && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Connected
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <GraduationCap className="h-4 w-4" />
                <span>
                  Batch {person.batch} • {person.department}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{person.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{person.connections} connections</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm mt-3 line-clamp-2">
              {person.bio}
            </p>

            {/* Skills */}
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {person.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {person.skills.length > 3 && (
                  <span className="text-gray-500 text-xs px-2 py-1">
                    +{person.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              {person.isConnected ? (
                <button
                  onClick={() => handleMessage(person.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(person.id)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Connect</span>
                </button>
              )}

              <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredAlumni.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No alumni found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find more alumni.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
