import React from 'react';
import { useFeatureFlag } from '../../hooks/useFeatureFlag';

/**
 * Conditional Feature Flag Wrapper Component
 * Renders children only when the specified feature flag is enabled
 * 
 * @param {Object} props - Component props
 * @param {string} props.featureName - Name of the feature flag to check
 * @param {React.ReactNode} props.children - Content to render when feature is enabled
 * @param {React.ReactNode} props.fallback - Content to render when feature is disabled (optional)
 * @param {React.ReactNode} props.loading - Content to render while loading (optional)
 * @param {boolean} props.defaultValue - Default value if API call fails (defaults to false)
 * @param {boolean} props.showLoading - Whether to show loading state (defaults to true)
 * @param {boolean} props.showFallback - Whether to show fallback when disabled (defaults to true)
 */
const FeatureFlagWrapper = ({
  featureName,
  children,
  fallback = null,
  loading = null,
  defaultValue = false,
  showLoading = true,
  showFallback = true
}) => {
  const { isEnabled, loading: isLoading, error } = useFeatureFlag(featureName, defaultValue);

  // Show loading state
  if (showLoading && isLoading) {
    return loading || <div className="text-gray-500 text-sm">Loading feature...</div>;
  }

  // Show error state (fallback to default behavior)
  if (error) {
    // Continue with default behavior
  }

  // Show children when feature is enabled
  if (isEnabled) {
    return <>{children}</>;
  }

  // Show fallback when feature is disabled
  if (showFallback) {
    return <>{fallback}</>;
  }

  // Show nothing when feature is disabled and no fallback
  return null;
};

/**
 * Higher-order component for feature flag conditional rendering
 * @param {string} featureName - Name of the feature flag
 * @param {React.ReactNode} fallback - Fallback component
 * @param {boolean} defaultValue - Default value
 * @returns {Function} HOC function
 */
export const withFeatureFlag = (featureName, fallback = null, defaultValue = false) => {
  return (WrappedComponent) => {
    const WithFeatureFlag = (props) => (
      <FeatureFlagWrapper
        featureName={featureName}
        fallback={fallback}
        defaultValue={defaultValue}
      >
        <WrappedComponent {...props} />
      </FeatureFlagWrapper>
    );

    WithFeatureFlag.displayName = `withFeatureFlag(${WrappedComponent.displayName || WrappedComponent.name})`;
    return WithFeatureFlag;
  };
};

/**
 * Hook-based conditional rendering hook
 * @param {string} featureName - Name of the feature flag
 * @param {boolean} defaultValue - Default value
 * @returns {Object} Object with render method and feature state
 */
export const useFeatureFlagRender = (featureName, defaultValue = false) => {
  const { isEnabled, loading, error } = useFeatureFlag(featureName, defaultValue);

  const render = (children, fallback = null) => {
    if (loading) {
      return <div className="text-gray-500 text-sm">Loading feature...</div>;
    }

    if (error) {
    }

    return isEnabled ? children : fallback;
  };

  return {
    render,
    isEnabled,
    loading,
    error
  };
};

export default FeatureFlagWrapper;
