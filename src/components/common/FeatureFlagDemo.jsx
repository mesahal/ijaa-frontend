import React from 'react';
import { useFeatureFlag, useFeatureFlags, useUserFeatureFlags, useFeatureEnabled } from '../hooks/useFeatureFlag';
import { FEATURE_FLAGS  } from '../../services/featureFlags/featureFlagApi';

/**
 * Demo component showcasing Group 3 Feature Flag functionality
 * This component demonstrates how to use the various hooks for checking feature flags
 */
const FeatureFlagDemo = () => {
  // Example 1: Single feature flag check
  const { isEnabled: isNewUIEnabled, loading: newUILoading, error: newUIError } = useFeatureFlag(FEATURE_FLAGS.NEW_UI);
  
  // Example 2: Multiple feature flags check
  const { flagsStatus, loading: multipleLoading, error: multipleError } = useFeatureFlags([
    FEATURE_FLAGS.CHAT_FEATURE,
    FEATURE_FLAGS.DARK_MODE,
    FEATURE_FLAGS.NOTIFICATIONS
  ]);
  
  // Example 3: User-specific feature flags
  const { userFlags, loading: userFlagsLoading, error: userFlagsError } = useUserFeatureFlags();
  
  // Example 4: Simple boolean check
  const isPaymentEnabled = useFeatureEnabled(FEATURE_FLAGS.PAYMENT_INTEGRATION, false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Feature Flag Demo - Group 3 Implementation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Feature Flag Check */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Single Feature Flag Check
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">NEW_UI Feature:</span>
              {newUILoading ? (
                <span className="text-blue-500">Loading...</span>
              ) : newUIError ? (
                <span className="text-red-500">Error: {newUIError}</span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isNewUIEnabled 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {isNewUIEnabled ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Multiple Feature Flags Check */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Multiple Feature Flags Check
          </h2>
          <div className="space-y-3">
            {multipleLoading ? (
              <span className="text-blue-500">Loading...</span>
            ) : multipleError ? (
              <span className="text-red-500">Error: {multipleError}</span>
            ) : (
              Object.entries(flagsStatus).map(([featureName, isEnabled]) => (
                <div key={featureName} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{featureName}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isEnabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Feature Flags */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            User Feature Flags
          </h2>
          <div className="space-y-3">
            {userFlagsLoading ? (
              <span className="text-blue-500">Loading...</span>
            ) : userFlagsError ? (
              <span className="text-red-500">Error: {userFlagsError}</span>
            ) : userFlags.length === 0 ? (
              <span className="text-gray-500">No user feature flags found</span>
            ) : (
              userFlags.map((flag) => (
                <div key={flag.featureName} className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300">{flag.featureName}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    flag.enabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Simple Boolean Check */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
            Simple Boolean Check
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Payment Integration:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isPaymentEnabled 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {isPaymentEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Usage Examples
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-2">Single Feature Flag:</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`const { isEnabled, loading, error } = useFeatureFlag('NEW_UI');
if (isEnabled) {
  return <NewUIComponent />;
} else {
  return <LegacyUIComponent />;
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-2">Multiple Feature Flags:</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`const { flagsStatus, loading, error } = useFeatureFlags(['CHAT_FEATURE', 'DARK_MODE']);
if (flagsStatus.CHAT_FEATURE) {
  return <ChatComponent />;
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-600 dark:text-gray-300 mb-2">Simple Boolean Check:</h3>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
{`const isEnabled = useFeatureEnabled('PAYMENT_INTEGRATION', false);
return isEnabled ? <PaymentForm /> : <ComingSoon />;`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureFlagDemo;
