import React, { useState, useEffect } from 'react';
import { featureFlagApi } from '../utils/featureFlagApi';

/**
 * Feature Flag Debug Panel Component
 * Provides debugging tools and real-time monitoring for feature flags
 * This is part of Group 3 implementation for feature flag debugging
 */
const FeatureFlagDebugPanel = ({ 
  isVisible = false, 
  onToggle = null,
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(isVisible);
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('all'); // 'all', 'enabled', 'disabled'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'status', 'updated'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds

  // Fetch feature flags
  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      const flags = await featureFlagApi.getAllFeatureFlags();
      setFeatureFlags(flags);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching feature flags:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (isOpen) {
      fetchFeatureFlags();
    }
  }, [isOpen]);

  // Auto-refresh
  useEffect(() => {
    if (!isOpen || !autoRefresh || !refreshInterval) return;

    const interval = setInterval(fetchFeatureFlags, refreshInterval);
    return () => clearInterval(interval);
  }, [isOpen, autoRefresh, refreshInterval]);

  // Toggle panel
  const togglePanel = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  // Filter and sort feature flags
  const getFilteredAndSortedFlags = () => {
    let filtered = [...featureFlags];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(flag => 
        flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flag.description && flag.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterEnabled !== 'all') {
      const enabled = filterEnabled === 'enabled';
      filtered = filtered.filter(flag => flag.enabled === enabled);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.enabled ? 1 : 0;
          bValue = b.enabled ? 1 : 0;
          break;
        case 'updated':
          aValue = new Date(a.updated_at || a.created_at || 0);
          bValue = new Date(b.updated_at || b.created_at || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Toggle feature flag
  const toggleFeatureFlag = async (flagId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await featureFlagApi.updateFeatureFlag(flagId, { enabled: newStatus });
      
      // Update local state
      setFeatureFlags(prev => 
        prev.map(flag => 
          flag.id === flagId 
            ? { ...flag, enabled: newStatus, updated_at: new Date().toISOString() }
            : flag
        )
      );
    } catch (err) {
      console.error('Error toggling feature flag:', err);
      setError(err.message);
    }
  };

  // Get status badge
  const getStatusBadge = (enabled) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      enabled 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {enabled ? '✓ Enabled' : '✗ Disabled'}
    </span>
  );

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const filteredFlags = getFilteredAndSortedFlags();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={togglePanel}
        className={`fixed bottom-4 right-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors ${className}`}
        title="Toggle Feature Flag Debug Panel"
      >
        🚩
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Feature Flag Debug Panel</h2>
              <button
                onClick={togglePanel}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Controls */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search flags..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterEnabled}
                    onChange={(e) => setFilterEnabled(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All</option>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                    <option value="updated">Last Updated</option>
                  </select>
                </div>

                {/* Auto-refresh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto-refresh</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">ON</span>
                    <input
                      type="number"
                      value={refreshInterval / 1000}
                      onChange={(e) => setRefreshInterval(e.target.value * 1000)}
                      min="5"
                      max="60"
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-sm text-gray-600">sec</span>
                  </div>
                </div>
              </div>

              {/* Manual Refresh */}
              <div className="mt-3 flex justify-between items-center">
                <button
                  onClick={fetchFeatureFlags}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Refreshing...' : 'Refresh Now'}
                </button>
                <span className="text-sm text-gray-500">
                  {filteredFlags.length} of {featureFlags.length} flags shown
                </span>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <div className="text-red-700 text-sm">Error: {error}</div>
              </div>
            )}

            {/* Content */}
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => setSortBy('name')}>
                      Name {getSortIndicator('name')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => setSortBy('status')}>
                      Status {getSortIndicator('status')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => setSortBy('updated')}>
                      Last Updated {getSortIndicator('updated')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFlags.map((flag) => (
                    <tr key={flag.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{flag.name}</div>
                          {flag.description && (
                            <div className="text-sm text-gray-500">{flag.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(flag.enabled)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {flag.updated_at 
                          ? new Date(flag.updated_at).toLocaleString()
                          : flag.created_at 
                            ? new Date(flag.created_at).toLocaleString()
                            : 'Unknown'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleFeatureFlag(flag.id, flag.enabled)}
                          className={`px-3 py-1 text-xs rounded ${
                            flag.enabled
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {flag.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredFlags.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || filterEnabled !== 'all' 
                    ? 'No flags match your filters' 
                    : 'No feature flags found'
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeatureFlagDebugPanel;
