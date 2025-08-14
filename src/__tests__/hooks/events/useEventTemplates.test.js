import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventTemplates } from '../../../hooks/events/useEventTemplates';
import { useAuth } from '../../../context/AuthContext';
import { eventApi } from '../../../utils/eventApi';

// Mock dependencies
jest.mock('../../../context/AuthContext');
jest.mock('../../../utils/eventApi');

describe('useEventTemplates', () => {
  const mockUser = {
    token: 'mock-token',
    userId: 'user-123'
  };

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
      maxParticipants: 50
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

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
  });

  describe('initialization', () => {
    it('should initialize with default state', () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useEventTemplates());

      expect(result.current.templates).toEqual([]);
      expect(result.current.publicTemplates).toEqual([]);
      expect(result.current.selectedTemplate).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.initialLoading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.hasTemplates).toBe(false);
      expect(result.current.hasPublicTemplates).toBe(false);
    });

    it('should load templates on mount', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [mockTemplate] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [mockPublicTemplate] });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      expect(result.current.templates).toEqual([mockTemplate]);
      expect(result.current.publicTemplates).toEqual([mockPublicTemplate]);
      expect(result.current.hasTemplates).toBe(true);
      expect(result.current.hasPublicTemplates).toBe(true);
    });

    it('should handle initialization error', async () => {
      eventApi.getAllTemplates.mockRejectedValue(new Error('Failed to load templates'));
      eventApi.getPublicTemplates.mockRejectedValue(new Error('Failed to load public templates'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to load templates');
    });
  });

  describe('loadTemplates', () => {
    it('should load templates successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [mockTemplate] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loadTemplates();
      });

      expect(result.current.templates).toEqual([mockTemplate]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading error', async () => {
      eventApi.getAllTemplates.mockRejectedValue(new Error('Failed to load templates'));
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loadTemplates();
      });

      expect(result.current.error).toBe('Failed to load templates');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('loadPublicTemplates', () => {
    it('should load public templates successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [mockPublicTemplate] });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loadPublicTemplates();
      });

      expect(result.current.publicTemplates).toEqual([mockPublicTemplate]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle public templates loading error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockRejectedValue(new Error('Failed to load public templates'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        await result.current.loadPublicTemplates();
      });

      expect(result.current.error).toBe('Failed to load public templates');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('getTemplateById', () => {
    it('should get template by ID successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.getTemplateById.mockResolvedValue({ data: mockTemplate });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.getTemplateById('template-1');
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockTemplate);
      });

      expect(result.current.selectedTemplate).toEqual(mockTemplate);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle get template by ID error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.getTemplateById.mockRejectedValue(new Error('Template not found'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.getTemplateById('template-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Template not found');
      });

      expect(result.current.error).toBe('Template not found');
      expect(result.current.loading).toBe(false);
    });

    it('should require authentication', async () => {
      useAuth.mockReturnValue({ user: null });

      const { result } = renderHook(() => useEventTemplates());

      await act(async () => {
        await expect(result.current.getTemplateById('template-1')).rejects.toThrow('Authentication required');
      });
    });
  });

  describe('createEventFromTemplate', () => {
    it('should create event from template successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.createEventFromTemplate.mockResolvedValue({ data: { id: 'event-1', title: 'New Event' } });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.createEventFromTemplate('template-1', { title: 'New Event' });
        expect(response.success).toBe(true);
        expect(response.data).toEqual({ id: 'event-1', title: 'New Event' });
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle create event from template error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.createEventFromTemplate.mockRejectedValue(new Error('Failed to create event'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.createEventFromTemplate('template-1', { title: 'New Event' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to create event');
      });

      expect(result.current.error).toBe('Failed to create event');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('searchTemplates', () => {
    it('should search templates successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.searchTemplates.mockResolvedValue({ data: [mockTemplate] });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.searchTemplates({ name: 'test' });
        expect(response.success).toBe(true);
        expect(response.data).toEqual([mockTemplate]);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle search error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.searchTemplates.mockRejectedValue(new Error('Search failed'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.searchTemplates({ name: 'test' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Search failed');
      });

      expect(result.current.error).toBe('Search failed');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('createTemplate', () => {
    it('should create template successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.createTemplate.mockResolvedValue({ data: mockTemplate });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.createTemplate(mockTemplate);
        expect(response.success).toBe(true);
        expect(response.data).toEqual(mockTemplate);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle create template error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.createTemplate.mockRejectedValue(new Error('Failed to create template'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.createTemplate(mockTemplate);
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to create template');
      });

      expect(result.current.error).toBe('Failed to create template');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('updateTemplate', () => {
    it('should update template successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.updateTemplate.mockResolvedValue({ data: { ...mockTemplate, name: 'Updated Template' } });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.updateTemplate('template-1', { name: 'Updated Template' });
        expect(response.success).toBe(true);
        expect(response.data.name).toBe('Updated Template');
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle update template error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.updateTemplate.mockRejectedValue(new Error('Failed to update template'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.updateTemplate('template-1', { name: 'Updated Template' });
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to update template');
      });

      expect(result.current.error).toBe('Failed to update template');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete template successfully', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.deleteTemplate.mockResolvedValue({ code: '200', data: { message: 'Template deleted successfully' } });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.deleteTemplate('template-1');
        expect(response.success).toBe(true);
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle delete template error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.deleteTemplate.mockRejectedValue(new Error('Failed to delete template'));

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      await act(async () => {
        const response = await result.current.deleteTemplate('template-1');
        expect(response.success).toBe(false);
        expect(response.error).toBe('Failed to delete template');
      });

      expect(result.current.error).toBe('Failed to delete template');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('utility functions', () => {
    it('should clear error', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      // Set an error first
      await act(async () => {
        await result.current.loadTemplates();
      });

      // Mock the error
      eventApi.getAllTemplates.mockRejectedValue(new Error('Test error'));
      await act(async () => {
        await result.current.loadTemplates();
      });

      expect(result.current.error).toBe('Test error');

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear selected template', async () => {
      eventApi.getAllTemplates.mockResolvedValue({ data: [] });
      eventApi.getPublicTemplates.mockResolvedValue({ data: [] });
      eventApi.getTemplateById.mockResolvedValue({ data: mockTemplate });

      const { result } = renderHook(() => useEventTemplates());

      await waitFor(() => {
        expect(result.current.initialLoading).toBe(false);
      });

      // Set a selected template first
      await act(async () => {
        await result.current.getTemplateById('template-1');
      });

      expect(result.current.selectedTemplate).toEqual(mockTemplate);

      // Clear the selected template
      act(() => {
        result.current.clearSelectedTemplate();
      });

      expect(result.current.selectedTemplate).toBeNull();
    });
  });
});
