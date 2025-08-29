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
import { useUnifiedAuth } from "../context/UnifiedAuthContext";
import apiClient from "../utils/apiClient";
import { Button, Input, Card, Avatar, Badge } from "../components/ui";
import UserCard from "../components/UserCard";
import FeatureFlagWrapper from "../components/FeatureFlagWrapper";

const Search = () => {
  // const { user } = useUnifiedAuth(); // Unused variable
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

    const startPage = Math.max(0, pagination.page - 2);
    const endPage = Math.min(pagination.totalPages - 1, pagination.page + 2);

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.first}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {startPage > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              className="px-3"
            >
              1
            </Button>
            {startPage > 1 && (
              <span className="text-gray-500 dark:text-gray-400">...</span>
            )}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
          (pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === pagination.page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="px-3"
            >
              {pageNum + 1}
            </Button>
          )
        )}

        {endPage < pagination.totalPages - 1 && (
          <>
            {endPage < pagination.totalPages - 2 && (
              <span className="text-gray-500 dark:text-gray-400">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages - 1)}
              className="px-3"
            >
              {pagination.totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.last}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  // Feature disabled fallback component
  const FeatureDisabledFallback = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <SearchIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Alumni Search Unavailable
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The alumni search feature is currently disabled. Please check back later or contact support for assistance.
          </p>
          <Button onClick={() => navigate("/dashboard")} variant="default">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <FeatureFlagWrapper 
      featureName="alumni.search"
      fallback={<FeatureDisabledFallback />}
      defaultValue={false}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Search Alumni
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and connect with fellow alumni from IIT JU
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-6">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search by name, profession, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                    icon={<SearchIcon className="h-4 w-4" />}
                  />
                </div>

                {/* Search Button */}
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="lg:w-auto"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <SearchIcon className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>

                {/* Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:w-auto"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Batch Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Batch Year
                      </label>
                      <select
                        value={filters.batch}
                        onChange={(e) => handleFilterChange("batch", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">All Batches</option>
                        {batchYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Profession Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Profession
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Software Engineer"
                        value={filters.profession}
                        onChange={(e) => handleFilterChange("profession", e.target.value)}
                        icon={<Briefcase className="h-4 w-4" />}
                      />
                    </div>

                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Dhaka, Bangladesh"
                        value={filters.location}
                        onChange={(e) => handleFilterChange("location", e.target.value)}
                        icon={<MapPin className="h-4 w-4" />}
                      />
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="name">Name</option>
                        <option value="batch">Batch</option>
                        <option value="connections">Connections</option>
                      </select>
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
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
              <UserCard
                key={person.userId}
                user={person}
                onConnect={handleConnect}
                onMessage={handleMessage}
                onViewProfile={handleViewProfile}
                loading={loading}
              />
            ))}
          </div>

          {/* Loading State */}
          {loading && alumni.length === 0 && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Searching for alumni...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && alumni.length === 0 && pagination.totalElements === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No alumni found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          <Pagination />
        </div>
      </div>
    </FeatureFlagWrapper>
  );
};

export default Search;
