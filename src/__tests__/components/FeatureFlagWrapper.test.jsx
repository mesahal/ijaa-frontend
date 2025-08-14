import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FeatureFlagWrapper, { withFeatureFlag, useFeatureFlagRender } from '../../components/FeatureFlagWrapper';

// Mock the useFeatureFlag hook
vi.mock('../../hooks/useFeatureFlag', () => ({
  useFeatureFlag: vi.fn()
}));

import { useFeatureFlag } from '../../hooks/useFeatureFlag';

describe('FeatureFlagWrapper', () => {
  const mockUseFeatureFlag = useFeatureFlag;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render children when feature flag is enabled', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: true,
        loading: false,
        error: null
      });

      render(
        <FeatureFlagWrapper featureName="test-feature">
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.getByTestId('feature-content')).toBeInTheDocument();
      expect(screen.getByText('Feature Content')).toBeInTheDocument();
    });

    it('should render fallback when feature flag is disabled', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      render(
        <FeatureFlagWrapper 
          featureName="test-feature"
          fallback={<div data-testid="fallback-content">Fallback Content</div>}
        >
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
      expect(screen.getByText('Fallback Content')).toBeInTheDocument();
      expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
    });

    it('should render nothing when feature flag is disabled and no fallback', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      const { container } = render(
        <FeatureFlagWrapper featureName="test-feature">
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Loading States', () => {
    it('should render loading content when loading is true', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: true,
        error: null
      });

      render(
        <FeatureFlagWrapper 
          featureName="test-feature"
          loading={<div data-testid="loading-content">Loading...</div>}
        >
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.getByTestId('loading-content')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render default loading message when loading is true and no loading prop', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: true,
        error: null
      });

      render(
        <FeatureFlagWrapper featureName="test-feature">
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.getByText('Loading feature...')).toBeInTheDocument();
    });

    it('should not show loading when showLoading is false', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: true,
        error: null
      });

      render(
        <FeatureFlagWrapper 
          featureName="test-feature"
          showLoading={false}
        >
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.queryByText('Loading feature...')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should log warning and continue with default behavior on error', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: new Error('API Error')
      });

      render(
        <FeatureFlagWrapper featureName="test-feature">
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(consoleSpy).toHaveBeenCalledWith('Feature flag error for test-feature:', expect.any(Error));
      expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Fallback Behavior', () => {
    it('should not show fallback when showFallback is false', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: false,
        loading: false,
        error: null
      });

      render(
        <FeatureFlagWrapper 
          featureName="test-feature"
          fallback={<div data-testid="fallback-content">Fallback</div>}
          showFallback={false}
        >
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.queryByTestId('fallback-content')).not.toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('should use default value when API call fails', () => {
      mockUseFeatureFlag.mockReturnValue({
        isEnabled: true, // This would be the default value
        loading: false,
        error: null
      });

      render(
        <FeatureFlagWrapper 
          featureName="test-feature"
          defaultValue={true}
        >
          <div data-testid="feature-content">Feature Content</div>
        </FeatureFlagWrapper>
      );

      expect(screen.getByTestId('feature-content')).toBeInTheDocument();
    });
  });
});

describe('withFeatureFlag HOC', () => {
  const mockUseFeatureFlag = useFeatureFlag;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should wrap component with feature flag logic', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: true,
      loading: false,
      error: null
    });

    const TestComponent = ({ name }) => <div data-testid="test-component">Hello {name}</div>;
    const WrappedComponent = withFeatureFlag('test-feature')(TestComponent);

    render(<WrappedComponent name="World" />);

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should pass through props to wrapped component', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: true,
      loading: false,
      error: null
    });

    const TestComponent = ({ title, count }) => (
      <div data-testid="test-component">
        {title}: {count}
      </div>
    );
    const WrappedComponent = withFeatureFlag('test-feature')(TestComponent);

    render(<WrappedComponent title="Items" count={5} />);

    expect(screen.getByText('Items: 5')).toBeInTheDocument();
  });

  it('should set proper display name', () => {
    const TestComponent = () => <div>Test</div>;
    TestComponent.displayName = 'CustomTestComponent';
    
    const WrappedComponent = withFeatureFlag('test-feature')(TestComponent);
    
    expect(WrappedComponent.displayName).toBe('withFeatureFlag(CustomTestComponent)');
  });

  it('should fall back to component name when no displayName', () => {
    const TestComponent = () => <div>Test</div>;
    
    const WrappedComponent = withFeatureFlag('test-feature')(TestComponent);
    
    expect(WrappedComponent.displayName).toBe('withFeatureFlag(TestComponent)');
  });
});

describe('useFeatureFlagRender Hook', () => {
  const mockUseFeatureFlag = useFeatureFlag;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide render method and feature state', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: true,
      loading: false,
      error: null
    });

    const TestComponent = () => {
      const { render, isEnabled, loading, error } = useFeatureFlagRender('test-feature');
      
      return (
        <div>
          <div data-testid="status">
            Enabled: {isEnabled.toString()}, Loading: {loading.toString()}, Error: {error ? 'yes' : 'no'}
          </div>
          {render(
            <div data-testid="feature-content">Feature Content</div>,
            <div data-testid="fallback-content">Fallback</div>
          )}
        </div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('status')).toHaveTextContent('Enabled: true, Loading: false, Error: no');
    expect(screen.getByTestId('feature-content')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback-content')).not.toBeInTheDocument();
  });

  it('should render fallback when feature is disabled', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: false,
      error: null
    });

    const TestComponent = () => {
      const { render } = useFeatureFlagRender('test-feature');
      
      return render(
        <div data-testid="feature-content">Feature Content</div>,
        <div data-testid="fallback-content">Fallback</div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    expect(screen.queryByTestId('feature-content')).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: true,
      error: null
    });

    const TestComponent = () => {
      const { render } = useFeatureFlagRender('test-feature');
      
      return render(
        <div data-testid="feature-content">Feature Content</div>,
        <div data-testid="fallback-content">Fallback</div>
      );
    };

    render(<TestComponent />);

    expect(screen.getByText('Loading feature...')).toBeInTheDocument();
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: false,
      error: new Error('API Error')
    });

    const TestComponent = () => {
      const { render } = useFeatureFlagRender('test-feature');
      
      return render(
        <div data-testid="feature-content">Feature Content</div>,
        <div data-testid="fallback-content">Fallback</div>
      );
    };

    render(<TestComponent />);

    expect(consoleSpy).toHaveBeenCalledWith('Feature flag error for test-feature:', expect.any(Error));
    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
