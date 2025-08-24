import React from 'react';
import { getRoleDisplayName, ADMIN_ROLE, USER_ROLE } from '../utils/roleConstants';

const RoleBadge = ({ role, className = "" }) => {
  const getBadgeStyle = (role) => {
    switch (role) {
      case ADMIN_ROLE:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case USER_ROLE:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(role)} ${className}`}
    >
      {getRoleDisplayName(role)}
    </span>
  );
};

export default RoleBadge; 