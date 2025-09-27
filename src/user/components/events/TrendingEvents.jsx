import React from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import EventCard from './EventCard';

/**
 * Trending Events Component
 * Displays trending events with popularity indicators
 * Part of Phase 2: Event Discovery & Search
 */
const TrendingEvents = ({ 
  events, 
  loading, 
  error, 
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
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading trending events...</span>
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
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No trending events
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Popular events will appear here based on engagement.
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
            Trending Events
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Most popular events based on engagement
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {events.length} trending
          </span>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const currentParticipationStatus = getParticipationStatus ? getParticipationStatus(event.id) : null;
          return (
            <div key={event.id} className="relative">
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute -top-2 -right-2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    #{index + 1} Trending
                  </div>
                </div>
              )}
              
              {/* Trending Score Badge */}
              {event.trendingScore && (
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    {Math.round(event.trendingScore * 100)}%
                  </div>
                </div>
              )}
              
              <EventCard
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingEvents;
