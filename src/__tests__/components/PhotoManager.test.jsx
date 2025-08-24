import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { 
  PhotoDisplay, 
  ProfilePhotoUploadButton, 
  CoverPhotoUploadButton,
  usePhotoManager 
} from '../../components/PhotoManager';

// Mock the photoApi functions
jest.mock('../../utils/photoApi', () => ({
  getProfilePhotoUrl: jest.fn(),
  getCoverPhotoUrl: jest.fn(),
  uploadProfilePhoto: jest.fn(),
  uploadCoverPhoto: jest.fn(),
  deleteProfilePhoto: jest.fn(),
  deleteCoverPhoto: jest.fn(),
  validateImageFile: jest.fn(),
  handlePhotoApiError: jest.fn()
}));

import {
  getProfilePhotoUrl,
  getCoverPhotoUrl,
  uploadProfilePhoto,
  uploadCoverPhoto
} from '../../utils/photoApi';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('PhotoManager Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock user data in localStorage
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      token: 'test-token',
      username: 'testuser',
      email: 'test@example.com'
    }));
  });

  describe('PhotoDisplay', () => {
    it('should display profile photo with correct URL', () => {
      const photoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg';
      
      render(
        <PhotoDisplay
          photoUrl={photoUrl}
          alt="Test Profile"
          type="profile"
          className="w-32 h-32 rounded-full"
        />
      );

      const img = screen.getByAltText('Test Profile');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', photoUrl);
      expect(img).toHaveClass('w-32', 'h-32', 'rounded-full');
    });

    it('should display cover photo with correct URL', () => {
      const photoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/def456.png';
      
      render(
        <PhotoDisplay
          photoUrl={photoUrl}
          alt="Test Cover"
          type="cover"
          className="w-full h-48 object-cover"
        />
      );

      const img = screen.getByAltText('Test Cover');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', photoUrl);
      expect(img).toHaveClass('w-full', 'h-48', 'object-cover');
    });

    it('should use fallback image when photoUrl is null', () => {
      render(
        <PhotoDisplay
          photoUrl={null}
          alt="Test Profile"
          type="profile"
        />
      );

      const img = screen.getByAltText('Test Profile');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/dp.png');
    });

    it('should use fallback image when photoUrl is empty string', () => {
      render(
        <PhotoDisplay
          photoUrl=""
          alt="Test Cover"
          type="cover"
        />
      );

      const img = screen.getByAltText('Test Cover');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/cover-image.jpg');
    });

    it('should handle image error and show fallback', async () => {
      const photoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/invalid.jpg';
      
      render(
        <PhotoDisplay
          photoUrl={photoUrl}
          alt="Test Profile"
          type="profile"
        />
      );

      const img = screen.getByAltText('Test Profile');
      expect(img).toHaveAttribute('src', photoUrl);

      // Simulate image load error
      fireEvent.error(img);

      await waitFor(() => {
        expect(img).toHaveAttribute('src', '/dp.png');
      });
    });
  });

  describe('ProfilePhotoUploadButton', () => {
    it('should not render when not in editing mode', () => {
      const onPhotoUpdate = jest.fn();
      
      render(
        <ProfilePhotoUploadButton
          userId="test-user"
          onPhotoUpdate={onPhotoUpdate}
          isEditing={false}
        />
      );

      expect(screen.queryByLabelText('Change profile photo')).not.toBeInTheDocument();
    });

    it('should render when in editing mode', () => {
      const onPhotoUpdate = jest.fn();
      
      render(
        <ProfilePhotoUploadButton
          userId="test-user"
          onPhotoUpdate={onPhotoUpdate}
          isEditing={true}
        />
      );

      const button = screen.getByLabelText('Change profile photo');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('absolute', 'bottom-0', 'right-0', 'rounded-full');
    });

    it('should handle file selection', async () => {
      const onFileUpload = jest.fn();
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      render(
        <ProfilePhotoUploadButton
          userId="test-user"
          onFileUpload={onFileUpload}
          isEditing={true}
        />
      );

      const button = screen.getByLabelText('Change profile photo');
      fireEvent.click(button);

      // The file input should be triggered
      await waitFor(() => {
        expect(onFileUpload).not.toHaveBeenCalled(); // Not called until file is selected
      });
    });
  });

  describe('CoverPhotoUploadButton', () => {
    it('should not render when not in editing mode', () => {
      const onPhotoUpdate = jest.fn();
      
      render(
        <CoverPhotoUploadButton
          userId="test-user"
          onPhotoUpdate={onPhotoUpdate}
          isEditing={false}
        />
      );

      expect(screen.queryByLabelText('Change cover photo')).not.toBeInTheDocument();
    });

    it('should render when in editing mode', () => {
      const onPhotoUpdate = jest.fn();
      
      render(
        <CoverPhotoUploadButton
          userId="test-user"
          onPhotoUpdate={onPhotoUpdate}
          isEditing={true}
        />
      );

      const button = screen.getByLabelText('Change cover photo');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-white/20', 'text-white', 'p-2', 'rounded-lg', 'hover:bg-white/30', 'transition-colors');
    });
  });

  describe('usePhotoManager hook', () => {
    it('should load photos successfully with new API format', async () => {
      const mockProfileData = {
        photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg',
        hasPhoto: true,
        exists: true
      };

      const mockCoverData = {
        photoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/def456.png',
        hasPhoto: true,
        exists: true
      };

      getProfilePhotoUrl.mockResolvedValue(mockProfileData);
      getCoverPhotoUrl.mockResolvedValue(mockCoverData);

      // Create a test component to use the hook
      const TestComponent = () => {
        const photoManager = usePhotoManager({ userId: 'test-user' });
        return (
          <div>
            <div data-testid="profile-url">{photoManager.profilePhotoUrl || 'no-profile'}</div>
            <div data-testid="cover-url">{photoManager.coverPhotoUrl || 'no-cover'}</div>
            <div data-testid="loading">{photoManager.loading ? 'loading' : 'loaded'}</div>
            <div data-testid="error">{photoManager.error || 'no-error'}</div>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });

      expect(screen.getByTestId('profile-url')).toHaveTextContent(mockProfileData.photoUrl);
      expect(screen.getByTestId('cover-url')).toHaveTextContent(mockCoverData.photoUrl);
      expect(screen.getByTestId('error')).toHaveTextContent('no-error');
    });

    it('should handle photo loading errors gracefully', async () => {
      getProfilePhotoUrl.mockRejectedValue(new Error('Failed to load profile photo'));
      getCoverPhotoUrl.mockRejectedValue(new Error('Failed to load cover photo'));

      const TestComponent = () => {
        const photoManager = usePhotoManager({ userId: 'test-user' });
        return (
          <div>
            <div data-testid="profile-url">{photoManager.profilePhotoUrl || 'no-profile'}</div>
            <div data-testid="cover-url">{photoManager.coverPhotoUrl || 'no-cover'}</div>
            <div data-testid="loading">{photoManager.loading ? 'loading' : 'loaded'}</div>
            <div data-testid="error">{photoManager.error || 'no-error'}</div>
          </div>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('loaded');
      });

      expect(screen.getByTestId('profile-url')).toHaveTextContent('no-profile');
      expect(screen.getByTestId('cover-url')).toHaveTextContent('no-cover');
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load photos');
    });

    it('should handle file upload successfully', async () => {
      const mockUploadResult = {
        fileUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/new123.jpg'
      };

      uploadProfilePhoto.mockResolvedValue(mockUploadResult);

      const onPhotoUpdate = jest.fn();

      const TestComponent = () => {
        const photoManager = usePhotoManager({ 
          userId: 'test-user',
          onPhotoUpdate 
        });

        const handleUpload = () => {
          const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
          photoManager.handleFileUpload(file, 'profile');
        };

        return (
          <div>
            <button onClick={handleUpload} data-testid="upload-btn">Upload</button>
            <div data-testid="profile-url">{photoManager.profilePhotoUrl || 'no-profile'}</div>
          </div>
        );
      };

      render(<TestComponent />);

      const uploadButton = screen.getByTestId('upload-btn');
      fireEvent.click(uploadButton);

      await waitFor(() => {
        expect(uploadProfilePhoto).toHaveBeenCalledWith('test-user', expect.any(File));
      });

      await waitFor(() => {
        expect(onPhotoUpdate).toHaveBeenCalledWith('profile', mockUploadResult.fileUrl);
      });
    });
  });
});
