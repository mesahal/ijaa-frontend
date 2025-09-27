import { renderHook, waitFor } from '@testing-library/react';
import { useUserPhoto } from '../../hooks/useUserPhoto';
import { getProfilePhotoUrl  } from '../../../utils/photoApi';

// Mock the dependencies
jest.mock('../../utils/photoApi');

describe('useUserPhoto', () => {
  const mockGetProfilePhotoUrl = getProfilePhotoUrl;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no userId is provided', () => {
    const { result } = renderHook(() => useUserPhoto(null));

    expect(result.current.profilePhotoUrl).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasPhoto).toBe(false);
  });

  it('should fetch profile photo when userId is provided', async () => {
    const userId = 'test-user-id';
    const mockPhotoResult = {
      photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/profile-photo/file/abc123.jpg',
      hasPhoto: true,
      exists: true
    };

    mockGetProfilePhotoUrl.mockResolvedValue(mockPhotoResult);

    const { result } = renderHook(() => useUserPhoto(userId));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.profilePhotoUrl).toBeNull();

    // Wait for the photo to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetProfilePhotoUrl).toHaveBeenCalledWith(userId);
    expect(result.current.profilePhotoUrl).toBe(mockPhotoResult.photoUrl);
    expect(result.current.hasPhoto).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle when user has no profile photo', async () => {
    const userId = 'test-user-id';
    const mockPhotoResult = {
      photoUrl: null,
      hasPhoto: false,
      exists: false
    };

    mockGetProfilePhotoUrl.mockResolvedValue(mockPhotoResult);

    const { result } = renderHook(() => useUserPhoto(userId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profilePhotoUrl).toBeNull();
    expect(result.current.hasPhoto).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors', async () => {
    const userId = 'test-user-id';
    const mockError = new Error('Failed to fetch profile photo');

    mockGetProfilePhotoUrl.mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserPhoto(userId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profilePhotoUrl).toBeNull();
    expect(result.current.hasPhoto).toBe(false);
    expect(result.current.error).toBe('Failed to fetch profile photo');
  });

  it('should refetch when userId changes', async () => {
    const userId1 = 'user-1';
    const userId2 = 'user-2';
    const mockPhotoResult = {
      photoUrl: 'http://localhost:8000/ijaa/api/v1/users/user-2/profile-photo/file/def456.jpg',
      hasPhoto: true,
      exists: true
    };

    mockGetProfilePhotoUrl.mockResolvedValue(mockPhotoResult);

    const { result, rerender } = renderHook(({ userId }) => useUserPhoto(userId), {
      initialProps: { userId: userId1 }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetProfilePhotoUrl).toHaveBeenCalledWith(userId1);

    // Change userId
    rerender({ userId: userId2 });

    await waitFor(() => {
      expect(mockGetProfilePhotoUrl).toHaveBeenCalledWith(userId2);
    });
  });
});
