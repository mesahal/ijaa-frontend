import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventTemplateCard from '../../../components/events/EventTemplateCard';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-text-icon">FileText</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  Calendar: () => <div data-testid="calendar-icon">Calendar</div>,
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
  Trash2: () => <div data-testid="trash-icon">Trash2</div>,
  Copy: () => <div data-testid="copy-icon">Copy</div>,
  Star: () => <div data-testid="star-icon">Star</div>,
  Tag: () => <div data-testid="tag-icon">Tag</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Globe: () => <div data-testid="globe-icon">Globe</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
}));

describe('EventTemplateCard', () => {
  const mockTemplate = {
    id: 'template-123',
    name: 'Test Template',
    description: 'A test template for networking events',
    category: 'NETWORKING',
    eventType: 'NETWORKING',
    isPublic: true,
    usageCount: 5,
    templateData: {
      title: 'Test Event',
      description: 'Test event description',
      location: 'Test Location',
      maxParticipants: 50,
      privacy: 'PUBLIC',
      inviteMessage: 'Join us!',
      tags: ['test', 'networking'],
      isOnline: false,
      meetingLink: '',
      organizerName: 'Test Organizer',
      organizerEmail: 'organizer@test.com'
    },
    tags: ['test', 'template'],
    createdBy: 'testuser',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockPrivateTemplate = {
    ...mockTemplate,
    id: 'private-template-123',
    name: 'Private Template',
    isPublic: false
  };

  const mockOnlineTemplate = {
    ...mockTemplate,
    id: 'online-template-123',
    name: 'Online Template',
    templateData: {
      ...mockTemplate.templateData,
      isOnline: true,
      meetingLink: 'https://meet.google.com/test'
    }
  };

  const defaultProps = {
    template: mockTemplate,
    isMyTemplate: true,
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onUse: jest.fn(),
    getEventTypeLabel: jest.fn((type) => type),
    getCategoryLabel: jest.fn((category) => category),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render template information correctly', () => {
      render(<EventTemplateCard {...defaultProps} />);

      expect(screen.getByText('Test Template')).toBeInTheDocument();
      expect(screen.getByText('A test template for networking events')).toBeInTheDocument();
      expect(screen.getByText('Test Event')).toBeInTheDocument();
      expect(screen.getByText('Test Location')).toBeInTheDocument();
      expect(screen.getByText('Max 50 participants')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('5 uses')).toBeInTheDocument();
    });

    it('should render public template with globe icon', () => {
      render(<EventTemplateCard {...defaultProps} />);

      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
      expect(screen.getByTitle('Public Template')).toBeInTheDocument();
    });

    it('should render private template with lock icon', () => {
      render(<EventTemplateCard {...defaultProps} template={mockPrivateTemplate} />);

      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      expect(screen.getByTitle('Private Template')).toBeInTheDocument();
    });

    it('should render online event indicator', () => {
      render(<EventTemplateCard {...defaultProps} template={mockOnlineTemplate} />);

      expect(screen.getByText('Test Location (Online)')).toBeInTheDocument();
    });

    it('should render tags correctly', () => {
      render(<EventTemplateCard {...defaultProps} />);

      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('template')).toBeInTheDocument();
    });

    it('should render truncated tags when there are more than 3', () => {
      const templateWithManyTags = {
        ...mockTemplate,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
      };

      render(<EventTemplateCard {...defaultProps} template={templateWithManyTags} />);

      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
      expect(screen.getByText('tag3')).toBeInTheDocument();
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('should format date correctly', () => {
      render(<EventTemplateCard {...defaultProps} />);

      // The date should be formatted as "Jan 1, 2024"
      expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('should render all action buttons for my template', () => {
      render(<EventTemplateCard {...defaultProps} />);

      expect(screen.getByTitle('View Template')).toBeInTheDocument();
      expect(screen.getByTitle('Use Template')).toBeInTheDocument();
      expect(screen.getByTitle('Edit Template')).toBeInTheDocument();
      expect(screen.getByTitle('Delete Template')).toBeInTheDocument();
    });

    it('should not render edit and delete buttons for non-my template', () => {
      render(<EventTemplateCard {...defaultProps} isMyTemplate={false} />);

      expect(screen.getByTitle('View Template')).toBeInTheDocument();
      expect(screen.getByTitle('Use Template')).toBeInTheDocument();
      expect(screen.queryByTitle('Edit Template')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Delete Template')).not.toBeInTheDocument();
    });

    it('should call onView when view button is clicked', () => {
      render(<EventTemplateCard {...defaultProps} />);

      fireEvent.click(screen.getByTitle('View Template'));

      expect(defaultProps.onView).toHaveBeenCalledWith(mockTemplate);
    });

    it('should call onUse when use button is clicked', () => {
      render(<EventTemplateCard {...defaultProps} />);

      fireEvent.click(screen.getByTitle('Use Template'));

      expect(defaultProps.onUse).toHaveBeenCalledWith(mockTemplate);
    });

    it('should call onEdit when edit button is clicked', () => {
      render(<EventTemplateCard {...defaultProps} />);

      fireEvent.click(screen.getByTitle('Edit Template'));

      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockTemplate);
    });

    it('should call onDelete when delete button is clicked', () => {
      render(<EventTemplateCard {...defaultProps} />);

      fireEvent.click(screen.getByTitle('Delete Template'));

      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockTemplate);
    });
  });

  describe('event type and category labels', () => {
    it('should use custom label functions when provided', () => {
      const customGetEventTypeLabel = jest.fn((type) => `Custom ${type}`);
      const customGetCategoryLabel = jest.fn((category) => `Custom ${category}`);

      render(
        <EventTemplateCard
          {...defaultProps}
          getEventTypeLabel={customGetEventTypeLabel}
          getCategoryLabel={customGetCategoryLabel}
        />
      );

      expect(customGetEventTypeLabel).toHaveBeenCalledWith('NETWORKING');
      expect(customGetCategoryLabel).toHaveBeenCalledWith('NETWORKING');
    });

    it('should fallback to original values when label functions are not provided', () => {
      render(<EventTemplateCard {...defaultProps} getEventTypeLabel={undefined} getCategoryLabel={undefined} />);

      expect(screen.getByText('NETWORKING')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle missing template gracefully', () => {
      render(<EventTemplateCard {...defaultProps} template={null} />);

      expect(screen.queryByText('Test Template')).not.toBeInTheDocument();
    });

    it('should handle missing location', () => {
      const templateWithoutLocation = {
        ...mockTemplate,
        templateData: {
          ...mockTemplate.templateData,
          location: ''
        }
      };

      render(<EventTemplateCard {...defaultProps} template={templateWithoutLocation} />);

      expect(screen.queryByText('Test Location')).not.toBeInTheDocument();
    });

    it('should handle missing tags', () => {
      const templateWithoutTags = {
        ...mockTemplate,
        tags: []
      };

      render(<EventTemplateCard {...defaultProps} template={templateWithoutTags} />);

      expect(screen.queryByText('test')).not.toBeInTheDocument();
      expect(screen.queryByText('template')).not.toBeInTheDocument();
    });

    it('should handle missing template data', () => {
      const templateWithoutData = {
        ...mockTemplate,
        templateData: null
      };

      render(<EventTemplateCard {...defaultProps} template={templateWithoutData} />);

      // Should still render basic template info
      expect(screen.getByText('Test Template')).toBeInTheDocument();
      expect(screen.getByText('A test template for networking events')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA labels and titles', () => {
      render(<EventTemplateCard {...defaultProps} />);

      expect(screen.getByTitle('View Template')).toBeInTheDocument();
      expect(screen.getByTitle('Use Template')).toBeInTheDocument();
      expect(screen.getByTitle('Edit Template')).toBeInTheDocument();
      expect(screen.getByTitle('Delete Template')).toBeInTheDocument();
      expect(screen.getByTitle('Public Template')).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<EventTemplateCard {...defaultProps} />);

      const viewButton = screen.getByTitle('View Template');
      const useButton = screen.getByTitle('Use Template');

      expect(viewButton).toHaveAttribute('role', 'button');
      expect(useButton).toHaveAttribute('role', 'button');

      // Test keyboard navigation
      viewButton.focus();
      expect(viewButton).toHaveFocus();

      fireEvent.keyDown(viewButton, { key: 'Enter' });
      expect(defaultProps.onView).toHaveBeenCalledWith(mockTemplate);
    });
  });

  describe('styling and layout', () => {
    it('should have proper CSS classes for styling', () => {
      const { container } = render(<EventTemplateCard {...defaultProps} />);

      const card = container.firstChild;
      expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow-md');
    });

    it('should have hover effects', () => {
      const { container } = render(<EventTemplateCard {...defaultProps} />);

      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow', 'duration-200');
    });

    it('should have proper border styling', () => {
      const { container } = render(<EventTemplateCard {...defaultProps} />);

      const card = container.firstChild;
      expect(card).toHaveClass('border', 'border-gray-200', 'dark:border-gray-700');
    });
  });
});
