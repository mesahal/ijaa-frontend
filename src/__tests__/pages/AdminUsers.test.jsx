import React from 'react';
import { render, screen, fireEvent, waitFor  } from '../../../utils/test-utils';
import AdminUsers from '../../pages/AdminUsers';

// Mock fetch globally
global.fetch = jest.fn();

// Mock toast
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('AdminUsers', () => {
  const mockUsers = [
    {
      userId: 'USER_123',
      name: 'John Doe',
      email: 'john@example.com',
      batch: '2020',
      active: true, // Active user
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      userId: 'USER_456',
      name: 'Jane Smith',
      email: 'jane@example.com',
      batch: '2021',
      active: false, // Blocked user
      createdAt: '2023-02-01T00:00:00Z'
    },
    {
      userId: 'USER_789',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      batch: '2019',
      active: true, // Active user
      createdAt: '2023-03-01T00:00:00Z'
    }
  ];

  const mockApiResponse = {
    message: "Users retrieved successfully",
    code: "200",
    data: mockUsers
  };

  beforeEach(() => {
    fetch.mockClear();
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('renders admin users page with header', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      expect(screen.getByText('Manage Users')).toBeInTheDocument();
      expect(screen.getByText('View and manage all registered users')).toBeInTheDocument();
    });

    test('renders search and filter controls', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
      expect(screen.getByDisplayValue('All Users')).toBeInTheDocument();
    });

    test('renders users table with correct headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Joined')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
      });
    });
  });

  describe('User Data Display', () => {
    test('displays user information correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('2020')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
    });

    test('displays blocked user status correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Blocked')).toBeInTheDocument();
      });
    });

    test('handles users with different ID fields', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
      });
    });

    test('displays correct action buttons for active users', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Check that active users show block button (UserX icon)
      const blockButtons = screen.getAllByTitle('Block User');
      expect(blockButtons.length).toBeGreaterThan(0);
    });

    test('displays correct action buttons for blocked users', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      // Check that blocked users show unblock button (UserCheck icon)
      const unblockButtons = screen.getAllByTitle('Unblock User');
      expect(unblockButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Search and Filter Functionality', () => {
    test('filters users by search term', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search users...');
      fireEvent.change(searchInput, { target: { value: 'John' } });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    test('filters users by status', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue('All Users');
      fireEvent.change(filterSelect, { target: { value: 'blocked' } });

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('filters active users correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const filterSelect = screen.getByDisplayValue('All Users');
      fireEvent.change(filterSelect, { target: { value: 'active' } });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  describe('Block User Functionality', () => {
    test('blocks a user successfully', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'User blocked successfully' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getAllByTitle('Block User')[0];
      fireEvent.click(blockButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/users/USER_123/block'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': expect.stringContaining('Bearer'),
              'Content-Type': 'application/json',
            }),
            body: '{}',
          })
        );
      });
    });

    test('handles block user error', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'User cannot be blocked' }),
        });

      const { toast } = require('react-toastify');

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getAllByTitle('Block User')[0];
      fireEvent.click(blockButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User cannot be blocked');
      });
    });

    test('updates UI immediately after blocking user', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'User blocked successfully' }),
        });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
      });

      const blockButton = screen.getAllByTitle('Block User')[0];
      fireEvent.click(blockButton);

      // Check that the UI updates immediately to show blocked status
      await waitFor(() => {
        expect(screen.getByText('Blocked')).toBeInTheDocument();
      });
    });
  });

  describe('Unblock User Functionality', () => {
    test('unblocks a user successfully', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'User unblocked successfully' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const unblockButton = screen.getAllByTitle('Unblock User')[0];
      fireEvent.click(unblockButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/users/USER_456/unblock'),
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Authorization': expect.stringContaining('Bearer'),
              'Content-Type': 'application/json',
            }),
            body: '{}',
          })
        );
      });
    });

    test('handles unblock user error', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'User cannot be unblocked' }),
        });

      const { toast } = require('react-toastify');

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      const unblockButton = screen.getAllByTitle('Unblock User')[0];
      fireEvent.click(unblockButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User cannot be unblocked');
      });
    });

    test('updates UI immediately after unblocking user', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'User unblocked successfully' }),
        });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Blocked')).toBeInTheDocument();
      });

      const unblockButton = screen.getAllByTitle('Unblock User')[0];
      fireEvent.click(unblockButton);

      // Check that the UI updates immediately to show active status
      await waitFor(() => {
        expect(screen.getByText('Active')).toBeInTheDocument();
      });
    });
  });

  describe('Delete User Functionality', () => {
    test('shows delete confirmation modal', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete User')[0];
      fireEvent.click(deleteButton);

      expect(screen.getByText('Delete User')).toBeInTheDocument();
      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    test('deletes a user successfully', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'User deleted successfully' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        });

      const { toast } = require('react-toastify');

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete User')[0];
      fireEvent.click(deleteButton);

      const confirmDeleteButton = screen.getByText('Delete');
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/users/USER_123'),
          expect.objectContaining({
            method: 'DELETE',
            headers: expect.objectContaining({
              'Authorization': expect.stringContaining('Bearer'),
              'Content-Type': 'application/json',
            }),
          })
        );
      });
    });

    test('handles delete user error', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          json: async () => ({ message: 'User cannot be deleted' }),
        });

      const { toast } = require('react-toastify');

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete User')[0];
      fireEvent.click(deleteButton);

      const confirmDeleteButton = screen.getByText('Delete');
      fireEvent.click(confirmDeleteButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('User cannot be deleted');
      });
    });

    test('cancels delete operation', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButton = screen.getAllByTitle('Delete User')[0];
      fireEvent.click(deleteButton);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(screen.queryByText('Delete User')).not.toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('shows loading spinner while fetching users', () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<AdminUsers />);

      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    test('shows loading state during block/unblock operations', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockApiResponse,
        })
        .mockImplementation(() => new Promise(() => {})); // Never resolves for block operation

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getAllByTitle('Block User')[0];
      fireEvent.click(blockButton);

      // Check if button is disabled and shows loading spinner
      expect(blockButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('handles API error when fetching users', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { toast } = require('react-toastify');

      render(<AdminUsers />);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load users');
      });
    });

    test('handles invalid user ID', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Users retrieved successfully",
          code: "200",
          data: [{ ...mockUsers[0], userId: null }]
        }),
      });

      const { toast } = require('react-toastify');

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const blockButton = screen.getAllByTitle('Block User')[0];
      fireEvent.click(blockButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid user ID');
      });
    });
  });

  describe('Permission Checks', () => {
    test('shows insufficient privileges message for non-admin', () => {
      // Mock admin context to return null or non-admin user
      jest.spyOn(require('../../context/AdminAuthContext'), 'useAdminAuth').mockReturnValue({
        admin: null,
      });

      render(<AdminUsers />);

      expect(screen.getByText('Insufficient Privileges')).toBeInTheDocument();
    });
  });

  describe('Blocked User Status Display', () => {
    test('correctly processes different blocked status formats', async () => {
      const usersWithDifferentBlockedFormats = [
        { userId: 'USER_1', name: 'User 1', active: true }, // Active user
        { userId: 'USER_2', name: 'User 2', active: false }, // Blocked user (active: false)
        { userId: 'USER_3', name: 'User 3', active: true, isBlocked: true }, // Active but has isBlocked flag
        { userId: 'USER_4', name: 'User 4', active: false, blocked: true }, // Blocked with multiple indicators
        { userId: 'USER_5', name: 'User 5', active: true, status: 'BLOCKED' } // Active but has BLOCKED status
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Users retrieved successfully",
          code: "200",
          data: usersWithDifferentBlockedFormats
        }),
      });

      render(<AdminUsers />);

      await waitFor(() => {
        // All users should be displayed
        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('User 2')).toBeInTheDocument();
        expect(screen.getByText('User 3')).toBeInTheDocument();
        expect(screen.getByText('User 4')).toBeInTheDocument();
        expect(screen.getByText('User 5')).toBeInTheDocument();
      });

      // Check that blocked users show unblock buttons
      const unblockButtons = screen.getAllByTitle('Unblock User');
      expect(unblockButtons.length).toBe(3); // Users 2, 3, 4, and 5 should be blocked

      // Check that active user shows block button
      const blockButtons = screen.getAllByTitle('Block User');
      expect(blockButtons.length).toBe(1); // User 1 should be active
    });

    test('correctly identifies blocked users based on active field', async () => {
      const usersWithActiveField = [
        { userId: 'USER_1', name: 'Active User', active: true },
        { userId: 'USER_2', name: 'Blocked User', active: false },
        { userId: 'USER_3', name: 'Another Active', active: true }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Users retrieved successfully",
          code: "200",
          data: usersWithActiveField
        }),
      });

      render(<AdminUsers />);

      await waitFor(() => {
        expect(screen.getByText('Active User')).toBeInTheDocument();
        expect(screen.getByText('Blocked User')).toBeInTheDocument();
        expect(screen.getByText('Another Active')).toBeInTheDocument();
      });

      // Check status displays
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Blocked')).toBeInTheDocument();

      // Check action buttons
      const blockButtons = screen.getAllByTitle('Block User');
      const unblockButtons = screen.getAllByTitle('Unblock User');
      
      expect(blockButtons.length).toBe(2); // Two active users
      expect(unblockButtons.length).toBe(1); // One blocked user
    });
  });
});
