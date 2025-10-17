import React, { useState } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import EventCard from './EventCard';
import { EVENT_CATEGORIES  } from '../../../services/api/eventApi';

/**
 * Advanced Search Component
 * Provides comprehensive search functionality for events
 * Part of Phase 2: Event Discovery & Search
 */
const AdvancedSearch = ({
  searchResults,
  loading,
  error,
  pagination,
  onSearch,
  onClear,
  onLoadMore,
  onLoadPrevious,
  getEventTypeLabel,
  formatDate,
  formatTime,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  // Phase 3: Event Participation props
  onRsvp,
  onUpdateRsvp,
  rsvpLoading = false,
  getParticipationStatus
}) => {
  const [searchParams, setSearchParams] = useState({
    title: '',
    category: '',
    location: '',
    startDate: '',
    endDate: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleClear = () => {
    setSearchParams({
      title: '',
      category: '',
      location: '',
      startDate: '',
      endDate: ''
    });
    onClear();
  };

  const handleInputChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: EVENT_CATEGORIES.SOCIAL, label: 'Social' },
    { value: EVENT_CATEGORIES.EDUCATIONAL, label: 'Educational' },
    { value: EVENT_CATEGORIES.NETWORKING, label: 'Networking' },
    { value: EVENT_CATEGORIES.PROFESSIONAL, label: 'Professional' }
  ];

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Basic Search */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchParams.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="h-4 w-4" />}
            >
              Filters
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={searchParams.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <Input
                  type="text"
                  placeholder="Enter location..."
                  value={searchParams.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={searchParams.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={searchParams.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Clear Button */}
          {(searchParams.title || searchParams.category || searchParams.location || searchParams.startDate || searchParams.endDate) && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                icon={<X className="h-4 w-4" />}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </form>
      </Card>

      {/* Search Results */}
      {loading && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Searching events...</span>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 border-error-200 dark:border-error-700">
          <div className="text-center">
            <p className="text-error-700 dark:text-error-300">{error}</p>
          </div>
        </Card>
      )}

      {!loading && !error && searchResults && (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h2>
              {pagination && pagination.totalElements > 0 && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Found {pagination.totalElements} event{pagination.totalElements !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {/* Pagination Info */}
            {pagination && pagination.totalElements > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {pagination.page * pagination.size + 1} - {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} events
              </div>
            )}
          </div>

          {/* Results Grid */}
          {searchResults.length > 0 ? (
            <>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {searchResults.map((event) => {
                   const currentParticipationStatus = getParticipationStatus ? getParticipationStatus(event.id) : null;
                   return (
                     <EventCard
                       key={event.id}
                       event={event}
                       isMyEvent={false}
                       onView={onViewEvent}
                       onEdit={onEditEvent}
                       onDelete={onDeleteEvent}
                       getEventTypeLabel={getEventTypeLabel}
                       formatDate={formatDate}
                       formatTime={formatTime}
                       // Phase 3: Event Participation props
                       onRsvp={onRsvp}
                       onUpdateRsvp={onUpdateRsvp}
                       rsvpLoading={rsvpLoading}
                       currentParticipationStatus={currentParticipationStatus}
                       showRsvpButtons={true}
                     />
                   );
                 })}
               </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={onLoadPrevious}
                    disabled={pagination.first}
                    variant="outline"
                    size="sm"
                    icon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  
                  <Button
                    onClick={onLoadMore}
                    disabled={pagination.last}
                    variant="outline"
                    size="sm"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or browse all events.
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
