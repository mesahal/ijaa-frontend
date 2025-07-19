import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Lock,
  Globe,
  MessageCircle,
  Calendar,
  TrendingUp,
  Crown,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import GroupChat from "../components/GroupChat";

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const groups = [
    {
      id: 1,
      name: "CSE Alumni Network",
      description:
        "Connect with Computer Science & Engineering graduates from all batches. Share opportunities, discuss tech trends, and collaborate on projects.",
      memberCount: 450,
      type: "department",
      privacy: "public",
      image:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      recentActivity: "2 hours ago",
      isJoined: true,
      isAdmin: false,
      tags: ["Technology", "Career", "Networking"],
    },
    {
      id: 2,
      name: "Batch 2020 Reunion",
      description:
        "Official group for the Class of 2020. Stay connected with your batchmates, plan reunions, and share memories.",
      memberCount: 89,
      type: "batch",
      privacy: "private",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      recentActivity: "5 hours ago",
      isJoined: true,
      isAdmin: true,
      tags: ["Batch 2020", "Reunion", "Friends"],
    },
    {
      id: 3,
      name: "Entrepreneurs Club",
      description:
        "For alumni who are entrepreneurs or aspiring to start their own ventures. Share ideas, get feedback, and find co-founders.",
      memberCount: 156,
      type: "interest",
      privacy: "public",
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      recentActivity: "1 day ago",
      isJoined: false,
      isAdmin: false,
      tags: ["Startup", "Business", "Innovation"],
    },
    {
      id: 4,
      name: "Global Alumni Network",
      description:
        "Connecting IIT JU alumni living around the world. Share experiences of living abroad, help newcomers, and maintain cultural connections.",
      memberCount: 234,
      type: "location",
      privacy: "public",
      image:
        "https://images.pexels.com/photos/1181435/pexels-photo-1181435.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      recentActivity: "3 hours ago",
      isJoined: false,
      isAdmin: false,
      tags: ["International", "Travel", "Culture"],
    },
    {
      id: 5,
      name: "Women in Tech",
      description:
        "Supporting and empowering women alumni in technology fields. Share opportunities, discuss challenges, and celebrate achievements.",
      memberCount: 78,
      type: "interest",
      privacy: "public",
      image:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      recentActivity: "6 hours ago",
      isJoined: true,
      isAdmin: false,
      tags: ["Women", "Technology", "Empowerment"],
    },
    {
      id: 6,
      name: "Research & Academia",
      description:
        "For alumni pursuing or working in research and academia. Discuss research opportunities, share publications, and collaborate.",
      memberCount: 92,
      type: "interest",
      privacy: "private",
      image:
        "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      recentActivity: "12 hours ago",
      isJoined: false,
      isAdmin: false,
      tags: ["Research", "Academia", "Science"],
    },
  ];

  const myGroups = groups.filter((group) => group.isJoined);
  const discoverGroups = groups.filter((group) => !group.isJoined);

  const filteredGroups = (
    activeTab === "my" ? myGroups : discoverGroups
  ).filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || group.type === filterType;

    return matchesSearch && matchesType;
  });

  const handleJoinGroup = (groupId) => {
    console.log("Joining group:", groupId);
  };

  const handleLeaveGroup = (groupId) => {
    console.log("Leaving group:", groupId);
  };

  const handleOpenGroupChat = (group) => {
    setSelectedGroup(group);
  };

  const handleBackToGroups = () => {
    setSelectedGroup(null);
  };

  // If a group chat is selected, show the chat interface
  if (selectedGroup) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={handleBackToGroups}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Groups</span>
          </button>
        </div>
        <div className="h-[calc(100vh-12rem)]">
          <GroupChat
            groupId={selectedGroup.id}
            groupName={selectedGroup.name}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alumni Groups
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Join communities and connect with like-minded alumni
            </p>
          </div>
          <Link
            to="/groups/create"
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Group</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("discover")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "discover"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Discover Groups
            </button>
            <button
              onClick={() => setActiveTab("my")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === "my"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>My Groups</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {myGroups.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="department">Department</option>
              <option value="batch">Batch</option>
              <option value="interest">Interest</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                    group.type === "department"
                      ? "bg-blue-100 text-blue-800"
                      : group.type === "batch"
                      ? "bg-green-100 text-green-800"
                      : group.type === "interest"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {group.type}
                </span>
                {group.privacy === "private" ? (
                  <Lock className="h-4 w-4 text-gray-600" />
                ) : (
                  <Globe className="h-4 w-4 text-gray-600" />
                )}
              </div>
              {group.isAdmin && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Admin</span>
                  </span>
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {group.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                {group.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{group.recentActivity}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {group.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                {group.isJoined ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenGroupChat(group)}
                      className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => handleLeaveGroup(group.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Leave
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Join Group</span>
                  </button>
                )}

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    group.privacy === "private"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {group.privacy}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No groups found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {activeTab === "my"
              ? "You haven't joined any groups yet. Discover groups to get started!"
              : "Try adjusting your search or filters to find more groups."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Groups;
