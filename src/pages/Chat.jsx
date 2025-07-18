import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Users,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import DirectChat from "../components/DirectChat";
import GroupChat from "../components/GroupChat";

const Chat = () => {
  const { userId } = useParams();
  const [selectedChat, setSelectedChat] = useState(
    userId ? parseInt(userId) : null
  );
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const chats = [
    {
      id: 1,
      type: "individual",
      name: "Sarah Ahmed",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      lastMessage: "Hey! How are you doing?",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      profession: "Data Scientist",
    },
    {
      id: 2,
      type: "group",
      name: "CSE Alumni Network",
      avatar:
        "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      lastMessage: "John: Anyone interested in the tech meetup?",
      lastMessageTime: "15 min ago",
      unreadCount: 5,
      memberCount: 450,
    },
    {
      id: 3,
      type: "individual",
      name: "Rakib Hassan",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      lastMessage: "Thanks for the recommendation!",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
      profession: "Hardware Engineer",
    },
    {
      id: 4,
      type: "group",
      name: "Batch 2020 Reunion",
      avatar:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      lastMessage: "Planning committee meeting tomorrow",
      lastMessageTime: "2 hours ago",
      unreadCount: 1,
      memberCount: 89,
    },
    {
      id: 5,
      type: "individual",
      name: "Fatima Khan",
      avatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1",
      lastMessage: "Great presentation today!",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      isOnline: true,
      profession: "Product Manager",
    },
  ];

  // If userId is provided in URL, find and select that chat
  React.useEffect(() => {
    if (userId) {
      const chatIndex = chats.findIndex((chat) => chat.id === parseInt(userId));
      if (chatIndex !== -1) {
        setSelectedChat(parseInt(userId));
      }
    }
  }, [userId]);

  const currentChat = chats.find((chat) => chat.id === selectedChat);

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "direct" && chat.type === "individual") ||
      (activeTab === "groups" && chat.type === "group");
    return matchesSearch && matchesTab;
  });

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Chat List Sidebar */}
            <div
              className={`${
                selectedChat ? "hidden lg:block" : "block"
              } w-full lg:w-1/3 border-r border-gray-200 flex flex-col`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Messages
                </h2>

                {/* Tabs */}
                <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "all"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("direct")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "direct"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Direct
                  </button>
                  <button
                    onClick={() => setActiveTab("groups")}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "groups"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Groups
                  </button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChat === chat.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {chat.type === "individual" && chat.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                        {chat.type === "group" && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
                            <Users className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">
                            {chat.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageTime}
                          </span>
                        </div>

                        {chat.type === "individual" && chat.profession && (
                          <p className="text-xs text-gray-500 mb-1">
                            {chat.profession}
                          </p>
                        )}

                        {chat.type === "group" && (
                          <p className="text-xs text-gray-500 mb-1">
                            {chat.memberCount} members
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`${
                selectedChat ? "block" : "hidden lg:block"
              } flex-1 flex flex-col`}
            >
              {currentChat ? (
                <div className="h-full flex flex-col">
                  {/* Mobile Back Button */}
                  <div className="lg:hidden p-4 border-b border-gray-200">
                    <button
                      onClick={handleBackToList}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span>Back</span>
                    </button>
                  </div>

                  {/* Chat Component */}
                  <div className="flex-1">
                    {currentChat.type === "individual" ? (
                      <DirectChat
                        contactId={currentChat.id}
                        contactName={currentChat.name}
                        contactAvatar={currentChat.avatar}
                        onBack={handleBackToList}
                      />
                    ) : (
                      <GroupChat
                        groupId={currentChat.id}
                        groupName={currentChat.name}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a chat from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
