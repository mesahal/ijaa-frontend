import React from 'react';
import { render, screen } from '@testing-library/react';
import UpcomingEvents from '../../../components/events/UpcomingEvents';

// Mock the EventCard component
jest.mock('../../../components/events/EventCard', () => {
  return function MockEventCard({ event }) {
    return <div data-testid={`event-card-${event.id}`}>{event.title}</div>;
  };
});

// Mock the Button component
jest.mock('../../../components/ui/Button', () => {
  return function MockButton({ children, onClick, disabled }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid="mock-button">
        {children}
      </button>
    );
  };
});

// Mock the Card component
jest.mock('../../../components/ui/Card', () => {
  return function MockCard({ children, className }) {
    return <div className={className} data-testid="mock-card">{children}</div>;
  };
});

describe('UpcomingEvents Component', () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Test Event 1',
      description: 'Test Description 1',
      startDate: '2024-01-15T10:00:00Z',
      endDate: '2024-01-15T12:00:00Z',
      location: 'Test Location 1',
      maxParticipants: 50,
      eventType: 'NETWORKING'
    },
    {
      id: 2,
      title: 'Test Event 2',
      description: 'Test Description 2',
      startDate: '2024-01-16T14:00:00Z',
      endDate: '2024-01-16T16:00:00Z',
      location: 'Test Location 2',
      maxParticipants: 30,
      eventType: 'WORKSHOP'
    }
  ];

  const defaultProps = {
    events: mockEvents,
    loading: false,
    error: null,
    pagination: {
      page: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1,
      first: true,
      last: true
    },
    onLoadMore: jest.fn(),
    onLoadPrevious: jest.fn(),
    getEventTypeLabel: jest.fn((type) => type),
    formatDate: jest.fn((date) => new Date(date).toLocaleDateString()),
    onViewEvent: jest.fn(),
    onEditEvent: jest.fn(),
    onDeleteEvent: jest.fn(),
    onRsvp: jest.fn(),
    onUpdateRsvp: jest.fn(),
    rsvpLoading: false,
    getParticipationStatus: jest.fn()
  };

  it('should render loading state', () => {
    render(<UpcomingEvents {...defaultProps} loading={true} />);
    
    expect(screen.getByText('Loading upcoming events...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    const errorMessage = 'Failed to load events';
    render(<UpcomingEvents {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render empty state when no events', () => {
    render(<UpcomingEvents {...defaultProps} events={[]} />);
    
    expect(screen.getByText('No upcoming events')).toBeInTheDocument();
    expect(screen.getByText('Check back later for new events or create your own event.')).toBeInTheDocument();
  });

  it('should render events correctly', () => {
    render(<UpcomingEvents {...defaultProps} />);
    
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('Events happening in the next 30 days')).toBeInTheDocument();
    expect(screen.getByText('2 upcoming')).toBeInTheDocument();
    
    expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-2')).toBeInTheDocument();
  });

  it('should render pagination controls when multiple pages', () => {
    const paginationWithMultiplePages = {
      ...defaultProps.pagination,
      totalPages: 3,
      last: false
    };
    
    render(<UpcomingEvents {...defaultProps} pagination={paginationWithMultiplePages} />);
    
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('(2 total)')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-button')).toHaveLength(2); // Previous and Next buttons
  });

  it('should not render pagination controls when single page', () => {
    render(<UpcomingEvents {...defaultProps} />);
    
    expect(screen.queryByText('Page 1 of 1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-button')).not.toBeInTheDocument();
  });

  it('should display pagination info', () => {
    render(<UpcomingEvents {...defaultProps} />);
    
    expect(screen.getByText('Showing 2 of 2 upcoming events')).toBeInTheDocument();
  });
});




