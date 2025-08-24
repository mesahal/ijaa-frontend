import React from 'react';
import { User } from 'lucide-react';

const Avatar = React.forwardRef(({
  src,
  alt,
  size = 'md',
  status,
  fallback,
  className = '',
  ...props
}, ref) => {
  const [imageError, setImageError] = React.useState(false);
  
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
    '3xl': 'h-24 w-24',
  };
  
  const statusSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-3.5 w-3.5',
    '2xl': 'h-4 w-4',
    '3xl': 'h-4 w-4',
  };
  
  const statusPositions = {
    xs: '-bottom-0.5 -right-0.5',
    sm: '-bottom-0.5 -right-0.5',
    md: '-bottom-0.5 -right-0.5',
    lg: '-bottom-1 -right-1',
    xl: '-bottom-1 -right-1',
    '2xl': '-bottom-1 -right-1',
    '3xl': '-bottom-1 -right-1',
  };
  
  const baseClasses = 'relative inline-block rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden';
  const sizeClasses = sizes[size];
  
  const classes = [
    baseClasses,
    sizeClasses,
    className,
  ].filter(Boolean).join(' ');
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="h-full w-full object-cover"
          onError={handleImageError}
        />
      );
    }
    
    if (fallback) {
      return (
        <div className="h-full w-full flex items-center justify-center text-gray-600 dark:text-gray-400">
          {fallback}
        </div>
      );
    }
    
    const initials = getInitials(alt);
    if (initials) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium text-sm">
          {initials}
        </div>
      );
    }
    
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
        <User className="h-1/2 w-1/2" />
      </div>
    );
  };
  
  return (
    <div ref={ref} className={classes} {...props}>
      {renderContent()}
      
      {status && (
        <span
          className={`absolute ${statusPositions[size]} ${statusSizes[size]} rounded-full border-2 border-white dark:border-gray-800 bg-${status === 'online' ? 'success' : status === 'away' ? 'warning' : status === 'busy' ? 'error' : 'gray'}-500`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
