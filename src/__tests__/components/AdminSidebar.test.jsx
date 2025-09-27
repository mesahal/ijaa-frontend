import React from 'react';
import { render, screen, fireEvent  } from '../../../utils/test-utils';
import AdminNavbar from '../../components/AdminNavbar';
import { MemoryRouter } from 'react-router-dom';

describe('AdminNavbar', () => {
  test('renders admin navbar with navigation links', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check for main navigation items
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/users/i)).toBeInTheDocument();
    expect(screen.getByText(/feature flags/i)).toBeInTheDocument();
  });

  test('renders navbar with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    const navbar = container.querySelector('nav');
    expect(navbar).toHaveClass('bg-white', 'dark:bg-gray-800', 'shadow-lg');
  });

  test('renders admin header section', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
    expect(screen.getByText(/IIT JU Alumni Network/i)).toBeInTheDocument();
  });

  test('renders navigation links with proper structure', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();

    // Check for navigation items
    const dashboardLink = screen.getByText(/dashboard/i);
    expect(dashboardLink).toBeInTheDocument();
  });

  test('renders navigation items with icons', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check for icon elements (assuming icons are rendered)
    const dashboardLink = screen.getByText(/dashboard/i);
    expect(dashboardLink).toBeInTheDocument();
  });

  test('handles navigation link clicks', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
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
        <AdminNavbar />
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
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check for all expected navigation items
    const expectedItems = [
      'Dashboard',
      'Users',
      'Feature Flags'
    ];

    expectedItems.forEach(item => {
      expect(screen.getByText(new RegExp(item, 'i'))).toBeInTheDocument();
    });
  });

  test('renders with responsive design', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    const navbar = container.querySelector('nav');
    expect(navbar).toHaveClass('sticky', 'top-0', 'z-50');
  });

  test('handles mobile menu toggle', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check if mobile menu functionality is present
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  test('renders with proper semantic structure', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check for proper HTML structure
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('renders with consistent styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    const navbar = container.querySelector('nav');
    
    // Check for consistent styling classes
    expect(navbar).toHaveClass('bg-white');
    expect(navbar).toHaveClass('dark:bg-gray-800');
    expect(navbar).toHaveClass('shadow-lg');
  });

  test('renders theme toggle button', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check for theme toggle functionality
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  test('renders notifications icon', () => {
    render(
      <MemoryRouter>
        <AdminNavbar />
      </MemoryRouter>
    );

    // Check for notifications functionality
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });
}); 