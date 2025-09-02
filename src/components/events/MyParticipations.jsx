import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Loader2, CheckCircle, Clock, X, MapPin, Users } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import RSVPButtons from './RSVPButtons';

/**
 * My Participations Component
 * Displays user's event participations with management capabilities
 * Part of Phase 3: Event Participation
 */
const MyParticipations = ({ 
  participations, 
  loading, 
  error, 
  pagination, 
  onLoadMore, 
  onLoadPrevious,
  onRsvp,
  onUpdateRsvp,
  rsvpLoading,
  formatDate,
  onViewEvent
}) => {
  const [statusFilter, setStatusFilter] = useState('all');

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your participations...</span>
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

  const filteredParticipations = statusFilter === 'all' 
    ? participations 
    : participations.filter(p => p.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'MAYBE':
        return 'warning';
      case 'DECLINED':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />;
      case 'MAYBE':
        return <Clock className="h-4 w-4" />;
      case 'DECLINED':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'MAYBE':
        return 'Maybe';
      case 'DECLINED':
        return 'Declined';
      default:
        return 'Unknown';
    }
  };

  if (!participations || participations.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No participations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start joining events to see your participations here.
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
            My Participations
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Events you've RSVP'd to
          </p>
        </div>
        
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="MAYBE">Maybe</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>
      </div>

      {/* Participations List */}
      <div className="space-y-4">
        {filteredParticipations.map((participation) => (
          <Card key={participation.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {participation.eventTitle}
                  </h3>
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(participation.status)}-100 dark:bg-${getStatusColor(participation.status)}-900/20 text-${getStatusColor(participation.status)}-700 dark:text-${getStatusColor(participation.status)}-300`}>
                    {getStatusIcon(participation.status)}
                    <span>{getStatusText(participation.status)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(participation.eventStartDate)}</span>
                  </div>
                  
                  {participation.eventLocation && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{participation.eventLocation}</span>
                    </div>
                  )}
                </div>

                {participation.message && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      "{participation.message}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Joined: {formatDate(participation.joinedAt)}</span>
                  {participation.updatedAt !== participation.joinedAt && (
                    <span>Updated: {formatDate(participation.updatedAt)}</span>
                  )}
                </div>
              </div>

              <div className="ml-6 flex flex-col space-y-3">
                <Button
                  onClick={() => onViewEvent(participation.eventId)}
                  variant="outline"
                  size="sm"
                >
                  View Event
                </Button>

                <RSVPButtons
                  eventId={participation.eventId}
                  currentStatus={participation.status}
                  onRsvp={onRsvp}
                  onUpdateRsvp={onUpdateRsvp}
                  loading={rsvpLoading}
                  showMessageInput={true}
                />
              </div>
            </div>
          </Card>
        ))}
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

      {/* Statistics */}
      {participations.length > 0 && (
        <Card className="mt-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {participations.filter(p => p.status === 'CONFIRMED').length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-100 dark:bg-warning-900/20 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Maybe</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {participations.filter(p => p.status === 'MAYBE').length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-error-100 dark:bg-error-900/20 rounded-lg flex items-center justify-center">
                <X className="h-5 w-5 text-error-600 dark:text-error-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Declined</p>
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  {participations.filter(p => p.status === 'DECLINED').length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyParticipations;

