import React from 'react';
import { User } from 'lucide-react';
import { useUserPhoto } from '../../user/hooks/useUserPhoto';

/**
 * UserAvatar component that displays user profile photos with fallback
 * Handles both userId and username cases
 */
const UserAvatar = ({ 
  userId, 
  username, 
  name, 
  size = 'md', 
  className = '',
  showFallback = true 
}) => {
  // Use the useUserPhoto hook if we have a userId
  const { profilePhotoUrl, loading } = useUserPhoto(userId);
  
  // Debug logging
  console.log('🔍 [UserAvatar] Props:', { userId, username, name, size });
  console.log('🔍 [UserAvatar] Photo data:', { profilePhotoUrl, loading });
  
  // Get display name for fallback
  const displayName = name || username || 'User';
  const initials = displayName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Size classes
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  // Show loading state while fetching photo
  if (loading && userId) {
    return (
      <div className={`${sizeClass} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 flex-shrink-0 ${className}`}>
        <div className="animate-pulse">
          <User className={iconSize} />
        </div>
      </div>
    );
  }

  // If we have a profile photo URL, show it
  if (profilePhotoUrl && !loading) {
    return (
      <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
        <img
          src={profilePhotoUrl}
          alt={displayName}
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show fallback
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Fallback avatar - hidden by default, shown on image error */}
        <div 
          className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400"
          style={{ display: 'none' }}
        >
          {showFallback ? (
            <span className="font-medium">{initials}</span>
          ) : (
            <User className={iconSize} />
          )}
        </div>
      </div>
    );
  }

  // Show fallback avatar
  return (
    <div className={`${sizeClass} rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0 ${className}`}>
      {showFallback ? (
        <span className="font-medium">{initials}</span>
      ) : (
        <User className={iconSize} />
      )}
    </div>
  );
};

export default UserAvatar;
