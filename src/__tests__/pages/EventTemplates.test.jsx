import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventTemplates from '../../pages/EventTemplates';
import { useEventTemplates } from '../../hooks/events/useEventTemplates';
import { useEventActions } from '../../hooks/events/useEventActions';
import EventTemplateCard from '../../components/events/EventTemplateCard';
import EventTemplateForm from '../../components/events/EventTemplateForm';
import EventForm from '../../components/events/EventForm';
import { EVENT_TYPES, EVENT_PRIVACY  } from '../../../services/api/eventApi';

// Mock dependencies
jest.mock('../../hooks/events/useEventTemplates');
jest.mock('../../hooks/events/useEventActions');
jest.mock('../../components/events/EventTemplateCard');
jest.mock('../../components/events/EventTemplateForm');
jest.mock('../../components/events/EventForm');
jest.mock('../../utils/eventApi', () => ({
  EVENT_TYPES: {
    NETWORKING: 'NETWORKING',
    WORKSHOP: 'WORKSHOP',
    CONFERENCE: 'CONFERENCE',
    SOCIAL: 'SOCIAL',
    CAREER: 'CAREER',
    MENTORSHIP: 'MENTORSHIP'
  },
  EVENT_PRIVACY: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    ALUMNI_ONLY: 'ALUMNI_ONLY'
  }
}));

describe('EventTemplates', () => {
  const mockTemplate = {
    id: 'template-1',
    name: 'Test Template',
    description: 'A test template',
    category: 'NETWORKING',
    eventType: 'NETWORKING',
    isPublic: false,
    usageCount: 5,
    templateData: {
      title: 'Test Event',
      description: 'Test event description',
      location: 'Test Location',
      maxParticipants: 50,
      privacy: 'PUBLIC',
      inviteMessage: 'Join us!',
      tags: ['test', 'template'],
      isOnline: false,
      meetingLink: '',
      organizerName: 'Test Organizer',
      organizerEmail: 'organizer@test.com'
    },
    tags: ['test', 'template'],
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    createdBy: 'user-123',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockPublicTemplate = {
    ...mockTemplate,
    id: 'public-template-1',
    name: 'Public Template',
    isPublic: true
  };

  const mockUseEventTemplates = {
    templates: [],
    publicTemplates: [],
    loading: false,
    error: null,
    loadTemplates: jest.fn(),
    loadPublicTemplates: jest.fn(),
    createTemplate: jest.fn(),
    updateTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
    createEventFromTemplate: jest.fn(),
    clearError: jest.fn(),
  };

  const mockUseEventActions = {
    loading: false,
    error: null,
    clearError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock EventTemplateCard component
    EventTemplateCard.mockImplementation(({ template, onView, onEdit, onDelete, onUse }) => (
      <div data-testid={`template-card-${template.id}`}>
        <h3>{template.name}</h3>
        <p>{template.description}</p>
        <button onClick={() => onView(template)}>View</button>
        <button onClick={() => onEdit(template)}>Edit</button>
        <button onClick={() => onDelete(template)}>Delete</button>
        <button onClick={() => onUse(template)}>Use</button>
      </div>
    ));

    // Mock EventTemplateForm component
    EventTemplateForm.mockImplementation(({ isOpen, onClose, onSubmit }) => (
      isOpen ? (
        <div data-testid="template-form-modal">
          <button onClick={onClose}>Close</button>
          <button onClick={() => onSubmit({ name: 'Test Template' })}>Submit</button>
        </div>
      ) : null
    ));

    // Mock EventForm component
    EventForm.mockImplementation(({ isOpen, onClose, onSubmit }) => (
      isOpen ? (
        <div data-testid="event-form-modal">
          <button onClick={onClose}>Close</button>
          <button onClick={() => onSubmit({ title: 'Test Event' })}>Submit</button>
        </div>
      ) : null
    ));
  });

  describe('rendering', () => {
    it('should render page title and description', () => {
      useEventTemplates.mockReturnValue(mockUseEventTemplates);
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('Event Templates')).toBeInTheDocument();
      expect(screen.getByText('Create, manage, and use event templates to quickly set up events')).toBeInTheDocument();
    });

    it('should render create template button', () => {
      useEventTemplates.mockReturnValue(mockUseEventTemplates);
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('Create Template')).toBeInTheDocument();
    });

    it('should render tabs', () => {
      useEventTemplates.mockReturnValue(mockUseEventTemplates);
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('My Templates (0)')).toBeInTheDocument();
      expect(screen.getByText('Public Templates (0)')).toBeInTheDocument();
    });

    it('should render search input', () => {
      useEventTemplates.mockReturnValue(mockUseEventTemplates);
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByPlaceholderText('Search templates...')).toBeInTheDocument();
    });
  });

  describe('tab switching', () => {
    it('should switch between tabs', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [mockTemplate],
        publicTemplates: [mockPublicTemplate]
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      // Initially shows my templates
      expect(screen.getByTestId('template-card-template-1')).toBeInTheDocument();

      // Switch to public templates
      fireEvent.click(screen.getByText('Public Templates (1)'));
      expect(screen.getByTestId('template-card-public-template-1')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('should filter templates based on search query', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [mockTemplate, { ...mockTemplate, id: 'template-2', name: 'Another Template', description: 'Different description' }]
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      const searchInput = screen.getByPlaceholderText('Search templates...');
      fireEvent.change(searchInput, { target: { value: 'Another' } });

      expect(screen.getByTestId('template-card-template-2')).toBeInTheDocument();
      expect(screen.queryByTestId('template-card-template-1')).not.toBeInTheDocument();
    });
  });

  describe('modal functionality', () => {
    it('should open create template modal', () => {
      useEventTemplates.mockReturnValue(mockUseEventTemplates);
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      fireEvent.click(screen.getByText('Create Template'));
      expect(screen.getByTestId('template-form-modal')).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('should handle create template submission', async () => {
      const mockCreateTemplate = jest.fn().mockResolvedValue({ success: true });
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        createTemplate: mockCreateTemplate
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      fireEvent.click(screen.getByText('Create Template'));
      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(mockCreateTemplate).toHaveBeenCalled();
      });
    });
  });

  describe('error handling', () => {
    it('should display error message', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        error: 'Failed to load templates'
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('Failed to load templates')).toBeInTheDocument();
    });

    it('should clear error when close button is clicked', () => {
      const mockClearError = jest.fn();
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        error: 'Failed to load templates',
        clearError: mockClearError
      });
      useEventActions.mockReturnValue({
        ...mockUseEventActions,
        clearError: jest.fn()
      });

      render(<EventTemplates />);

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('loading states', () => {
    it('should show loading spinner when loading', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        loading: true
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('Loading templates...')).toBeInTheDocument();
    });
  });

  describe('empty states', () => {
    it('should show empty state for my templates', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [],
        publicTemplates: []
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('No templates found')).toBeInTheDocument();
      expect(screen.getByText("You haven't created any templates yet.")).toBeInTheDocument();
    });

    it('should show create template button in empty state for my templates', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [],
        publicTemplates: []
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      expect(screen.getByText('Create Your First Template')).toBeInTheDocument();
    });

    it('should show different message for public templates empty state', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [],
        publicTemplates: []
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      fireEvent.click(screen.getByText('Public Templates (0)'));

      expect(screen.getByText('No public templates available.')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper tab roles', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [mockTemplate],
        publicTemplates: [mockPublicTemplate]
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      render(<EventTemplates />);

      const tabs = screen.getAllByRole('button');
      const tabButtons = tabs.filter(tab => 
        tab.textContent?.includes('My Templates') || tab.textContent?.includes('Public Templates')
      );
      expect(tabButtons).toHaveLength(2);
      expect(tabButtons[0]).toHaveTextContent('My Templates (1)');
      expect(tabButtons[1]).toHaveTextContent('Public Templates (1)');
    });
  });

  describe('responsive design', () => {
    it('should have responsive grid layout', () => {
      useEventTemplates.mockReturnValue({
        ...mockUseEventTemplates,
        templates: [mockTemplate]
      });
      useEventActions.mockReturnValue(mockUseEventActions);

      const { container } = render(<EventTemplates />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });
  });
});
