import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useAuth } from '../../context/AuthContext';
import Search from '../../pages/Search';
import { MemoryRouter } from 'react-router-dom';

// Mock the AuthContext
jest.mock('../../context/AuthContext');

const mockUseAuth = useAuth;

describe('Search', () => {
  const mockUser = {
    username: 'testuser',
    token: 'mock-token'
  };

  const mockSearchResults = [
    {
      username: 'alumni1',
      name: 'John Doe',
      profession: 'Software Engineer',
      location: 'Dhaka, Bangladesh',
      batch: '2018',
      connections: 15
    },
    {
      username: 'alumni2',
      name: 'Jane Smith',
      profession: 'Data Scientist',
      location: 'Chittagong, Bangladesh',
      batch: '2019',
      connections: 20
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false
    });

    // Mock fetch for search API
    global.fetch = jest.fn();
  });

  test('renders search form', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    expect(screen.getByText(/search alumni/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profession/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/batch/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('handles search form submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Search completed',
        code: '200',
        data: mockSearchResults
      })
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const professionInput = screen.getByLabelText(/profession/i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(professionInput, { target: { value: 'Engineer' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('shows loading state during search', async () => {
    global.fetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    expect(screen.getByText(/searching/i)).toBeInTheDocument();
    expect(searchButton).toBeDisabled();
  });

  test('shows no results message when no matches found', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Search completed',
        code: '200',
        data: []
      })
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/no results found/i)).toBeInTheDocument();
    });
  });

  test('handles search error gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to search/i)).toBeInTheDocument();
    });
  });

  test('renders search filters', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    expect(screen.getByText(/filters/i)).toBeInTheDocument();
    expect(screen.getByText(/department/i)).toBeInTheDocument();
    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  test('handles filter changes', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const departmentSelect = screen.getByLabelText(/department/i);
    fireEvent.change(departmentSelect, { target: { value: 'CSE' } });

    expect(departmentSelect.value).toBe('CSE');
  });

  test('renders search results with proper information', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Search completed',
        code: '200',
        data: mockSearchResults
      })
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Dhaka, Bangladesh')).toBeInTheDocument();
      expect(screen.getByText('2018')).toBeInTheDocument();
      expect(screen.getByText('15 connections')).toBeInTheDocument();
    });
  });

  test('handles view profile button click', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Search completed',
        code: '200',
        data: mockSearchResults
      })
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const viewProfileButtons = screen.getAllByText(/view profile/i);
      fireEvent.click(viewProfileButtons[0]);
    });

    // Should navigate to profile page
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('handles clear filters', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const clearButton = screen.getByText(/clear filters/i);
    fireEvent.click(clearButton);

    const nameInput = screen.getByLabelText(/name/i);
    const professionInput = screen.getByLabelText(/profession/i);
    const locationInput = screen.getByLabelText(/location/i);

    expect(nameInput.value).toBe('');
    expect(professionInput.value).toBe('');
    expect(locationInput.value).toBe('');
  });

  test('renders with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const search = container.firstChild;
    expect(search).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  test('renders responsive design elements', () => {
    const { container } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    // Check for responsive classes
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-4');
  });

  test('handles keyboard navigation', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Search completed',
        code: '200',
        data: mockSearchResults
      })
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.keyPress(nameInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles empty search query', async () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter search criteria/i)).toBeInTheDocument();
    });
  });

  test('renders with proper accessibility attributes', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    // Check for proper form structure
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();

    // Check for proper input labels
    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toHaveAttribute('id');
  });

  test('handles special characters in search', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Search completed',
        code: '200',
        data: mockSearchResults
      })
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'John & Doe' } });
    
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('handles pagination', async () => {
    const paginatedResults = {
      message: 'Search completed',
      code: '200',
      data: mockSearchResults,
      pagination: {
        currentPage: 1,
        totalPages: 3,
        totalItems: 6
      }
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => paginatedResults
    });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/page 1 of 3/i)).toBeInTheDocument();
    });
  });
}); 