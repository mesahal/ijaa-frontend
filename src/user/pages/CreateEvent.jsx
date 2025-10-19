import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Save,
  X,
  MapPin,
  Users,
  Globe,
  Lock,
  Unlock,
  Clock,
  FileText,
  Settings,
  Image,
  Upload,
  Trash2,
} from 'lucide-react';

// Import authentication context
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

// Import custom hooks
import { useEventActions } from '../hooks/events/useEventActions';
import useEventBanner from '../hooks/events/useEventBanner';

// Import services
import eventService from '../../services/api/eventService';

// Import UI components
import { Button, Card, Badge, Input   } from '../../components/ui';

// Import constants
import { EVENT_CATEGORIES, EVENT_TYPES, EVENT_PRIVACY  } from '../../services/api/eventApi';

// Constants
const EVENT_CATEGORY_OPTIONS = [
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'CONFERENCE', label: 'Conference' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'CAREER', label: 'Career' },
  { value: 'MENTORSHIP', label: 'Mentorship' }
];

const EVENT_PRIVACY_OPTIONS = [
  { value: 'PUBLIC', label: 'Public', icon: Unlock, description: 'Anyone can see and join' },
  { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only invited users can join' }
];

const INITIAL_EVENT_FORM = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  maxParticipants: '',
  eventType: 'NETWORKING',
  isOnline: false,
  meetingLink: '',
  privacy: 'PUBLIC',
  inviteMessage: '',
  bannerImage: null,
  organizerName: '',
  organizerEmail: ''
};

/**
 * CreateEvent Page Component
 * Full-page event creation form with modern design
 * 
 * Features:
 * - Modern card-based layout
 * - Responsive design
 * - Enhanced visual hierarchy
 * - Modern form elements
 * - Improved spacing and typography
 * - Edit mode support
 */
const CreateEvent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); // For edit mode
  const { user } = useAuth();
  
  // State management
  const [formData, setFormData] = useState(INITIAL_EVENT_FORM);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  
  // State for banner deletion staging
  const [shouldDeleteBanner, setShouldDeleteBanner] = useState(false);

  // Custom hooks
  const {
    loading: actionsLoading,
    error: actionsError,
    handleCreateEvent,
    handleUpdateEvent,
    clearError: clearActionsError,
  } = useEventActions(() => {
    // Dummy refresh function - not needed for create/edit pages
  });

  // Event banner hook (for edit mode)
  const {
    bannerUrl,
    bannerExists,
    loading: bannerLoading,
    uploadBanner,
    deleteBanner,
    loadBannerUrl,
    clearError: clearBannerError,
  } = useEventBanner(eventId);

  // Check if we're in edit mode
  useEffect(() => {
    if (eventId) {
      setIsEditMode(true);
      setShouldDeleteBanner(false); // Reset staged deletion
      loadEventForEdit(eventId);
      // Load banner for edit mode
      loadBannerUrl();
    }
  }, [eventId, loadBannerUrl]);

  // Load event data for editing
  const loadEventForEdit = async (id) => {
    setEventLoading(true);
    try {
      console.log('🔄 [CreateEvent] Loading event for edit:', id);
      
      // Try to get user's own event first
      let response;
      try {
        response = await eventService.getMyEventById(id);
        console.log('✅ [CreateEvent] Got user event data:', response);
      } catch (myEventError) {
        console.log('⚠️ [CreateEvent] Failed to get user event, trying public endpoint:', myEventError);
        // Fallback to public endpoint
        response = await eventService.getEventById(id);
        console.log('✅ [CreateEvent] Got public event data:', response);
      }
      
      // Handle different response structures
      let event;
      if (response && response.data) {
        event = response.data;
      } else if (response) {
        event = response;
      } else {
        throw new Error('No response received from server');
      }

      console.log('📝 [CreateEvent] Processing event data:', event);
      
      if (event && (event.title || event.id)) {
        const eventData = {
          title: event.title || '',
          description: event.description || '',
          location: event.location || '',
          startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
          endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
          maxParticipants: event.maxParticipants?.toString() || '',
          eventType: event.eventType || event.category || 'NETWORKING',
          isOnline: event.isOnline || false,
          meetingLink: event.meetingLink || '',
          privacy: event.privacy || 'PUBLIC',
          inviteMessage: event.inviteMessage || '',
          organizerName: event.organizerName || user?.name || '',
          organizerEmail: event.organizerEmail || user?.email || ''
        };
        
        console.log('📋 [CreateEvent] Setting form data:', eventData);
        setFormData(eventData);
        toast.success('Event data loaded successfully');
      } else {
        console.error('❌ [CreateEvent] Invalid event data structure:', event);
        toast.error('Invalid event data received');
      }
    } catch (error) {
      console.error('❌ [CreateEvent] Error loading event for edit:', error);
      toast.error(`Failed to load event data: ${error.message || 'Unknown error'}`);
    } finally {
      setEventLoading(false);
    }
  };

  // Initialize organizer fields with user data
  useEffect(() => {
    if (user && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        organizerName: user.name || '',
        organizerEmail: user.email || ''
      }));
    }
  }, [user, isEditMode]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    if (!formData.isOnline && !formData.location.trim()) {
      newErrors.location = 'Location is required for in-person events';
    }

    if (formData.isOnline && !formData.meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required for online events';
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants = 'Maximum participants must be greater than 0';
    }

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Organizer name is required';
    }

    if (!formData.organizerEmail.trim()) {
      newErrors.organizerEmail = 'Organizer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.organizerEmail)) {
      newErrors.organizerEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        console.log('Updating event...');
        
        // Handle staged banner deletion
        if (shouldDeleteBanner) {
          try {
            await deleteBanner();
            console.log('Banner deleted successfully');
          } catch (bannerError) {
            console.error('Error deleting banner:', bannerError);
            // Don't fail the entire update if banner deletion fails
            toast.warning('Event updated but failed to delete banner');
          }
        }
        
        const result = await handleUpdateEvent(eventId, formData);
        if (result && result.success) {
          toast.success('Event updated successfully');
          // Redirect to the specific event page
          navigate(`/user/events/${eventId}`);
          return; // Exit early to prevent further processing
        } else {
          throw new Error(result?.error || 'Failed to update event');
        }
      } else {
        console.log('Creating new event...');
        const result = await handleCreateEvent(formData);
        console.log('Event creation result:', result);
        
        if (result && result.success) {
          // If we have a banner image and event was created successfully, upload it
          if (formData.bannerImage && result?.data?.id) {
            try {
              console.log('Uploading banner image...');
              const newEventId = result.data.id;
              await eventService.uploadEventBanner(newEventId, formData.bannerImage);
            } catch (bannerError) {
              console.error('Banner upload failed:', bannerError);
              // Don't fail the entire form submission if banner upload fails
            }
          }
          
          // Navigate back to events page on success
          navigate('/user/events');
        } else {
          console.error('Event creation failed:', result);
          throw new Error(result?.error || 'Failed to create event');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: error.message || 'Failed to save event' });
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle online/offline toggle
  const handleOnlineToggle = (isOnline) => {
    setFormData(prev => ({ 
      ...prev, 
      isOnline,
      meetingLink: isOnline ? prev.meetingLink : ''
    }));
  };

  // Handle banner image selection
  const handleBannerImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, bannerImage: file }));
      // Clear any previous banner errors
      if (errors.bannerImage) {
        setErrors(prev => ({ ...prev, bannerImage: null }));
      }
      
      // In edit mode, automatically upload the banner
      if (isEditMode && eventId) {
        try {
          await handleBannerUpload(file);
        } catch (error) {
          console.error('Error uploading banner:', error);
          toast.error('Failed to upload banner');
        }
      }
    }
  };

  // Handle banner image removal
  const handleRemoveBannerImage = () => {
    setFormData(prev => ({ ...prev, bannerImage: null }));
    if (errors.bannerImage) {
      setErrors(prev => ({ ...prev, bannerImage: null }));
    }
  };

  // Handle banner image upload (for edit mode)
  const handleBannerUpload = async (file) => {
    if (!eventId || !file) return;
    
    try {
      await uploadBanner(file);
      // Clear the form banner image since it's now uploaded
      setFormData(prev => ({ ...prev, bannerImage: null }));
      toast.success('Banner uploaded successfully');
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast.error('Failed to upload banner');
    }
  };

  // Handle banner deletion staging (for edit mode)
  const handleBannerDelete = () => {
    setShouldDeleteBanner(true);
    toast.info('Banner will be deleted when you save the event');
  };

  // Format date for datetime-local input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  // Loading state
  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/events')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Events</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isEditMode ? 'Edit Event' : 'Create New Event'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isEditMode ? 'Update your event details' : 'Organize a new event for the alumni community'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {(actionsError || errors.submit) && (
          <Card className="mb-6 border-error-200 dark:border-error-700">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-error-500 flex-shrink-0" />
                <p className="text-error-700 dark:text-error-300">{actionsError || errors.submit}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearActionsError();
                    setErrors(prev => ({ ...prev, submit: null }));
                  }}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provide the essential details about your event
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Title *
                </label>
                <Input
                  id="event-title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Enter event title"
                  error={errors.title}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="event-description"
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Describe your event in detail..."
                />
              </div>

              {/* Event Type */}
              <div>
                <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type *
                </label>
                <select
                  id="event-type"
                  value={formData.eventType}
                  onChange={(e) => handleFieldChange('eventType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {EVENT_CATEGORY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organizer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="organizer-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organizer Name *
                  </label>
                  <Input
                    id="organizer-name"
                    type="text"
                    required
                    value={formData.organizerName}
                    onChange={(e) => handleFieldChange('organizerName', e.target.value)}
                    placeholder="Enter organizer name"
                    error={errors.organizerName}
                  />
                </div>
                <div>
                  <label htmlFor="organizer-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Organizer Email *
                  </label>
                  <Input
                    id="organizer-email"
                    type="email"
                    required
                    value={formData.organizerEmail}
                    onChange={(e) => handleFieldChange('organizerEmail', e.target.value)}
                    placeholder="Enter organizer email"
                    error={errors.organizerEmail}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Banner Image Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <Image className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Banner Image
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add a banner image to make your event stand out
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Current Banner Display (Edit Mode) */}
              {isEditMode && (
                <>
                  {bannerLoading ? (
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading banner...</span>
                      </div>
                    </div>
                  ) : bannerExists && bannerUrl && !shouldDeleteBanner ? (
                    <div className="relative">
                      <img
                        src={bannerUrl}
                        alt="Current event banner"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        onError={(e) => {
                          console.error('Failed to load banner image:', e);
                          e.target.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleBannerDelete}
                        disabled={bannerLoading}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full transition-colors"
                        title="Delete banner"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : shouldDeleteBanner ? (
                    <div className="w-full h-32 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-600 flex items-center justify-center">
                      <div className="text-center text-red-600 dark:text-red-400">
                        <Trash2 className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Banner marked for deletion</p>
                        <p className="text-xs mt-1">Will be removed when you save</p>
                        <button
                          type="button"
                          onClick={() => setShouldDeleteBanner(false)}
                          className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Undo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <Image className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No banner image</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Banner Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                {formData.bannerImage ? (
                  <div className="space-y-4">
                    <img
                      src={URL.createObjectURL(formData.bannerImage)}
                      alt="Selected banner"
                      className="w-full h-32 object-cover rounded-lg mx-auto"
                    />
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveBannerImage}
                        className="flex items-center space-x-2"
                      >
                        <X className="h-4 w-4" />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </label>
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Error Display */}
              {errors.bannerImage && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.bannerImage}
                </p>
              )}
            </div>
          </Card>

          {/* Date and Time Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Date & Time
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set when your event will take place
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date & Time */}
              <div>
                <label htmlFor="event-start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date & Time *
                </label>
                <Input
                  id="event-start-date"
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                  error={errors.startDate}
                />
              </div>

              {/* End Date & Time */}
              <div>
                <label htmlFor="event-end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date & Time *
                </label>
                <Input
                  id="event-end-date"
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                  error={errors.endDate}
                />
              </div>
            </div>
          </Card>

          {/* Location Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Location
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Where will your event take place?
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Online/Offline Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Event Format
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleOnlineToggle(false)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      !formData.isOnline
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>In-Person</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOnlineToggle(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      formData.isOnline
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Online</span>
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formData.isOnline ? 'Meeting Link' : 'Location'} *
                </label>
                <Input
                  id="event-location"
                  type="text"
                  required
                  value={formData.isOnline ? formData.meetingLink : formData.location}
                  onChange={(e) => handleFieldChange(formData.isOnline ? 'meetingLink' : 'location', e.target.value)}
                  placeholder={formData.isOnline ? 'https://meet.google.com/...' : 'Enter event location'}
                  error={errors.location || errors.meetingLink}
                />
              </div>
            </div>
          </Card>

          {/* Settings Card */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Event Settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure additional event options
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Maximum Participants */}
              <div>
                <label htmlFor="event-max-participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Participants
                </label>
                <Input
                  id="event-max-participants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => handleFieldChange('maxParticipants', e.target.value)}
                  placeholder="No limit"
                  error={errors.maxParticipants}
                />
              </div>

              {/* Privacy */}
              <div>
                <label htmlFor="event-privacy" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Privacy Setting
                </label>
                <select
                  id="event-privacy"
                  value={formData.privacy}
                  onChange={(e) => handleFieldChange('privacy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {EVENT_PRIVACY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Invite Message */}
            <div className="mt-6">
              <label htmlFor="event-invite-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Invite Message (Optional)
              </label>
              <textarea
                id="event-invite-message"
                value={formData.inviteMessage}
                onChange={(e) => handleFieldChange('inviteMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Add a personal message for your invitees..."
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/events')}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                disabled={loading || actionsLoading}
                className="flex items-center space-x-2"
              >
                {loading || actionsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isEditMode ? 'Update Event' : 'Create Event'}</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

