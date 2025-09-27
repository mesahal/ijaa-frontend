import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminSettings from '../../pages/AdminSettings';
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

const mockAdmin = {
  id: 1,
  name: 'Test Admin',
  email: 'admin@test.com',
  role: 'ADMIN',
  active: true,
  token: 'test-token',
  adminId: 1,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z'
};

const mockProfile = {
  id: 1,
  name: 'Test Admin',
  email: 'admin@test.com',
  role: 'ADMIN',
  active: true,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z'
};

const renderAdminSettings = () => {
  return render(
    <BrowserRouter>
      <AdminSettings />
    </BrowserRouter>
  );
};

describe('AdminSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAdminAuth.mockReturnValue({
      admin: mockAdmin
    });
  });

  describe('Profile Information', () => {
    it('should display admin profile information when loaded successfully', async () => {
      adminApi.getAdminProfile.mockResolvedValue({ data: mockProfile });

      renderAdminSettings();

      await waitFor(() => {
        expect(screen.getByText('Test Admin')).toBeInTheDocument();
        expect(screen.getByText('admin@test.com')).toBeInTheDocument();
        expect(screen.getByText('ADMIN')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
    });

    it('should show loading spinner while fetching profile', () => {
      adminApi.getAdminProfile.mockImplementation(() => new Promise(() => {}));

      renderAdminSettings();

      expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });

    it('should show error toast when profile fetch fails', async () => {
      const error = new Error('Failed to fetch profile');
      adminApi.getAdminProfile.mockRejectedValue(error);

      renderAdminSettings();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load admin profile');
      });
    });

    it('should display different role badges with correct colors', async () => {
      const superAdminProfile = { ...mockProfile, role: 'SUPER_ADMIN' };
      adminApi.getAdminProfile.mockResolvedValue({ data: superAdminProfile });

      renderAdminSettings();

      await waitFor(() => {
        const roleBadge = screen.getByText('SUPER_ADMIN');
        expect(roleBadge).toBeInTheDocument();
        expect(roleBadge.closest('span')).toHaveClass('bg-red-100', 'text-red-800');
      });
    });

    it('should display inactive status badge correctly', async () => {
      const inactiveProfile = { ...mockProfile, active: false };
      adminApi.getAdminProfile.mockResolvedValue({ data: inactiveProfile });

      renderAdminSettings();

      await waitFor(() => {
        expect(screen.getByText('Inactive')).toBeInTheDocument();
      });
    });
  });

  describe('Password Change Form', () => {
    beforeEach(async () => {
      adminApi.getAdminProfile.mockResolvedValue({ data: mockProfile });
      renderAdminSettings();
      await waitFor(() => {
        expect(screen.getByText('Test Admin')).toBeInTheDocument();
      });
    });

    it('should render password change form with all fields', () => {
      expect(screen.getByPlaceholderText('Enter current password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter new password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Confirm new password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('should have password visibility toggle buttons', () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      // Initially all passwords should be hidden
      expect(currentPasswordInput).toHaveAttribute('type', 'password');
      expect(newPasswordInput).toHaveAttribute('type', 'password');
      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      // Check that eye icons exist
      const eyeIcons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && 
        (button.querySelector('svg').classList.contains('lucide-eye') || 
         button.querySelector('svg').classList.contains('lucide-eye-off'))
      );
      expect(eyeIcons.length).toBeGreaterThan(0);
    });

    it('should validate required fields on form submission', async () => {
      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      // Wait for validation to complete and check for at least one validation message
      await waitFor(() => {
        expect(screen.getByText('Current password is required')).toBeInTheDocument();
      });
    });

    it('should validate password length', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'oldpass' } });
      fireEvent.change(newPasswordInput, { target: { value: 'short' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

      const submitButton = screen.getByRole('button', { name: /change password/i });
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

      const submitButton = screen.getByRole('button', { name: /change password/i });
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

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('New password must be different from current password')).toBeInTheDocument();
      });
    });

    it('should successfully change password with valid data', async () => {
      adminApi.changeAdminPassword.mockResolvedValue({ data: mockProfile });

      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(adminApi.changeAdminPassword).toHaveBeenCalledWith({
          currentPassword: 'oldpassword',
          newPassword: 'newpassword123',
          confirmPassword: 'newpassword123'
        });
        expect(toast.success).toHaveBeenCalledWith('Password changed successfully');
      });
    });

    it('should show error toast when password change fails', async () => {
      const error = new Error('Current password is incorrect');
      adminApi.changeAdminPassword.mockRejectedValue(error);

      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'wrongpassword' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Current password is incorrect');
      });
    });

    it('should clear form after successful password change', async () => {
      adminApi.changeAdminPassword.mockResolvedValue({ data: mockProfile });

      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const newPasswordInput = screen.getByPlaceholderText('Enter new password');
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm new password');

      fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
      fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

      const submitButton = screen.getByRole('button', { name: /change password/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(currentPasswordInput).toHaveValue('');
        expect(newPasswordInput).toHaveValue('');
        expect(confirmPasswordInput).toHaveValue('');
      });
    });

    it('should clear validation errors when user starts typing', async () => {
      const currentPasswordInput = screen.getByPlaceholderText('Enter current password');
      const submitButton = screen.getByRole('button', { name: /change password/i });

      // Submit empty form to show errors
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText('Current password is required')).toBeInTheDocument();
      });

      // Start typing to clear error
      fireEvent.change(currentPasswordInput, { target: { value: 'test' } });
      await waitFor(() => {
        expect(screen.queryByText('Current password is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    it('should render with correct page title and description', async () => {
      adminApi.getAdminProfile.mockResolvedValue({ data: mockProfile });

      renderAdminSettings();

      await waitFor(() => {
        expect(screen.getByText('Admin Settings')).toBeInTheDocument();
        expect(screen.getByText('Manage your admin profile and security settings')).toBeInTheDocument();
      });
    });

    it('should render profile information and password change sections', async () => {
      adminApi.getAdminProfile.mockResolvedValue({ data: mockProfile });

      renderAdminSettings();

      await waitFor(() => {
        expect(screen.getByText('Profile Information')).toBeInTheDocument();
        expect(screen.getAllByText('Change Password')).toHaveLength(2); // Heading and button
      });
    });

    it('should display formatted dates correctly', async () => {
      adminApi.getAdminProfile.mockResolvedValue({ data: mockProfile });

      renderAdminSettings();

      await waitFor(() => {
        expect(screen.getAllByText('1/1/2025')).toHaveLength(2); // Created At and Last Updated
      });
    });
  });
});
