import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventApi } from '../../utils/eventApi';

/**
 * Custom hook for managing event templates
 * Handles template CRUD operations, search, and template-based event creation
 */
export const useEventTemplates = () => {
  const { user } = useAuth();
  
  // State management
  const [templates, setTemplates] = useState([]);
  const [publicTemplates, setPublicTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load all templates
   */
  const loadTemplates = useCallback(async () => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.getAllTemplates();
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        setTemplates(response.data || response);
      } else {
        throw new Error(response?.message || 'Failed to load templates');
      }
    } catch (err) {
      console.error('Error loading templates:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  /**
   * Load public templates
   */
  const loadPublicTemplates = useCallback(async () => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.getPublicTemplates();
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        setPublicTemplates(response.data || response);
      } else {
        throw new Error(response?.message || 'Failed to load public templates');
      }
    } catch (err) {
      console.error('Error loading public templates:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load public templates');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  /**
   * Initialize templates data
   */
  const initializeTemplates = useCallback(async () => {
    if (!user?.token) {
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    setError(null);

    try {
      // Load both templates and public templates concurrently
      const [templatesResponse, publicTemplatesResponse] = await Promise.all([
        eventApi.getAllTemplates().catch(err => ({ error: err })),
        eventApi.getPublicTemplates().catch(err => ({ error: err }))
      ]);

      // Handle templates response
      if (templatesResponse && !templatesResponse.error && 
          (templatesResponse.code === '200' || templatesResponse.code === 200 || templatesResponse.data)) {
        setTemplates(templatesResponse.data || templatesResponse);
      }

      // Handle public templates response
      if (publicTemplatesResponse && !publicTemplatesResponse.error && 
          (publicTemplatesResponse.code === '200' || publicTemplatesResponse.code === 200 || publicTemplatesResponse.data)) {
        setPublicTemplates(publicTemplatesResponse.data || publicTemplatesResponse);
      }

      // Set error if both failed
      if (templatesResponse?.error && publicTemplatesResponse?.error) {
        setError('Failed to load templates');
      }
    } catch (err) {
      console.error('Error initializing templates:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load templates');
    } finally {
      setInitialLoading(false);
    }
  }, [user?.token]);

  /**
   * Get template by ID
   */
  const getTemplateById = useCallback(async (templateId) => {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.getTemplateById(templateId);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        const template = response.data || response;
        setSelectedTemplate(template);
        return { success: true, data: template };
      } else {
        throw new Error(response?.message || 'Failed to get template');
      }
    } catch (err) {
      console.error('Error getting template:', err);
      setError(err.response?.data?.message || err.message || 'Failed to get template');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  /**
   * Create event from template
   */
  const createEventFromTemplate = useCallback(async (templateId, eventData = {}) => {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.createEventFromTemplate(templateId, eventData);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        return { success: true, data: response.data || response };
      } else {
        throw new Error(response?.message || 'Failed to create event from template');
      }
    } catch (err) {
      console.error('Error creating event from template:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create event from template');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  /**
   * Search templates
   */
  const searchTemplates = useCallback(async (searchParams = {}) => {
    if (!user?.token) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.searchTemplates(searchParams);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        return { success: true, data: response.data || response };
      } else {
        throw new Error(response?.message || 'Failed to search templates');
      }
    } catch (err) {
      console.error('Error searching templates:', err);
      setError(err.response?.data?.message || err.message || 'Failed to search templates');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  /**
   * Create new template
   */
  const createTemplate = useCallback(async (templateData) => {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.createTemplate(templateData);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        // Refresh templates list
        await loadTemplates();
        return { success: true, data: response.data || response };
      } else {
        throw new Error(response?.message || 'Failed to create template');
      }
    } catch (err) {
      console.error('Error creating template:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create template');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user?.token, loadTemplates]);

  /**
   * Update template
   */
  const updateTemplate = useCallback(async (templateId, templateData) => {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.updateTemplate(templateId, templateData);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        // Refresh templates list
        await loadTemplates();
        return { success: true, data: response.data || response };
      } else {
        throw new Error(response?.message || 'Failed to update template');
      }
    } catch (err) {
      console.error('Error updating template:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update template');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user?.token, loadTemplates]);

  /**
   * Delete template
   */
  const deleteTemplate = useCallback(async (templateId) => {
    if (!user?.token) {
      throw new Error('Authentication required');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await eventApi.deleteTemplate(templateId);
      if (response && (response.code === '200' || response.code === 200 || response.data)) {
        // Refresh templates list
        await loadTemplates();
        return { success: true };
      } else {
        throw new Error(response?.message || 'Failed to delete template');
      }
    } catch (err) {
      console.error('Error deleting template:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete template');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user?.token, loadTemplates]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear selected template
   */
  const clearSelectedTemplate = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  // Initialize templates on component mount
  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  return {
    // State
    templates,
    publicTemplates,
    selectedTemplate,
    loading,
    initialLoading,
    error,
    
    // Actions
    loadTemplates,
    loadPublicTemplates,
    initializeTemplates,
    getTemplateById,
    createEventFromTemplate,
    searchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    clearError,
    clearSelectedTemplate,
    
    // Utilities
    hasTemplates: templates.length > 0,
    hasPublicTemplates: publicTemplates.length > 0,
  };
};
