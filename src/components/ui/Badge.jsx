import React from 'react';
import { X } from 'lucide-react';

const Badge = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  removable = false,
  onRemove,
  className = '',
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    success: 'bg-success-100 dark:bg-success-900/50 text-success-800 dark:text-success-200',
    warning: 'bg-warning-100 dark:bg-warning-900/50 text-warning-800 dark:text-warning-200',
    error: 'bg-error-100 dark:bg-error-900/50 text-error-800 dark:text-error-200',
    outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
    ghost: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };
  
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const variantClasses = variants[variant];
  const sizeClasses = sizes[size];
  
  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    removable && 'pr-1',
    className,
  ].filter(Boolean).join(' ');
  
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(e);
  };
  
  return (
    <span ref={ref} className={classes} {...props}>
      {children}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1 h-3 w-3 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Remove badge"
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
