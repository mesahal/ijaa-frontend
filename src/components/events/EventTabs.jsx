import React from 'react';
import {
  Calendar,
  Users,
  TrendingUp,
  Search,
  Bell,
  Bookmark,
  Star,
  Clock,
} from 'lucide-react';

/**
 * EventTabs Component
 * Handles tab navigation for events with modern Facebook-style design
 * 
 * @param {string} activeTab - Currently active tab
 * @param {Function} onTabChange - Callback for tab changes
 * @param {Object} invitationCounts - Counts for invitation badges
 */
const EventTabs = ({ activeTab, onTabChange, invitationCounts = { unreadCount: 0 } }) => {
  const tabs = [
    { 
      id: 'all', 
      label: 'All Events',
      icon: <Calendar className="h-4 w-4" />,
      description: 'Browse all events'
    },
    { 
      id: 'my-events', 
      label: 'My Events',
      icon: <Star className="h-4 w-4" />,
      description: 'Events I created'
    },
    { 
      id: 'my-active-events', 
      label: 'Active Events',
      icon: <Clock className="h-4 w-4" />,
      description: 'My active events'
    },
    { 
      id: 'upcoming', 
      label: 'Upcoming',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Events happening soon'
    },
    { 
      id: 'trending', 
      label: 'Trending',
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Popular events'
    },
    { 
      id: 'search', 
      label: 'Advanced Search',
      icon: <Search className="h-4 w-4" />,
      description: 'Find specific events'
    },
    { 
      id: 'participations', 
      label: 'My Participations',
      icon: <Users className="h-4 w-4" />,
      description: 'Events I\'m attending'
    },
    { 
      id: 'invitations', 
      label: 'Invitations',
      icon: <Bell className="h-4 w-4" />,
      description: 'Event invitations',
      badge: invitationCounts.unreadCount > 0 ? invitationCounts.unreadCount : null
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex flex-wrap" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            title={tab.description}
          >
            <span className="flex-shrink-0">
              {tab.icon}
            </span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge && (
              <span className="flex-shrink-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventTabs;
