// Feature Flag Advanced Features - Phase 6 Implementation
// A/B Testing Framework

import { featureFlagApi, FEATURE_FLAGS } from './featureFlagApi';

// 6.1 A/B Testing Framework
export class FeatureFlagABTesting {
  constructor() {
    this.experiments = new Map();
    this.userVariants = new Map();
    this.experimentResults = new Map();
    this.initializeABTesting();
  }

  // Initialize A/B testing
  initializeABTesting() {
    this.loadUserVariants();
    this.trackExperimentViews();
    this.trackExperimentConversions();
  }

  // Create A/B test experiment
  createExperiment(experimentName, variants, trafficSplit = 'equal') {
    const experiment = {
      id: this.generateExperimentId(),
      name: experimentName,
      variants: variants.map((variant, index) => ({
        id: `variant_${index}`,
        name: variant.name,
        value: variant.value,
        weight: trafficSplit === 'equal' ? 1 / variants.length : variant.weight || 0
      })),
      trafficSplit,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: null,
      metrics: {
        impressions: 0,
        conversions: 0,
        conversionRate: 0
      }
    };

    this.experiments.set(experimentName, experiment);
    return experiment;
  }

  // Generate experiment ID
  generateExperimentId() {
    return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get user variant for experiment
  getUserVariant(experimentName, userId = null) {
    const experiment = this.experiments.get(experimentName);
    if (!experiment || experiment.status !== 'active') {
      return null;
    }

    const userKey = userId || this.getAnonymousUserId();
    
    if (this.userVariants.has(`${experimentName}_${userKey}`)) {
      return this.userVariants.get(`${experimentName}_${userKey}`);
    }

    const variant = this.assignVariant(experiment, userKey);
    this.userVariants.set(`${experimentName}_${userKey}`, variant);
    this.saveUserVariants();
    
    return variant;
  }

  // Assign variant to user
  assignVariant(experiment, userKey) {
    const hash = this.hashString(userKey);
    const normalizedHash = hash % 100;
    
    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight * 100;
      if (normalizedHash < cumulativeWeight) {
        return variant;
      }
    }
    
    return experiment.variants[0];
  }

  // Hash string to number
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Get anonymous user ID
  getAnonymousUserId() {
    let userId = localStorage.getItem('anonymous_user_id');
    if (!userId) {
      userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('anonymous_user_id', userId);
    }
    return userId;
  }

  // Track experiment view
  trackExperimentView(experimentName, variant) {
    const experiment = this.experiments.get(experimentName);
    if (experiment) {
      experiment.metrics.impressions++;
      this.recordExperimentEvent('view', experimentName, variant);
    }
  }

  // Track experiment conversion
  trackExperimentConversion(experimentName, variant, conversionValue = 1) {
    const experiment = this.experiments.get(experimentName);
    if (experiment) {
      experiment.metrics.conversions += conversionValue;
      experiment.metrics.conversionRate = experiment.metrics.conversions / experiment.metrics.impressions;
      this.recordExperimentEvent('conversion', experimentName, variant, conversionValue);
    }
  }

  // Record experiment event
  recordExperimentEvent(eventType, experimentName, variant, value = null) {
    const event = {
      id: this.generateEventId(),
      type: eventType,
      experimentName,
      variant: variant.name,
      variantId: variant.id,
      timestamp: new Date().toISOString(),
      userId: this.getAnonymousUserId(),
      value
    };

    if (!this.experimentResults.has(experimentName)) {
      this.experimentResults.set(experimentName, []);
    }
    this.experimentResults.get(experimentName).push(event);
    this.sendExperimentEvent(event);
  }

  // Generate event ID
  generateEventId() {
    return `ab_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Send experiment event to analytics
  async sendExperimentEvent(event) {
    try {
      if (window.FEATURE_FLAG_ANALYTICS_ENDPOINT) {
        await fetch(window.FEATURE_FLAG_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('alumni_user')?.token || ''}`
          },
          body: JSON.stringify({
            ...event,
            eventType: 'ab_testing'
          })
        });
      }
    } catch (error) {
      console.warn('Failed to send experiment event:', error);
    }
  }

  // Get experiment statistics
  getExperimentStatistics(experimentName) {
    const experiment = this.experiments.get(experimentName);
    if (!experiment) return null;

    const variantStats = experiment.variants.map(variant => {
      const variantEvents = this.experimentResults.get(experimentName)?.filter(
        event => event.variantId === variant.id
      ) || [];

      const views = variantEvents.filter(event => event.type === 'view').length;
      const conversions = variantEvents.filter(event => event.type === 'conversion').length;
      const conversionRate = views > 0 ? conversions / views : 0;

      return {
        variant,
        views,
        conversions,
        conversionRate,
        events: variantEvents
      };
    });

    return {
      experiment,
      variantStats,
      totalViews: experiment.metrics.impressions,
      totalConversions: experiment.metrics.conversions,
      overallConversionRate: experiment.metrics.conversionRate
    };
  }

  // End experiment
  endExperiment(experimentName) {
    const experiment = this.experiments.get(experimentName);
    if (experiment) {
      experiment.status = 'ended';
      experiment.endDate = new Date().toISOString();
      
      const stats = this.getExperimentStatistics(experimentName);
      if (stats) {
        const winner = stats.variantStats.reduce((best, current) => 
          current.conversionRate > best.conversionRate ? current : best
        );
        experiment.winner = winner.variant;
      }
    }
  }

  // Load user variants from localStorage
  loadUserVariants() {
    try {
      const saved = localStorage.getItem('feature_flag_ab_variants');
      if (saved) {
        this.userVariants = new Map(JSON.parse(saved));
      }
    } catch (error) {
      console.warn('Failed to load A/B test variants:', error);
    }
  }

  // Save user variants to localStorage
  saveUserVariants() {
    try {
      const serialized = JSON.stringify(Array.from(this.userVariants.entries()));
      localStorage.setItem('feature_flag_ab_variants', serialized);
    } catch (error) {
      console.warn('Failed to save A/B test variants:', error);
    }
  }

  // Cleanup
  cleanup() {
    this.saveUserVariants();
  }
}

export default {
  FeatureFlagABTesting
};
