import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
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
    loading: false
  })
}));

// Mock apiClient
jest.mock('../../utils/apiClient', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

import apiClient from '../../utils/apiClient';

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

    // Mock API responses
    apiClient.get.mockImplementation((url) => {
      if (url.includes('/profile/')) {
        return Promise.resolve({
          data: {
            data: mockUser
          }
        });
      } else if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: mockExperiences
          }
        });
      } else if (url.includes('/interests/')) {
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
      const editButton = screen.getByText('Edit');
      expect(editButton).toBeInTheDocument();
    });
  });

  test('enters edit mode when edit button is clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit');
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
      const editButton = screen.getByText('Edit');
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
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
    });
  });

  test('shows visibility toggle buttons for contact fields', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      // Check for visibility toggle buttons
      expect(screen.getAllByText('Visible')).toHaveLength(5); // All fields are visible by default
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn Profile')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Facebook Profile')).toBeInTheDocument();
    });
  });

  test('toggles visibility when visibility buttons are clicked', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit');
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
      const editButton = screen.getByText('Edit');
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
      expect(screen.getByText('LinkedIn Profile')).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Facebook Profile')).toBeInTheDocument();
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
      const editButton = screen.getByText('Edit');
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
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
    });
  });

  test('shows loading spinner initially', () => {
    render(<Profile />);
    
    // Check for the loading spinner by its class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  test('handles API errors gracefully', async () => {
    apiClient.get.mockRejectedValue(new Error('API Error'));

    render(<Profile />);

    await waitFor(() => {
      // Should not crash and should show some content
      expect(screen.getByText('Your Name')).toBeInTheDocument();
    });
  });

  test('updates profile with visibility settings when saving', async () => {
    render(<Profile />);

    await waitFor(() => {
      const editButton = screen.getByText('Edit');
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
      const editButton = screen.getByText('Edit');
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
      const editButton = screen.getByText('Edit');
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

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: singleExperience
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockUser
        }
      });
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

    apiClient.get.mockImplementation((url) => {
      if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: singleInterest
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockUser
        }
      });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Single Interest')).toBeInTheDocument();
    });
  });

  test('handles empty experiences array gracefully', async () => {
    apiClient.get.mockImplementation((url) => {
      if (url.includes('/experiences/')) {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockUser
        }
      });
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('No experience added yet. Click "Add Experience" to get started.')).toBeInTheDocument();
    });
  });

  test('handles empty interests array gracefully', async () => {
    apiClient.get.mockImplementation((url) => {
      if (url.includes('/interests/')) {
        return Promise.resolve({
          data: {
            data: []
          }
        });
      }
      return Promise.resolve({
        data: {
          data: mockUser
        }
      });
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
      expect(screen.getByText('Your Name')).toBeInTheDocument();
      expect(screen.getByText('Your Profession')).toBeInTheDocument();
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
      if (url.includes('/profile/')) {
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
      expect(screen.getByText('Your Profession')).toBeInTheDocument();
    });
  });
});
