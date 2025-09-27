import React, { useState, useEffect } from 'react';
import { featureFlagApi  } from '../../services/featureFlags/featureFlagApi';

/**
 * Feature Flag Status Component
 * Displays the current status of all feature flags for debugging and monitoring
 * This is part of Group 3 implementation for feature flag status checking
 */
const FeatureFlagStatus = ({ 
  showDetails = false, 
  refreshInterval = 30000, // 30 seconds
  className = '' 
}) => {
  const [featureFlags, setFeatureFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch feature flags
  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      const flags = await featureFlagApi.getAllFeatureFlags();
      setFeatureFlags(flags);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !refreshInterval) return;

    const interval = setInterval(fetchFeatureFlags, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Manual refresh
  const handleRefresh = () => {
    fetchFeatureFlags();
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Get status color
  const getStatusColor = (enabled) => {
    return enabled ? 'text-green-600' : 'text-red-600';
  };

  // Get status icon
  const getStatusIcon = (enabled) => {
    return enabled ? '✓' : '✗';
  };

  if (loading && featureFlags.length === 0) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Feature Flag Status</h3>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Feature Flag Status</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAutoRefresh}
            className={`px-3 py-1 text-xs rounded ${
              autoRefresh 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          Error: {error}
        </div>
      )}

      {/* Last Updated */}
      {lastUpdated && (
        <div className="mb-4 text-xs text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Feature Flags List */}
      <div className="space-y-2">
        {featureFlags.map((flag) => (
          <div
            key={flag.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded border"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getStatusColor(flag.enabled)}`}>
                  {getStatusIcon(flag.enabled)}
                </span>
                <span className="font-medium text-gray-800">{flag.name}</span>
                {flag.description && (
                  <span className="text-xs text-gray-500">({flag.description})</span>
                )}
              </div>
              
              {showDetails && (
                <div className="mt-1 text-xs text-gray-600">
                  <span>ID: {flag.id}</span>
                  {flag.created_at && (
                    <span className="ml-2">Created: {new Date(flag.created_at).toLocaleDateString()}</span>
                  )}
                  {flag.updated_at && (
                    <span className="ml-2">Updated: {new Date(flag.updated_at).toLocaleDateString()}</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                flag.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {flag.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && featureFlags.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No feature flags found
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Flags: {featureFlags.length}</span>
          <span>
            Enabled: {featureFlags.filter(f => f.enabled).length} | 
            Disabled: {featureFlags.filter(f => !f.enabled).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagStatus;
