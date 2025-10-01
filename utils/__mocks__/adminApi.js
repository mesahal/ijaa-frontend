// Jest manual mock for root-level utils/adminApi
export const adminApi = {
  getFeatureFlags: jest.fn(),
  getFeatureFlag: jest.fn(),
  createFeatureFlag: jest.fn(),
  updateFeatureFlag: jest.fn(),
  deleteFeatureFlag: jest.fn(),
  getEnabledFeatureFlags: jest.fn(),
  getDisabledFeatureFlags: jest.fn(),
  refreshFeatureFlagCache: jest.fn(),
};

export default { adminApi };


