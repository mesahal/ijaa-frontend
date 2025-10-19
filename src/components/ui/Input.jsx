import React from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  error,
  success,
  helpText,
  leftIcon,
  rightIcon,
  type = 'text',
  className = '',
  fullWidth = true,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const { onClick: userOnClick, onFocus: userOnFocus, onBlur: userOnBlur, ...restProps } = props;
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const isDateLike = ['date', 'datetime-local', 'time', 'month', 'week'].includes(inputType);
  
  const baseClasses = 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors duration-200';
  const stateClasses = error ? 'border-error-300 dark:border-error-600 focus:border-error-500 dark:focus:border-error-400 focus:ring-error-500' : success ? 'border-success-300 dark:border-success-600 focus:border-success-500 dark:focus:border-success-400 focus:ring-success-500' : '';
  const focusClasses = isFocused ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : '';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = [
    baseClasses,
    stateClasses,
    focusClasses,
    widthClasses,
    leftIcon && 'pl-10',
    (rightIcon || type === 'password') && 'pr-10',
    className,
  ].filter(Boolean).join(' ');
  
  const handleFocus = (e) => {
    setIsFocused(true);
    userOnFocus?.(e);
  };
  
  const handleBlur = (e) => {
    setIsFocused(false);
    userOnBlur?.(e);
  };
  
  const handleClick = (e) => {
    if (isDateLike && typeof e.currentTarget.showPicker === 'function') {
      try { e.currentTarget.showPicker(); } catch {}
    }
    userOnClick?.(e);
  };
  
  return (
    <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={classes}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${props.id || 'input'}-error` :
            success ? `${props.id || 'input'}-success` :
            helpText ? `${props.id || 'input'}-help` : undefined
          }
          {...restProps}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        
        {rightIcon && type !== 'password' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
        
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-error-500" />
          </div>
        )}
        
        {success && !error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-success-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${props.id || 'input'}-error`} className="text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
      
      {success && !error && (
        <p id={`${props.id || 'input'}-success`} className="text-sm text-success-600 dark:text-success-400">
          {success}
        </p>
      )}
      
      {helpText && !error && !success && (
        <p id={`${props.id || 'input'}-help`} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
