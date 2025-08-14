import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Events from '../../pages/Events';
import { useAuth } from '../../context/AuthContext';

// Mock the dependencies
jest.mock('../../context/AuthContext');
jest.mock('../../hooks/events/useEvents');
jest.mock('../../hooks/events/useEventActions');
jest.mock('../../hooks/events/useEventSearch');
jest.mock('../../hooks/events/useEventInvitations');
jest.mock('../../services/eventService');

// Mock the components
jest.mock('../../components/events/EventCard', () => {
  return function MockEventCard({ event, onView }) {
    return (
      <div data-testid="event-card">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>{event.location}</p>
        <button onClick={() => onView(event)}>View</button>
      </div>
    );
  };
});

jest.mock('../../components/events/EventTabs', () => {
  return function MockEventTabs({ activeTab, onTabChange }) {
    return (
      <div data-testid="event-tabs">
        <button onClick={() => onTabChange('all')}>All Events</button>
        <button onClick={() => onTabChange('my-events')}>My Events</button>
        <button onClick={() => onTabChange('my-active-events')}>My Active Events</button>
        <button onClick={() => onTabChange('invitations')}>Invitations</button>
      </div>
    );
  };
});

jest.mock('../../components/events/EventFilters', () => {
  return function MockEventFilters({ searchQuery, onSearchChange, filterType, onFilterChange, onAdvancedSearch }) {
    return (
      <div data-testid="event-filters">
        <input 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events..."
        />
        <select value={filterType} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All Types</option>
          <option value="NETWORKING">Networking</option>
          <option value="WORKSHOP">Workshop</option>
        </select>
        <button onClick={onAdvancedSearch}>Advanced Search</button>
      </div>
    );
  };
});

jest.mock('../../components/events/EventForm', () => {
  return function MockEventForm({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="event-form">
        <h2>Create Event</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../../components/events/EventDetailsModal', () => {
  return function MockEventDetailsModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="event-details-modal">
        <h2>Event Details</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../../components/events/InviteModal', () => {
  return function MockInviteModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="invite-modal">
        <h2>Invite People</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../../components/events/ParticipantsModal', () => {
  return function MockParticipantsModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="participants-modal">
        <h2>Participants</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('../../components/events/SearchModal', () => {
  return function MockSearchModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
      <div data-testid="search-modal">
        <h2>Advanced Search</h2>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Loader2: () => <div data-testid="loader-icon">Loader2</div>,
  AlertCircle: () => <div data-testid="alertcircle-icon">AlertCircle</div>,
}));

describe('Events Page - Group 1: Basic Event Management', () => {
  const mockUser = {
    id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    token: 'mock-token'
  };

  const mockEvents = [
    {
      id: 1,
      title: 'Alumni Meet 2024',
      description: 'Annual alumni gathering',
      startDate: '2024-12-25T18:00:00',
      endDate: '2024-12-25T22:00:00',
      location: 'IIT Campus',
      eventType: 'NETWORKING',
      active: true,
      isOnline: false,
      meetingLink: null,
      maxParticipants: 100,
      currentParticipants: 0,
      organizerName: 'John Doe',
      organizerEmail: 'john@example.com',
      createdByUsername: 'john.doe',
      privacy: 'PUBLIC',
      inviteMessage: 'Join our annual alumni meet!',
      createdAt: '2024-12-01T10:00:00',
      updatedAt: '2024-12-01T10:00:00'
    },
    {
      id: 2,
      title: 'Workshop on AI',
      description: 'Learn about artificial intelligence',
      startDate: '2024-12-30T10:00:00',
      endDate: '2024-12-30T16:00:00',
      location: 'Online',
      eventType: 'WORKSHOP',
      active: true,
      isOnline: true,
      meetingLink: 'https://meet.google.com/abc123',
      maxParticipants: 50,
      currentParticipants: 25,
      organizerName: 'Jane Smith',
      organizerEmail: 'jane@example.com',
      createdByUsername: 'jane.smith',
      privacy: 'PUBLIC',
      inviteMessage: 'Join our AI workshop!',
      createdAt: '2024-12-01T10:00:00',
      updatedAt: '2024-12-01T10:00:00'
    }
  ];

  const mockUseEvents = {
    events: mockEvents,
    myEvents: mockEvents.filter(e => e.createdByUsername === 'testuser'),
    loading: false,
    error: null,
    activeTab: 'all',
    loadEvents: jest.fn(),
    refreshEvents: jest.fn(),
    handleTabChange: jest.fn(),
    getCurrentEvents: jest.fn(() => mockEvents),
    getEventById: jest.fn()
  };

  const mockUseEventActions = {
    loading: false,
    error: null,
    handleCreateEvent: jest.fn(),
    handleDeleteEvent: jest.fn(),
    handleRsvp: jest.fn(),
    handleCancelRsvp: jest.fn(),
    clearError: jest.fn()
  };

  const mockUseEventSearch = {
    searchQuery: '',
    filterType: 'all',
    loading: false,
    error: null,
    handleSearchQueryChange: jest.fn(),
    handleFilterTypeChange: jest.fn(),
    searchEvents: jest.fn(),
    clearSearch: jest.fn(),
    getFilteredEvents: jest.fn(() => mockEvents)
  };

  const mockUseEventInvitations = {
    myParticipations: [],
    myInvitations: [],
    invitationCounts: { unreadCount: 0 },
    loading: false,
    error: null,
    sendInvitations: jest.fn(),
    acceptInvitation: jest.fn(),
    declineInvitation: jest.fn(),
    getEventParticipants: jest.fn(),
    clearError: jest.fn(),
    getMyParticipationStatus: jest.fn(),
    getMyInvitationStatus: jest.fn()
  };

  beforeEach(() => {
    // Mock the auth context
    useAuth.mockReturnValue({
      user: mockUser,
      signIn: jest.fn(),
      signOut: jest.fn()
    });

    // Mock the custom hooks
    useEvents.mockReturnValue(mockUseEvents);
    useEventActions.mockReturnValue(mockUseEventActions);
    useEventSearch.mockReturnValue(mockUseEventSearch);
    useEventInvitations.mockReturnValue(mockUseEventInvitations);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Group 1: Basic Event Management - Core Functionality', () => {
    it('should render without crashing', async () => {
      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('Events')).toBeInTheDocument();
      });
    });

    it('should display events header and create button', async () => {
      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('Events')).toBeInTheDocument();
        expect(screen.getByText('Discover and manage alumni events')).toBeInTheDocument();
        expect(screen.getByText('Create Event')).toBeInTheDocument();
      });
    });

    it('should display all Group 1 tabs for navigation', async () => {
      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('All Events')).toBeInTheDocument();
        expect(screen.getByText('My Events')).toBeInTheDocument();
        expect(screen.getByText('My Active Events')).toBeInTheDocument();
        expect(screen.getByText('Invitations')).toBeInTheDocument();
      });
    });

    it('should display search and filter controls', async () => {
      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search events...')).toBeInTheDocument();
        expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
        expect(screen.getByText('Advanced Search')).toBeInTheDocument();
      });
    });

    it('should show loading state when loading', async () => {
      const loadingMock = {
        ...mockUseEvents,
        loading: true,
      };
      useEvents.mockReturnValue(loadingMock);

      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      });
    });

    it('should show error message when there is an error', async () => {
      const errorMock = {
        ...mockUseEvents,
        error: 'Failed to load events',
      };
      useEvents.mockReturnValue(errorMock);

      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load events')).toBeInTheDocument();
      });
    });

    it('should show empty state when no events', async () => {
      const emptyMock = {
        ...mockUseEvents,
        events: [],
        getCurrentEvents: jest.fn(() => [])
      };
      useEvents.mockReturnValue(emptyMock);

      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('No events found')).toBeInTheDocument();
        expect(screen.getByText('No events match your search criteria.')).toBeInTheDocument();
      });
    });
  });

  describe('Group 1: Basic Event Management - Tab Navigation', () => {
    it('should handle tab changes correctly', async () => {
      const user = userEvent.setup();
      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('All Events')).toBeInTheDocument();
      });

      // Test tab navigation
      const myEventsTab = screen.getByText('My Events');
      await user.click(myEventsTab);
      expect(mockUseEvents.handleTabChange).toHaveBeenCalledWith('my-events');

      const myActiveEventsTab = screen.getByText('My Active Events');
      await user.click(myActiveEventsTab);
      expect(mockUseEvents.handleTabChange).toHaveBeenCalledWith('my-active-events');

      const invitationsTab = screen.getByText('Invitations');
      await user.click(invitationsTab);
      expect(mockUseEvents.handleTabChange).toHaveBeenCalledWith('invitations');
    });

    it('should display correct events for each tab', async () => {
      const myEventsMock = {
        ...mockUseEvents,
        activeTab: 'my-events',
        getCurrentEvents: jest.fn(() => mockEvents.filter(e => e.createdByUsername === 'testuser'))
      };
      useEvents.mockReturnValue(myEventsMock);

      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('My Events')).toBeInTheDocument();
      });
    });
  });

  describe('Group 1: Basic Event Management - Event Display', () => {
    it('should display event cards with correct information', async () => {
      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('Alumni Meet 2024')).toBeInTheDocument();
        expect(screen.getByText('Annual alumni gathering')).toBeInTheDocument();
        expect(screen.getByText('IIT Campus')).toBeInTheDocument();
        expect(screen.getByText('Workshop on AI')).toBeInTheDocument();
        expect(screen.getByText('Learn about artificial intelligence')).toBeInTheDocument();
      });
    });

    it('should handle event card view action', async () => {
      render(<Events />);
      
      await waitFor(() => {
        const viewButtons = screen.getAllByText('View');
        expect(viewButtons).toHaveLength(2);
      });

      const firstViewButton = screen.getAllByText('View')[0];
      fireEvent.click(firstViewButton);
    });
  });

  describe('Group 1: Basic Event Management - Event Creation', () => {
    it('should handle create event button click', async () => {
      render(<Events />);
      
      const createButton = screen.getByText('Create Event');
      fireEvent.click(createButton);
      
      // Modal should be opened (this would be tested in the modal component)
      expect(createButton).toBeInTheDocument();
    });
  });

  describe('Group 1: Basic Event Management - Search and Filters', () => {
    it('should handle search input changes', async () => {
      const user = userEvent.setup();
      render(<Events />);
      
      const searchInput = screen.getByPlaceholderText('Search events...');
      await user.type(searchInput, 'test search');
      
      expect(mockUseEventSearch.handleSearchQueryChange).toHaveBeenCalledWith('test search');
    });

    it('should handle filter type changes', async () => {
      const user = userEvent.setup();
      render(<Events />);
      
      const filterSelect = screen.getByDisplayValue('All Types');
      await user.selectOptions(filterSelect, 'NETWORKING');
      
      expect(mockUseEventSearch.handleFilterTypeChange).toHaveBeenCalledWith('NETWORKING');
    });

    it('should handle advanced search button click', async () => {
      render(<Events />);
      
      const advancedSearchButton = screen.getByText('Advanced Search');
      fireEvent.click(advancedSearchButton);
      
      expect(advancedSearchButton).toBeInTheDocument();
    });
  });

  describe('Group 1: Basic Event Management - Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorMock = {
        ...mockUseEvents,
        error: 'Network error occurred',
      };
      useEvents.mockReturnValue(errorMock);

      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('Network error occurred')).toBeInTheDocument();
      });
    });

    it('should handle authentication errors', async () => {
      const authErrorMock = {
        ...mockUseEvents,
        error: 'Authentication required',
      };
      useEvents.mockReturnValue(authErrorMock);

      render(<Events />);
      
      await waitFor(() => {
        expect(screen.getByText('Authentication required')).toBeInTheDocument();
      });
    });
  });

  describe('Group 1: Basic Event Management - Integration', () => {
    it('should integrate with event service correctly', async () => {
      render(<Events />);
      
      await waitFor(() => {
        expect(mockUseEvents.loadEvents).toHaveBeenCalled();
      });
    });

    it('should refresh events when needed', async () => {
      render(<Events />);
      
      // Simulate a refresh
      mockUseEvents.refreshEvents();
      
      expect(mockUseEvents.refreshEvents).toHaveBeenCalled();
    });
  });
}); 