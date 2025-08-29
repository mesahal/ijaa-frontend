import React from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { featureFlagApi } from '../utils/featureFlagApi';

/**
 * MultiFeatureFlag Component
 * Renders children only when all specified feature flags are enabled (hierarchical validation)
 * 
 * @param {Object} props - Component props
 * @param {Array<string>} props.features - Array of feature flag names to check
 * @param {React.ReactNode} props.children - Content to render when all features are enabled
 * @param {React.ReactNode} props.fallback - Content to render when any feature is disabled (optional)
 * @param {React.ReactNode} props.loading - Content to render while loading (optional)
 * @param {boolean} props.requireAll - Whether all features must be enabled (default: true)
 * @param {boolean} props.showLoading - Whether to show loading state (default: true)
 * @param {boolean} props.showFallback - Whether to show fallback when disabled (default: true)
 * @param {boolean} props.hierarchical - Whether to check parent features (default: true)
 */
const MultiFeatureFlag = ({
  features,
  children,
  fallback = null,
  loading = null,
  requireAll = true,
  showLoading = true,
  showFallback = true,
  hierarchical = true
}) => {
  const [featureStatuses, setFeatureStatuses] = React.useState({});
  const [loadingState, setLoadingState] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const checkFeatures = async () => {
      try {
        setLoadingState(true);
        setError(null);

        if (hierarchical) {
          // Check features with hierarchical validation
          const statuses = {};
          for (const feature of features) {
            try {
              const response = await featureFlagApi.checkFeatureFlagHierarchical(feature);
              statuses[feature] = response.data?.enabled || false;
            } catch (err) {
              console.warn(`Failed to check feature flag ${feature}:`, err);
              statuses[feature] = false;
            }
          }
          setFeatureStatuses(statuses);
        } else {
          // Check features without hierarchical validation
          const statuses = {};
          for (const feature of features) {
            try {
              const response = await featureFlagApi.checkFeatureFlag(feature);
              statuses[feature] = response.data?.enabled || false;
            } catch (err) {
              console.warn(`Failed to check feature flag ${feature}:`, err);
              statuses[feature] = false;
            }
          }
          setFeatureStatuses(statuses);
        }
      } catch (err) {
        console.error('Error checking feature flags:', err);
        setError(err.message);
      } finally {
        setLoadingState(false);
      }
    };

    if (features && features.length > 0) {
      checkFeatures();
    } else {
      setLoadingState(false);
    }
  }, [features, hierarchical]);

  // Show loading state
  if (showLoading && loadingState) {
    return loading || <div className="text-gray-500 text-sm">Loading features...</div>;
  }

  // Show error state (fallback to default behavior)
  if (error) {
    console.warn(`MultiFeatureFlag error:`, error);
    // Continue with default behavior
  }

  // Check if features are enabled based on requireAll setting
  const areFeaturesEnabled = () => {
    if (requireAll) {
      return features.every(feature => featureStatuses[feature] === true);
    } else {
      return features.some(feature => featureStatuses[feature] === true);
    }
  };

  // Show children when features are enabled
  if (areFeaturesEnabled()) {
    return <>{children}</>;
  }

  // Show fallback when features are disabled
  if (showFallback) {
    return <>{fallback}</>;
  }

  // Show nothing when features are disabled and no fallback
  return null;
};

/**
 * Higher-order component for multi-feature flag conditional rendering
 * @param {Array<string>} features - Array of feature flag names
 * @param {React.ReactNode} fallback - Fallback component
 * @param {boolean} requireAll - Whether all features must be enabled
 * @param {boolean} hierarchical - Whether to check parent features
 * @returns {Function} HOC function
 */
export const withMultiFeatureFlag = (features, fallback = null, requireAll = true, hierarchical = true) => {
  return (WrappedComponent) => {
    const WithMultiFeatureFlag = (props) => (
      <MultiFeatureFlag
        features={features}
        fallback={fallback}
        requireAll={requireAll}
        hierarchical={hierarchical}
      >
        <WrappedComponent {...props} />
      </MultiFeatureFlag>
    );

    WithMultiFeatureFlag.displayName = `withMultiFeatureFlag(${WrappedComponent.displayName || WrappedComponent.name})`;
    return WithMultiFeatureFlag;
  };
};

/**
 * Hook-based multi-feature flag conditional rendering hook
 * @param {Array<string>} features - Array of feature flag names
 * @param {boolean} requireAll - Whether all features must be enabled
 * @param {boolean} hierarchical - Whether to check parent features
 * @returns {Object} Object with render method and feature states
 */
export const useMultiFeatureFlag = (features, requireAll = true, hierarchical = true) => {
  const [featureStatuses, setFeatureStatuses] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const checkFeatures = async () => {
      try {
        setLoading(true);
        setError(null);

        if (hierarchical) {
          // Check features with hierarchical validation
          const statuses = {};
          for (const feature of features) {
            try {
              const response = await featureFlagApi.checkFeatureFlagHierarchical(feature);
              statuses[feature] = response.data?.enabled || false;
            } catch (err) {
              console.warn(`Failed to check feature flag ${feature}:`, err);
              statuses[feature] = false;
            }
          }
          setFeatureStatuses(statuses);
        } else {
          // Check features without hierarchical validation
          const statuses = {};
          for (const feature of features) {
            try {
              const response = await featureFlagApi.checkFeatureFlag(feature);
              statuses[feature] = response.data?.enabled || false;
            } catch (err) {
              console.warn(`Failed to check feature flag ${feature}:`, err);
              statuses[feature] = false;
            }
          }
          setFeatureStatuses(statuses);
        }
      } catch (err) {
        console.error('Error checking feature flags:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (features && features.length > 0) {
      checkFeatures();
    } else {
      setLoading(false);
    }
  }, [features, hierarchical]);

  const areFeaturesEnabled = () => {
    if (requireAll) {
      return features.every(feature => featureStatuses[feature] === true);
    } else {
      return features.some(feature => featureStatuses[feature] === true);
    }
  };

  const render = (children, fallback = null) => {
    if (loading) {
      return <div className="text-gray-500 text-sm">Loading features...</div>;
    }

    if (error) {
      console.warn(`MultiFeatureFlag error:`, error);
    }

    return areFeaturesEnabled() ? children : fallback;
  };

  return {
    render,
    featureStatuses,
    areFeaturesEnabled: areFeaturesEnabled(),
    loading,
    error
  };
};

export default MultiFeatureFlag;

