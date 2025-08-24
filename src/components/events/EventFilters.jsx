import React from 'react';
import { Search, Filter } from 'lucide-react';

/**
 * EventFilters Component
 * Handles search and filtering functionality for events
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
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Search events"
            />
          </div>
        </div>

        {/* Filter */}
        <div className="sm:w-48">
          <select
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            aria-label="Filter events by type"
          >
            <option value="all">All Types</option>
            {eventTypeOptions.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Advanced Search Button */}
        <button
          onClick={onAdvancedSearch}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          aria-label="Open advanced search"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>Advanced Search</span>
        </button>
      </div>
    </div>
  );
};

export default EventFilters;
