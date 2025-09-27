import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  User,
  Shield,
  ShieldCheck,
  ShieldX,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  Star,
  TrendingUp,
} from 'lucide-react';
import RSVPButtons from './RSVPButtons';
import useEventBanner from '../../hooks/events/useEventBanner';

/**
 * EventCard Component
 * Displays individual event information in a modern Facebook-style card format
 * Updated for modern design with enhanced visual hierarchy
 * 
 * @param {Object} event - Event data
 * @param {boolean} isMyEvent - Whether the event belongs to current user
 * @param {Function} onView - Callback for viewing event details
 * @param {Function} onEdit - Callback for editing event
 * @param {Function} onDelete - Callback for deleting event
 * @param {Function} getEventTypeLabel - Function to get event type label
 * @param {Function} formatDate - Function to format date
 * @param {string} viewMode - View mode (grid/list)
 */
const EventCard = ({ 
  event, 
  isMyEvent, 
  onEdit, 
  onDelete, 
  getEventTypeLabel, 
  formatDate,
  // Phase 3: Event Participation props
  onRsvp,
  onUpdateRsvp,
  rsvpLoading = false,
  currentParticipationStatus = null,
  showRsvpButtons = false,
  viewMode = 'grid'
}) => {
  const navigate = useNavigate();
  const { bannerUrl, loadBannerUrl } = useEventBanner(event?.id);

  // Load banner URL when component mounts
  useEffect(() => {
    if (event?.id) {
      loadBannerUrl();
    }
  }, [event?.id, loadBannerUrl]);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/events/${event.id}`);
  };
  const isUpcoming = new Date(event.startDate) > new Date();
  const isPopular = (event.currentParticipants || 0) > (event.maxParticipants || 0) * 0.7;
  const isOnline = event.isOnline;

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {/* Event Image/Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Event Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {getEventTypeLabel(event.category || event.eventType)}
                    </span>
                    {isUpcoming && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                        Upcoming
                      </span>
                    )}
                    {isPopular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300">
                        Popular
                      </span>
                    )}
                    {isOnline && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        Online
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  {isMyEvent && (
                    <>
                      <button
                        onClick={() => onEdit(event)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(event.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.location || "Location TBD"}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {event.currentParticipants || 0}/{event.maxParticipants || '∞'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{event.organizerName || "Organizer"}</span>
                </div>
              </div>

              {/* RSVP Buttons */}
              {showRsvpButtons && !isMyEvent && (
                <div className="mt-4">
                  <RSVPButtons
                    eventId={event.id}
                    currentStatus={currentParticipationStatus}
                    onRsvp={onRsvp}
                    onUpdateRsvp={onUpdateRsvp}
                    loading={rsvpLoading}
                    showMessageInput={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Event Header */}
      <div className="relative h-32 bg-gray-100 dark:bg-gray-700" style={{
        backgroundImage: `url(${bannerUrl || event.coverImage || event.image || '/cover.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
              {getEventTypeLabel(event.category || event.eventType)}
            </span>
            {isUpcoming && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
                Upcoming
              </span>
            )}
          </div>
          
          {/* Action Menu */}
          <div className="flex items-center space-x-1">
            {isMyEvent && (
              <>
                <button
                  onClick={() => onEdit(event)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Popular Badge */}
        {isPopular && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/50 rounded-full">
              <TrendingUp className="h-3 w-3 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-800 dark:text-orange-300">Popular</span>
            </div>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {event.description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">
              {isOnline ? (
                <span className="flex items-center space-x-1">
                  <span>🌐</span>
                  <span>Online Event</span>
                </span>
              ) : (
                event.location || "Location TBD"
              )}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">
              {event.currentParticipants || 0} of {event.maxParticipants || '∞'} participants
            </span>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {event.organizerName || "Organizer"}
              </p>
              <div className="flex items-center space-x-1">
                {event.isPublic !== false ? (
                  <>
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400">Public</span>
                  </>
                ) : (
                  <>
                    <ShieldX className="h-3 w-3 text-orange-500" />
                    <span className="text-xs text-orange-600 dark:text-orange-400">Private</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-1">
          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            <Heart className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* RSVP Buttons - Phase 3 */}
        {showRsvpButtons && !isMyEvent && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <RSVPButtons
              eventId={event.id}
              currentStatus={currentParticipationStatus}
              onRsvp={onRsvp}
              onUpdateRsvp={onUpdateRsvp}
              loading={rsvpLoading}
              showMessageInput={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
