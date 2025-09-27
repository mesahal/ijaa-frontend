import React from 'react';
import { Send, Loader2, X } from 'lucide-react';

/**
 * InviteModal Component
 * Modal for sending event invitations
 */
const InviteModal = ({ isOpen, onClose, onSubmit, formData, setFormData, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite People
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

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="usernames" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usernames (comma-separated)
            </label>
            <input
              id="usernames"
              type="text"
              required
              value={formData.usernames}
              onChange={(e) => setFormData({ ...formData, usernames: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="username1, username2, username3"
            />
          </div>

          <div>
            <label htmlFor="personal-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Message (optional)
            </label>
            <textarea
              id="personal-message"
              value={formData.personalMessage}
              onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Add a personal message..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="h-4 w-4" aria-hidden="true" />
              )}
              <span>Send Invitations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
