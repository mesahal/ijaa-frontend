import React from 'react';
import { render, screen  } from '../../../utils/test-utils';
import AdminLayout from '../../components/AdminLayout';
import { MemoryRouter } from 'react-router-dom';

describe('AdminLayout', () => {
  const TestContent = () => <div>Admin Content</div>;

  test('renders admin layout with sidebar and content', () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('renders admin sidebar', () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    // Check for sidebar elements
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/users/i)).toBeInTheDocument();
    expect(screen.getByText(/feature flags/i)).toBeInTheDocument();
  });

  test('renders admin header', () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  test('renders main content area', () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    const mainContent = screen.getByText('Admin Content');
    expect(mainContent).toBeInTheDocument();
  });

  test('has proper layout structure', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    // Check for layout classes
    const layout = container.firstChild;
    expect(layout).toHaveClass('flex', 'h-screen', 'bg-gray-100');
  });

  test('renders sidebar with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    const sidebar = container.querySelector('[data-testid="admin-sidebar"]') || 
                   container.querySelector('.bg-gray-800');
    expect(sidebar).toBeInTheDocument();
  });

  test('renders main content with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    const mainContent = container.querySelector('main') || 
                       container.querySelector('.flex-1');
    expect(mainContent).toBeInTheDocument();
  });

  test('handles multiple children', () => {
    const MultipleContent = () => (
      <>
        <div>Content 1</div>
        <div>Content 2</div>
      </>
    );

    render(
      <MemoryRouter>
        <AdminLayout>
          <MultipleContent />
        </AdminLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  test('handles empty children', () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          {null}
        </AdminLayout>
      </MemoryRouter>
    );

    // Should still render the layout structure
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    // Check for navigation landmarks
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('renders with responsive design', () => {
    const { container } = render(
      <MemoryRouter>
        <AdminLayout>
          <TestContent />
        </AdminLayout>
      </MemoryRouter>
    );

    // Check for responsive classes
    const layout = container.firstChild;
    expect(layout).toHaveClass('flex');
  });
}); 