import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";

const DirectChat = ({
  contactId = 2,
  contactName = "Sarah Ahmed",
  contactAvatar = "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
  onBack,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentUser = {
    id: 1,
    name: "John Doe",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1",
  };

  // Dummy chat history
  const initialMessages = [
    {
      id: 1,
      senderId: contactId,
      senderName: contactName,
      message: "Hey John! How are you doing?",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 2,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message:
        "Hi Sarah! I'm doing great, thanks for asking. Just finished a big project at work. How about you?",
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 3,
      senderId: contactId,
      senderName: contactName,
      message:
        "That's awesome! Congratulations on finishing your project. I've been working on some exciting ML models at Google.",
      timestamp: new Date(Date.now() - 7000000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 4,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message:
        "That sounds really interesting! What kind of ML models are you working on?",
      timestamp: new Date(Date.now() - 6900000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 5,
      senderId: contactId,
      senderName: contactName,
      message:
        "Mainly recommendation systems and natural language processing. It's fascinating how we can make computers understand human language better.",
      timestamp: new Date(Date.now() - 6800000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 6,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message:
        "Wow, that's cutting-edge stuff! I'd love to learn more about it sometime.",
      timestamp: new Date(Date.now() - 6700000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 7,
      senderId: contactId,
      senderName: contactName,
      message:
        "Absolutely! We should definitely catch up over coffee sometime. Are you still in Dhaka?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: "text",
      status: "read",
    },
    {
      id: 8,
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: "Yes, still here! That would be great. When are you free?",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      type: "text",
      status: "delivered",
    },
    {
      id: 9,
      senderId: contactId,
      senderName: contactName,
      message: "How about this weekend? I know a great new café in Gulshan.",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      type: "text",
      status: "delivered",
    },
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator and random responses
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        // 20% chance
        simulateTyping();
      }
    }, 20000); // Check every 20 seconds

    return () => clearInterval(interval);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateTyping = () => {
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const responses = [
        "That sounds perfect! 😊",
        "Looking forward to it!",
        "Great! See you then.",
        "Can't wait to catch up properly!",
        "It's been too long since we last met.",
        "I have so much to tell you!",
        "This is going to be fun! 🎉",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      const newMsg = {
        id: Date.now(),
        senderId: contactId,
        senderName: contactName,
        message: randomResponse,
        timestamp: new Date().toISOString(),
        type: "text",
        status: "delivered",
      };

      setMessages((prev) => [...prev, newMsg]);
    }, 2000 + Math.random() * 3000); // 2-5 seconds typing
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      status: "sent",
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    inputRef.current?.focus();

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 3000);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return <span className="text-blue-500">✓✓</span>;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="relative">
            <img
              src={contactAvatar}
              alt={contactName}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">{contactName}</h3>
            <p className="text-sm text-gray-500">
              {isOnline ? "Online" : "Last seen recently"}
            </p>
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
          const isCurrentUser = message.senderId === currentUser.id;
          const showTime =
            !prevMessage ||
            prevMessage.senderId !== message.senderId ||
            showDateSeparator ||
            new Date(message.timestamp) - new Date(prevMessage.timestamp) >
              300000; // 5 minutes

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
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>

                  {showTime && (
                    <div
                      className={`flex items-center mt-1 px-2 space-x-1 ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <p className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </p>
                      {isCurrentUser && (
                        <span className="text-xs">
                          {getStatusIcon(message.status)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
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
            </div>
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

export default DirectChat;
