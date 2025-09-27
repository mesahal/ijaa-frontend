import React from 'react';
import {
  FileText,
  Users,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Copy,
  Star,
  Tag,
  User,
  Globe,
  Lock,
} from 'lucide-react';

/**
 * EventTemplateCard Component
 * Displays individual event template information in a card format
 * 
 * @param {Object} template - Template data
 * @param {boolean} isMyTemplate - Whether the template belongs to current user
 * @param {Function} onView - Callback for viewing template details
 * @param {Function} onEdit - Callback for editing template
 * @param {Function} onDelete - Callback for deleting template
 * @param {Function} onUse - Callback for using template to create event
 * @param {Function} getEventTypeLabel - Function to get event type label
 * @param {Function} getCategoryLabel - Function to get category label
 */
const EventTemplateCard = ({ 
  template, 
  isMyTemplate, 
  onView, 
  onEdit, 
  onDelete, 
  onUse,
  getEventTypeLabel, 
  getCategoryLabel 
}) => {
  if (!template) return null;

  const {
    id,
    name,
    description,
    category,
    eventType,
    isPublic,
    usageCount,
    templateData,
    tags,
    thumbnailUrl,
    createdBy,
    createdAt
  } = template;

  const {
    title,
    location,
    maxParticipants,
    privacy,
    isOnline
  } = templateData;

  /**
   * Format date for display
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get privacy icon
   */
  const getPrivacyIcon = () => {
    return isPublic ? (
      <Globe className="w-4 h-4 text-green-600" title="Public Template" />
    ) : (
      <Lock className="w-4 h-4 text-gray-600" title="Private Template" />
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      {/* Template Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {name}
              </h3>
              {getPrivacyIcon()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Event Type & Category */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {getEventTypeLabel ? getEventTypeLabel(eventType) : eventType}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-700 dark:text-gray-300">
                {getCategoryLabel ? getCategoryLabel(category) : category}
              </span>
            </div>
          </div>

          {/* Template Data Preview */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {title}
              </span>
            </div>
            
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {location} {isOnline && '(Online)'}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Max {maxParticipants} participants
              </span>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Template Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{createdBy}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{usageCount} uses</span>
            </div>
            <span>{formatDate(createdAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(template)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              title="View Template"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onUse(template)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors"
              title="Use Template"
            >
              <Copy className="w-4 h-4" />
            </button>

            {isMyTemplate && (
              <>
                <button
                  onClick={() => onEdit(template)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-md transition-colors"
                  title="Edit Template"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDelete(template)}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  title="Delete Template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTemplateCard;
