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
  CheckCircle,
} from "lucide-react";
import { Button, Card, Avatar, Badge } from "../components/ui";

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
      connection: "text-primary-600 bg-primary-100 dark:bg-primary-900/20",
      message: "text-success-600 bg-success-100 dark:bg-success-900/20",
      group: "text-warning-600 bg-warning-100 dark:bg-warning-900/20",
      system: "text-gray-600 bg-gray-100 dark:bg-gray-700",
    };

    return colorMap[type] || "text-gray-600 bg-gray-100 dark:bg-gray-700";
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              icon={<ArrowLeft className="h-5 w-5" />}
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : "All caught up!"}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              icon={<CheckCircle className="h-4 w-4" />}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
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
              <Button
                key={filterOption.value}
                variant={filter === filterOption.value ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterOption.value)}
                className="whitespace-nowrap"
              >
                {filterOption.label}
                {filterOption.count > 0 && (
                  <Badge
                    variant={filter === filterOption.value ? "primary" : "secondary"}
                    size="sm"
                    className="ml-2"
                  >
                    {filterOption.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all hover:shadow-md ${
                notification.read
                  ? ""
                  : "border-primary-200 dark:border-primary-700 bg-primary-50/30 dark:bg-primary-900/10"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon/Avatar */}
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <Avatar
                        size="md"
                        src={notification.avatar}
                        alt=""
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
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-900 dark:text-white font-semibold"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            icon={<Check className="h-4 w-4" />}
                            title="Mark as read"
                          />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          icon={<Trash2 className="h-4 w-4" />}
                          title="Delete notification"
                          className="text-gray-400 hover:text-error-600"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {notification.actionable && !notification.read && (
                      <div className="flex items-center space-x-3 mt-4">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAction(notification, "accept")}
                        >
                          {notification.type === "connection" ? "Accept" : "Join"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(notification, "decline")}
                        >
                          {notification.type === "connection"
                            ? "Decline"
                            : "Ignore"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === "all"
                  ? "You're all caught up! No new notifications."
                  : `No ${filter} notifications found.`}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications;
