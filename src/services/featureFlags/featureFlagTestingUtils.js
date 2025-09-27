// Feature Flag Testing Utilities - Phase 4 Implementation
// Provides mock services, testing utilities, and development tools

import { featureFlagApi, FEATURE_FLAGS } from './featureFlagApi';

// ===== PHASE 4: TESTING AND DEVELOPMENT TOOLS =====

// 4.1 Mock Services for Testing
export class MockFeatureFlagService {
  constructor(mockData = {}) {
    this.mockData = {
      // Default mock data
      featureFlags: [
        {
          id: 1,
          featureName: "NEW_UI",
          enabled: true,
          description: "Enable new user interface with modern design",
          createdAt: "2024-12-01T10:00:00",
          updatedAt: "2024-12-01T10:00:00"
        },
        {
          id: 2,
          featureName: "CHAT_FEATURE",
          enabled: false,
          description: "Enable real-time chat functionality between alumni",
          createdAt: "2024-12-01T10:00:00",
          updatedAt: "2024-12-01T10:00:00"
        },
        {
          id: 3,
          featureName: "DARK_MODE",
          enabled: true,
          description: "Enable dark mode theme",
          createdAt: "2024-12-01T10:00:00",
          updatedAt: "2024-12-01T10:00:00"
        }
      ],
      ...mockData
    };
    
    this.calls = [];
    this.errors = [];
  }

  // Track API calls for testing
  _trackCall(method, params) {
    this.calls.push({
      method,
      params,
      timestamp: new Date(),
      id: this.calls.length + 1
    });
  }

  // Track errors for testing
  _trackError(method, error) {
    this.errors.push({
      method,
      error: error.message || error,
      timestamp: new Date(),
      id: this.errors.length + 1
    });
  }

  // Mock Group 1: Basic Feature Flag Management
  async getAllFeatureFlags() {
    this._trackCall('getAllFeatureFlags', {});
    return {
      message: "Feature flags retrieved successfully",
      code: "200",
      data: this.mockData.featureFlags
    };
  }

  async getFeatureFlag(featureName) {
    this._trackCall('getFeatureFlag', { featureName });
    const flag = this.mockData.featureFlags.find(f => f.featureName === featureName);
    
    if (!flag) {
      const error = new Error('Feature flag not found');
      this._trackError('getFeatureFlag', error);
      throw error;
    }

    return {
      message: "Feature flag retrieved successfully",
      code: "200",
      data: flag
    };
  }

  async createFeatureFlag(featureFlagData) {
    this._trackCall('createFeatureFlag', featureFlagData);
    
    const newFlag = {
      id: this.mockData.featureFlags.length + 1,
      ...featureFlagData,
      enabled: featureFlagData.enabled || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockData.featureFlags.push(newFlag);

    return {
      message: "Feature flag created successfully",
      code: "201",
      data: newFlag
    };
  }

  async updateFeatureFlag(featureName, featureFlagData) {
    this._trackCall('updateFeatureFlag', { featureName, featureFlagData });
    
    const flagIndex = this.mockData.featureFlags.findIndex(f => f.featureName === featureName);
    
    if (flagIndex === -1) {
      const error = new Error('Feature flag not found');
      this._trackError('updateFeatureFlag', error);
      throw error;
    }

    this.mockData.featureFlags[flagIndex] = {
      ...this.mockData.featureFlags[flagIndex],
      ...featureFlagData,
      updatedAt: new Date().toISOString()
    };

    return {
      message: "Feature flag updated successfully",
      code: "200",
      data: this.mockData.featureFlags[flagIndex]
    };
  }

  async deleteFeatureFlag(featureName) {
    this._trackCall('deleteFeatureFlag', { featureName });
    
    const flagIndex = this.mockData.featureFlags.findIndex(f => f.featureName === featureName);
    
    if (flagIndex === -1) {
      const error = new Error('Feature flag not found');
      this._trackError('deleteFeatureFlag', error);
      throw error;
    }

    this.mockData.featureFlags.splice(flagIndex, 1);

    return {
      message: "Feature flag deleted successfully",
      code: "200",
      data: null
    };
  }

  // Mock Group 2: Feature Flag Status Management
  async getEnabledFeatureFlags() {
    this._trackCall('getEnabledFeatureFlags', {});
    const enabledFlags = this.mockData.featureFlags.filter(f => f.enabled);
    
    return {
      message: "Enabled feature flags retrieved successfully",
      code: "200",
      data: enabledFlags
    };
  }

  async getDisabledFeatureFlags() {
    this._trackCall('getDisabledFeatureFlags', {});
    const disabledFlags = this.mockData.featureFlags.filter(f => !f.enabled);
    
    return {
      message: "Disabled feature flags retrieved successfully",
      code: "200",
      data: disabledFlags
    };
  }

  // Mock Group 3: Feature Flag Status Checking
  async checkFeatureFlag(featureName) {
    this._trackCall('checkFeatureFlag', { featureName });
    const flag = this.mockData.featureFlags.find(f => f.featureName === featureName);
    
    if (!flag) {
      const error = new Error('Feature flag not found');
      this._trackError('checkFeatureFlag', error);
      throw error;
    }

    return {
      message: "Feature flag status retrieved successfully",
      code: "200",
      data: {
        featureName: flag.featureName,
        enabled: flag.enabled
      }
    };
  }

  async isFeatureEnabled(featureName) {
    this._trackCall('isFeatureEnabled', { featureName });
    try {
      const response = await this.checkFeatureFlag(featureName);
      return response.data?.enabled || false;
    } catch (error) {
      this._trackError('isFeatureEnabled', error);
      return false;
    }
  }

  // Testing utilities
  getCallHistory() {
    return [...this.calls];
  }

  getErrorHistory() {
    return [...this.errors];
  }

  clearHistory() {
    this.calls = [];
    this.errors = [];
  }

  setMockData(newData) {
    this.mockData = { ...this.mockData, ...newData };
  }

  resetMockData() {
    this.mockData = {
      featureFlags: [
        {
          id: 1,
          featureName: "NEW_UI",
          enabled: true,
          description: "Enable new user interface with modern design",
          createdAt: "2024-12-01T10:00:00",
          updatedAt: "2024-12-01T10:00:00"
        },
        {
          id: 2,
          featureName: "CHAT_FEATURE",
          enabled: false,
          description: "Enable real-time chat functionality between alumni",
          createdAt: "2024-12-01T10:00:00",
          updatedAt: "2024-12-01T10:00:00"
        }
      ]
    };
  }

  // Simulate network delays for testing
  async simulateNetworkDelay(delay = 100) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Simulate network errors for testing
  async simulateNetworkError(errorMessage = 'Network error') {
    throw new Error(errorMessage);
  }
}

// 4.2 Testing Utilities
export const createMockFeatureFlagData = (overrides = {}) => {
  const baseData = {
    id: Math.floor(Math.random() * 1000),
    featureName: "TEST_FEATURE",
    enabled: false,
    description: "Test feature flag for testing purposes",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return { ...baseData, ...overrides };
};

export const createMockFeatureFlagResponse = (data, overrides = {}) => {
  const baseResponse = {
    message: "Feature flag operation completed successfully",
    code: "200",
    data: data
  };

  return { ...baseResponse, ...overrides };
};

export const createMockFeatureFlagError = (message = "Feature flag error", code = "400") => {
  return {
    message,
    code,
    error: true,
    timestamp: new Date().toISOString()
  };
};

// 4.3 Development Tools
export class FeatureFlagDevelopmentTools {
  constructor() {
    this.debugMode = false;
    this.logLevel = 'info'; // 'debug', 'info', 'warn', 'error'
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      startTime: new Date()
    };
  }

  // Enable/disable debug mode
  setDebugMode(enabled) {
    this.debugMode = enabled;
    if (enabled) {
    } else {
    }
  }

  // Set log level
  setLogLevel(level) {
    this.logLevel = level;
  }

  // Log messages based on level
  log(level, message, data = null) {
    if (!this.debugMode) return;

    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] < levels[this.logLevel]) return;

    const timestamp = new Date().toISOString();
    const prefix = `🔧 [${timestamp}] [${level.toUpperCase()}] Feature Flag:`;
    
    if (data) {
      console[level](prefix, message, data);
    } else {
      console[level](prefix, message);
    }
  }

  // Track API calls
  trackApiCall(method, endpoint, duration = 0) {
    this.metrics.apiCalls++;
    this.log('debug', `API Call: ${method} ${endpoint} (${duration}ms)`);
  }

  // Track cache operations
  trackCacheHit(featureName) {
    this.metrics.cacheHits++;
    this.log('debug', `Cache HIT: ${featureName}`);
  }

  trackCacheMiss(featureName) {
    this.metrics.cacheMisses++;
    this.log('debug', `Cache MISS: ${featureName}`);
  }

  // Track errors
  trackError(method, error) {
    this.metrics.errors++;
    this.log('error', `Error in ${method}:`, error);
  }

  // Get metrics
  getMetrics() {
    const now = new Date();
    const uptime = now - this.metrics.startTime;
    
    return {
      ...this.metrics,
      uptime: uptime,
      uptimeFormatted: this.formatUptime(uptime),
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0,
      errorRate: this.metrics.errors / this.metrics.apiCalls || 0
    };
  }

  // Format uptime
  formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // Reset metrics
  resetMetrics() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      startTime: new Date()
    };
    this.log('info', 'Metrics reset');
  }

  // Export metrics for external monitoring
  exportMetrics() {
    return {
      ...this.getMetrics(),
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    };
  }
}

// 4.4 Integration Test Helpers
export const createFeatureFlagTestSuite = (service, options = {}) => {
  const {
    testName = 'Feature Flag Service',
    enableLogging = false,
    enableMetrics = false
  } = options;

  const devTools = new FeatureFlagDevelopmentTools();
  if (enableLogging) devTools.setDebugMode(true);
  if (enableMetrics) devTools.setDebugMode(true);

  return {
    testName,
    service,
    devTools,
    
    // Test data setup
    setupTestData: (testData) => {
      if (service.setMockData) {
        service.setMockData(testData);
      }
      devTools.log('info', 'Test data setup completed', testData);
    },

    // Test cleanup
    cleanupTest: () => {
      if (service.clearHistory) {
        service.clearHistory();
      }
      if (service.resetMockData) {
        service.resetMockData();
      }
      devTools.log('info', 'Test cleanup completed');
    },

    // Run test scenario
    runTestScenario: async (scenarioName, testFunction) => {
      devTools.log('info', `Running test scenario: ${scenarioName}`);
      const startTime = Date.now();
      
      try {
        const result = await testFunction();
        const duration = Date.now() - startTime;
        devTools.log('info', `Test scenario completed: ${scenarioName} (${duration}ms)`);
        return { success: true, result, duration };
      } catch (error) {
        const duration = Date.now() - startTime;
        devTools.trackError(scenarioName, error);
        devTools.log('error', `Test scenario failed: ${scenarioName} (${duration}ms)`, error);
        return { success: false, error, duration };
      }
    },

    // Get test results
    getTestResults: () => {
      return {
        metrics: devTools.getMetrics(),
        serviceHistory: service.getCallHistory ? service.getCallHistory() : [],
        serviceErrors: service.getErrorHistory ? service.getErrorHistory() : []
      };
    }
  };
};

// 4.5 Performance Testing Utilities
export const measureFeatureFlagPerformance = async (operation, iterations = 100) => {
  const results = {
    operation: operation.name || 'Unknown Operation',
    iterations,
    totalTime: 0,
    averageTime: 0,
    minTime: Infinity,
    maxTime: 0,
    times: []
  };

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    await operation();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    results.times.push(duration);
    results.totalTime += duration;
    results.minTime = Math.min(results.minTime, duration);
    results.maxTime = Math.max(results.maxTime, duration);
  }

  results.averageTime = results.totalTime / iterations;
  results.standardDeviation = calculateStandardDeviation(results.times);

  return results;
};

const calculateStandardDeviation = (values) => {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
};

// 4.6 Mock Environment Setup
export const setupMockFeatureFlagEnvironment = (config = {}) => {
  const {
    enableMockService = true,
    enableDevTools = true,
    mockData = {},
    logLevel = 'info'
  } = config;

  const environment = {};

  if (enableMockService) {
    environment.mockService = new MockFeatureFlagService(mockData);
    environment.originalApi = { ...featureFlagApi };
    
    // Replace API methods with mock methods
    Object.keys(environment.mockService).forEach(method => {
      if (typeof environment.mockService[method] === 'function') {
        featureFlagApi[method] = environment.mockService[method].bind(environment.mockService);
      }
    });
  }

  if (enableDevTools) {
    environment.devTools = new FeatureFlagDevelopmentTools();
    environment.devTools.setLogLevel(logLevel);
    environment.devTools.setDebugMode(true);
  }

  return {
    ...environment,
    cleanup: () => {
      if (environment.originalApi) {
        Object.assign(featureFlagApi, environment.originalApi);
      }
      if (environment.devTools) {
        environment.devTools.setDebugMode(false);
      }
    }
  };
};

// Export all utilities
export default {
  MockFeatureFlagService,
  createMockFeatureFlagData,
  createMockFeatureFlagResponse,
  createMockFeatureFlagError,
  FeatureFlagDevelopmentTools,
  createFeatureFlagTestSuite,
  measureFeatureFlagPerformance,
  setupMockFeatureFlagEnvironment
};
