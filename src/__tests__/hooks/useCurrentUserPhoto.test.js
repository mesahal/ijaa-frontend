import { renderHook, waitFor } from '@testing-library/react';
import { useCurrentUserPhoto } from '../../hooks/useCurrentUserPhoto';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { getProfilePhotoUrl } from '../../utils/photoApi';

// Mock the dependencies
jest.mock('../../context/UnifiedAuthContext');
jest.mock('../../utils/photoApi');

describe('useCurrentUserPhoto', () => {
  const mockUseUnifiedAuth = useUnifiedAuth;
  const mockGetProfilePhotoUrl = getProfilePhotoUrl;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when no user is logged in', () => {
    mockUseUnifiedAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useCurrentUserPhoto());

    expect(result.current.profilePhotoUrl).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasPhoto).toBe(false);
  });

  it('should fetch profile photo when user is logged in', async () => {
    const mockUser = { userId: 'test-user-id' };
    const mockPhotoResult = {
      photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/profile-photo/file/abc123.jpg',
      hasPhoto: true,
      exists: true
    };

    mockUseUnifiedAuth.mockReturnValue({ user: mockUser });
    mockGetProfilePhotoUrl.mockResolvedValue(mockPhotoResult);

    const { result } = renderHook(() => useCurrentUserPhoto());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.profilePhotoUrl).toBeNull();

    // Wait for the photo to be fetched
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetProfilePhotoUrl).toHaveBeenCalledWith('test-user-id');
    expect(result.current.profilePhotoUrl).toBe(mockPhotoResult.photoUrl);
    expect(result.current.hasPhoto).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle when user has no profile photo', async () => {
    const mockUser = { userId: 'test-user-id' };
    const mockPhotoResult = {
      photoUrl: null,
      hasPhoto: false,
      exists: false
    };

    mockUseUnifiedAuth.mockReturnValue({ user: mockUser });
    mockGetProfilePhotoUrl.mockResolvedValue(mockPhotoResult);

    const { result } = renderHook(() => useCurrentUserPhoto());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profilePhotoUrl).toBeNull();
    expect(result.current.hasPhoto).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors', async () => {
    const mockUser = { userId: 'test-user-id' };
    const mockError = new Error('Failed to fetch profile photo');

    mockUseUnifiedAuth.mockReturnValue({ user: mockUser });
    mockGetProfilePhotoUrl.mockRejectedValue(mockError);

    const { result } = renderHook(() => useCurrentUserPhoto());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profilePhotoUrl).toBeNull();
    expect(result.current.hasPhoto).toBe(false);
    expect(result.current.error).toBe('Failed to fetch profile photo');
  });

  it('should refetch when user ID changes', async () => {
    const mockUser1 = { userId: 'user-1' };
    const mockUser2 = { userId: 'user-2' };
    const mockPhotoResult = {
      photoUrl: 'http://localhost:8000/ijaa/api/v1/users/user-2/profile-photo/file/def456.jpg',
      hasPhoto: true,
      exists: true
    };

    mockUseUnifiedAuth.mockReturnValue({ user: mockUser1 });
    mockGetProfilePhotoUrl.mockResolvedValue(mockPhotoResult);

    const { result, rerender } = renderHook(() => useCurrentUserPhoto());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetProfilePhotoUrl).toHaveBeenCalledWith('user-1');

    // Change user
    mockUseUnifiedAuth.mockReturnValue({ user: mockUser2 });
    rerender();

    await waitFor(() => {
      expect(mockGetProfilePhotoUrl).toHaveBeenCalledWith('user-2');
    });
  });
});
