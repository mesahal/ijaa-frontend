import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Users,
  Phone,
  Video,
} from "lucide-react";

const GroupChat = ({ groupId = 1, groupName = "CSE Alumni Network" }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Dummy chat history
  const initialMessages = [
    {
      id: 1,
      userId: 2,
      userName: "Sarah Ahmed",
      userAvatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message: "Hey everyone! Hope you all are doing well 👋",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: "text",
    },
    {
      id: 2,
      userId: 3,
      userName: "Rakib Hassan",
      userAvatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message: "Hi Sarah! Great to see you here. How's the new job at Google?",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      type: "text",
    },
    {
      id: 3,
      userId: 2,
      userName: "Sarah Ahmed",
      userAvatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message:
        "It's been amazing! Working on some really exciting ML projects. What about you?",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      type: "text",
    },
    {
      id: 4,
      userId: 4,
      userName: "Fatima Khan",
      userAvatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message:
        "Hey guys! Just joined the group. Excited to reconnect with everyone! 🎉",
      timestamp: new Date(Date.now() - 3000000).toISOString(),
      type: "text",
    },
    {
      id: 5,
      userId: 5,
      userName: "Ahmed Rahman",
      userAvatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message:
        "Welcome Fatima! Great to have you here. Are you still in Dubai?",
      timestamp: new Date(Date.now() - 2800000).toISOString(),
      type: "text",
    },
    {
      id: 6,
      userId: 4,
      userName: "Fatima Khan",
      userAvatar:
        "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message: "Actually moved to Austin recently! Working at Tesla now 🚗⚡",
      timestamp: new Date(Date.now() - 2700000).toISOString(),
      type: "text",
    },
    {
      id: 7,
      userId: 3,
      userName: "Rakib Hassan",
      userAvatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message:
        "That's awesome! Tesla is doing incredible work in sustainable transport.",
      timestamp: new Date(Date.now() - 2600000).toISOString(),
      type: "text",
    },
    {
      id: 8,
      userId: 6,
      userName: "Nadia Islam",
      userAvatar:
        "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      message: "Hi everyone! Just saw the notification. How's everyone doing?",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: "text",
    },
  ];

  const currentUser = {
    id: 1,
    name: "John Doe",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
  };

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of new message
        simulateIncomingMessage();
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateIncomingMessage = () => {
    const users = [
      {
        id: 2,
        name: "Sarah Ahmed",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      },
      {
        id: 3,
        name: "Rakib Hassan",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      },
      {
        id: 4,
        name: "Fatima Khan",
        avatar:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
      },
    ];

    const sampleMessages = [
      "Anyone up for a virtual coffee chat?",
      "Just shared an interesting article on LinkedIn!",
      "Great discussion everyone! 👍",
      "Looking forward to the next reunion!",
      "Has anyone tried the new tech stack we discussed?",
      "Thanks for sharing that resource!",
      "Hope everyone is staying safe and healthy! 🙏",
    ];

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomMessage =
      sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

    const newMsg = {
      id: Date.now(),
      userId: randomUser.id,
      userName: randomUser.name,
      userAvatar: randomUser.avatar,
      message: randomMessage,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{groupName}</h3>
            <p className="text-sm text-gray-500">450 members • 12 online</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const showDateSeparator = shouldShowDateSeparator(
            message,
            prevMessage
          );
          const isCurrentUser = message.userId === currentUser.id;
          const showAvatar =
            !prevMessage ||
            prevMessage.userId !== message.userId ||
            showDateSeparator;

          return (
            <div key={message.id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {formatDate(message.timestamp)}
                  </div>
                </div>
              )}

              <div
                className={`flex items-end space-x-2 ${
                  isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div className="w-8 h-8 flex-shrink-0">
                  {showAvatar && !isCurrentUser && (
                    <img
                      src={message.userAvatar}
                      alt={message.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                </div>

                <div
                  className={`max-w-xs lg:max-w-md ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  {showAvatar && !isCurrentUser && (
                    <p className="text-xs text-gray-500 mb-1 px-3">
                      {message.userName}
                    </p>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>

                  <p
                    className={`text-xs text-gray-500 mt-1 px-3 ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
              typing...
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Smile className="h-5 w-5" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
