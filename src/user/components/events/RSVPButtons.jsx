import React, { useState } from 'react';
import { CheckCircle, Clock, X, MessageCircle, Loader2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

/**
 * RSVP Buttons Component
 * Provides RSVP functionality for events
 * Part of Phase 3: Event Participation
 */
const RSVPButtons = ({
  eventId,
  currentStatus = null,
  onRsvp,
  onUpdateRsvp,
  loading = false,
  disabled = false,
  showMessageInput = false,
  className = ''
}) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedAction, setSelectedAction] = useState(null);

  const handleRsvpAction = async (status) => {
    if (showMessageInput) {
      setSelectedAction(status);
      setShowMessageModal(true);
    } else {
      await performRsvpAction(status, '');
    }
  };

  const performRsvpAction = async (status, messageText) => {
    if (currentStatus) {
      // Update existing RSVP
      await onUpdateRsvp(eventId, status, messageText);
    } else {
      // New RSVP
      await onRsvp(eventId, status, messageText);
    }
    setShowMessageModal(false);
    setMessage('');
    setSelectedAction(null);
  };

  const handleSubmitMessage = async () => {
    if (selectedAction) {
      await performRsvpAction(selectedAction, message);
    }
  };

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
        return 'Joined';
      case 'MAYBE':
        return 'Maybe';
      case 'DECLINED':
        return 'Declined';
      default:
        return 'RSVP';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Status Display */}
      {currentStatus && (
        <div className="flex items-center justify-center">
          <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-${getStatusColor(currentStatus)}-100 dark:bg-${getStatusColor(currentStatus)}-900/20 text-${getStatusColor(currentStatus)}-700 dark:text-${getStatusColor(currentStatus)}-300`}>
            {getStatusIcon(currentStatus)}
            <span className="text-sm font-medium">
              {getStatusText(currentStatus)}
            </span>
          </div>
        </div>
      )}

      {/* RSVP Buttons */}
      <div className="flex space-x-2">
        <Button
          onClick={() => handleRsvpAction('CONFIRMED')}
          variant={currentStatus === 'CONFIRMED' ? 'success' : 'primary'}
          size="sm"
          disabled={disabled || loading}
          className="flex-1"
          icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        >
          {loading ? 'Joining...' : 'Join Event'}
        </Button>

        <Button
          onClick={() => handleRsvpAction('MAYBE')}
          variant={currentStatus === 'MAYBE' ? 'warning' : 'outline'}
          size="sm"
          disabled={disabled || loading}
          className="flex-1"
          icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
        >
          {loading ? 'Updating...' : 'Maybe'}
        </Button>

        <Button
          onClick={() => handleRsvpAction('DECLINED')}
          variant={currentStatus === 'DECLINED' ? 'error' : 'outline'}
          size="sm"
          disabled={disabled || loading}
          className="flex-1"
          icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
        >
          {loading ? 'Declining...' : 'Decline'}
        </Button>
      </div>

      {/* Message Input Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 p-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add a Message
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedAction === 'CONFIRMED' && 'Share your excitement about joining this event!'}
                  {selectedAction === 'MAYBE' && 'Let the organizer know you might attend.'}
                  {selectedAction === 'DECLINED' && 'Let the organizer know why you can\'t attend.'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessage('');
                    setSelectedAction(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitMessage}
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                  icon={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                >
                  {loading ? 'Sending...' : 'Send RSVP'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RSVPButtons;

