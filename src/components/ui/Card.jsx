import React from 'react';

const Card = React.forwardRef(({
  children,
  variant = 'default',
  interactive = false,
  hover = false,
  className = '',
  padding = 'default',
  ...props
}, ref) => {
  const baseClasses = 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg',
    outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
    ghost: 'bg-transparent border-0 shadow-none',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20',
  };
  
  const paddingSizes = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };
  
  const interactiveClasses = interactive ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98] hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200' : '';
  const hoverClasses = hover && !interactive ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200' : '';
  
  const classes = [
    baseClasses,
    variants[variant],
    paddingSizes[padding],
    interactiveClasses,
    hoverClasses,
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card sub-components for better composition
const CardHeader = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`pb-4 ${className}`} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <h3 ref={ref} className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardSubtitle = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <p ref={ref} className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${className}`} {...props}>
    {children}
  </p>
));

CardSubtitle.displayName = 'CardSubtitle';

const CardContent = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`${className}`} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

// Attach sub-components to Card
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
