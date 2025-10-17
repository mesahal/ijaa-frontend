import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * DropdownMenu Component
 * A reusable dropdown menu component with proper positioning and accessibility
 * 
 * @param {React.ReactNode} trigger - The trigger element (button, etc.)
 * @param {Array} items - Array of menu items with { label, icon, onClick, disabled }
 * @param {string} align - Alignment of dropdown ('left' | 'right')
 * @param {string} className - Additional CSS classes
 */
const DropdownMenu = ({ 
  trigger, 
  items = [], 
  align = 'right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleItemClick = (item) => {
    if (item.onClick && !item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleItemClick(item)}
              className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                item.disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${item.danger ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' : ''}`}
              role="menuitem"
              tabIndex={item.disabled ? -1 : 0}
            >
              {item.icon && (
                <span className="mr-3 flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span className="flex-1">{item.label}</span>
              {item.shortcut && (
                <span className="ml-3 text-xs text-gray-400 dark:text-gray-500">
                  {item.shortcut}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
