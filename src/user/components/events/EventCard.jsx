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
import ShareModal from './ShareModal';
import useEventBanner from '../../hooks/events/useEventBanner';
import Button from '../../../components/ui/Button';

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
  formatTime,
  // Phase 3: Event Participation props
  onRsvp,
  onUpdateRsvp,
  onCancelRsvp,
  rsvpLoading = false,
  currentParticipationStatus = null,
  showRsvpButtons = false,
  viewMode = 'grid'
}) => {
  const navigate = useNavigate();
  const { bannerUrl, loadBannerUrl } = useEventBanner(event?.id);
  const [showShareModal, setShowShareModal] = useState(false);

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
    navigate(`/user/events/${event.id}`);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShowShareModal(true);
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
                  <button
                    onClick={handleShareClick}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Share Event"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
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
                    onCancelRsvp={onCancelRsvp}
                    loading={rsvpLoading}
                    showMessageInput={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          event={event}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      </div>
    );
  }

  // Grid view (default) - Updated to match UserCard structure with fixed height and bottom buttons
  return (
    <div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer w-full flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Event Image - Fixed Height */}
      <div className="relative h-56 bg-gray-100 dark:bg-gray-700" style={{
        backgroundImage: `url(${bannerUrl || event.coverImage || event.image || '/cover.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Kebab menu in top-right corner */}
        <div className="absolute top-3 right-3">
          <button className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600/50 rounded-lg transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Event Content - Flexible height with fixed bottom buttons */}
      <div className="p-4 flex flex-col flex-1">
        {/* Date - Fixed Height */}
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
          {event.endDate ? (() => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            const isSameDay = start.toDateString() === end.toDateString();
            
            if (isSameDay) {
              // Same day: "Wednesday, October 15, 2025 at 11:00 AM - 2:00 PM"
              return `${formatDate(event.startDate)} at ${formatTime(event.startDate)} - ${formatTime(event.endDate)}`;
            } else {
              // Different days: "Wednesday, October 15, 2025 at 11:00 AM - Thursday, October 16, 2025 at 11:00 AM"
              return `${formatDate(event.startDate)} at ${formatTime(event.startDate)} - ${formatDate(event.endDate)} at ${formatTime(event.endDate)}`;
            }
          })() : 
            `${formatDate(event.startDate)} at ${formatTime(event.startDate)}`
          }
        </div>

        {/* Event Title - Fixed Height */}
        <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-h-[2.5rem]">
          {event.title}
        </h3>

        {/* Location/Organizer - Fixed Height */}
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-1 line-clamp-1 min-h-[1.25rem]">
          {event.location || event.organizerName || "Location TBD"}
        </div>

        {/* Interest/Going Count - Fixed Height */}
        <div className="text-gray-500 dark:text-gray-400 text-sm mb-3 min-h-[1.25rem]">
          {Math.floor((event.currentParticipants || 0) * 0.8)} interested • {event.currentParticipants || 0} going
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="mt-auto">
          <div className="flex items-center space-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (currentParticipationStatus === 'MAYBE' && onCancelRsvp) {
                  onCancelRsvp(event.id);
                } else if (currentParticipationStatus && onUpdateRsvp) {
                  onUpdateRsvp(event.id, 'MAYBE', '');
                } else if (onRsvp) {
                  onRsvp(event.id, 'MAYBE', '');
                }
              }}
              disabled={rsvpLoading}
              variant={currentParticipationStatus === 'MAYBE' ? 'primary' : 'outline'}
              size="sm"
              className="flex-1"
              title="Mark as Interested"
              icon={<Star className="h-4 w-4" />}
            >
              Interested
            </Button>
            <button 
              onClick={handleShareClick}
              className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-lg transition-colors"
              title="Share Event"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        event={event}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </div>
  );
};

export default EventCard;
