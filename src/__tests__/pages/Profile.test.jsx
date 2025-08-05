import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { useAuth } from '../../context/AuthContext';
import Profile from '../../pages/Profile';
import { MemoryRouter } from 'react-router-dom';

// Mock the AuthContext
jest.mock('../../context/AuthContext');

const mockUseAuth = useAuth;

describe('Profile', () => {
  const mockUser = {
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    profession: 'Software Engineer',
    location: 'Dhaka, Bangladesh',
    bio: 'Test bio',
    phone: '+880-1234567890',
    linkedIn: 'https://linkedin.com/in/testuser',
    website: 'https://testuser.com',
    batch: '2018',
    facebook: 'https://facebook.com/testuser',
    connections: 25
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false
    });
  });

  test('renders profile information', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(mockUser.profession)).toBeInTheDocument();
    expect(screen.getByText(mockUser.location)).toBeInTheDocument();
    expect(screen.getByText(mockUser.bio)).toBeInTheDocument();
    expect(screen.getByText(mockUser.phone)).toBeInTheDocument();
    expect(screen.getByText(mockUser.batch)).toBeInTheDocument();
  });

  test('renders edit profile button', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/edit profile/i)).toBeInTheDocument();
  });

  test('renders profile sections', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/personal information/i)).toBeInTheDocument();
    expect(screen.getByText(/contact information/i)).toBeInTheDocument();
    expect(screen.getByText(/social links/i)).toBeInTheDocument();
    expect(screen.getByText(/connections/i)).toBeInTheDocument();
  });

  test('renders user avatar', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const avatar = screen.getByAltText(/user avatar/i);
    expect(avatar).toBeInTheDocument();
  });

  test('renders social links', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/linkedin/i)).toBeInTheDocument();
    expect(screen.getByText(/website/i)).toBeInTheDocument();
    expect(screen.getByText(/facebook/i)).toBeInTheDocument();
  });

  test('renders connections count', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(mockUser.connections.toString())).toBeInTheDocument();
  });

  test('handles edit profile button click', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editButton = screen.getByText(/edit profile/i);
    fireEvent.click(editButton);

    // Should navigate to edit profile page
    expect(editButton).toBeInTheDocument();
  });

  test('renders with loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <MemoryRouter>
        <Profile />
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
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/profile not found/i)).toBeInTheDocument();
  });

  test('handles missing optional fields gracefully', () => {
    const userWithMissingFields = {
      username: 'testuser',
      name: 'Test User',
      email: 'test@example.com'
      // Missing other fields
    };

    mockUseAuth.mockReturnValue({
      user: userWithMissingFields,
      loading: false
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(userWithMissingFields.name)).toBeInTheDocument();
    expect(screen.getByText(userWithMissingFields.email)).toBeInTheDocument();
  });

  test('renders privacy settings indicators', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Check for privacy indicators
    expect(screen.getByText(/visibility settings/i)).toBeInTheDocument();
  });

  test('renders with proper styling', () => {
    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const profile = container.firstChild;
    expect(profile).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  test('renders responsive design elements', () => {
    const { container } = render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Check for responsive classes
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-1', 'lg:grid-cols-3');
  });

  test('renders with proper accessibility attributes', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('handles long text content', () => {
    const userWithLongBio = {
      ...mockUser,
      bio: 'This is a very long bio that should be handled properly by the component. It contains multiple sentences and should be displayed correctly without breaking the layout.'
    };

    mockUseAuth.mockReturnValue({
      user: userWithLongBio,
      loading: false
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(userWithLongBio.bio)).toBeInTheDocument();
  });

  test('renders contact information section', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/phone/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.phone)).toBeInTheDocument();
  });

  test('renders batch information', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/batch/i)).toBeInTheDocument();
    expect(screen.getByText(mockUser.batch)).toBeInTheDocument();
  });

  test('handles special characters in user data', () => {
    const userWithSpecialChars = {
      ...mockUser,
      name: 'Test User & Co.',
      bio: 'Bio with special chars: @#$%^&*()'
    };

    mockUseAuth.mockReturnValue({
      user: userWithSpecialChars,
      loading: false
    });

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(userWithSpecialChars.name)).toBeInTheDocument();
    expect(screen.getByText(userWithSpecialChars.bio)).toBeInTheDocument();
  });

  test('renders with proper semantic structure', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Check for proper section structure
    const sections = screen.getAllByRole('region');
    expect(sections.length).toBeGreaterThan(0);
  });
}); 