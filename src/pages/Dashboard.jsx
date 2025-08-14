import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  Bell,
  Bookmark,
  Share2,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Eye,
  UserPlus,
  Award,
  Target,
  Activity,
} from "lucide-react";
import { Card, Button, Avatar, Badge } from "../components/ui";

const Dashboard = () => {
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [suggestedConnections, setSuggestedConnections] = useState([]);

  useEffect(() => {
    // Simulate loading data
    setRecentActivities([
      {
        id: 1,
        type: "connection",
        user: {
          name: "Sarah Johnson",
          avatar: "/dp.png",
          profession: "Software Engineer",
        },
        action: "connected with you",
        time: "2 hours ago",
        company: "Google",
      },
      {
        id: 2,
        type: "event",
        user: {
          name: "Mike Chen",
          avatar: "/dp.png",
          profession: "Product Manager",
        },
        action: "registered for",
        event: "Alumni Networking Event",
        time: "4 hours ago",
      },
      {
        id: 3,
        type: "post",
        user: {
          name: "Emily Davis",
          avatar: "/dp.png",
          profession: "Data Scientist",
        },
        action: "shared a post",
        time: "6 hours ago",
        company: "Microsoft",
      },
    ]);

    setUpcomingEvents([
      {
        id: 1,
        title: "Alumni Networking Event",
        date: "2024-02-15",
        time: "6:00 PM",
        location: "Dhaka, Bangladesh",
        attendees: 45,
        type: "NETWORKING",
      },
      {
        id: 2,
        title: "Career Development Workshop",
        date: "2024-02-20",
        time: "2:00 PM",
        location: "Online",
        attendees: 23,
        type: "WORKSHOP",
      },
      {
        id: 3,
        title: "Annual Alumni Meet",
        date: "2024-03-01",
        time: "7:00 PM",
        location: "Jahangirnagar University",
        attendees: 120,
        type: "SOCIAL",
      },
    ]);

    setSuggestedConnections([
      {
        id: 1,
        name: "Alex Thompson",
        profession: "Senior Developer",
        company: "Facebook",
        avatar: "/dp.png",
        mutualConnections: 12,
      },
      {
        id: 2,
        name: "Lisa Wang",
        profession: "UX Designer",
        company: "Apple",
        avatar: "/dp.png",
        mutualConnections: 8,
      },
      {
        id: 3,
        name: "David Kim",
        profession: "Data Analyst",
        company: "Netflix",
        avatar: "/dp.png",
        mutualConnections: 15,
      },
    ]);
  }, []);

  const stats = [
    {
      title: "Total Connections",
      value: "1,234",
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "blue",
    },
    {
      title: "Profile Views",
      value: "89",
      change: "+5%",
      changeType: "positive",
      icon: Eye,
      color: "green",
    },
    {
      title: "Events Attended",
      value: "23",
      change: "+8%",
      changeType: "positive",
      icon: Calendar,
      color: "purple",
    },
    {
      title: "Messages",
      value: "156",
      change: "+3%",
      changeType: "positive",
      icon: MessageCircle,
      color: "orange",
    },
  ];

  const getEventTypeColor = (type) => {
    const colors = {
      NETWORKING: "primary",
      WORKSHOP: "success",
      CONFERENCE: "warning",
      SOCIAL: "secondary",
      CAREER: "error",
      MENTORSHIP: "purple",
    };
    return colors[type] || "secondary";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {localStorage.getItem("user_name") || "Alumni"}!
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
