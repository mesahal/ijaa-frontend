import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ArrowLeft,
  Check,
  X,
  Users,

  MessageCircle,
  UserPlus,
  Settings,
  Trash2,
  Filter,
} from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "connection",
      title: "New Connection Request",
      message: "Sarah Ahmed wants to connect with you",
      time: "2 minutes ago",
      read: false,
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      actionable: true,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "Rakib Hassan sent you a message",
      time: "15 minutes ago",
      read: false,
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      actionable: false,
    },

    {
      id: 4,
      type: "group",
      title: "Group Invitation",
      message: 'You have been invited to join "CSE Alumni Network"',
      time: "2 hours ago",
      read: true,
      actionable: true,
    },
    {
      id: 5,
      type: "connection",
      title: "Connection Accepted",
      message: "Fatima Khan accepted your connection request",
      time: "3 hours ago",
      read: true,
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      actionable: false,
    },

    {
      id: 7,
      type: "message",
      title: "Group Message",
      message: 'New message in "Batch 2020 Reunion" group',
      time: "1 day ago",
      read: true,
      actionable: false,
    },
    {
      id: 8,
      type: "system",
      title: "Profile Update",
      message: "Your profile has been successfully updated",
      time: "2 days ago",
      read: true,
      actionable: false,
    },
  ]);

  const getNotificationIcon = (type) => {
    const iconMap = {
      connection: UserPlus,
      message: MessageCircle,

      group: Users,
      system: Settings,
    };

    const Icon = iconMap[type] || Bell;
    return <Icon className="h-5 w-5" />;
  };

  const getNotificationColor = (type) => {
    const colorMap = {
      connection: "text-blue-600 bg-blue-100",
      message: "text-green-600 bg-green-100",

      group: "text-orange-600 bg-orange-100",
      system: "text-gray-600 bg-gray-100",
    };

    return colorMap[type] || "text-gray-600 bg-gray-100";
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleAction = (notification, action) => {
    if (action === "accept") {
      console.log("Accepting:", notification.type, notification.id);
    } else if (action === "decline") {
      console.log("Declining:", notification.type, notification.id);
    }
    markAsRead(notification.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notifications`
                : "All caught up!"}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center space-x-1 overflow-x-auto">
          <Filter className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
          {[
            { value: "all", label: "All", count: notifications.length },
            { value: "unread", label: "Unread", count: unreadCount },
            {
              value: "connection",
              label: "Connections",
              count: notifications.filter((n) => n.type === "connection")
                .length,
            },
            {
              value: "message",
              label: "Messages",
              count: notifications.filter((n) => n.type === "message").length,
            },

            {
              value: "group",
              label: "Groups",
              count: notifications.filter((n) => n.type === "group").length,
            },
          ].map((filterOption) => (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === filterOption.value
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === filterOption.value
                      ? "bg-blue-200 text-blue-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {filterOption.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
              notification.read
                ? "border-gray-100"
                : "border-blue-200 bg-blue-50/30"
            }`}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                {/* Icon/Avatar */}
                <div className="flex-shrink-0">
                  {notification.avatar ? (
                    <img
                      src={notification.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={`font-medium ${
                          notification.read
                            ? "text-gray-900"
                            : "text-gray-900 font-semibold"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {notification.time}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {notification.actionable && !notification.read && (
                    <div className="flex items-center space-x-3 mt-4">
                      <button
                        onClick={() => handleAction(notification, "accept")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        {notification.type === "connection" ? "Accept" : "Join"}
                      </button>
                      <button
                        onClick={() => handleAction(notification, "decline")}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        {notification.type === "connection"
                          ? "Decline"
                          : "Ignore"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notifications
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "You're all caught up! No new notifications."
              : `No ${filter} notifications found.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
