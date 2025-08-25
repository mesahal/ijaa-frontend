import { renderHook, waitFor, act } from '@testing-library/react';
import { useCurrentUserProfile } from '../../hooks/useCurrentUserProfile';
import apiClient from '../../utils/apiClient';

// Mock the dependencies
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: jest.fn(),
}));

jest.mock('../../utils/apiClient');

const mockUseUnifiedAuth = require('../../context/UnifiedAuthContext').useUnifiedAuth;

describe('useCurrentUserProfile', () => {
  const mockUser = {
    userId: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockProfileData = {
    userId: 'test-user-id',
    name: 'John Doe',
    profession: 'Software Engineer',
    location: 'New York',
    bio: 'Experienced developer',
    email: 'john@example.com',
    phone: '+1234567890',
    linkedIn: 'https://linkedin.com/in/johndoe',
    website: 'https://johndoe.com',
    batch: '2020',
    facebook: 'https://facebook.com/johndoe',
    connections: 150,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUnifiedAuth.mockReturnValue({ user: mockUser });
  });

  it('should fetch profile data successfully', async () => {
    const mockApiResponse = {
      data: {
        data: mockProfileData,
      },
    };

    apiClient.get.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCurrentUserProfile());

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
    expect(result.current.profileData).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledWith('/profile/test-user-id');
    expect(result.current.profileData).toEqual(mockProfileData);
    expect(result.current.error).toBe(null);
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    apiClient.get.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCurrentUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.profileData).toEqual({
      userId: 'test-user-id',
      name: 'Test User',
      profession: '',
      location: '',
      bio: '',
      phone: '',
      linkedIn: '',
      website: '',
      batch: '',
      facebook: '',
      email: 'test@example.com',
      connections: 0,
    });
  });

  it('should handle missing user ID', () => {
    mockUseUnifiedAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useCurrentUserProfile());

    expect(result.current.loading).toBe(false);
    expect(result.current.profileData).toBe(null);
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it('should handle invalid API response structure', async () => {
    const mockInvalidResponse = {
      data: {}, // Missing data property
    };

    apiClient.get.mockResolvedValue(mockInvalidResponse);

    const { result } = renderHook(() => useCurrentUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Invalid profile response structure');
  });

  it('should handle empty profile data', async () => {
    const mockEmptyResponse = {
      data: {
        data: null,
      },
    };

    apiClient.get.mockResolvedValue(mockEmptyResponse);

    const { result } = renderHook(() => useCurrentUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Invalid profile response structure');
  });

  it('should provide fallback values for missing profile fields', async () => {
    const mockPartialProfile = {
      userId: 'test-user-id',
      name: 'John Doe',
      // Missing other fields
    };

    const mockApiResponse = {
      data: {
        data: mockPartialProfile,
      },
    };

    apiClient.get.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCurrentUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profileData).toEqual({
      userId: 'test-user-id',
      name: 'John Doe',
      profession: '',
      location: '',
      bio: '',
      phone: '',
      linkedIn: '',
      website: '',
      batch: '',
      facebook: '',
      email: 'test@example.com',
      connections: 0,
    });
  });

  it('should refetch profile data when refetch is called', async () => {
    const mockApiResponse = {
      data: {
        data: mockProfileData,
      },
    };

    apiClient.get.mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useCurrentUserProfile());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Reset mock to track new call
    apiClient.get.mockClear();

    // Call refetch
    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiClient.get).toHaveBeenCalledWith('/profile/test-user-id');
  });
});

