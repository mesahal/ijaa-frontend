import React from 'react';
import { render, screen, fireEvent, waitFor  } from '../../../utils/test-utils';
import Profile from '../../pages/Profile';

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext', () => ({
  useUnifiedAuth: () => ({
    user: {
      userId: 'USER_123456',
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com',
      profession: 'Software Engineer',
      location: 'New York, NY',
      bio: 'A passionate developer',
      phone: '+1-555-123-4567',
      linkedIn: 'https://linkedin.com/in/testuser',
      website: 'https://testuser.dev',
      batch: '2020',
      facebook: 'https://facebook.com/testuser',
      connections: 150,
      showPhone: true,
      showLinkedIn: true,
      showWebsite: true,
      showEmail: true,
      showFacebook: true
    },
    isAuthenticated: true,
    loading: false,
    signOut: jest.fn()
  })
}));

// Mock apiClient
const mockApiClient = {
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
};

const mockChangeUserPassword = jest.fn();

jest.mock('../../utils/apiClient', () => ({
  __esModule: true,
  default: mockApiClient,
  changeUserPassword: mockChangeUserPassword,
}));

import apiClient, { changeUserPassword } from '../../utils/apiClient';

// Mock the PhotoManager components
jest.mock('../../components/PhotoManager', () => {
  let mockProfilePhotoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg';
  let mockCoverPhotoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/def456.png';

  return {
    PhotoDisplay: ({ photoUrl, alt, type, className }) => (
      <img 
        src={photoUrl || (type === 'profile' ? '/dp.png' : '/cover-image.jpg')} 
        alt={alt} 
        className={className}
        data-testid={`${type}-photo`}
      />
    ),
    ProfilePhotoUploadButton: ({ userId, onPhotoUpdate, isEditing, onFileUpload }) => {
      if (!isEditing) return null;
      return (
        <button 
          data-testid="profile-photo-upload"
          onClick={() => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            if (onFileUpload) onFileUpload(file, 'profile');
            if (onPhotoUpdate) {
              mockProfilePhotoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/new.jpg';
              onPhotoUpdate('profile', mockProfilePhotoUrl);
            }
          }}
        >
          Upload Profile Photo
        </button>
      );
    },
    CoverPhotoUploadButton: ({ userId, onPhotoUpdate, isEditing, onFileUpload }) => {
      if (!isEditing) return null;
      return (
        <button 
          data-testid="cover-photo-upload"
          onClick={() => {
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            if (onFileUpload) onFileUpload(file, 'cover');
            if (onPhotoUpdate) {
              mockCoverPhotoUrl = 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/new.jpg';
              onPhotoUpdate('cover', mockCoverPhotoUrl);
            }
          }}
        >
          Upload Cover Photo
        </button>
      );
    },
    usePhotoManager: ({ userId, onPhotoUpdate }) => ({
      profilePhotoUrl: mockProfilePhotoUrl,
      coverPhotoUrl: mockCoverPhotoUrl,
      loading: false,
      error: null,
      handleFileUpload: jest.fn(),
      reloadPhotos: jest.fn()
    })
  };
});

describe('Profile', () => {
  const mockUser = {
    userId: 'USER_123456',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    profession: 'Software Engineer',
    location: 'New York, NY',
    bio: 'A passionate developer',
    phone: '+1-555-123-4567',
    linkedIn: 'https://linkedin.com/in/testuser',
    website: 'https://testuser.dev',
    batch: '2020',
    facebook: 'https://facebook.com/testuser',
    connections: 150,
    showPhone: true,
    showLinkedIn: true,
    showWebsite: true,
    showEmail: true,
    showFacebook: true
  };

  const mockExperiences = [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'Tech Corp',
      period: '2022-2024',
      description: 'Led development team'
    }
  ];

  const mockInterests = [
    {
      id: 1,
      interest: 'Machine Learning'
    }
  ];

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Default API responses
    apiClient.get.mockImplementation((url) => {
      if (url === '/profile/USER_123456') {
        return Promise.resolve({
          data: {
            data: mockUser
          }
        });
      } else if (url === '/experiences/USER_123456') {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      } else if (url === '/interests/USER_123456') {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    apiClient.put.mockResolvedValue({
      data: {
        data: mockUser
      }
    });

    apiClient.post.mockResolvedValue({
      data: {
        data: { id: 2, interest: 'New Interest' }
      }
    });

    apiClient.delete.mockResolvedValue({
      data: {
        message: 'Deleted successfully'
      }
    });

    // Mock changeUserPassword function
    apiClient.changeUserPassword = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders profile with user information', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('New York, NY')).toBeInTheDocument();
      expect(screen.getByText('A passionate developer')).toBeInTheDocument();
    });
  });

  test('renders user avatar', async () => {
    render(<Profile />);

    await waitFor(() => {
      const avatar = screen.getByAltText('Test User');
      expect(avatar).toBeInTheDocument();
    });
  });

  test('displays batch information in hero section', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Batch 2020')).toBeInTheDocument();
    });
  });

  test('displays connections count from API', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });
  });

  test('shows edit button when not editing', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      expect(editButton).toBeInTheDocument();
    });
  });

  test('enters edit mode when edit button is clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument();
      expect(screen.getByDisplayValue('New York, NY')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2020')).toBeInTheDocument();
    });
  });

  test('shows all contact fields in edit mode', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      // Check for all contact fields
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+1-555-123-4567')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://linkedin.com/in/testuser')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://testuser.dev')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://facebook.com/testuser')).toBeInTheDocument();
    });
  });

  test('shows section headers in edit mode', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
      expect(screen.getAllByText('Contact Information')).toHaveLength(2); // One in edit mode, one in sidebar
    });
  });

  test('shows visibility toggle buttons for contact fields', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      // Check for visibility toggle buttons
      expect(screen.getAllByText('Visible')).toHaveLength(5); // All fields are visible by default
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn Profile')).toBeInTheDocument();
      expect(screen.getAllByText('Website')).toHaveLength(2); // One in edit mode, one in sidebar
      expect(screen.getByText('Facebook Profile')).toBeInTheDocument();
    });
  });

  test('toggles visibility when visibility buttons are clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const emailVisibilityButton = screen.getByText('Email Address').closest('div').querySelector('button');
      fireEvent.click(emailVisibilityButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Hidden')).toBeInTheDocument();
    });
  });

  test('shows save and cancel buttons when editing', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('displays contact information based on visibility settings', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('+1-555-123-4567')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
    });
  });

  test('displays experiences', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Senior Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
      expect(screen.getByText('2022-2024')).toBeInTheDocument();
      expect(screen.getByText('Led development team')).toBeInTheDocument();
    });
  });

  test('displays interests', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    });
  });

  test('shows add experience form when add button is clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const addButton = screen.getAllByText('Add Experience')[0];
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      // Check for the form title (h4 element) specifically
      const formTitle = screen.getByRole('heading', { name: 'Add Experience' });
      expect(formTitle).toBeInTheDocument();
    });
  });

  test('shows add interest form when add button is clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const addButton = screen.getAllByText('Add Interest')[0];
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      // Check for the form title (h4 element) specifically
      const formTitle = screen.getByRole('heading', { name: 'Add Interest' });
      expect(formTitle).toBeInTheDocument();
    });
  });

  test('handles experience deletion', async () => {
    render(<Profile />);

    await waitFor(() => {
      // Find the delete button by test ID
      const deleteButton = screen.getByTestId('delete-experience-1');
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/experiences/1');
    });
  });

  test('validates required fields when saving', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const nameInput = screen.getByDisplayValue('Test User');
      fireEvent.change(nameInput, { target: { value: '' } });
      
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  test('cancels edit mode when cancel button is clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
    });
  });

  test('shows loading spinner initially', () => {
    render(<Profile />);
    
    // Check for the loading state by its class
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    apiClient.get.mockRejectedValue(new Error('API Error'));

    render(<Profile />);

    await waitFor(() => {
      // Should not crash and should show some content
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  test('updates profile with visibility settings when saving', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith('/profile', expect.objectContaining({
        userId: 'USER_123456',
        showPhone: true,
        showLinkedIn: true,
        showWebsite: true,
        showEmail: true,
        showFacebook: true
      }));
    });
  });

  test('displays bio field with proper styling in edit mode', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const bioTextarea = screen.getByDisplayValue('A passionate developer');
      expect(bioTextarea).toBeInTheDocument();
      expect(bioTextarea.tagName).toBe('TEXTAREA');
      expect(bioTextarea).toHaveAttribute('rows', '4');
    });
  });

  test('displays experience description field with proper styling', async () => {
    render(<Profile />);
    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });
    await waitFor(() => {
      const addExperienceButton = screen.getByText('Add Experience');
      fireEvent.click(addExperienceButton);
    });
    await waitFor(() => {
      const descriptionField = screen.getByPlaceholderText('Describe your role and achievements...');
      expect(descriptionField).toHaveClass('w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200');
    });
  });

  test('handles single experience object response correctly', async () => {
    const singleExperience = {
      id: 1,
      title: 'Single Experience',
      company: 'Single Company',
      period: '2023-2024',
      description: 'Single description'
    };

    // Mock API to return single experience object for experiences endpoint
    apiClient.get.mockImplementation((url) => {
      if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: singleExperience
          }
        });
      } else if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: mockUser
          }
        });
      } else if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Single Experience')).toBeInTheDocument();
      expect(screen.getByText('Single Company')).toBeInTheDocument();
    });
  });

  test('handles single interest object response correctly', async () => {
    const singleInterest = {
      id: 1,
      interest: 'Single Interest'
    };

    // Mock API to return single interest object for interests endpoint
    apiClient.get.mockImplementation((url) => {
      if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: singleInterest
          }
        });
      } else if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: mockUser
          }
        });
      } else if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Single Interest')).toBeInTheDocument();
    });
  });

  test('handles empty experiences array gracefully', async () => {
    // Mock API to return empty array for experiences
    apiClient.get.mockImplementation((url) => {
      if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      } else if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: mockUser
          }
        });
      } else if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('No experience added yet. Click "Add Experience" to get started.')).toBeInTheDocument();
    });
  });

  test('handles empty interests array gracefully', async () => {
    // Mock API to return empty array for interests
    apiClient.get.mockImplementation((url) => {
      if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      } else if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: mockUser
          }
        });
      } else if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('No interests added yet. Click "Add Interest" to get started.')).toBeInTheDocument();
    });
  });

  test('sets default profile data on API error', async () => {
    apiClient.get.mockRejectedValue(new Error('API Error'));

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });

  test('renders with consistent cover image width', async () => {
    render(<Profile />);

    await waitFor(() => {
      const container = screen.getByText('Test User').closest('.max-w-4xl');
      expect(container).toBeInTheDocument();
    });
  });

  test('handles profile data with missing fields gracefully', async () => {
    const incompleteProfile = {
      userId: 'USER_123456',
      name: 'Test User',
      // Missing other fields
    };

    apiClient.get.mockImplementation((url) => {
      if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: incompleteProfile
          }
        });
      }
      return Promise.resolve({
        data: {
          data: []
        }
      });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });

  test('displays user information from API response', async () => {
    // Mock API response with complete profile data
    apiClient.get.mockImplementation((url) => {
      if (url === '/profile') {
        return Promise.resolve({
          data: {
            data: {
              userId: 'USER_123456',
              name: 'API Test User',
              profession: 'API Software Engineer',
              location: 'API New York, NY',
              bio: 'API bio from backend',
              phone: '+1-555-API-1234',
              linkedIn: 'https://linkedin.com/in/apitestuser',
              website: 'https://apitestuser.dev',
              batch: '2021',
              facebook: 'https://facebook.com/apitestuser',
              email: 'api@test.com',
              connections: 200,
              showPhone: true,
              showLinkedIn: true,
              showWebsite: true,
              showEmail: true,
              showFacebook: true
            }
          }
        });
      } else if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      } else if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      // Should show API data instead of user context data
      expect(screen.getByText('API Test User')).toBeInTheDocument();
      expect(screen.getByText('API Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('API New York, NY')).toBeInTheDocument();
      expect(screen.getByText('API bio from backend')).toBeInTheDocument();
      expect(screen.getByText('Batch 2021')).toBeInTheDocument();
    });
  });

  test('handles invalid API response structure gracefully', async () => {
    // Mock API to return invalid response structure
    apiClient.get.mockImplementation((url) => {
      if (url === '/profile') {
        return Promise.resolve({
          data: null // Invalid structure
        });
      } else if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      } else if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      // Should fall back to user context data
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });

  test('handles missing data property in API response', async () => {
    // Mock API to return response without data property
    apiClient.get.mockImplementation((url) => {
      if (url === '/profile') {
        return Promise.resolve({
          data: {
            // Missing data property
          }
        });
      } else if (url === '/experiences') {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      } else if (url === '/interests') {
        return Promise.resolve({
          data: {
            data: mockInterests
          }
        });
      }
      return Promise.resolve({ data: { data: [] } });
    });

    render(<Profile />);

    await waitFor(() => {
      // Should fall back to user context data
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    });
  });

  test('displays profile photo with correct URL from API', async () => {
    render(<Profile />);

    await waitFor(() => {
      const profilePhoto = screen.getByTestId('profile-photo');
      expect(profilePhoto).toBeInTheDocument();
      expect(profilePhoto).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/abc123.jpg');
      expect(profilePhoto).toHaveAttribute('alt', 'Test User');
    });
  });

  test('displays cover photo with correct URL from API', async () => {
    render(<Profile />);

    await waitFor(() => {
      const coverPhoto = screen.getByTestId('cover-photo');
      expect(coverPhoto).toBeInTheDocument();
      expect(coverPhoto).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/def456.png');
      expect(coverPhoto).toHaveAttribute('alt', 'Cover');
    });
  });

  test('shows photo upload buttons when in edit mode', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('profile-photo-upload')).toBeInTheDocument();
      expect(screen.getByTestId('cover-photo-upload')).toBeInTheDocument();
    });
  });

  test('does not show photo upload buttons when not in edit mode', async () => {
    render(<Profile />);

    await waitFor(() => {
      expect(screen.queryByTestId('profile-photo-upload')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cover-photo-upload')).not.toBeInTheDocument();
    });
  });

  test('handles profile photo upload', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const uploadButton = screen.getByTestId('profile-photo-upload');
      fireEvent.click(uploadButton);
    });

    // The mock should handle the upload and update the photo URL
    await waitFor(() => {
      const profilePhoto = screen.getByTestId('profile-photo');
      expect(profilePhoto).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/profile-photo/file/new.jpg');
    });
  });

  test('handles cover photo upload', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit Profile');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const uploadButton = screen.getByTestId('cover-photo-upload');
      fireEvent.click(uploadButton);
    });

    // The mock should handle the upload and update the photo URL
    await waitFor(() => {
      const coverPhoto = screen.getByTestId('cover-photo');
      expect(coverPhoto).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user/cover-photo/file/new.jpg');
    });
  });

  describe('Password Change Functionality', () => {
    beforeEach(async () => {
      apiClient.get.mockResolvedValue({ data: { data: mockUser } });
      render(<Profile />);
      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
      });
    });

    it('should render password change section in sidebar', () => {
      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });

    it('should show password change form', () => {
      expect(screen.getByPlaceholderText('Enter current password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /update password/i })).toBeInTheDocument();
    });

    it('should validate password form fields', async () => {
      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      // Wait for validation to complete
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/required|password/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should validate password length', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'oldpass' } });
      fireEvent.change(newPasswordInput, { target: { value: 'short' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should validate that new password is different from current password', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'samepassword' } });
      fireEvent.change(newPasswordInput, { target: { value: 'samepassword' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'samepassword' } });

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New password must be different from current password')).toBeInTheDocument();
      });
    });

    it('should successfully change password with valid data', async () => {
      // Mock the changeUserPassword function
      mockChangeUserPassword.mockResolvedValue({ success: true });

      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'OldPassword123!' } });
      fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123!' } });

      // Verify the form is filled correctly
      expect(currentPasswordInput).toHaveValue('OldPassword123!');
      expect(newPasswordInput).toHaveValue('NewPassword123!');
      expect(confirmPasswordInput).toHaveValue('NewPassword123!');

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      // Wait for the form submission to complete
      await waitFor(() => {
        expect(mockChangeUserPassword).toHaveBeenCalledWith({
          currentPassword: 'OldPassword123!',
          newPassword: 'NewPassword123!',
          confirmPassword: 'NewPassword123!'
        });
      }, { timeout: 3000 });
    });

    it('should validate password complexity requirements', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      // Test password without uppercase letter
      fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123!' } });

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New password must contain at least one uppercase letter')).toBeInTheDocument();
      });
    });

    it('should validate password length maximum', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      // Test password that's too long
      const longPassword = 'a'.repeat(129);
      fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
      fireEvent.change(newPasswordInput, { target: { value: longPassword } });
      fireEvent.change(confirmPasswordInput, { target: { value: longPassword } });

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New password must be less than 128 characters')).toBeInTheDocument();
      });
    });



    it('should clear form after successful password change', async () => {
      mockChangeUserPassword.mockResolvedValue({ success: true });

      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'OldPassword123!' } });
      fireEvent.change(newPasswordInput, { target: { value: 'NewPassword123!' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'NewPassword123!' } });

      const submitButton = screen.getByRole('button', { name: /update password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(currentPasswordInput).toHaveValue('');
        expect(newPasswordInput).toHaveValue('');
        expect(confirmPasswordInput).toHaveValue('');
      });
    });

    it('should show password visibility toggle buttons', () => {
      // Look for eye icons by their role and aria-label
      const visibilityButtons = screen.getAllByRole('button');
      const eyeButtons = visibilityButtons.filter(button => 
        button.querySelector('svg') && 
        button.querySelector('svg').getAttribute('class')?.includes('h-4 w-4')
      );

      expect(eyeButtons.length).toBeGreaterThan(0);
    });
  });


});
