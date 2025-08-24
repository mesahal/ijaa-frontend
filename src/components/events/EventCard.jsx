import React from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  User,
  Shield,
  ShieldCheck,
  ShieldX,
} from 'lucide-react';

/**
 * EventCard Component
 * Displays individual event information in a card format
 * 
 * @param {Object} event - Event data
 * @param {boolean} isMyEvent - Whether the event belongs to current user
 * @param {Function} onView - Callback for viewing event details
 * @param {Function} onEdit - Callback for editing event
 * @param {Function} onDelete - Callback for deleting event
 * @param {Function} getEventTypeLabel - Function to get event type label
 * @param {Function} formatDate - Function to format date
 */
const EventCard = ({ 
  event, 
  isMyEvent, 
  onView, 
  onEdit, 
  onDelete, 
  getEventTypeLabel, 
  formatDate 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow h-80 flex flex-col overflow-hidden">
      {/* Event Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-start justify-between mb-3 flex-shrink-0">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
              <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {getEventTypeLabel(event.eventType)}
            </span>
          </div>
          {isMyEvent && (
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <button
                onClick={() => onEdit(event)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit Event"
                aria-label={`Edit event: ${event.title}`}
              >
                <Edit className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Event"
                aria-label={`Delete event: ${event.title}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        <div className="overflow-hidden flex-1 min-h-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-1 overflow-hidden flex-shrink-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate min-w-0 flex-1">{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate min-w-0 flex-1">
              {event.isOnline ? "Online Event" : event.location}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span className="truncate min-w-0 flex-1">
              {event.currentParticipants}/{event.maxParticipants} participants
            </span>
          </div>
        </div>
      </div>

      {/* Event Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <User className="h-4 w-4 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {event.organizerName}
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Privacy Badge */}
            {event.privacy && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                event.privacy === 'PUBLIC' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                  : event.privacy === 'PRIVATE'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
              }`}>
                {event.privacy === 'PUBLIC' ? (
                  <ShieldCheck className="h-3 w-3 inline mr-1" aria-hidden="true" />
                ) : event.privacy === 'PRIVATE' ? (
                  <ShieldX className="h-3 w-3 inline mr-1" aria-hidden="true" />
                ) : (
                  <Shield className="h-3 w-3 inline mr-1" aria-hidden="true" />
                )}
                {event.privacy}
              </span>
            )}
            <button
              onClick={() => onView(event)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
              aria-label={`View details for event: ${event.title}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>View</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
