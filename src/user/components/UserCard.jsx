import React from "react";
import {
  GraduationCap,
  MapPin,
  Users,
  MessageCircle,
  UserPlus,
  Tag,
} from "lucide-react";
import { Card, Avatar, Badge, Button } from "../../components/ui";
import { useFeatureFlag } from "../../hooks/useFeatureFlag";
import { useUserPhoto } from "../hooks/useUserPhoto";

const UserCard = ({ 
  user, 
  onConnect, 
  onMessage, 
  onViewProfile, 
  loading = false 
}) => {
  const { isEnabled: isInterestsEnabled } = useFeatureFlag("user.interests", false);
  const { profilePhotoUrl } = useUserPhoto(user.userId);

  const handleConnect = (e) => {
    e.stopPropagation();
    if (!loading) {
      onConnect?.(user.userId);
    }
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    if (!loading) {
      onMessage?.(user.userId);
    }
  };

  const handleViewProfile = () => {
    if (!loading) {
      onViewProfile?.(user.userId);
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={handleViewProfile}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header Section - Fixed Height */}
        <div className="flex items-start space-x-4 mb-4">
          <Avatar
            size="lg"
            src={profilePhotoUrl || "/dp.png"}
            alt={user.name || "User"}
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {user.name || "Unknown"}
            </h3>
            <p className="text-primary-600 font-medium truncate">
              {user.profession || "Not specified"}
            </p>
          </div>

          {user.isConnected && (
            <Badge variant="success" size="sm">
              Connected
            </Badge>
          )}
        </div>

        {/* Info Section - Fixed Height */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <GraduationCap className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {user.batch
                ? `Batch ${user.batch}`
                : "Batch not specified"}
            </span>
          </div>
          {user.location && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{user.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>{user.connections || 0} connections</span>
          </div>
        </div>

        {/* Bio Section - Flexible but constrained height with ellipsis */}
        <div className="flex-1 mb-4 min-h-0">
          {user.bio ? (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.5',
              maxHeight: '4.5rem'
            }}>
              {user.bio}
            </p>
          ) : (
            <div className="h-12"></div>
          )}
        </div>

        {/* Interests Section - Fixed Height */}
        {isInterestsEnabled ? (
          <div className="mb-6 h-8 flex items-start">
            {user.interests && user.interests.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {user.interests.slice(0, 2).map((interest, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    size="sm"
                    className="max-w-20 truncate"
                  >
                    <Tag className="h-3 w-3 flex-shrink-0 mr-1" />
                    {interest}
                  </Badge>
                ))}
                {user.interests.length > 2 && (
                  <span className="text-gray-500 dark:text-gray-400 text-xs px-2 py-1 flex items-center">
                    +{user.interests.length - 2}
                  </span>
                )}
              </div>
            ) : (
              <div className="h-8"></div>
            )}
          </div>
        ) : (
          <div className="mb-6 h-8"></div>
        )}

        {/* Action Buttons - Fixed at bottom */}
        <div className="mt-auto pt-4">
          {user.isConnected ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleMessage}
              icon={<MessageCircle className="h-4 w-4" />}
              disabled={loading}
            >
              Message
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleConnect}
              icon={<UserPlus className="h-4 w-4" />}
              disabled={loading}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
