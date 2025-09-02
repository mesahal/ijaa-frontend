import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import EventCard from './EventCard';

/**
 * Upcoming Events Component
 * Displays upcoming events with pagination support
 * Part of Phase 2: Event Discovery & Search
 */
const UpcomingEvents = ({ 
  events, 
  loading, 
  error, 
  pagination, 
  onLoadMore, 
  onLoadPrevious,
  getEventTypeLabel,
  formatDate,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  // Phase 3: Event Participation props
  onRsvp,
  onUpdateRsvp,
  rsvpLoading = false,
  getParticipationStatus
}) => {
  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading upcoming events...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-error-200 dark:border-error-700">
        <div className="text-center">
          <p className="text-error-700 dark:text-error-300">{error}</p>
        </div>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No upcoming events
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for new events or create your own event.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upcoming Events
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Events happening in the next 30 days
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {pagination?.totalElements || events.length} upcoming
          </span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const currentParticipationStatus = getParticipationStatus ? getParticipationStatus(event.id) : null;
          return (
            <EventCard
              key={event.id}
              event={event}
              isMyEvent={false}
              onView={onViewEvent}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              getEventTypeLabel={getEventTypeLabel}
              formatDate={formatDate}
              // Phase 3: Event Participation props
              onRsvp={onRsvp}
              onUpdateRsvp={onUpdateRsvp}
              rsvpLoading={rsvpLoading}
              currentParticipationStatus={currentParticipationStatus}
              showRsvpButtons={true}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={onLoadPrevious}
            disabled={pagination.first}
            variant="outline"
            size="sm"
            icon={<ChevronLeft className="h-4 w-4" />}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page + 1} of {pagination.totalPages}
            {pagination.totalElements && (
              <span className="ml-2">
                ({pagination.totalElements} total)
              </span>
            )}
          </span>
          
          <Button
            onClick={onLoadMore}
            disabled={pagination.last}
            variant="outline"
            size="sm"
            icon={<ChevronRight className="h-4 w-4" />}
          >
            Next
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Showing {events.length} of {pagination.totalElements || events.length} upcoming events
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;




