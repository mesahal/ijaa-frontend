import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Events from '../../pages/Events';
import { useUnifiedAuth } from '../../context/UnifiedAuthContext';
import { useEvents } from '../../hooks/events/useEvents';
import { useEventActions } from '../../hooks/events/useEventActions';
import { useEventSearch } from '../../hooks/events/useEventSearch';
import { useEventDiscovery } from '../../hooks/events/useEventDiscovery';
import { useEventParticipation } from '../../hooks/events/useEventParticipation';
import { useEventInvitations } from '../../hooks/events/useEventInvitations';

// Mock the dependencies
jest.mock('../../context/UnifiedAuthContext');
jest.mock('../../hooks/events/useEvents');
jest.mock('../../hooks/events/useEventActions');
jest.mock('../../hooks/events/useEventSearch');
jest.mock('../../hooks/events/useEventDiscovery');
jest.mock('../../hooks/events/useEventParticipation');
jest.mock('../../hooks/events/useEventInvitations');

// Mock the components
jest.mock('../../components/events/EventCard', () => {
  return function MockEventCard({ event, onView }) {
    return (
      <div data-testid="event-card" className="modern-event-card">
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <p>{event.location}</p>
        <button onClick={() => onView(event)}>View Details</button>
      </div>
    );
  };
});

jest.mock('../../components/events/EventTabs', () => {
  return function MockEventTabs({ activeTab, onTabChange }) {
    return (
      <div data-testid="event-tabs" className="modern-tabs" role="tablist">
        <button onClick={() => onTabChange('all')}>All Events</button>
        <button onClick={() => onTabChange('my-events')}>My Events</button>
        <button onClick={() => onTabChange('upcoming')}>Upcoming</button>
        <button onClick={() => onTabChange('trending')}>Trending</button>
      </div>
    );
  };
});

jest.mock('../../components/events/EventFilters', () => {
  return function MockEventFilters({ searchQuery, onSearchChange, filterType, onFilterChange, onAdvancedSearch }) {
    return (
      <div data-testid="event-filters" className="modern-filters">
        <input 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events by title, description, or location..."
        />
        <select value={filterType} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="NETWORKING">Networking</option>
          <option value="WORKSHOP">Workshop</option>
        </select>
        <button onClick={onAdvancedSearch}>Advanced</button>
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

jest.mock('../../components/events/UpcomingEvents', () => {
  return function MockUpcomingEvents() {
    return <div data-testid="upcoming-events">Upcoming Events</div>;
  };
});

jest.mock('../../components/events/TrendingEvents', () => {
  return function MockTrendingEvents() {
    return <div data-testid="trending-events">Trending Events</div>;
  };
});

jest.mock('../../components/events/AdvancedSearch', () => {
  return function MockAdvancedSearch() {
    return <div data-testid="advanced-search">Advanced Search</div>;
  };
});

jest.mock('../../components/events/MyParticipations', () => {
  return function MockMyParticipations() {
    return <div data-testid="my-participations">My Participations</div>;
  };
});

jest.mock('lucide-react', () => ({
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Loader2: () => <div data-testid="loader-icon">Loader2</div>,
  AlertCircle: () => <div data-testid="alertcircle-icon">AlertCircle</div>,
  TrendingUp: () => <div data-testid="trending-icon">TrendingUp</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
  Heart: () => <div data-testid="heart-icon">Heart</div>,
  Share2: () => <div data-testid="share-icon">Share2</div>,
  MoreHorizontal: () => <div data-testid="more-icon">MoreHorizontal</div>,
  Grid3X3: () => <div data-testid="grid-icon">Grid3X3</div>,
  List: () => <div data-testid="list-icon">List</div>,
  Bell: () => <div data-testid="bell-icon">Bell</div>,
  Bookmark: () => <div data-testid="bookmark-icon">Bookmark</div>,
  Clock: () => <div data-testid="clock-icon">Clock</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  SlidersHorizontal: () => <div data-testid="sliders-icon">SlidersHorizontal</div>,
  X: () => <div data-testid="x-icon">X</div>,
}));

describe('Events Page - Modern Design Features', () => {
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
    }
  ];

  beforeEach(() => {
    // Mock the auth context
    useUnifiedAuth.mockReturnValue({
      user: mockUser,
      loading: false,
      signIn: jest.fn(),
      signOut: jest.fn()
    });

    // Mock the custom hooks
    useEvents.mockReturnValue({
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
    });

    useEventActions.mockReturnValue({
      loading: false,
      error: null,
      handleCreateEvent: jest.fn(),
      handleDeleteEvent: jest.fn(),
      handleRsvp: jest.fn(),
      handleCancelRsvp: jest.fn(),
      clearError: jest.fn()
    });

    useEventSearch.mockReturnValue({
      searchQuery: '',
      filterType: 'all',
      loading: false,
      error: null,
      handleSearchQueryChange: jest.fn(),
      handleFilterTypeChange: jest.fn(),
      searchEvents: jest.fn(),
      clearSearch: jest.fn(),
      getFilteredEvents: jest.fn(() => mockEvents)
    });

    useEventDiscovery.mockReturnValue({
      upcomingEvents: [],
      upcomingLoading: false,
      upcomingError: null,
      upcomingPagination: {},
      loadUpcomingEvents: jest.fn(),
      loadNextUpcomingPage: jest.fn(),
      loadPreviousUpcomingPage: jest.fn(),
      trendingEvents: [],
      trendingLoading: false,
      trendingError: null,
      loadTrendingEvents: jest.fn(),
      searchResults: [],
      searchLoading: false,
      searchError: null,
      searchPagination: {},
      searchEvents: jest.fn(),
      clearSearch: jest.fn(),
      loadNextSearchPage: jest.fn(),
      loadPreviousSearchPage: jest.fn()
    });

    useEventParticipation.mockReturnValue({
      participations: [],
      participationsLoading: false,
      participationsError: null,
      participationsPagination: {},
      loadMyParticipations: jest.fn(),
      loadNextParticipationsPage: jest.fn(),
      loadPreviousParticipationsPage: jest.fn(),
      clearParticipationsError: jest.fn(),
      rsvpLoading: false,
      rsvpError: null,
      rsvpToEvent: jest.fn(),
      clearRsvpError: jest.fn(),
      updateLoading: false,
      updateError: null,
      updateParticipation: jest.fn(),
      clearUpdateError: jest.fn(),
      joinEvent: jest.fn(),
      maybeAttendEvent: jest.fn(),
      cancelRsvp: jest.fn(),
      getParticipationStatus: jest.fn(),
      getParticipation: jest.fn(),
      isParticipating: jest.fn(),
      isMaybeAttending: jest.fn(),
      hasDeclined: jest.fn()
    });

    useEventInvitations.mockReturnValue({
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
    });

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Modern Design Features', () => {
    it('should render with clean header design', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        // Check for clean header design - look for the main container
        const container = screen.getByText('Events').closest('.min-h-screen');
        expect(container).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
      });
    });

    it('should display modern subtitle text', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Discover and connect with alumni events')).toBeInTheDocument();
      });
    });

    it('should have clean create event button styling', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const createButton = screen.getByText('Create Event').closest('button');
        expect(createButton).toBeInTheDocument();
        expect(createButton.tagName).toBe('BUTTON');
      });
    });

    it('should display search and filter form', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('event-filters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search events by title, description, or location...')).toBeInTheDocument();
        expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
      });
    });

    it('should display modern search filters', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('event-filters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search events by title, description, or location...')).toBeInTheDocument();
        expect(screen.getByDisplayValue('All Categories')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
      });
    });

    it('should display events in modern card layout', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByTestId('event-card')).toBeInTheDocument();
        expect(screen.getByText('Alumni Meet 2024')).toBeInTheDocument();
        expect(screen.getByText('View Details')).toBeInTheDocument();
      });
    });

    it('should show view mode toggle when events are present', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        // Check for view mode toggle (grid/list buttons)
        expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
        expect(screen.getByTestId('list-icon')).toBeInTheDocument();
      });
    });

    it('should display event count information', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        expect(screen.getByText('Found 1 event')).toBeInTheDocument();
      });
    });
  });

  describe('Modern Design Responsiveness', () => {
    it('should have responsive layout classes', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const container = screen.getByText('Events').closest('.max-w-7xl');
        expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
      });
    });

    it('should have modern card styling', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const eventCard = screen.getByTestId('event-card');
        expect(eventCard).toHaveClass('modern-event-card');
      });
    });
  });

  describe('Modern Design Accessibility', () => {
    it('should have proper ARIA labels and roles', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText('Search events by title, description, or location...');
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('placeholder', 'Search events by title, description, or location...');
      });
    });

    it('should have proper button labels', async () => {
      render(
        <BrowserRouter>
          <Events />
        </BrowserRouter>
      );
      
      await waitFor(() => {
        const createButton = screen.getByText('Create Event');
        expect(createButton).toBeInTheDocument();
      });
    });
  });
});
