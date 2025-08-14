import React from 'react';

/**
 * EventTabs Component
 * Handles tab navigation for events (All Events, My Events, My Active Events, Invitations)
 * Group 1: Basic Event Management implementation
 * 
 * @param {string} activeTab - Currently active tab
 * @param {Function} onTabChange - Callback for tab changes
 * @param {Object} invitationCounts - Counts for invitation badges
 */
const EventTabs = ({ activeTab, onTabChange, invitationCounts = { unreadCount: 0 } }) => {
  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'my-events', label: 'My Events' },
    { id: 'my-active-events', label: 'My Active Events' },
    { 
      id: 'invitations', 
      label: 'Invitations',
      badge: invitationCounts.unreadCount > 0 ? invitationCounts.unreadCount : null
    }
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`${tab.id}-panel`}
        >
          <span className="flex items-center justify-center">
            {tab.label}
            {tab.badge && (
              <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default EventTabs;
