import React from 'react';
import { render, screen  } from '../../../utils/test-utils';
import RoleBadge from '../../components/RoleBadge';

describe('RoleBadge', () => {
  test('renders admin badge correctly', () => {
    render(<RoleBadge role="ADMIN" />);
    
    const badge = screen.getByText('ADMIN');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  test('renders user badge correctly', () => {
    render(<RoleBadge role="USER" />);
    
    const badge = screen.getByText('USER');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  test('renders moderator badge correctly', () => {
    render(<RoleBadge role="MODERATOR" />);
    
    const badge = screen.getByText('MODERATOR');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  test('renders unknown role with default styling', () => {
    render(<RoleBadge role="UNKNOWN" />);
    
    const badge = screen.getByText('UNKNOWN');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  test('handles case insensitive roles', () => {
    render(<RoleBadge role="admin" />);
    
    const badge = screen.getByText('admin');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });

  test('handles empty role', () => {
    render(<RoleBadge role="" />);
    
    const badge = screen.getByText('');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  test('handles undefined role', () => {
    render(<RoleBadge role={undefined} />);
    
    const badge = screen.getByText('undefined');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  test('handles null role', () => {
    render(<RoleBadge role={null} />);
    
    const badge = screen.getByText('null');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  test('applies custom className', () => {
    render(<RoleBadge role="ADMIN" className="custom-class" />);
    
    const badge = screen.getByText('ADMIN');
    expect(badge).toHaveClass('custom-class');
  });

  test('has proper accessibility attributes', () => {
    render(<RoleBadge role="ADMIN" />);
    
    const badge = screen.getByText('ADMIN');
    expect(badge).toHaveAttribute('role', 'status');
  });

  test('renders with different role variations', () => {
    const roles = ['ADMIN', 'USER', 'MODERATOR', 'SUPER_ADMIN'];
    
    roles.forEach(role => {
      const { unmount } = render(<RoleBadge role={role} />);
      
      const badge = screen.getByText(role);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('px-2', 'py-1', 'text-xs', 'font-medium', 'rounded-full');
      
      unmount();
    });
  });
}); 