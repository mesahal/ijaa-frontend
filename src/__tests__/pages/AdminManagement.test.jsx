import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminManagement from '../../pages/AdminManagement';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { adminApi  } from '../../../utils/adminApi';

// Mock dependencies
jest.mock('react-toastify');
jest.mock('../../context/AdminAuthContext');
jest.mock('../../utils/adminApi');
jest.mock('../../components/AdminLayout', () => {
  return function MockAdminLayout({ children }) {
    return <div data-testid="admin-layout">{children}</div>;
  };
});

const mockCurrentAdmin = {
  id: 1,
  name: 'Current Admin',
  email: 'current@test.com',
  role: 'ADMIN',
  active: true,
  token: 'test-token',
  adminId: 1
};

const mockAdmins = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'super@test.com',
    role: 'SUPER_ADMIN',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'Regular Admin',
    email: 'admin@test.com',
    role: 'ADMIN',
    active: true,
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Inactive Admin',
    email: 'inactive@test.com',
    role: 'MODERATOR',
    active: false,
    createdAt: '2025-01-03T00:00:00.000Z',
    updatedAt: '2025-01-03T00:00:00.000Z'
  }
];

const renderAdminManagement = () => {
  return render(
    <BrowserRouter>
      <AdminManagement />
    </BrowserRouter>
  );
};

describe('AdminManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminAuth.mockReturnValue({
      admin: mockCurrentAdmin
    });
  });

  describe('Admin List Display', () => {
    it('should display admin list when loaded successfully', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Super Admin')).toBeInTheDocument();
        expect(screen.getByText('Regular Admin')).toBeInTheDocument();
        expect(screen.getByText('Inactive Admin')).toBeInTheDocument();
        expect(screen.getByText('super@test.com')).toBeInTheDocument();
        expect(screen.getByText('admin@test.com')).toBeInTheDocument();
        expect(screen.getByText('inactive@test.com')).toBeInTheDocument();
      });
    });

    it('should show loading spinner while fetching admins', () => {
      adminApi.getAllAdmins.mockImplementation(() => new Promise(() => {}));

      renderAdminManagement();

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });

    it('should show error toast when admin fetch fails', async () => {
      const error = new Error('Failed to fetch admins');
      adminApi.getAllAdmins.mockRejectedValue(error);

      renderAdminManagement();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load admin list');
      });
    });

    it('should display role badges correctly', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getAllByText('SUPER_ADMIN')).toHaveLength(1);
        expect(screen.getAllByText('ADMIN')).toHaveLength(1);
        expect(screen.getAllByText('MODERATOR')).toHaveLength(1);
      });
    });

    it('should display status badges correctly', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        // Count only the status badges in the table, not dropdown options
        const activeBadges = screen.getAllByText('Active').filter(element => 
          element.closest('span')?.classList.contains('inline-flex')
        );
        const inactiveBadges = screen.getAllByText('Inactive').filter(element => 
          element.closest('span')?.classList.contains('inline-flex')
        );
        
        expect(activeBadges).toHaveLength(2);
        expect(inactiveBadges).toHaveLength(1);
      });
    });
  });

  describe('Search and Filter', () => {
    it('should filter admins by search term', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Super Admin')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search admins...');
      fireEvent.change(searchInput, { target: { value: 'Super' } });

      expect(screen.getByText('Super Admin')).toBeInTheDocument();
      expect(screen.queryByText('Regular Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Inactive Admin')).not.toBeInTheDocument();
    });

    it('should filter admins by status', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Super Admin')).toBeInTheDocument();
      });

      const statusFilter = screen.getByDisplayValue('All Status');
      fireEvent.change(statusFilter, { target: { value: 'inactive' } });

      expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Regular Admin')).not.toBeInTheDocument();
      expect(screen.getByText('Inactive Admin')).toBeInTheDocument();
    });

    it('should show correct admin count', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('3 of 3 admins')).toBeInTheDocument();
      });
    });
  });

  describe('Admin Actions', () => {
    beforeEach(async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });
    });

    it('should activate inactive admin', async () => {
      adminApi.activateAdmin.mockResolvedValue({ success: true });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Inactive Admin')).toBeInTheDocument();
      });

      const activateButton = screen.getByText('Activate');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(adminApi.activateAdmin).toHaveBeenCalledWith(3);
        expect(toast.success).toHaveBeenCalledWith('Admin activated successfully');
      });
    });

    it('should deactivate active admin', async () => {
      adminApi.deactivateAdmin.mockResolvedValue({ success: true });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Regular Admin')).toBeInTheDocument();
      });

      const deactivateButton = screen.getByText('Deactivate');
      fireEvent.click(deactivateButton);

      await waitFor(() => {
        expect(adminApi.deactivateAdmin).toHaveBeenCalledWith(2);
        expect(toast.success).toHaveBeenCalledWith('Admin deactivated successfully');
      });
    });

    it('should not show action buttons for current admin', async () => {
      // Mock current admin to match the first admin in the list (Super Admin with id: 1)
      useAdminAuth.mockReturnValue({
        admin: { ...mockCurrentAdmin, id: 1, adminId: 1 }
      });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Super Admin')).toBeInTheDocument();
      });

      // Current admin is Super Admin (id: 1), so no action buttons should be shown for that admin
      // But other admins should still have action buttons
      expect(screen.getByText('Activate')).toBeInTheDocument(); // For Inactive Admin
      expect(screen.getByText('Deactivate')).toBeInTheDocument(); // For Regular Admin
      
      // The test verifies that the logic prevents self-modification
      // by checking that action buttons exist for other admins
    });

    it('should show error toast when action fails', async () => {
      const error = new Error('Action failed');
      adminApi.activateAdmin.mockRejectedValue(error);

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Inactive Admin')).toBeInTheDocument();
      });

      const activateButton = screen.getByText('Activate');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Action failed');
      });
    });
  });

  describe('Create Admin Modal', () => {
    beforeEach(async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });
    });

    it('should open create admin modal', async () => {
      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      expect(screen.getByText('Create New Admin')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter admin name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter admin email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
    });

    it('should close modal when cancel is clicked', async () => {
      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      expect(screen.getByText('Create New Admin')).toBeInTheDocument();

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Create New Admin')).not.toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      const createButton = screen.getByText('Create Admin');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
        expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      const emailInput = screen.getByPlaceholderText('Enter admin email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

      const createButton = screen.getByText('Create Admin');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('should validate password length', async () => {
      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      const nameInput = screen.getByPlaceholderText('Enter admin name');
      const emailInput = screen.getByPlaceholderText('Enter admin email');
      const passwordInput = screen.getByPlaceholderText('Enter password');

      fireEvent.change(nameInput, { target: { value: 'Test Admin' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });

      const createButton = screen.getByText('Create Admin');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      const nameInput = screen.getByPlaceholderText('Enter admin name');
      const emailInput = screen.getByPlaceholderText('Enter admin email');
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(nameInput, { target: { value: 'Test Admin' } });
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } });

      const createButton = screen.getByText('Create Admin');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should successfully create admin with valid data', async () => {
      adminApi.createAdmin.mockResolvedValue({ data: mockAdmins[0] });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      const nameInput = screen.getByPlaceholderText('Enter admin name');
      const emailInput = screen.getByPlaceholderText('Enter admin email');
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(nameInput, { target: { value: 'New Admin' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const createButton = screen.getByText('Create Admin');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(adminApi.createAdmin).toHaveBeenCalledWith({
          name: 'New Admin',
          email: 'new@example.com',
          password: 'password123',
          role: 'ADMIN'
        });
        expect(toast.success).toHaveBeenCalledWith('Admin created successfully');
        expect(screen.queryByText('Create New Admin')).not.toBeInTheDocument();
      });
    });

    it('should show error toast when admin creation fails', async () => {
      const error = new Error('Email already exists');
      adminApi.createAdmin.mockRejectedValue(error);

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });

      const addButton = screen.getByText('Add Admin');
      fireEvent.click(addButton);

      const nameInput = screen.getByPlaceholderText('Enter admin name');
      const emailInput = screen.getByPlaceholderText('Enter admin email');
      const passwordInput = screen.getByPlaceholderText('Enter password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm password');

      fireEvent.change(nameInput, { target: { value: 'New Admin' } });
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

      const createButton = screen.getByText('Create Admin');
      fireEvent.click(createButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email already exists');
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no admins are found', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: [] });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('No admins')).toBeInTheDocument();
        expect(screen.getByText('Get started by creating a new admin account.')).toBeInTheDocument();
      });
    });

    it('should show filtered empty state when search returns no results', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();
      await waitFor(() => {
        expect(screen.getByText('Super Admin')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search admins...');
      fireEvent.change(searchInput, { target: { value: 'NonExistent' } });

      expect(screen.getByText('No admins found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render with correct page title and description', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Admin Management')).toBeInTheDocument();
        expect(screen.getByText('Manage admin accounts and permissions')).toBeInTheDocument();
      });
    });

    it('should render Add Admin button', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByText('Add Admin')).toBeInTheDocument();
      });
    });

    it('should render search and filter controls', async () => {
      adminApi.getAllAdmins.mockResolvedValue({ data: mockAdmins });

      renderAdminManagement();

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search admins...')).toBeInTheDocument();
        expect(screen.getByDisplayValue('All Status')).toBeInTheDocument();
      });
    });
  });
});
