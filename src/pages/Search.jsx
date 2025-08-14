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
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../utils/apiClient";
import { Button, Input, Card, Avatar, Badge } from "../components/ui";

const Search = () => {
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

      const response = await apiClient.post(`/alumni/search`, requestBody);

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
      const response = await apiClient.post(`/connections/request`, {
        recipientUsername: alumniId,
      });

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
    // Chat functionality removed
    alert("Chat feature has been removed from this application.");
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.first || loading}
          icon={<ChevronLeft className="h-4 w-4" />}
        >
          Previous
        </Button>

        {pages.map((page) => (
          <Button
            key={page}
            variant={page === pagination.page ? "primary" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            disabled={loading}
          >
            {page + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.last || loading}
          icon={<ChevronRight className="h-4 w-4" />}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, profession, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                leftIcon={<SearchIcon className="h-5 w-5" />}
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                variant="primary"
                size="lg"
                icon={<SearchIcon className="h-5 w-5" />}
                disabled={loading}
              >
                Search
              </Button>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                size="lg"
                icon={<Filter className="h-5 w-5" />}
                disabled={loading}
              >
                Filters
              </Button>
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  <Input
                    label="Profession"
                    placeholder="e.g., Software Engineer"
                    value={filters.profession}
                    onChange={(e) => handleFilterChange("profession", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Input
                    label="Location"
                    placeholder="e.g., Dhaka"
                    value={filters.location}
                    onChange={(e) => handleFilterChange("location", e.target.value)}
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
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={loading}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="name">Name</option>
                    <option value="batch">Batch</option>
                    <option value="connections">Connections</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={clearFilters}
                    variant="ghost"
                    size="sm"
                    icon={<X className="h-4 w-4" />}
                    disabled={loading}
                  >
                    Clear Filters
                  </Button>
                  <Button
                    onClick={handleSearch}
                    variant="primary"
                    size="sm"
                    disabled={loading}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-error-200 dark:border-error-700">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <Loader2 className="h-5 w-5 text-error-500 flex-shrink-0" />
                <p className="text-error-700 dark:text-error-300">{error}</p>
              </div>
            </div>
          </Card>
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
            <Card
              key={person.userId}
              className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
              onClick={() => handleViewProfile(person.userId)}
            >
              <div className="p-6">
                {/* Header Section - Fixed Height */}
                <div className="flex items-start space-x-4 mb-4">
                  <Avatar
                    size="lg"
                    src={person.avatar || "/dp.png"}
                    alt={person.name}
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {person.name || "Unknown"}
                    </h3>
                    <p className="text-primary-600 font-medium truncate">
                      {person.profession || "Not specified"}
                    </p>
                  </div>

                  {person.isConnected && (
                    <Badge variant="success" size="sm">
                      Connected
                    </Badge>
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
                        <Badge
                          key={index}
                          variant="secondary"
                          size="sm"
                          className="max-w-20 truncate"
                        >
                          <Tag className="h-3 w-3 flex-shrink-0 mr-1" />
                          {interest}
                        </Badge>
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
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessage(person.userId);
                      }}
                      icon={<MessageCircle className="h-4 w-4" />}
                      disabled={loading}
                    >
                      Message
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(person.userId);
                      }}
                      icon={<UserPlus className="h-4 w-4" />}
                      disabled={loading}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {loading && alumni.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Loader2 className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Searching Alumni...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we find alumni matching your criteria.
              </p>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {!loading && alumni.length === 0 && !error && (
          <Card className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No alumni found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Try adjusting your search terms or filters to find more alumni.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                icon={<X className="h-4 w-4" />}
              >
                Clear All Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default Search;
