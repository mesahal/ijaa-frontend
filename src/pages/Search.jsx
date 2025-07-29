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
  Tag,
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

  // Batch years from 1 to 16
  const batchYears = Array.from({ length: 16 }, (_, i) => i + 1);

  // Search alumni function
  const searchAlumni = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        searchQuery: searchQuery?.trim() || null,
        batch: filters.batch || null,
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
      const response = await axios.post(
        `${API_BASE}/connections/request`,
        { recipientUsername: alumniId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.data.code === "200" || response.data.code === 200) {
        console.log("Connection request sent successfully");
        setAlumni((prev) =>
          prev.map((person) =>
            person.userId === alumniId
              ? { ...person, isConnected: true }
              : person
          )
        );
      }
    } catch (err) {
      console.error("Error connecting with alumni:", err);
      alert("Failed to send connection request. Please try again.");
    }
  };

  const handleMessage = (userId) => {
    console.log("Messaging alumni:", userId);
    navigate(`/chat/${userId}`);
  };

  const handleViewProfile = (userId) => {
    console.log("Viewing profile of alumni:", userId);
    navigate(`/profile/${userId}`);
  };

  const clearFilters = () => {
    setFilters({
      batch: "",
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
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
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
                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.last || loading}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
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
                placeholder="Search by name, profession, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Batch
                </label>
                <select
                  value={filters.batch}
                  onChange={(e) => handleFilterChange("batch", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={loading}
                >
                  <option value="">All Batches</option>
                  {batchYears.map((batch) => (
                    <option key={batch} value={batch}>
                      Batch {batch}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={loading}
                >
                  <option value="relevance">Relevance</option>
                  <option value="name">Name</option>
                  <option value="batch">Batch</option>
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
            key={person.userId}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
            onClick={() => handleViewProfile(person.userId)}
          >
            {/* Header Section - Fixed Height */}
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={
                  person.avatar ||
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                }
                alt={person.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                onError={(e) => {
                  e.target.src =
                    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1";
                }}
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {person.name || "Unknown"}
                </h3>
                <p className="text-blue-600 font-medium truncate">
                  {person.profession || "Not specified"}
                </p>
              </div>

              {person.isConnected && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                  Connected
                </span>
              )}
            </div>

            {/* Info Section - Fixed Height */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {person.batch
                    ? `Batch ${person.batch}`
                    : "Batch not specified"}
                </span>
              </div>
              {person.location && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{person.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>{person.connections || 0} connections</span>
              </div>
            </div>

            {/* Bio Section - Flexible but constrained height */}
            <div className="flex-1 mb-4">
              {person.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
                  {person.bio}
                </p>
              )}
            </div>

            {/* Interests Section - Fixed Height */}
            <div className="mb-6 h-8 flex items-start">
              {person.interests && person.interests.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {person.interests.slice(0, 2).map((interest, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs flex items-center space-x-1 max-w-20 truncate"
                    >
                      <Tag className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{interest}</span>
                    </span>
                  ))}
                  {person.interests.length > 2 && (
                    <span className="text-gray-500 dark:text-gray-400 text-xs px-2 py-1 flex items-center">
                      +{person.interests.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex space-x-3 mt-auto">
              {person.isConnected ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessage(person.userId);
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
                    handleConnect(person.userId);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  disabled={loading}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Connect</span>
                </button>
              )}
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
