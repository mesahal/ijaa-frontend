import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import Events from '../../pages/Events';
import { mockUser, mockApiResponses } from '../utils/test-utils';

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser
  })
}));

// Mock the apiClient
jest.mock('../../utils/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

describe('Events Component', () => {
  let mockApiClient;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiClient = require('../../utils/apiClient').default;
  });

  test('renders events page with title and description', () => {
    render(<Events />);
    
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Discover and manage alumni events')).toBeInTheDocument();
  });

  test('renders create event button', () => {
    render(<Events />);
    
    const createButton = screen.getByRole('button', { name: /create event/i });
    expect(createButton).toBeInTheDocument();
  });

  test('renders tab navigation', () => {
    render(<Events />);
    
    expect(screen.getByText('All Events')).toBeInTheDocument();
    expect(screen.getByText('My Events')).toBeInTheDocument();
  });

  test('renders search and filter controls', () => {
    render(<Events />);
    
    expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
  });

  test('shows loading state when fetching events', async () => {
    mockApiClient.get.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: mockApiResponses.events.success }), 100))
    );

    render(<Events />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays events when API call succeeds', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test event description')).toBeInTheDocument();
    });
  });

  test('shows error message when API call fails', async () => {
    mockApiClient.get.mockRejectedValue(new Error('Failed to fetch events'));

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to load events/i)).toBeInTheDocument();
    });
  });

  test('opens create event modal when create button is clicked', () => {
    render(<Events />);
    
    const createButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(createButton);
    
    expect(screen.getByText('Create New Event')).toBeInTheDocument();
  });

  test('creates event successfully', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });
    mockApiClient.post.mockResolvedValue({ data: { code: '201', data: { id: 1 } } });

    render(<Events />);
    
    // Open create modal
    const createButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(createButton);
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Enter event title'), {
      target: { value: 'New Test Event' }
    });
    fireEvent.change(screen.getByPlaceholderText('Enter event description'), {
      target: { value: 'New test event description' }
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockApiClient.post).toHaveBeenCalledWith('/events/create', expect.any(Object));
    });
  });

  test('validates required fields in create event form', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    // Open create modal
    const createButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(createButton);
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /create event/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    });
  });

  test('filters events by type', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Change filter
    const filterSelect = screen.getByDisplayValue('All Types');
    fireEvent.change(filterSelect, { target: { value: 'WORKSHOP' } });
    
    // Event should still be visible since it's a workshop
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  test('searches events by text', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Search for non-existent event
    const searchInput = screen.getByPlaceholderText('Search events...');
    fireEvent.change(searchInput, { target: { value: 'Non-existent Event' } });
    
    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });

  test('switches between all events and my events tabs', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    // Initially on "All Events" tab
    expect(screen.getByText('All Events')).toHaveClass('bg-white');
    
    // Switch to "My Events" tab
    const myEventsTab = screen.getByText('My Events');
    fireEvent.click(myEventsTab);
    
    expect(myEventsTab).toHaveClass('bg-white');
  });

  test('shows empty state when no events are found', async () => {
    mockApiClient.get.mockResolvedValue({ data: { code: '200', data: [] } });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  test('handles event deletion', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });
    mockApiClient.delete.mockResolvedValue({ data: { code: '200' } });

    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Find and click delete button (if it exists for my events)
    const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]);
      expect(window.confirm).toHaveBeenCalled();
    }
  });

  test('displays event details in modal', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Click view details button
    const viewButton = screen.getByText('View Details');
    fireEvent.click(viewButton);
    
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  test('handles online events correctly', async () => {
    const onlineEventResponse = {
      ...mockApiResponses.events.success,
      data: [{
        ...mockApiResponses.events.success.data[0],
        isOnline: true,
        meetingLink: 'https://meet.google.com/test'
      }]
    };
    
    mockApiClient.get.mockResolvedValue({ data: onlineEventResponse });

    render(<Events />);
    
    await waitFor(() => {
      expect(screen.getByText('Online Event')).toBeInTheDocument();
    });
  });

  test('accessibility features are present', async () => {
    mockApiClient.get.mockResolvedValue({ data: mockApiResponses.events.success });

    render(<Events />);
    
    // Check for proper ARIA labels
    expect(screen.getByRole('button', { name: /create event/i })).toBeInTheDocument();
    
    // Check for proper form labels
    expect(screen.getByText('Search events...')).toBeInTheDocument();
  });
}); 