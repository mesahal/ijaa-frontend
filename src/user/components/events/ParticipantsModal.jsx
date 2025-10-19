import React, { useEffect, useState } from 'react';
import { Users, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import eventService from '../../../services/api/eventService';

/**
 * ParticipantsModal Component
 * Modal for viewing event participants with status filters
 */
const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'CONFIRMED', label: 'Going' },
  { key: 'MAYBE', label: 'Interested' },
  { key: 'DECLINED', label: "Can't go" },
];

const ParticipantsModal = ({ isOpen, onClose, event, loading: parentLoading = false }) => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);

  const eventId = event?.id;

  const fetchParticipants = async (status = 'ALL') => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      let response;
      if (status === 'ALL') {
        response = await eventService.getEventParticipants(eventId);
      } else {
        response = await eventService.getEventParticipantsByStatus(eventId, status);
      }
      const data = response?.data ?? response;
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setParticipants(list);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load participants');
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Going';
      case 'MAYBE':
        return 'Interested';
      case 'DECLINED':
        return "Can't go";
      default:
        return status || '';
    }
  };

  useEffect(() => {
    if (isOpen && eventId) {
      fetchParticipants(activeTab);
    }
  }, [isOpen, eventId, activeTab]);

  if (!isOpen) return null;

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'MAYBE':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'DECLINED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Event Participants{event?.title ? ` • ${event.title}` : ''}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Status Tabs */}
          <div className="mt-4 flex items-center space-x-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {parentLoading || loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-600 dark:text-gray-400">No participants found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {participants.map((p, idx) => (
                <li key={p.id || p.userId || idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {p.username || p.userName || p.name || p.email || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getStatusLabel(p.status || (activeTab !== 'ALL' ? activeTab : ''))}
                      </div>
                    </div>
                  </div>
                  {renderStatusIcon(p.status || (activeTab !== 'ALL' ? activeTab : ''))}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParticipantsModal;
