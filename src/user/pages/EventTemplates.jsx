import React, { useState, useCallback } from 'react';
import {
  FileText,
  Plus,
  Search,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';

// Import custom hooks
import { useEventTemplates } from '../hooks/events/useEventTemplates';
import { useEventActions } from '../hooks/events/useEventActions';

// Import components
import EventTemplateCard from '../components/events/EventTemplateCard';
import EventTemplateForm from '../components/events/EventTemplateForm';
import EventForm from '../components/events/EventForm';

// Import constants
import { EVENT_TYPES, EVENT_PRIVACY  } from '../../services/api/eventApi';

/**
 * EventTemplates Page Component
 * Main page for managing event templates
 */
const EventTemplates = () => {
  // Custom hooks
  const {
    templates,
    publicTemplates,
    loading: templatesLoading,
    error: templatesError,
    loadTemplates,
    loadPublicTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createEventFromTemplate,
    clearError: clearTemplatesError,
  } = useEventTemplates();

  const {
    loading: actionsLoading,
    error: actionsError,
    clearError: clearActionsError,
  } = useEventActions();

  // Local state
  const [activeTab, setActiveTab] = useState('my-templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateForm, setTemplateForm] = useState(getInitialTemplateForm());
  const [eventForm, setEventForm] = useState(getInitialEventForm());

  // Constants
  const EVENT_TYPE_OPTIONS = [
    { value: EVENT_TYPES.NETWORKING, label: "Networking" },
    { value: EVENT_TYPES.WORKSHOP, label: "Workshop" },
    { value: EVENT_TYPES.CONFERENCE, label: "Conference" },
    { value: EVENT_TYPES.SOCIAL, label: "Social" },
    { value: EVENT_TYPES.CAREER, label: "Career" },
    { value: EVENT_TYPES.MENTORSHIP, label: "Mentorship" },
  ];

  const CATEGORY_OPTIONS = [
    { value: 'NETWORKING', label: "Networking" },
    { value: 'WORKSHOP', label: "Workshop" },
    { value: 'CONFERENCE', label: "Conference" },
    { value: 'SOCIAL', label: "Social" },
    { value: 'CAREER', label: "Career" },
    { value: 'MENTORSHIP', label: "Mentorship" },
    { value: 'GENERAL', label: "General" },
    { value: 'CUSTOM', label: "Custom" },
  ];

  // Combined loading and error states
  const isLoading = templatesLoading || actionsLoading;
  const error = templatesError || actionsError;

  function getInitialTemplateForm() {
    return {
      name: "",
      description: "",
      category: "",
      eventType: EVENT_TYPES.NETWORKING,
      isPublic: false,
      tags: [],
      templateData: {
        title: "",
        description: "",
        location: "",
        maxParticipants: 50,
        privacy: EVENT_PRIVACY.PUBLIC,
        inviteMessage: "",
        tags: [],
        isOnline: false,
        meetingLink: "",
        organizerName: "",
        organizerEmail: "",
      },
    };
  }

  function getInitialEventForm() {
    return {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      eventType: EVENT_TYPES.NETWORKING,
      isOnline: false,
      meetingLink: "",
      maxParticipants: 50,
      organizerName: "",
      organizerEmail: "",
      privacy: EVENT_PRIVACY.PUBLIC,
      inviteMessage: "",
    };
  }

  const handleCreateTemplate = useCallback(async (formData) => {
    const result = await createTemplate(formData);
    if (result.success) {
      setShowCreateTemplateModal(false);
      setTemplateForm(getInitialTemplateForm());
    }
  }, [createTemplate]);

  const handleEditTemplate = useCallback(async (formData) => {
    if (!selectedTemplate) return;
    const result = await updateTemplate(selectedTemplate.id, formData);
    if (result.success) {
      setShowEditTemplateModal(false);
      setSelectedTemplate(null);
      setTemplateForm(getInitialTemplateForm());
    }
  }, [updateTemplate, selectedTemplate]);

  const handleDeleteTemplate = useCallback(async (template) => {
    if (!window.confirm(`Delete template "${template.name}"?`)) return;
    const result = await deleteTemplate(template.id);
    if (result.success) {
    }
  }, [deleteTemplate]);

  const handleUseTemplate = useCallback((template) => {
    const now = new Date();
    const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    setEventForm({
      title: template.templateData.title,
      description: template.templateData.description,
      startDate: startDate.toISOString().slice(0, 16),
      endDate: endDate.toISOString().slice(0, 16),
      location: template.templateData.location,
      eventType: template.templateData.eventType,
      isOnline: template.templateData.isOnline,
      meetingLink: template.templateData.meetingLink || "",
      maxParticipants: template.templateData.maxParticipants,
      organizerName: template.templateData.organizerName,
      organizerEmail: template.templateData.organizerEmail,
      privacy: template.templateData.privacy,
      inviteMessage: template.templateData.inviteMessage,
    });

    setSelectedTemplate(template);
    setShowCreateEventModal(true);
  }, []);

  const handleCreateEventFromTemplate = useCallback(async (eventFormData) => {
    if (!selectedTemplate) return;
    const result = await createEventFromTemplate(selectedTemplate.id, eventFormData);
    if (result.success) {
      setShowCreateEventModal(false);
      setSelectedTemplate(null);
      setEventForm(getInitialEventForm());
    }
  }, [createEventFromTemplate, selectedTemplate]);

  const handleEditTemplateClick = useCallback((template) => {
    setTemplateForm({
      name: template.name,
      description: template.description,
      category: template.category,
      eventType: template.eventType,
      isPublic: template.isPublic,
      tags: template.tags || [],
      templateData: {
        title: template.templateData.title,
        description: template.templateData.description,
        location: template.templateData.location,
        maxParticipants: template.templateData.maxParticipants,
        privacy: template.templateData.privacy,
        inviteMessage: template.templateData.inviteMessage,
        tags: template.templateData.tags || [],
        isOnline: template.templateData.isOnline,
        meetingLink: template.templateData.meetingLink || "",
        organizerName: template.templateData.organizerName,
        organizerEmail: template.templateData.organizerEmail,
      },
    });

    setSelectedTemplate(template);
    setShowEditTemplateModal(true);
  }, []);

  const getEventTypeLabel = useCallback((eventType) => {
    const type = EVENT_TYPE_OPTIONS.find(t => t.value === eventType);
    return type ? type.label : eventType;
  }, []);

  const getCategoryLabel = useCallback((category) => {
    const cat = CATEGORY_OPTIONS.find(c => c.value === category);
    return cat ? cat.label : category;
  }, []);

  const getFilteredTemplates = useCallback(() => {
    const currentTemplates = activeTab === 'my-templates' ? templates : publicTemplates;
    
    if (!searchQuery) return currentTemplates;

    return currentTemplates.filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.templateData.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeTab, templates, publicTemplates, searchQuery]);

  const filteredTemplates = getFilteredTemplates();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Event Templates
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create, manage, and use event templates to quickly set up events
              </p>
            </div>
            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 dark:text-red-200">{error}</span>
            <button
              onClick={() => {
                clearTemplatesError();
                clearActionsError();
              }}
              className="ml-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('my-templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                My Templates ({templates.length})
              </button>
              <button
                onClick={() => setActiveTab('public-templates')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'public-templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Public Templates ({publicTemplates.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading templates...</span>
          </div>
        )}

        {/* Templates Grid */}
        {!isLoading && (
          <>
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No templates found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {activeTab === 'my-templates' 
                    ? "You haven't created any templates yet."
                    : "No public templates available."
                  }
                </p>
                {activeTab === 'my-templates' && (
                  <button
                    onClick={() => setShowCreateTemplateModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Template
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <EventTemplateCard
                    key={template.id}
                    template={template}
                    isMyTemplate={activeTab === 'my-templates'}
                    onEdit={handleEditTemplateClick}
                    onDelete={handleDeleteTemplate}
                    onUse={handleUseTemplate}
                    getEventTypeLabel={getEventTypeLabel}
                    getCategoryLabel={getCategoryLabel}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {showCreateTemplateModal && (
          <EventTemplateForm
            isOpen={showCreateTemplateModal}
            onClose={() => {
              setShowCreateTemplateModal(false);
              setTemplateForm(getInitialTemplateForm());
            }}
            onSubmit={handleCreateTemplate}
            formData={templateForm}
            setFormData={setTemplateForm}
            selectedTemplate={null}
            loading={isLoading}
            eventTypeOptions={EVENT_TYPE_OPTIONS}
            categoryOptions={CATEGORY_OPTIONS}
          />
        )}

        {showEditTemplateModal && selectedTemplate && (
          <EventTemplateForm
            isOpen={showEditTemplateModal}
            onClose={() => {
              setShowEditTemplateModal(false);
              setSelectedTemplate(null);
              setTemplateForm(getInitialTemplateForm());
            }}
            onSubmit={handleEditTemplate}
            formData={templateForm}
            setFormData={setTemplateForm}
            selectedTemplate={selectedTemplate}
            loading={isLoading}
            eventTypeOptions={EVENT_TYPE_OPTIONS}
            categoryOptions={CATEGORY_OPTIONS}
          />
        )}

        {showCreateEventModal && selectedTemplate && (
          <EventForm
            isOpen={showCreateEventModal}
            onClose={() => {
              setShowCreateEventModal(false);
              setSelectedTemplate(null);
              setEventForm(getInitialEventForm());
            }}
            onSubmit={handleCreateEventFromTemplate}
            formData={eventForm}
            setFormData={setEventForm}
            selectedEvent={null}
            loading={isLoading}
            eventTypeOptions={EVENT_TYPE_OPTIONS}
          />
        )}
      </div>
    </div>
  );
};

export default EventTemplates;
