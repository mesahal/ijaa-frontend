import { renderHook, act } from '@testing-library/react';
import useEventBanner from '../../../hooks/events/useEventBanner';
import eventService from '../../../services/eventService';
import { useUnifiedAuth } from '../../../context/UnifiedAuthContext';

// Mock the eventService
jest.mock('../../../services/eventService');

// Mock the UnifiedAuthContext
jest.mock('../../../context/UnifiedAuthContext');

describe('useEventBanner', () => {
  const mockUser = {
    token: 'test-token',
    username: 'testuser'
  };

  const mockEventId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
    useUnifiedAuth.mockReturnValue({ user: mockUser });
  });

  describe('loadBannerUrl', () => {
    it('should load banner URL successfully', async () => {
      const mockResponse = {
        data: {
          exists: true,
          photoUrl: '/api/v1/events/123/banner/file/banner.jpg'
        }
      };
      eventService.getEventBannerUrl.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      expect(eventService.getEventBannerUrl).toHaveBeenCalledWith(mockEventId);
      expect(result.current.bannerUrl).toBe('http://localhost/api/v1/events/123/banner/file/banner.jpg');
      expect(result.current.bannerExists).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle banner not existing', async () => {
      const mockResponse = {
        data: {
          exists: false,
          photoUrl: null
        }
      };
      eventService.getEventBannerUrl.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      expect(result.current.bannerUrl).toBe(null);
      expect(result.current.bannerExists).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle API error', async () => {
      const mockError = new Error('API Error');
      eventService.getEventBannerUrl.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      expect(result.current.bannerUrl).toBe(null);
      expect(result.current.bannerExists).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('API Error');
    });

    it('should not load if no eventId or token', async () => {
      useUnifiedAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useEventBanner(null));

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      expect(eventService.getEventBannerUrl).not.toHaveBeenCalled();
      expect(result.current.bannerUrl).toBe(null);
      expect(result.current.bannerExists).toBe(false);
    });
  });

  describe('uploadBanner', () => {
    it('should upload banner successfully', async () => {
      const mockFile = new File(['test'], 'banner.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        data: {
          fileUrl: '/api/v1/events/123/banner/file/banner.jpg',
          fileName: 'banner.jpg',
          fileSize: 1024
        }
      };
      eventService.uploadEventBanner.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        await result.current.uploadBanner(mockFile);
      });

      expect(eventService.uploadEventBanner).toHaveBeenCalledWith(mockEventId, mockFile);
      expect(result.current.bannerUrl).toBe('http://localhost/api/v1/events/123/banner/file/banner.jpg');
      expect(result.current.bannerExists).toBe(true);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['test'], 'banner.jpg', { type: 'image/jpeg' });
      const mockError = new Error('Upload failed');
      eventService.uploadEventBanner.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        try {
          await result.current.uploadBanner(mockFile);
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Upload failed');
    });

    it('should throw error for missing parameters', async () => {
      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        try {
          await result.current.uploadBanner(null);
        } catch (error) {
          expect(error.message).toBe('Missing required parameters for banner upload');
        }
      });
    });
  });

  describe('deleteBanner', () => {
    it('should delete banner successfully', async () => {
      eventService.deleteEventBanner.mockResolvedValue({});

      const { result } = renderHook(() => useEventBanner(mockEventId));

      // Set initial state by calling loadBannerUrl first
      const mockResponse = {
        data: {
          exists: true,
          photoUrl: '/test/url'
        }
      };
      eventService.getEventBannerUrl.mockResolvedValue(mockResponse);

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      await act(async () => {
        await result.current.deleteBanner();
      });

      expect(eventService.deleteEventBanner).toHaveBeenCalledWith(mockEventId);
      expect(result.current.bannerUrl).toBe(null);
      expect(result.current.bannerExists).toBe(false);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle delete error', async () => {
      const mockError = new Error('Delete failed');
      eventService.deleteEventBanner.mockRejectedValue(mockError);

      const { result } = renderHook(() => useEventBanner(mockEventId));

      await act(async () => {
        try {
          await result.current.deleteBanner();
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Delete failed');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      const { result } = renderHook(() => useEventBanner(mockEventId));

      // Set error state by causing an error
      const mockError = new Error('Test error');
      eventService.getEventBannerUrl.mockRejectedValue(mockError);

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('getFullBannerUrl', () => {
    it('should return full URL for relative path', async () => {
      const { result } = renderHook(() => useEventBanner(mockEventId));

      // Mock window.location.origin
      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true
      });

      const mockResponse = {
        data: {
          exists: true,
          photoUrl: '/api/v1/events/123/banner/file/banner.jpg'
        }
      };
      eventService.getEventBannerUrl.mockResolvedValue(mockResponse);

      await act(async () => {
        await result.current.loadBannerUrl();
      });

      expect(result.current.bannerUrl).toBe('http://localhost:3000/api/v1/events/123/banner/file/banner.jpg');
    });

    it('should return URL as is for absolute URL', () => {
      const { result } = renderHook(() => useEventBanner(mockEventId));

      act(() => {
        result.current.bannerUrl = 'https://example.com/banner.jpg';
      });

      expect(result.current.bannerUrl).toBe('https://example.com/banner.jpg');
    });

    it('should return null for no URL', () => {
      const { result } = renderHook(() => useEventBanner(mockEventId));

      expect(result.current.bannerUrl).toBe(null);
    });
  });
});
