import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Search = () => {
  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const { user } = useAuth();
  const navigate = useNavigate();

  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    batch: "",
    department: "",
    profession: "",
    location: "",
    sortBy: "relevance",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [alumni, setAlumni] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
  });

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

  // Search alumni function
  const searchAlumni = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        searchQuery: searchQuery?.trim() || null,
        batch: filters.batch || null,
        department: filters.department || null,
        profession: filters.profession?.trim() || null,
        location: filters.location?.trim() || null,
        sortBy: filters.sortBy || "relevance",
        page: page,
        size: pagination.size,
      };

      const response = await axios.post(
        `${API_BASE}/alumni/search`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      const result = response.data;
      console.log("Search result:", result);

      if ((result.code === "200" || result.code === 200) && result.data) {
        setAlumni(result.data.content || []);
        setPagination({
          page: result.data.page,
          size: result.data.size,
          totalElements: result.data.totalElements,
          totalPages: result.data.totalPages,
          first: result.data.first,
          last: result.data.last,
        });
      } else {
        throw new Error(result.message || "Failed to fetch alumni data");
      }
    } catch (err) {
      console.error("Error searching alumni:", err);

      if (err.response) {
        setError(
          `Server error: ${err.response.status} - ${
            err.response.data?.message || "Unknown error"
          }`
        );
      } else if (err.request) {
        setError("Network error: Unable to reach the server");
      } else {
        setError(err.message || "Failed to search alumni. Please try again.");
      }

      setAlumni([]);
      setPagination({
        page: 0,
        size: 12,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load - load all alumni on component mount
  useEffect(() => {
    searchAlumni(0);
  }, []); // Only run on mount

  // Handle search button click
  const handleSearch = () => {
    searchAlumni(0); // Reset to first page when searching
  };

  // Handle filter changes (just update state, don't search automatically)
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      searchAlumni(newPage);
    }
  };

  const handleConnect = async (alumniId) => {
    try {
      console.log("Connecting with alumni:", alumniId);
      setAlumni((prev) =>
        prev.map((person) =>
          person.id === alumniId ? { ...person, isConnected: true } : person
        )
      );
    } catch (err) {
      console.error("Error connecting with alumni:", err);
    }
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
    setSearchQuery("");
    // Don't search automatically, user needs to click search button
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Pagination component
  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      0,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages - 1,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.first || loading}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={loading}
            className={`px-3 py-2 rounded-lg border ${
              page === pagination.page
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.last || loading}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Find Alumni
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Connect with fellow graduates from IIT Jahangirnagar University
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, profession, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <SearchIcon className="h-5 w-5" />
              <span>Search</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batch Year
                </label>
                <input
                  type="number"
                  placeholder="e.g., 2020"
                  value={filters.batch}
                  onChange={(e) => handleFilterChange("batch", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="batch">Batch Year</option>
                  <option value="connections">Connections</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                  disabled={loading}
                >
                  Clear Filters
                </button>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-300">
          {loading ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching...</span>
            </span>
          ) : (
            <>
              Found {pagination.totalElements} alumni
              {searchQuery && ` for "${searchQuery}"`}
            </>
          )}
        </p>

        {pagination.totalElements > 0 && (
          <p className="text-gray-500 text-sm">
            Page {pagination.page + 1} of {pagination.totalPages}
          </p>
        )}
      </div>

      {/* Alumni Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.map((person) => (
          <div
            key={person.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewProfile(person.id)}
          >
            <div className="flex items-start space-x-4">
              <img
                src={
                  person.avatar ||
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                }
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1";
                }}
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {person.name || "Unknown"}
                </h3>
                <p className="text-blue-600 font-medium">
                  {person.profession || "Not specified"}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {person.company || "No company specified"}
                </p>
              </div>

              {person.isConnected && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Connected
                </span>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <GraduationCap className="h-4 w-4" />
                <span>
                  {person.batch
                    ? `Batch ${person.batch}`
                    : "Batch not specified"}
                  {person.department && ` • ${person.department}`}
                </span>
              </div>
              {person.location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4" />
                  <span>{person.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4" />
                <span>{person.connections || 0} connections</span>
              </div>
            </div>

            {person.bio && (
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 line-clamp-2">
                {person.bio}
              </p>
            )}

            {/* Skills */}
            {person.skills && person.skills.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {person.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {person.skills.length > 3 && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs px-2 py-1">
                      +{person.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              {person.isConnected ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(person.id);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  disabled={loading}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConnect(person.id);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Connect</span>
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewProfile(person.id);
                }}
                className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && alumni.length === 0 && (
        <div className="text-center py-12">
          <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Searching Alumni...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we find alumni matching your criteria.
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && alumni.length === 0 && !error && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No alumni found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your search terms or filters to find more alumni.
          </p>
        </div>
      )}

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default Search;
