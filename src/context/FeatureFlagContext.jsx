import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { featureFlagApi, FEATURE_FLAGS } from '../services/featureFlags/featureFlagApi';

// Create the feature flag context
const FeatureFlagContext = createContext();

// Custom hook to use the feature flag context
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagProvider');
  }
  return context;
};

// Feature flag provider component
export const FeatureFlagProvider = ({ children }) => {
  const [featureFlags, setFeatureFlags] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load all predefined feature flags
  const loadAllFeatureFlags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allFeatureNames = Object.values(FEATURE_FLAGS);
      const status = await featureFlagApi.checkMultipleFeatureFlags(allFeatureNames);
      
      const flagsMap = new Map();
      allFeatureNames.forEach(featureName => {
        flagsMap.set(featureName, status[featureName] || false);
      });
      
      setFeatureFlags(flagsMap);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      
      // Set default values if loading fails
      const flagsMap = new Map();
      Object.values(FEATURE_FLAGS).forEach(featureName => {
        flagsMap.set(featureName, false);
      });
      setFeatureFlags(flagsMap);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if a specific feature is enabled
  const isFeatureEnabled = useCallback((featureName) => {
    return featureFlags.get(featureName) || false;
  }, [featureFlags]);

  // Check multiple features at once
  const areFeaturesEnabled = useCallback((featureNames) => {
    const result = {};
    featureNames.forEach(featureName => {
      result[featureName] = featureFlags.get(featureName) || false;
    });
    return result;
  }, [featureFlags]);

  // Refresh feature flags
  const refreshFeatureFlags = useCallback(async () => {
    await loadAllFeatureFlags();
  }, [loadAllFeatureFlags]);

  // Check a single feature flag (with caching)
  const checkFeatureFlag = useCallback(async (featureName) => {
    try {
      const response = await featureFlagApi.checkFeatureFlagCached(featureName);
      const isEnabled = response.data?.enabled || false;
      
      // Update the local state
      setFeatureFlags(prev => new Map(prev).set(featureName, isEnabled));
      
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  // Check multiple feature flags (with caching)
  const checkMultipleFeatureFlags = useCallback(async (featureNames) => {
    try {
      const status = await featureFlagApi.checkMultipleFeatureFlags(featureNames);
      
      // Update the local state
      setFeatureFlags(prev => {
        const newMap = new Map(prev);
        featureNames.forEach(featureName => {
          newMap.set(featureName, status[featureName] || false);
        });
        return newMap;
      });
      
      return status;
    } catch (error) {
      throw error;
    }
  }, []);

  // Clear feature flag cache
  const clearCache = useCallback(() => {
    featureFlagApi.clearFeatureFlagCache();
    setLastUpdated(null);
  }, []);

  // Load feature flags on mount
  useEffect(() => {
    loadAllFeatureFlags();
  }, [loadAllFeatureFlags]);

  // Auto-refresh feature flags every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        loadAllFeatureFlags();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading, loadAllFeatureFlags]);

  const value = {
    // State
    featureFlags,
    loading,
    error,
    lastUpdated,
    
    // Methods
    isFeatureEnabled,
    areFeaturesEnabled,
    checkFeatureFlag,
    checkMultipleFeatureFlags,
    refreshFeatureFlags,
    clearCache,
    
    // Constants
    FEATURE_FLAGS
  };

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export default FeatureFlagContext;
