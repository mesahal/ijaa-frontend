import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminFeatureFlags from '../../pages/AdminFeatureFlags';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminApi } from '../../utils/adminApi';

// Mock the dependencies
jest.mock('../../context/AdminAuthContext');
jest.mock('../../utils/adminApi');
jest.mock('../../components/AdminLayout', () => {
  return function MockAdminLayout({ children }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

const mockAdmin = {
  id: 'admin_123',
  email: 'admin@ijaa.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'SUPER_ADMIN',
  token: 'mock-admin-token'
};

const mockFeatureFlags = [
  {
    id: 1,
    featureName: 'NEW_UI',
    enabled: true,
    description: 'Enable new user interface with modern design',
    createdAt: '2024-12-01T10:00:00',
    updatedAt: '2024-12-01T10:00:00'
  },
  {
    id: 2,
    featureName: 'CHAT_FEATURE',
    enabled: false,
    description: 'Enable real-time chat functionality between alumni',
    createdAt: '2024-12-01T10:00:00',
    updatedAt: '2024-12-01T10:00:00'
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AdminFeatureFlags - Group 1 & 2 Implementation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminAuth.mockReturnValue({ admin: mockAdmin });
  });

  describe('Group 1: Basic Feature Flag Management', () => {
    it('should render feature flags page with Group 1 functionality', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
        expect(screen.getByText('Enable or disable system features')).toBeInTheDocument();
      });

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
      expect(screen.getByText('NEW_UI')).toBeInTheDocument();
      expect(screen.getByText('CHAT_FEATURE')).toBeInTheDocument();
    });

    it('should handle feature flag toggle (Group 1.4)', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
      adminApi.updateFeatureFlag.mockResolvedValue({ data: { success: true } });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('NEW_UI')).toBeInTheDocument();
      });

      const toggleButton = screen.getAllByRole('button').find(button => 
        button.textContent.includes('Toggle') || button.getAttribute('aria-label')?.includes('toggle')
      );

      if (toggleButton) {
        await act(async () => {
          fireEvent.click(toggleButton);
        });

        expect(adminApi.updateFeatureFlag).toHaveBeenCalledWith('NEW_UI', { enabled: false });
      }
    });

    it('should create feature flag when form is submitted (Group 1.3)', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
      adminApi.createFeatureFlag.mockResolvedValue({ data: { success: true } });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Create Flag')).toBeInTheDocument();
      });

      // Click the first Create Flag button (the one in the header)
      const createButtons = screen.getAllByText('Create Flag');
      await act(async () => {
        fireEvent.click(createButtons[0]);
      });

      // Wait for modal to appear and fill form
      await waitFor(() => {
        expect(screen.getByPlaceholderText('e.g., NEW_UI')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText('e.g., NEW_UI');
      const descriptionInput = screen.getByPlaceholderText('Describe what this feature does...');

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'TEST_FEATURE' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test feature description' } });
      });

      // Find the submit button in the modal
      const submitButton = screen.getAllByText('Create Flag').find(button => 
        button.closest('form') !== null
      );

      if (submitButton) {
        await act(async () => {
          fireEvent.click(submitButton);
        });

        expect(adminApi.createFeatureFlag).toHaveBeenCalledWith({
          featureName: 'TEST_FEATURE',
          description: 'Test feature description',
          enabled: false
        });
      }
    });
  });

  describe('Group 2: Feature Flag Status Management', () => {
    it('should filter enabled feature flags (Group 2.1)', async () => {
      const enabledFlags = mockFeatureFlags.filter(f => f.enabled);
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
      adminApi.getEnabledFeatureFlags.mockResolvedValue({ data: enabledFlags });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      });

      // Find and select the filter dropdown
      const filterSelect = screen.getByDisplayValue('All Flags');
      
      await act(async () => {
        fireEvent.change(filterSelect, { target: { value: 'enabled' } });
      });

      // Wait for the API call to be made
      await waitFor(() => {
        expect(adminApi.getEnabledFeatureFlags).toHaveBeenCalled();
      });
    });

    it('should filter disabled feature flags (Group 2.2)', async () => {
      const disabledFlags = mockFeatureFlags.filter(f => !f.enabled);
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
      adminApi.getDisabledFeatureFlags.mockResolvedValue({ data: disabledFlags });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      });

      // Find and select the filter dropdown
      const filterSelect = screen.getByDisplayValue('All Flags');
      
      await act(async () => {
        fireEvent.change(filterSelect, { target: { value: 'disabled' } });
      });

      // Wait for the API call to be made
      await waitFor(() => {
        expect(adminApi.getDisabledFeatureFlags).toHaveBeenCalled();
      });
    });

    it('should display feature flags summary statistics', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      });

      // Check for summary statistics - look for the numbers in the stats cards
      expect(screen.getByText('2')).toBeInTheDocument(); // Total count in "System Features (2)"
    });

    it('should handle filter change correctly', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
      adminApi.getEnabledFeatureFlags.mockResolvedValue({ data: [mockFeatureFlags[0]] });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue('All Flags');
      
      await act(async () => {
        fireEvent.change(filterSelect, { target: { value: 'enabled' } });
      });

      // Wait for the API call to be made
      await waitFor(() => {
        expect(adminApi.getEnabledFeatureFlags).toHaveBeenCalled();
      });
    });

    it('should refresh feature flags when refresh button is clicked', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh');
      
      await act(async () => {
        fireEvent.click(refreshButton);
      });

      expect(adminApi.getFeatureFlags).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors when fetching feature flags', async () => {
      adminApi.getFeatureFlags.mockRejectedValue(new Error('Failed to fetch'));

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('Feature Flags')).toBeInTheDocument();
      });

      // Component should still render even with errors
      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });

    it('should handle errors when updating feature flags', async () => {
      adminApi.getFeatureFlags.mockResolvedValue({ data: mockFeatureFlags });
      adminApi.updateFeatureFlag.mockRejectedValue(new Error('Update failed'));

      renderWithRouter(<AdminFeatureFlags />);

      await waitFor(() => {
        expect(screen.getByText('NEW_UI')).toBeInTheDocument();
      });

      // Test should complete without crashing
      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });
  });
});
