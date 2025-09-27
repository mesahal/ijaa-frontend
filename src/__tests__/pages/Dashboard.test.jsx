import React from 'react';
import { render, screen, fireEvent  } from '../../../utils/test-utils';
import { useAuth } from '../../hooks/useAuth';
import Dashboard from '../../pages/Dashboard';
import { MemoryRouter } from 'react-router-dom';

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext');

const mockUseUnifiedAuth = useUnifiedAuth;

describe('Dashboard', () => {
  const mockUser = {
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    profession: 'Software Engineer',
    location: 'Dhaka, Bangladesh'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false
    });
  });

  test('renders dashboard with user information', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.profession)).toBeInTheDocument();
    expect(screen.getByText(mockUser.location)).toBeInTheDocument();
  });

  test('renders dashboard navigation cards', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
    expect(screen.getByText(/events/i)).toBeInTheDocument();
    expect(screen.getByText(/search/i)).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/settings/i)).toBeInTheDocument();
  });

  test('renders quick stats section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/quick stats/i)).toBeInTheDocument();
    expect(screen.getByText(/connections/i)).toBeInTheDocument();
    expect(screen.getByText(/events/i)).toBeInTheDocument();
    expect(screen.getByText(/messages/i)).toBeInTheDocument();
  });

  test('renders recent activity section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
  });

  test('handles navigation card clicks', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const profileCard = screen.getByText(/profile/i).closest('div');
    fireEvent.click(profileCard);

    // Should navigate to profile page
    expect(profileCard).toBeInTheDocument();
  });

  test('renders with loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders with no user data', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  test('renders user avatar if available', () => {
    const userWithAvatar = {
      ...mockUser,
      avatar: 'https://example.com/avatar.jpg'
    };

    mockUseAuth.mockReturnValue({
      user: userWithAvatar,
      loading: false
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const avatar = screen.getByAltText(/user avatar/i);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('renders default avatar when no avatar available', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const avatar = screen.getByAltText(/user avatar/i);
    expect(avatar).toBeInTheDocument();
  });

  test('renders admin section for admin users', () => {
    const adminUser = {
      ...mockUser,
      role: 'ADMIN'
    };

    mockUseAuth.mockReturnValue({
      user: adminUser,
      loading: false
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
  });

  test('does not render admin section for regular users', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.queryByText(/admin panel/i)).not.toBeInTheDocument();
  });

  test('renders with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const dashboard = container.firstChild;
    expect(dashboard).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  test('renders responsive design elements', () => {
    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check for responsive classes
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
  });

  test('handles empty user data gracefully', () => {
    const emptyUser = {
      username: 'testuser'
      // Missing other properties
    };

    mockUseAuth.mockReturnValue({
      user: emptyUser,
      loading: false
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  test('renders with proper accessibility attributes', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('renders navigation links with proper attributes', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const navigationCards = screen.getAllByRole('link');
    navigationCards.forEach(card => {
      expect(card).toHaveAttribute('href');
    });
  });
}); 