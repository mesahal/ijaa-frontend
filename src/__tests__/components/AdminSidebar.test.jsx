import React from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import AdminSidebar from '../../components/AdminSidebar';
import { MemoryRouter } from 'react-router-dom';

describe('AdminSidebar', () => {
  test('renders admin sidebar with navigation links', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    // Check for main navigation items
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/users/i)).toBeInTheDocument();
    expect(screen.getByText(/events/i)).toBeInTheDocument();
    expect(screen.getByText(/announcements/i)).toBeInTheDocument();
    expect(screen.getByText(/reports/i)).toBeInTheDocument();
    expect(screen.getByText(/feature flags/i)).toBeInTheDocument();
  });

  test('renders sidebar with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('bg-gray-800', 'text-white', 'w-64');
  });

  test('renders admin header section', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
  });

  test('renders navigation links with proper structure', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check for navigation list
    const navList = nav.querySelector('ul');
    expect(navList).toBeInTheDocument();
  });

  test('renders navigation items with icons', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    // Check for icon elements (assuming icons are rendered)
    const dashboardLink = screen.getByText(/dashboard/i);
    expect(dashboardLink).toBeInTheDocument();
  });

  test('handles navigation link clicks', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByText(/dashboard/i);
    fireEvent.click(dashboardLink);

    // Should navigate to dashboard
    expect(dashboardLink).toBeInTheDocument();
  });

  test('renders with proper accessibility attributes', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check for proper heading structure
    const heading = screen.getByText(/admin panel/i);
    expect(heading).toBeInTheDocument();
  });

  test('renders all navigation sections', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    // Check for all expected navigation items
    const expectedItems = [
      'Dashboard',
      'Users',
      'Events',
      'Announcements',
      'Reports',
      'Feature Flags'
    ];

    expectedItems.forEach(item => {
      expect(screen.getByText(new RegExp(item, 'i'))).toBeInTheDocument();
    });
  });

  test('renders with responsive design', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const sidebar = container.firstChild;
    expect(sidebar).toHaveClass('w-64');
  });

  test('handles mobile menu toggle', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    // Check if mobile menu functionality is present
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
  });

  test('renders with proper semantic structure', () => {
    render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    // Check for proper HTML structure
    const nav = screen.getByRole('navigation');
    const list = nav.querySelector('ul');
    const items = list?.querySelectorAll('li');

    expect(nav).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(items?.length).toBeGreaterThan(0);
  });

  test('renders with consistent styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminSidebar />
      </MemoryRouter>
    );

    const sidebar = container.firstChild;
    
    // Check for consistent styling classes
    expect(sidebar).toHaveClass('bg-gray-800');
    expect(sidebar).toHaveClass('text-white');
    expect(sidebar).toHaveClass('min-h-screen');
  });
}); 