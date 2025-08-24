import { useState, useEffect } from 'react';
import { featureFlagApi } from '../utils/featureFlagApi';

/**
 * Hook for checking if a single feature flag is enabled
 * @param {string} featureName - The name of the feature flag to check
 * @param {boolean} defaultValue - Default value if the feature flag check fails
 * @returns {Object} Object containing isEnabled, loading, and error states
 */
export const useFeatureFlag = (featureName, defaultValue = false) => {
  const [isEnabled, setIsEnabled] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFeature = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await featureFlagApi.checkFeatureFlag(featureName);
        setIsEnabled(response.data?.enabled || false);
      } catch (err) {
        console.error(`Error checking feature flag ${featureName}:`, err);
        setError(err.message);
        setIsEnabled(defaultValue);
      } finally {
        setLoading(false);
      }
    };

    if (featureName) {
      checkFeature();
    } else {
      setLoading(false);
      setIsEnabled(defaultValue);
    }
  }, [featureName, defaultValue]);

  return { isEnabled, loading, error };
};

/**
 * Hook for checking multiple feature flags at once
 * @param {Array<string>} featureNames - Array of feature flag names to check
 * @returns {Object} Object containing flagsStatus, loading, and error states
 */
export const useFeatureFlags = (featureNames) => {
  const [flagsStatus, setFlagsStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkFeatures = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = await featureFlagApi.checkMultipleFeatureFlags(featureNames);
        setFlagsStatus(status);
      } catch (err) {
        console.error('Error checking feature flags:', err);
        setError(err.message);
        setFlagsStatus({});
      } finally {
        setLoading(false);
      }
    };

    if (featureNames && featureNames.length > 0) {
      checkFeatures();
    } else {
      setLoading(false);
      setFlagsStatus({});
    }
  }, [featureNames]);

  return { flagsStatus, loading, error };
};

/**
 * Hook for getting all user-specific feature flags
 * @returns {Object} Object containing userFlags, loading, and error states
 */
export const useUserFeatureFlags = () => {
  const [userFlags, setUserFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserFlags = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await featureFlagApi.getUserFeatureFlags();
        setUserFlags(response.data || []);
      } catch (err) {
        console.error('Error loading user feature flags:', err);
        setError(err.message);
        setUserFlags([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserFlags();
  }, []);

  return { userFlags, loading, error };
};

/**
 * Hook for checking if a feature is enabled with a simple boolean return
 * @param {string} featureName - The name of the feature flag to check
 * @param {boolean} defaultValue - Default value if the feature flag check fails
 * @returns {boolean} Whether the feature is enabled
 */
export const useFeatureEnabled = (featureName, defaultValue = false) => {
  const { isEnabled } = useFeatureFlag(featureName, defaultValue);
  return isEnabled;
};

export default useFeatureFlag;
