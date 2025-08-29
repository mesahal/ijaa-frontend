import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MultiFeatureFlag, { withMultiFeatureFlag, useMultiFeatureFlag } from '../../components/MultiFeatureFlag';

// Mock the featureFlagApi
jest.mock('../../utils/featureFlagApi', () => ({
  featureFlagApi: {
    checkFeatureFlag: jest.fn(),
    checkFeatureFlagHierarchical: jest.fn()
  }
}));

import { featureFlagApi } from '../../utils/featureFlagApi';

describe('MultiFeatureFlag', () => {
  const mockCheckFeatureFlag = featureFlagApi.checkFeatureFlag;
  const mockCheckFeatureFlagHierarchical = featureFlagApi.checkFeatureFlagHierarchical;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockCheckFeatureFlag.mockReset();
    mockCheckFeatureFlagHierarchical.mockReset();
  });

  describe('Basic Rendering', () => {
    it('should render children when all feature flags are enabled', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      render(
        <MultiFeatureFlag features={['events', 'events.creation']}>
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(screen.getByTestId('feature-content')).toBeInTheDocument();
      });
    });

    it('should render fallback when any feature flag is disabled', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: false } });

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          fallback={<div data-testid="fallback-content">Fallback Content</div>}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
        expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
      });
    });

    it('should render nothing when features are disabled and no fallback', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: false } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: false } });

      const { container } = render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          showFallback={false}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('requireAll prop', () => {
    it('should require all features to be enabled when requireAll is true (default)', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: false } });

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          fallback={<div data-testid="fallback-content">Fallback Content</div>}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
      });
    });

    it('should render children when any feature is enabled when requireAll is false', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: false } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          requireAll={false}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(screen.getByTestId('feature-content')).toBeInTheDocument();
      });
    });
  });

  describe('hierarchical prop', () => {
    it('should use hierarchical validation when hierarchical is true (default)', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      render(
        <MultiFeatureFlag features={['events', 'events.creation']}>
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(mockCheckFeatureFlagHierarchical).toHaveBeenCalledWith('events');
        expect(mockCheckFeatureFlagHierarchical).toHaveBeenCalledWith('events.creation');
        expect(mockCheckFeatureFlag).not.toHaveBeenCalled();
      });
    });

    it('should use non-hierarchical validation when hierarchical is false', async () => {
      mockCheckFeatureFlag
        .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          hierarchical={false}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(mockCheckFeatureFlag).toHaveBeenCalledWith('events');
        expect(mockCheckFeatureFlag).toHaveBeenCalledWith('events.creation');
        expect(mockCheckFeatureFlagHierarchical).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while checking features', () => {
      // Don't resolve the promises immediately
      mockCheckFeatureFlagHierarchical.mockImplementation(() => new Promise(() => {}));

      render(
        <MultiFeatureFlag features={['events', 'events.creation']}>
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      expect(screen.getByText('Loading features...')).toBeInTheDocument();
    });

    it('should show custom loading component', () => {
      mockCheckFeatureFlagHierarchical.mockImplementation(() => new Promise(() => {}));

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          loading={<div data-testid="custom-loading">Custom Loading...</div>}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      expect(screen.getByTestId('custom-loading')).toBeInTheDocument();
    });

    it('should not show loading when showLoading is false', async () => {
      mockCheckFeatureFlagHierarchical
        .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          showLoading={false}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      expect(screen.queryByText('Loading features...')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      mockCheckFeatureFlagHierarchical
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <MultiFeatureFlag 
          features={['events', 'events.creation']}
          fallback={<div data-testid="fallback-content">Fallback Content</div>}
        >
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to check feature flag events:', expect.any(Error));
        expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Empty Features Array', () => {
    it('should render children when features array is empty', async () => {
      render(
        <MultiFeatureFlag features={[]}>
          <div data-testid="feature-content">Multi Feature Content</div>
        </MultiFeatureFlag>
      );

      await waitFor(() => {
        expect(screen.getByTestId('feature-content')).toBeInTheDocument();
      });

      expect(mockCheckFeatureFlagHierarchical).not.toHaveBeenCalled();
    });
  });
});

describe('withMultiFeatureFlag HOC', () => {
  const mockCheckFeatureFlagHierarchical = featureFlagApi.checkFeatureFlagHierarchical;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckFeatureFlagHierarchical.mockReset();
  });

  it('should wrap component with MultiFeatureFlag', async () => {
    mockCheckFeatureFlagHierarchical
      .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
      .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

    const TestComponent = () => <div data-testid="test-component">Test Component</div>;
    const WrappedComponent = withMultiFeatureFlag(['events', 'events.creation'])(TestComponent);

    render(<WrappedComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
  });

  it('should pass props to wrapped component', async () => {
    mockCheckFeatureFlagHierarchical
      .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
      .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

    const TestComponent = ({ title }) => <div data-testid="test-component">{title}</div>;
    const WrappedComponent = withMultiFeatureFlag(['events', 'events.creation'])(TestComponent);

    render(<WrappedComponent title="Test Title" />);

    await waitFor(() => {
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });
});

describe('useMultiFeatureFlag Hook', () => {
  const mockCheckFeatureFlagHierarchical = featureFlagApi.checkFeatureFlagHierarchical;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckFeatureFlagHierarchical.mockReset();
  });

  it('should return correct state when features are enabled', async () => {
    // Override the default mock for this specific test
    mockCheckFeatureFlagHierarchical
      .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
      .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

    const TestComponent = () => {
      const { areFeaturesEnabled, loading, featureStatuses } = useMultiFeatureFlag(['events', 'events.creation']);
      
      return (
        <div>
          <div data-testid="loading">{loading ? 'Loading' : 'Loaded'}</div>
          <div data-testid="enabled">{areFeaturesEnabled ? 'Enabled' : 'Disabled'}</div>
          <div data-testid="statuses">{JSON.stringify(featureStatuses)}</div>
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Loaded');
      expect(screen.getByTestId('enabled')).toHaveTextContent('Enabled');
    }, { timeout: 3000 });
  });

  it('should return correct state when features are disabled', async () => {
    mockCheckFeatureFlagHierarchical
      .mockResolvedValueOnce({ data: { name: 'events', enabled: false } })
      .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: false } });

    const TestComponent = () => {
      const { areFeaturesEnabled, loading } = useMultiFeatureFlag(['events', 'events.creation']);
      
      return (
        <div>
          <div data-testid="loading">{loading ? 'Loading' : 'Loaded'}</div>
          <div data-testid="enabled">{areFeaturesEnabled ? 'Enabled' : 'Disabled'}</div>
        </div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('enabled')).toHaveTextContent('Disabled');
    });
  });

  it('should handle requireAll=false correctly', async () => {
    mockCheckFeatureFlagHierarchical
      .mockResolvedValueOnce({ data: { name: 'events', enabled: false } })
      .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

    const TestComponent = () => {
      const { areFeaturesEnabled } = useMultiFeatureFlag(['events', 'events.creation'], false);
      
      return (
        <div data-testid="enabled">{areFeaturesEnabled ? 'Enabled' : 'Disabled'}</div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('enabled')).toHaveTextContent('Enabled');
    });
  });

  it('should provide render method', async () => {
    // Override the default mock for this specific test
    mockCheckFeatureFlagHierarchical
      .mockResolvedValueOnce({ data: { name: 'events', enabled: true } })
      .mockResolvedValueOnce({ data: { name: 'events.creation', enabled: true } });

    const TestComponent = () => {
      const { render } = useMultiFeatureFlag(['events', 'events.creation']);
      
      return render(
        <div data-testid="feature-content">Feature Content</div>,
        <div data-testid="fallback-content">Fallback Content</div>
      );
    };

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('feature-content')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
