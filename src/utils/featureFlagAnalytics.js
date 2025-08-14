// Feature Flag Analytics Dashboard and Performance Monitoring - Phase 5 Implementation
// Provides analytics dashboard and performance monitoring capabilities

import { FeatureFlagUsageTracker, FeatureFlagErrorMonitor } from './featureFlagMonitoring';

// 5.3 Analytics Dashboard
export class FeatureFlagAnalyticsDashboard {
  constructor(usageTracker, errorMonitor) {
    this.usageTracker = usageTracker;
    this.errorMonitor = errorMonitor;
    this.dashboardElement = null;
    this.updateInterval = null;
    
    this.initializeDashboard();
  }

  // Initialize dashboard
  initializeDashboard() {
    this.createDashboardElement();
    this.startAutoUpdate();
    this.render();
  }

  // Create dashboard element
  createDashboardElement() {
    this.dashboardElement = document.createElement('div');
    this.dashboardElement.id = 'feature-flag-analytics-dashboard';
    this.dashboardElement.className = 'fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-md z-50';
    this.dashboardElement.style.display = 'none';
    
    document.body.appendChild(this.dashboardElement);
  }

  // Start auto-update
  startAutoUpdate() {
    this.updateInterval = setInterval(() => {
      this.render();
    }, 5000); // Update every 5 seconds
  }

  // Toggle dashboard visibility
  toggle() {
    if (this.dashboardElement.style.display === 'none') {
      this.dashboardElement.style.display = 'block';
    } else {
      this.dashboardElement.style.display = 'none';
    }
  }

  // Render dashboard
  render() {
    if (!this.dashboardElement) return;

    const usageStats = this.usageTracker.getUsageStatistics();
    const errorStats = this.errorMonitor.getErrorStatistics();

    this.dashboardElement.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Feature Flag Analytics</h3>
        <button onclick="document.getElementById('feature-flag-analytics-dashboard').style.display='none'" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          ✕
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Usage Statistics -->
        <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded">
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">Usage Statistics</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>Total Features: ${usageStats.totalFeatures}</div>
            <div>Total Checks: ${usageStats.totalChecks}</div>
            <div>Error Rate: ${(usageStats.errorRate * 100).toFixed(1)}%</div>
            <div>Avg Response: ${usageStats.averageResponseTime.toFixed(2)}ms</div>
          </div>
        </div>
        
        <!-- Error Statistics -->
        <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded">
          <h4 class="font-medium text-red-900 dark:text-red-100 mb-2">Error Statistics</h4>
          <div class="grid grid-cols-2 gap-2 text-sm text-red-800 dark:text-red-200">
            <div>Total Errors: ${errorStats.totalErrors}</div>
            <div>Error Rate: ${errorStats.errorRate.toFixed(2)}/s</div>
            <div>Recent Errors: ${errorStats.recentErrors.length}</div>
            <div>Patterns: ${errorStats.errorPatterns.length}</div>
          </div>
        </div>
        
        <!-- Most Used Features -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
          <h4 class="font-medium text-blue-900 dark:text-blue-100 mb-2">Most Used Features</h4>
          <div class="space-y-1 text-sm text-blue-800 dark:text-blue-200">
            ${usageStats.mostUsedFeatures.map(feature => 
              `<div>${feature.featureName}: ${feature.totalChecks} checks</div>`
            ).join('')}
          </div>
        </div>
        
        <!-- Session Info -->
        <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded">
          <h4 class="font-medium text-green-900 dark:text-green-100 mb-2">Session Info</h4>
          <div class="space-y-1 text-sm text-green-800 dark:text-green-200">
            <div>Session: ${this.usageTracker.sessionData.sessionId.substring(0, 8)}...</div>
            <div>Page Views: ${this.usageTracker.sessionData.pageViews}</div>
            <div>Interactions: ${this.usageTracker.sessionData.featureInteractions}</div>
            <div>Uptime: ${this.formatUptime(Date.now() - new Date(this.usageTracker.sessionData.startTime).getTime())}</div>
          </div>
        </div>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
        <button onclick="window.featureFlagAnalytics.exportData()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm">
          Export Data
        </button>
      </div>
    `;
  }

  // Format uptime
  formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  // Export data
  exportData() {
    const data = {
      usage: this.usageTracker.exportUsageData(),
      errors: this.errorMonitor.getErrorStatistics(),
      exportTime: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feature-flag-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Cleanup
  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.dashboardElement && this.dashboardElement.parentNode) {
      this.dashboardElement.parentNode.removeChild(this.dashboardElement);
    }
  }
}

// 5.4 Performance Monitoring
export class FeatureFlagPerformanceMonitor {
  constructor() {
    this.performanceData = new Map();
    this.performanceThresholds = {
      slowThreshold: 1000, // 1 second
      verySlowThreshold: 5000, // 5 seconds
      memoryThreshold: 50 * 1024 * 1024 // 50MB
    };
    
    this.initializeMonitoring();
  }

  // Initialize performance monitoring
  initializeMonitoring() {
    this.monitorApiPerformance();
    this.monitorMemoryUsage();
    this.monitorRenderingPerformance();
  }

  // Monitor API performance
  monitorApiPerformance() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        if (url.includes('feature-flags')) {
          this.recordApiPerformance(url, duration, true);
        }
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        
        if (url.includes('feature-flags')) {
          this.recordApiPerformance(url, duration, false, error);
        }
        
        throw error;
      }
    };
  }

  // Record API performance
  recordApiPerformance(url, duration, success, error = null) {
    const endpoint = url.split('/').pop() || 'unknown';
    
    if (!this.performanceData.has(endpoint)) {
      this.performanceData.set(endpoint, {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        slowCalls: 0,
        verySlowCalls: 0,
        lastCall: null
      });
    }

    const data = this.performanceData.get(endpoint);
    data.totalCalls++;
    data.totalDuration += duration;
    data.minDuration = Math.min(data.minDuration, duration);
    data.maxDuration = Math.max(data.maxDuration, duration);
    data.lastCall = new Date().toISOString();

    if (success) {
      data.successfulCalls++;
    } else {
      data.failedCalls++;
    }

    if (duration > this.performanceThresholds.verySlowThreshold) {
      data.verySlowCalls++;
    } else if (duration > this.performanceThresholds.slowThreshold) {
      data.slowCalls++;
    }

    this.checkPerformanceAlerts(endpoint, duration);
  }

  // Check performance alerts
  checkPerformanceAlerts(endpoint, duration) {
    if (duration > this.performanceThresholds.verySlowThreshold) {
      this.triggerPerformanceAlert('very_slow_api_call', { endpoint, duration });
    } else if (duration > this.performanceThresholds.slowThreshold) {
      this.triggerPerformanceAlert('slow_api_call', { endpoint, duration });
    }
  }

  // Trigger performance alert
  triggerPerformanceAlert(alertType, data) {
    const alert = {
      id: this.generateAlertId(),
      type: alertType,
      data,
      timestamp: new Date().toISOString(),
      severity: alertType === 'very_slow_api_call' ? 'critical' : 'warning'
    };

    console.warn('Performance Alert:', alert);
    this.sendToMonitoringService(alert);
  }

  // Generate alert ID
  generateAlertId() {
    return `perf_alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Monitor memory usage
  monitorMemoryUsage() {
    if ('memory' in performance) {
      setInterval(() => {
        const memoryInfo = performance.memory;
        const usedMemory = memoryInfo.usedJSHeapSize;
        
        if (usedMemory > this.performanceThresholds.memoryThreshold) {
          this.triggerPerformanceAlert('high_memory_usage', { 
            usedMemory: this.formatBytes(usedMemory),
            limit: this.formatBytes(memoryInfo.jsHeapSizeLimit)
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  // Monitor rendering performance
  monitorRenderingPerformance() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        if (fps < 30) {
          this.triggerPerformanceAlert('low_fps', { fps, frameCount });
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  // Format bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  // Get performance statistics
  getPerformanceStatistics() {
    const stats = {
      totalEndpoints: this.performanceData.size,
      totalCalls: 0,
      totalDuration: 0,
      averageResponseTime: 0,
      slowCallRate: 0,
      errorRate: 0,
      endpoints: Array.from(this.performanceData.entries()).map(([endpoint, data]) => ({
        endpoint,
        ...data,
        averageDuration: data.totalDuration / data.totalCalls,
        successRate: data.successfulCalls / data.totalCalls
      }))
    };

    stats.endpoints.forEach(endpoint => {
      stats.totalCalls += endpoint.totalCalls;
      stats.totalDuration += endpoint.totalDuration;
    });

    if (stats.totalCalls > 0) {
      stats.averageResponseTime = stats.totalDuration / stats.totalCalls;
      stats.slowCallRate = stats.endpoints.reduce((total, endpoint) => 
        total + endpoint.slowCalls + endpoint.verySlowCalls, 0) / stats.totalCalls;
      stats.errorRate = stats.endpoints.reduce((total, endpoint) => 
        total + endpoint.failedCalls, 0) / stats.totalCalls;
    }

    return stats;
  }

  // Cleanup
  cleanup() {
    // Restore original fetch if needed
  }
}

// 5.5 Main Monitoring Class
export class FeatureFlagMonitoring {
  constructor(config = {}) {
    this.config = {
      enableUsageTracking: true,
      enableErrorMonitoring: true,
      enableAnalyticsDashboard: true,
      enablePerformanceMonitoring: true,
      ...config
    };

    this.usageTracker = null;
    this.errorMonitor = null;
    this.analyticsDashboard = null;
    this.performanceMonitor = null;
    
    this.initialize();
  }

  // Initialize monitoring
  initialize() {
    if (this.config.enableUsageTracking) {
      this.usageTracker = new FeatureFlagUsageTracker();
    }

    if (this.config.enableErrorMonitoring) {
      this.errorMonitor = new FeatureFlagErrorMonitor();
    }

    if (this.config.enablePerformanceMonitoring) {
      this.performanceMonitor = new FeatureFlagPerformanceMonitor();
    }

    if (this.config.enableAnalyticsDashboard && this.usageTracker && this.errorMonitor) {
      this.analyticsDashboard = new FeatureFlagAnalyticsDashboard(this.usageTracker, this.errorMonitor);
    }

    if (this.analyticsDashboard) {
      window.featureFlagAnalytics = this.analyticsDashboard;
    }

    this.addToggleButton();
  }

  // Add toggle button
  addToggleButton() {
    const button = document.createElement('button');
    button.innerHTML = '📊';
    button.className = 'fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full shadow-lg z-40';
    button.title = 'Toggle Feature Flag Analytics Dashboard';
    button.onclick = () => {
      if (this.analyticsDashboard) {
        this.analyticsDashboard.toggle();
      }
    };

    document.body.appendChild(button);
  }

  // Get comprehensive monitoring data
  getMonitoringData() {
    return {
      usage: this.usageTracker?.getUsageStatistics() || null,
      errors: this.errorMonitor?.getErrorStatistics() || null,
      performance: this.performanceMonitor?.getPerformanceStatistics() || null,
      timestamp: new Date().toISOString()
    };
  }

  // Export all monitoring data
  exportMonitoringData() {
    const data = this.getMonitoringData();
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feature-flag-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Cleanup
  cleanup() {
    this.usageTracker?.cleanup();
    this.errorMonitor?.cleanup();
    this.analyticsDashboard?.cleanup();
    this.performanceMonitor?.cleanup();
  }
}

// Export all monitoring classes
export default {
  FeatureFlagAnalyticsDashboard,
  FeatureFlagPerformanceMonitor,
  FeatureFlagMonitoring
};
