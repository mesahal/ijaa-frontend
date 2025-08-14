// Feature Flag Monitoring and Analytics - Phase 5 Implementation
// Provides usage tracking, error monitoring, analytics dashboard, and performance monitoring

import { featureFlagApi, FEATURE_FLAGS } from './featureFlagApi';

// ===== PHASE 5: MONITORING AND ANALYTICS =====

// 5.1 Feature Flag Usage Tracking
export class FeatureFlagUsageTracker {
  constructor() {
    this.usageData = new Map();
    this.sessionData = {
      sessionId: this.generateSessionId(),
      startTime: new Date(),
      userId: null,
      userAgent: navigator.userAgent,
      pageViews: 0,
      featureInteractions: 0
    };
    
    this.initializeTracking();
  }

  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize tracking
  initializeTracking() {
    this.trackPageView();
    this.interceptFeatureFlagCalls();
    this.trackUserInteractions();
    this.startPeriodicExport();
  }

  // Track page view
  trackPageView() {
    this.sessionData.pageViews++;
    this.recordEvent('page_view', {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionData.sessionId
    });
  }

  // Intercept feature flag API calls
  interceptFeatureFlagCalls() {
    const originalCheckFeatureFlag = featureFlagApi.checkFeatureFlag;
    const originalIsFeatureEnabled = featureFlagApi.isFeatureEnabled;
    
    featureFlagApi.checkFeatureFlag = async (featureName) => {
      const startTime = performance.now();
      try {
        const result = await originalCheckFeatureFlag.call(featureFlagApi, featureName);
        const duration = performance.now() - startTime;
        this.trackFeatureFlagCheck(featureName, result.data?.enabled, duration, true);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.trackFeatureFlagCheck(featureName, false, duration, false, error);
        throw error;
      }
    };

    featureFlagApi.isFeatureEnabled = async (featureName) => {
      const startTime = performance.now();
      try {
        const result = await originalIsFeatureEnabled.call(featureFlagApi, featureName);
        const duration = performance.now() - startTime;
        this.trackFeatureFlagCheck(featureName, result, duration, true);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        this.trackFeatureFlagCheck(featureName, false, duration, false, error);
        return false;
      }
    };
  }

  // Track feature flag check
  trackFeatureFlagCheck(featureName, isEnabled, duration, success, error = null) {
    const event = {
      type: 'feature_flag_check',
      featureName,
      isEnabled,
      duration,
      success,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionData.sessionId,
      userId: this.sessionData.userId,
      error: error ? error.message : null
    };

    this.recordEvent('feature_flag_check', event);
    
    if (!this.usageData.has(featureName)) {
      this.usageData.set(featureName, {
        totalChecks: 0,
        enabledChecks: 0,
        disabledChecks: 0,
        errorCount: 0,
        totalDuration: 0,
        lastChecked: null,
        firstSeen: new Date().toISOString()
      });
    }

    const usage = this.usageData.get(featureName);
    usage.totalChecks++;
    usage.totalDuration += duration;
    usage.lastChecked = new Date().toISOString();

    if (success) {
      if (isEnabled) {
        usage.enabledChecks++;
      } else {
        usage.disabledChecks++;
      }
    } else {
      usage.errorCount++;
    }
  }

  // Track user interactions
  trackUserInteractions() {
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-feature-flag]');
      if (target) {
        const featureName = target.dataset.featureFlag;
        this.trackFeatureInteraction(featureName, 'click', target);
      }
    });

    document.addEventListener('submit', (event) => {
      const form = event.target;
      const featureFlag = form.dataset.featureFlag;
      if (featureFlag) {
        this.trackFeatureInteraction(featureFlag, 'form_submit', form);
      }
    });
  }

  // Track feature interaction
  trackFeatureInteraction(featureName, interactionType, element) {
    this.sessionData.featureInteractions++;
    
    this.recordEvent('feature_interaction', {
      type: 'feature_interaction',
      featureName,
      interactionType,
      elementType: element.tagName,
      elementId: element.id || null,
      elementClass: element.className || null,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionData.sessionId,
      userId: this.sessionData.userId
    });
  }

  // Record event
  recordEvent(eventType, eventData) {
    const event = {
      id: this.generateEventId(),
      eventType,
      ...eventData
    };

    if (!this.usageData.has('_events')) {
      this.usageData.set('_events', []);
    }
    this.usageData.get('_events').push(event);
    this.sendToAnalytics(event);
  }

  // Generate event ID
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send to analytics endpoint
  async sendToAnalytics(event) {
    try {
      if (window.FEATURE_FLAG_ANALYTICS_ENDPOINT) {
        await fetch(window.FEATURE_FLAG_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('alumni_user')?.token || ''}`
          },
          body: JSON.stringify(event)
        });
      }
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  // Start periodic data export
  startPeriodicExport() {
    setInterval(() => {
      this.exportUsageData();
    }, 5 * 60 * 1000); // Export every 5 minutes
  }

  // Export usage data
  exportUsageData() {
    const exportData = {
      sessionData: this.sessionData,
      usageData: Object.fromEntries(this.usageData),
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    };

    try {
      localStorage.setItem('feature_flag_usage_data', JSON.stringify(exportData));
    } catch (error) {
      console.warn('Failed to store usage data:', error);
    }

    return exportData;
  }

  // Get usage statistics
  getUsageStatistics() {
    const stats = {
      totalFeatures: this.usageData.size - 1,
      totalChecks: 0,
      totalInteractions: 0,
      errorRate: 0,
      averageResponseTime: 0,
      mostUsedFeatures: [],
      leastUsedFeatures: []
    };

    let totalDuration = 0;
    const featureStats = [];

    for (const [featureName, usage] of this.usageData.entries()) {
      if (featureName === '_events') continue;

      stats.totalChecks += usage.totalChecks;
      totalDuration += usage.totalDuration;
      featureStats.push({
        featureName,
        ...usage,
        usageRate: usage.totalChecks / stats.totalChecks
      });
    }

    if (stats.totalChecks > 0) {
      stats.averageResponseTime = totalDuration / stats.totalChecks;
      stats.errorRate = Array.from(this.usageData.values())
        .filter(usage => usage !== '_events')
        .reduce((total, usage) => total + usage.errorCount, 0) / stats.totalChecks;
    }

    featureStats.sort((a, b) => b.totalChecks - a.totalChecks);
    stats.mostUsedFeatures = featureStats.slice(0, 5);
    stats.leastUsedFeatures = featureStats.slice(-5).reverse();

    return stats;
  }

  // Set user ID
  setUserId(userId) {
    this.sessionData.userId = userId;
  }

  // Cleanup
  cleanup() {
    this.exportUsageData();
    if (this.exportInterval) {
      clearInterval(this.exportInterval);
    }
  }
}

// 5.2 Error Monitoring
export class FeatureFlagErrorMonitor {
  constructor() {
    this.errors = [];
    this.errorPatterns = new Map();
    this.alertThresholds = {
      errorRate: 0.1,
      consecutiveErrors: 5,
      timeWindow: 5 * 60 * 1000
    };
    
    this.initializeMonitoring();
  }

  // Initialize error monitoring
  initializeMonitoring() {
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', event.reason);
    });

    window.addEventListener('error', (event) => {
      this.trackError('global_error', event.error);
    });

    const originalConsoleError = console.error;
    console.error = (...args) => {
      this.trackError('console_error', args);
      originalConsoleError.apply(console, args);
    };
  }

  // Track error
  trackError(errorType, error, context = {}) {
    const errorRecord = {
      id: this.generateErrorId(),
      type: errorType,
      message: error?.message || String(error),
      stack: error?.stack || null,
      timestamp: new Date().toISOString(),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      }
    };

    this.errors.push(errorRecord);
    this.analyzeErrorPatterns(errorRecord);
    this.checkAlertThresholds();
    this.sendToMonitoringService(errorRecord);
  }

  // Generate error ID
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Analyze error patterns
  analyzeErrorPatterns(errorRecord) {
    const key = `${errorRecord.type}:${errorRecord.message}`;
    
    if (!this.errorPatterns.has(key)) {
      this.errorPatterns.set(key, {
        count: 0,
        firstSeen: errorRecord.timestamp,
        lastSeen: errorRecord.timestamp,
        instances: []
      });
    }

    const pattern = this.errorPatterns.get(key);
    pattern.count++;
    pattern.lastSeen = errorRecord.timestamp;
    pattern.instances.push(errorRecord);
  }

  // Check alert thresholds
  checkAlertThresholds() {
    const recentErrors = this.errors.filter(
      error => Date.now() - new Date(error.timestamp).getTime() < this.alertThresholds.timeWindow
    );

    if (recentErrors.length > 0) {
      const errorRate = recentErrors.length / this.alertThresholds.timeWindow * 1000;
      if (errorRate > this.alertThresholds.errorRate) {
        this.triggerAlert('high_error_rate', { errorRate, threshold: this.alertThresholds.errorRate });
      }
    }

    let consecutiveCount = 0;
    for (let i = this.errors.length - 1; i >= 0; i--) {
      if (this.errors[i].type === 'feature_flag_error') {
        consecutiveCount++;
        if (consecutiveCount >= this.alertThresholds.consecutiveErrors) {
          this.triggerAlert('consecutive_errors', { count: consecutiveCount });
          break;
        }
      } else {
        break;
      }
    }
  }

  // Trigger alert
  triggerAlert(alertType, data) {
    const alert = {
      id: this.generateAlertId(),
      type: alertType,
      data,
      timestamp: new Date().toISOString(),
      severity: 'warning'
    };

    console.warn('Feature Flag Alert:', alert);
    this.sendToMonitoringService(alert);
    
    if (window.FEATURE_FLAG_ALERT_NOTIFICATION) {
      this.showUserNotification(alert);
    }
  }

  // Generate alert ID
  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Show user notification
  showUserNotification(alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Feature Flag Alert', {
        body: `Alert: ${alert.type}`,
        icon: '/favicon.ico'
      });
    }
  }

  // Send to monitoring service
  async sendToMonitoringService(data) {
    try {
      if (window.FEATURE_FLAG_MONITORING_ENDPOINT) {
        await fetch(window.FEATURE_FLAG_MONITORING_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('alumni_user')?.token || ''}`
          },
          body: JSON.stringify(data)
        });
      }
    } catch (error) {
      console.warn('Failed to send to monitoring service:', error);
    }
  }

  // Get error statistics
  getErrorStatistics() {
    const stats = {
      totalErrors: this.errors.length,
      errorTypes: {},
      errorPatterns: Array.from(this.errorPatterns.values()),
      recentErrors: this.errors.slice(-10),
      errorRate: this.calculateErrorRate()
    };

    this.errors.forEach(error => {
      stats.errorTypes[error.type] = (stats.errorTypes[error.type] || 0) + 1;
    });

    return stats;
  }

  // Calculate error rate
  calculateErrorRate() {
    const now = Date.now();
    const timeWindow = 60 * 1000;
    const recentErrors = this.errors.filter(
      error => now - new Date(error.timestamp).getTime() < timeWindow
    );
    
    return recentErrors.length / (timeWindow / 1000);
  }

  // Clear old errors
  clearOldErrors(maxAge = 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    this.errors = this.errors.filter(
      error => new Date(error.timestamp).getTime() > cutoff
    );
  }
}

// Export monitoring classes
export default {
  FeatureFlagUsageTracker,
  FeatureFlagErrorMonitor
};
