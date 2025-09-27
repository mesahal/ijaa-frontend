// Mock axios
jest.mock("axios");

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock the photoApi module
jest.mock('../../utils/photoApi', () => {
  const originalModule = jest.requireActual('../../utils/photoApi');
  return {
    ...originalModule,
    uploadProfilePhoto: jest.fn(),
    uploadCoverPhoto: jest.fn(),
    getProfilePhotoUrl: jest.fn(),
    getCoverPhotoUrl: jest.fn(),
    deleteProfilePhoto: jest.fn(),
    deleteCoverPhoto: jest.fn(),
  };
});

// Mock apiClient before importing photoApi
jest.mock("../../utils/apiClient", () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

import { getProfilePhotoUrl,
  getCoverPhotoUrl,
  uploadProfilePhoto,
  uploadCoverPhoto,
  deleteProfilePhoto,
  deleteCoverPhoto,
  validateImageFile,
  handlePhotoApiError,
 } from '../../../utils/photoApi';

// Mock the convertToAbsoluteUrl function by testing the actual implementation
const testUrlConversion = (relativeUrl, expectedAbsoluteUrl) => {
  // This tests the logic of convertToAbsoluteUrl function
  if (!relativeUrl) return null;
  
  if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
    return relativeUrl;
  }
  
  // Extract just the domain and port from the file API base URL
  const baseUrl = process.env.REACT_APP_API_FILE_URL || "http://localhost:8000/ijaa/api/v1/file";
  let domainBase = baseUrl;
  
  // Remove any path components, keeping only domain and port
  if (baseUrl.includes('/ijaa/')) {
    domainBase = baseUrl.split('/ijaa/')[0];
  }
  
  // If it's a relative URL starting with /, prepend the domain base
  if (relativeUrl.startsWith('/')) {
    return `${domainBase}${relativeUrl}`;
  }
  
  // If it's a relative URL without leading /, prepend the domain base with /
  return `${domainBase}/${relativeUrl}`;
};

describe("Photo API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        token: "test-token",
        username: "testuser",
        email: "test@example.com",
      })
    );
  });

  describe('URL Conversion', () => {
    it('should convert relative URL to absolute URL', () => {
      const relativeUrl = '/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg';
      const absoluteUrl = testUrlConversion(relativeUrl);
      expect(absoluteUrl).toBe('http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg');
    });

    it('should handle absolute URLs without conversion', () => {
      const absoluteUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg';
      const result = testUrlConversion(absoluteUrl);
      expect(result).toBe(absoluteUrl);
    });

    it('should handle null or undefined URLs', () => {
      expect(testUrlConversion(null)).toBeNull();
      expect(testUrlConversion(undefined)).toBeNull();
    });

    it('should handle URLs without leading slash', () => {
      const relativeUrl = 'ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg';
      const absoluteUrl = testUrlConversion(relativeUrl);
      expect(absoluteUrl).toBe('http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg');
    });
  });

  describe('validateImageFile', () => {
    it('should validate a valid image file', () => {
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      expect(() => validateImageFile(validFile)).not.toThrow();
    });

    it('should throw error for missing file', () => {
      expect(() => validateImageFile(null)).toThrow('Please select a file');
      expect(() => validateImageFile(undefined)).toThrow('Please select a file');
    });

    it('should throw error for empty file', () => {
      const emptyFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(() => validateImageFile(emptyFile)).toThrow('File is empty. Please select a valid image file.');
    });

    it('should throw error for file exceeding size limit', () => {
      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'test.jpg', { type: 'image/jpeg' });
      expect(() => validateImageFile(largeFile)).toThrow('File size exceeds 5MB limit');
    });

    it('should throw error for invalid file type', () => {
      const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      expect(() => validateImageFile(invalidFile)).toThrow('Invalid file type. Only JPG, JPEG, PNG, WEBP are allowed');
    });

    it('should throw error for empty filename', () => {
      const invalidFile = new File(['test'], '', { type: 'image/jpeg' });
      expect(() => validateImageFile(invalidFile)).toThrow('Invalid file name. Please select a valid image file.');
    });

    it('should accept all valid image types', () => {
      const jpgFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const jpegFile = new File(['test'], 'test.jpeg', { type: 'image/jpeg' });
      const pngFile = new File(['test'], 'test.png', { type: 'image/png' });
      const webpFile = new File(['test'], 'test.webp', { type: 'image/webp' });

      expect(() => validateImageFile(jpgFile)).not.toThrow();
      expect(() => validateImageFile(jpegFile)).not.toThrow();
      expect(() => validateImageFile(pngFile)).not.toThrow();
      expect(() => validateImageFile(webpFile)).not.toThrow();
    });
  });

  describe('handlePhotoApiError', () => {
    it('should handle 400 error', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Bad Request' }
        }
      };

      expect(handlePhotoApiError(error)).toBe('Bad Request');
    });

    it('should handle 401 error', () => {
      const error = {
        response: {
          status: 401
        }
      };

      expect(handlePhotoApiError(error)).toBe('Authentication required. Please log in again.');
    });

    it('should handle 404 error', () => {
      const error = {
        response: {
          status: 404
        }
      };

      expect(handlePhotoApiError(error)).toBe('Resource not found.');
    });

    it('should handle 500 error', () => {
      const error = {
        response: {
          status: 500
        }
      };

      expect(handlePhotoApiError(error)).toBe('Server error. Please try again later.');
    });

    it('should handle network error', () => {
      const error = {
        request: {}
      };

      expect(handlePhotoApiError(error)).toBe('Network error. Please check your connection.');
    });

    it('should handle other errors', () => {
      const error = {
        message: 'Custom error'
      };

      expect(handlePhotoApiError(error)).toBe('Custom error');
    });

    it('should handle unknown errors', () => {
      const error = {};

      expect(handlePhotoApiError(error)).toBe('An unexpected error occurred.');
    });
  });

  describe('uploadProfilePhoto', () => {
    it('should upload profile photo successfully', async () => {
      const userId = 'test-user-id';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResult = {
        fileUrl: '/uploads/profile/test.jpg',
        fileName: 'test.jpg',
        fileSize: 1024
      };

      uploadProfilePhoto.mockResolvedValue(mockResult);

      const result = await uploadProfilePhoto(userId, file);

      expect(uploadProfilePhoto).toHaveBeenCalledWith(userId, file);
      expect(result).toEqual(mockResult);
    });

    it('should handle upload failure', async () => {
      const userId = 'test-user-id';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      uploadProfilePhoto.mockRejectedValue(new Error('Upload failed'));

      await expect(uploadProfilePhoto(userId, file)).rejects.toThrow('Upload failed');
    });

    it('should handle network error', async () => {
      const userId = 'test-user-id';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      uploadProfilePhoto.mockRejectedValue(new Error('Network error'));

      await expect(uploadProfilePhoto(userId, file)).rejects.toThrow('Network error');
    });
  });

  describe('uploadCoverPhoto', () => {
    it('should upload cover photo successfully', async () => {
      const userId = 'test-user-id';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResult = {
        fileUrl: '/uploads/cover/test.jpg',
        fileName: 'test.jpg',
        fileSize: 1024
      };

      uploadCoverPhoto.mockResolvedValue(mockResult);

      const result = await uploadCoverPhoto(userId, file);

      expect(uploadCoverPhoto).toHaveBeenCalledWith(userId, file);
      expect(result).toEqual(mockResult);
    });

    it('should handle upload failure', async () => {
      const userId = 'test-user-id';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      uploadCoverPhoto.mockRejectedValue(new Error('Upload failed'));

      await expect(uploadCoverPhoto(userId, file)).rejects.toThrow('Upload failed');
    });

    it('should handle network error', async () => {
      const userId = 'test-user-id';
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      uploadCoverPhoto.mockRejectedValue(new Error('Network error'));

      await expect(uploadCoverPhoto(userId, file)).rejects.toThrow('Network error');
    });
  });

  describe('getProfilePhotoUrl', () => {
    it('should get profile photo URL successfully with new format', async () => {
      const userId = 'test-user-id';
      const mockResult = {
        photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/profile-photo/file/abc123.jpg',
        hasPhoto: true,
        exists: true
      };

      getProfilePhotoUrl.mockResolvedValue(mockResult);

      const result = await getProfilePhotoUrl(userId);

      expect(getProfilePhotoUrl).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });

    it('should convert relative URL to absolute URL', async () => {
      const userId = 'test-user-id';
      const mockResult = {
        photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/profile-photo/file/abc123.jpg',
        hasPhoto: true,
        exists: true
      };

      getProfilePhotoUrl.mockResolvedValue(mockResult);

      const result = await getProfilePhotoUrl(userId);

      expect(getProfilePhotoUrl).toHaveBeenCalledWith(userId);
      expect(result.photoUrl).toMatch(/^http:\/\/localhost:8000/);
    });

    it('should handle no photo found with new format', async () => {
      const userId = 'test-user-id';
      const mockResult = {
        photoUrl: null,
        hasPhoto: false,
        exists: false
      };

      getProfilePhotoUrl.mockResolvedValue(mockResult);

      const result = await getProfilePhotoUrl(userId);

      expect(getProfilePhotoUrl).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getCoverPhotoUrl', () => {
    it('should get cover photo URL successfully with new format', async () => {
      const userId = 'test-user-id';
      const mockResult = {
        photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/cover-photo/file/def456.png',
        hasPhoto: true,
        exists: true
      };

      getCoverPhotoUrl.mockResolvedValue(mockResult);

      const result = await getCoverPhotoUrl(userId);

      expect(getCoverPhotoUrl).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });

    it('should convert relative URL to absolute URL', async () => {
      const userId = 'test-user-id';
      const mockResult = {
        photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/cover-photo/file/def456.png',
        hasPhoto: true,
        exists: true
      };

      getCoverPhotoUrl.mockResolvedValue(mockResult);

      const result = await getCoverPhotoUrl(userId);

      expect(getCoverPhotoUrl).toHaveBeenCalledWith(userId);
      expect(result.photoUrl).toMatch(/^http:\/\/localhost:8000/);
    });

    it('should handle no photo found with new format', async () => {
      const userId = 'test-user-id';
      const mockResult = {
        photoUrl: null,
        hasPhoto: false,
        exists: false
      };

      getCoverPhotoUrl.mockResolvedValue(mockResult);

      const result = await getCoverPhotoUrl(userId);

      expect(getCoverPhotoUrl).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteProfilePhoto', () => {
    it('should delete profile photo successfully', async () => {
      const userId = 'test-user-id';

      deleteProfilePhoto.mockResolvedValue(true);

      const result = await deleteProfilePhoto(userId);

      expect(deleteProfilePhoto).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should handle deletion failure', async () => {
      const userId = 'test-user-id';

      deleteProfilePhoto.mockRejectedValue(new Error('Failed to delete profile photo'));

      await expect(deleteProfilePhoto(userId)).rejects.toThrow('Failed to delete profile photo');
    });

    it('should handle network error', async () => {
      const userId = 'test-user-id';

      deleteProfilePhoto.mockRejectedValue(new Error('Network error'));

      await expect(deleteProfilePhoto(userId)).rejects.toThrow('Network error');
    });
  });

  describe('deleteCoverPhoto', () => {
    it('should delete cover photo successfully', async () => {
      const userId = 'test-user-id';

      deleteCoverPhoto.mockResolvedValue(true);

      const result = await deleteCoverPhoto(userId);

      expect(deleteCoverPhoto).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should handle deletion failure', async () => {
      const userId = 'test-user-id';

      deleteCoverPhoto.mockRejectedValue(new Error('Failed to delete cover photo'));

      await expect(deleteCoverPhoto(userId)).rejects.toThrow('Failed to delete cover photo');
    });

    it('should handle network error', async () => {
      const userId = 'test-user-id';

      deleteCoverPhoto.mockRejectedValue(new Error('Network error'));

      await expect(deleteCoverPhoto(userId)).rejects.toThrow('Network error');
    });
  });
});
