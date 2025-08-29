import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCard from '../../components/UserCard';

// Mock the useFeatureFlag hook
jest.mock('../../hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn()
}));

import { useFeatureFlag } from '../../hooks/useFeatureFlag';

const mockUseFeatureFlag = useFeatureFlag;

describe('UserCard Component', () => {
  const mockUser = {
    userId: 'USER_123',
    name: 'John Doe',
    email: 'john@example.com',
    batch: 10,
    location: 'New York',
    bio: 'Software engineer with 5 years of experience',
    interests: ['JavaScript', 'React', 'Node.js'],
    connections: 25,
    isConnected: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show interests when feature flag is enabled', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: true,
      loading: false,
      error: null
    });

    render(<UserCard user={mockUser} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('should hide interests when feature flag is disabled', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: false,
      loading: false,
      error: null
    });

    render(<UserCard user={mockUser} />);

    expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('should call useFeatureFlag with correct feature name', () => {
    mockUseFeatureFlag.mockReturnValue({
      isEnabled: true,
      loading: false,
      error: null
    });

    render(<UserCard user={mockUser} />);

    expect(mockUseFeatureFlag).toHaveBeenCalledWith('user.interests', false);
  });
});
