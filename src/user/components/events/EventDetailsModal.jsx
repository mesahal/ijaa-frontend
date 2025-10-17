import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Edit,
  Video,
  User,
  Mail,
  ExternalLink,
  X,
  CheckCircle,
  Clock,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldX,
  MessageSquare,
  Image,
} from 'lucide-react';
import EventComments from './EventComments';
import EventMedia from './EventMedia';

/**
 * EventDetailsModal Component
 * Modal for viewing event details with RSVP functionality and social features
 * Enhanced with Phase 4: Social Features (Comments and Media)
 */
const EventDetailsModal = ({ 
  isOpen, 
  onClose, 
  event, 
  isMyEvent = false, 
  onEdit = () => {}, 
  onViewParticipants = () => {}, 
  onInvite = () => {},
  getParticipationStatus = () => null,
  getMyInvitationStatus = () => null,
  onRsvp = () => {},
  onCancelRsvp = () => {},
  onAcceptInvitation = () => {},
  onDeclineInvitation = () => {},
  formatDate = (date) => new Date(date).toLocaleDateString(),
  formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  getEventTypeLabel = (type) => type,
  participationStatus
}) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!isOpen || !event) return null;

  const tabs = [
    { id: 'details', label: 'Details', icon: Calendar },
    { id: 'comments', label: 'Comments', icon: MessageSquare },
    { id: 'media', label: 'Media', icon: Image },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'comments':
        return (
          <EventComments
            eventId={event.id}
            onCommentAdded={() => {
              // Refresh event data if needed
            }}
            onCommentUpdated={() => {
              // Refresh event data if needed
            }}
            onCommentDeleted={() => {
              // Refresh event data if needed
            }}
          />
        );
      case 'media':
        return (
          <EventMedia
            eventId={event.id}
            onMediaAdded={() => {
              // Refresh event data if needed
            }}
            onMediaUpdated={() => {
              // Refresh event data if needed
            }}
            onMediaDeleted={() => {
              // Refresh event data if needed
            }}
          />
        );
      default:
        return (
          <>
            {/* Event Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" aria-hidden="true" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getEventTypeLabel(event.eventType)}
                </span>
                {event.isOnline && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 text-xs rounded-full">
                    Online
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                  <p className="text-gray-900 dark:text-white">
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
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                  <p className="text-gray-900 dark:text-white">
                    {event.isOnline ? "Online Event" : event.location}
                  </p>
                </div>
              </div>

              {event.isOnline && event.meetingLink && (
                <div className="flex items-center space-x-3">
                  <Video className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Meeting Link</p>
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>Join Meeting</span>
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Participants</p>
                  <p className="text-gray-900 dark:text-white">
                    {event.currentParticipants}/{event.maxParticipants}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organizer</p>
                  <p className="text-gray-900 dark:text-white">{event.organizerName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="text-gray-900 dark:text-white">{event.organizerEmail}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                {/* View Participants Button */}
                <button
                  onClick={() => onViewParticipants(event.id)}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-1"
                >
                  <Users className="h-3 w-3" aria-hidden="true" />
                  <span>Participants</span>
                </button>

                {/* Invite Button (only for event creator) */}
                {isMyEvent && (
                  <button
                    onClick={onInvite}
                    className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center space-x-1"
                  >
                    <UserPlus className="h-3 w-3" aria-hidden="true" />
                    <span>Invite</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                {isMyEvent && (
                  <button
                    onClick={() => onEdit(event)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" aria-hidden="true" />
                    <span>Edit Event</span>
                  </button>
                )}
              </div>
            </div>

            {/* RSVP Section */}
            {!isMyEvent && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Response</h4>
                <div className="flex items-center space-x-2">
                  {(() => {
                    const myStatus = getParticipationStatus(event.id);
                    const invitationStatus = getMyInvitationStatus(event.id);
                    
                    if (invitationStatus && !invitationStatus.isResponded) {
                      return (
                        <>
                          <button
                            onClick={() => onAcceptInvitation(event.id)}
                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" aria-hidden="true" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => onDeclineInvitation(event.id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                            <span>Decline</span>
                          </button>
                        </>
                      );
                    } else if (myStatus) {
                      return (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Status: <span className="font-medium">{myStatus}</span>
                          </span>
                          <button
                            onClick={() => onCancelRsvp(event.id)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            Cancel RSVP
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onRsvp(event.id, participationStatus.CONFIRMED)}
                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" aria-hidden="true" />
                            <span>Going</span>
                          </button>
                          <button
                            onClick={() => onRsvp(event.id, participationStatus.MAYBE)}
                            className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            <span>Maybe</span>
                          </button>
                          <button
                            onClick={() => onRsvp(event.id, participationStatus.DECLINED)}
                            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-1"
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                            <span>Not Going</span>
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Event Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
