import React from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

/**
 * EventFilters Component
 * Handles search and filtering functionality for events with modern design
 * 
 * @param {string} searchQuery - Current search query
 * @param {Function} onSearchChange - Callback for search query changes
 * @param {string} filterType - Current filter type
 * @param {Function} onFilterChange - Callback for filter changes
 * @param {Function} onAdvancedSearch - Callback for advanced search
 * @param {Array} eventTypeOptions - Available event type options
 */
const EventFilters = ({ 
  searchQuery, 
  onSearchChange, 
  filterType, 
  onFilterChange, 
  onAdvancedSearch,
  eventTypeOptions = []
}) => {
  const hasActiveFilters = searchQuery || (filterType && filterType !== 'all');

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500"
              aria-label="Search events"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="lg:w-48">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => onFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm appearance-none bg-white dark:bg-gray-700 transition-colors hover:border-gray-400 dark:hover:border-gray-500"
              aria-label="Filter events by type"
            >
              <option value="all">All Categories</option>
              {eventTypeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Advanced Search Button */}
        <button
          onClick={onAdvancedSearch}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 font-medium"
          aria-label="Open advanced search"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Advanced</span>
        </button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => onSearchChange('')}
                    className="ml-1 p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filterType && filterType !== 'all' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                  Category: {eventTypeOptions.find(t => t.value === filterType)?.label || filterType}
                  <button
                    onClick={() => onFilterChange('all')}
                    className="ml-1 p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventFilters;
