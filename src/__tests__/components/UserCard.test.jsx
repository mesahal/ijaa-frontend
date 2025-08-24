import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import UserCard from '../../components/UserCard';

// Mock the useUserPhoto hook
jest.mock('../../hooks/useUserPhoto', () => ({
  useUserPhoto: jest.fn()
}));

import { useUserPhoto } from '../../hooks/useUserPhoto';

describe('UserCard', () => {
  const mockUser = {
    userId: 'test-user-id',
    name: 'John Doe',
    profession: 'Software Engineer',
    batch: 2020,
    location: 'Dhaka, Bangladesh',
    connections: 150,
    bio: 'Passionate software engineer with 5 years of experience in web development.',
    interests: ['JavaScript', 'React', 'Node.js'],
    isConnected: false
  };

  const defaultProps = {
    user: mockUser,
    onConnect: jest.fn(),
    onMessage: jest.fn(),
    onViewProfile: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useUserPhoto.mockReturnValue({
      profilePhotoUrl: 'http://localhost:8000/ijaa/api/v1/users/test-user-id/profile-photo/file/abc123.jpg',
      loading: false,
      error: null,
      hasPhoto: true
    });
  });

  it('should render user information correctly', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Batch 2020')).toBeInTheDocument();
    expect(screen.getByText('Dhaka, Bangladesh')).toBeInTheDocument();
    expect(screen.getByText('150 connections')).toBeInTheDocument();
    expect(screen.getByText('Passionate software engineer with 5 years of experience in web development.')).toBeInTheDocument();
  });

  it('should display profile photo from useUserPhoto hook', () => {
    render(<UserCard {...defaultProps} />);

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toHaveAttribute('src', 'http://localhost:8000/ijaa/api/v1/users/test-user-id/profile-photo/file/abc123.jpg');
  });

  it('should use fallback image when no profile photo is available', () => {
    useUserPhoto.mockReturnValue({
      profilePhotoUrl: null,
      loading: false,
      error: null,
      hasPhoto: false
    });

    render(<UserCard {...defaultProps} />);

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toHaveAttribute('src', '/dp.png');
  });

  it('should show connect button when user is not connected', () => {
    render(<UserCard {...defaultProps} />);

    const connectButton = screen.getByText('Connect');
    expect(connectButton).toBeInTheDocument();
  });

  it('should show message button when user is connected', () => {
    const connectedUser = { ...mockUser, isConnected: true };
    render(<UserCard {...defaultProps} user={connectedUser} />);

    const messageButton = screen.getByText('Message');
    expect(messageButton).toBeInTheDocument();
  });

  it('should show connected badge when user is connected', () => {
    const connectedUser = { ...mockUser, isConnected: true };
    render(<UserCard {...defaultProps} user={connectedUser} />);

    const connectedBadge = screen.getByText('Connected');
    expect(connectedBadge).toBeInTheDocument();
  });

  it('should call onConnect when connect button is clicked', () => {
    render(<UserCard {...defaultProps} />);

    const connectButton = screen.getByText('Connect');
    fireEvent.click(connectButton);

    expect(defaultProps.onConnect).toHaveBeenCalledWith('test-user-id');
  });

  it('should call onMessage when message button is clicked', () => {
    const connectedUser = { ...mockUser, isConnected: true };
    render(<UserCard {...defaultProps} user={connectedUser} />);

    const messageButton = screen.getByText('Message');
    fireEvent.click(messageButton);

    expect(defaultProps.onMessage).toHaveBeenCalledWith('test-user-id');
  });

  it('should call onViewProfile when card is clicked', () => {
    render(<UserCard {...defaultProps} />);

    // Find the card by looking for the container with the user name
    const card = screen.getByText('John Doe').parentElement?.parentElement?.parentElement?.parentElement;
    expect(card).toBeInTheDocument();
    fireEvent.click(card);

    expect(defaultProps.onViewProfile).toHaveBeenCalledWith('test-user-id');
  });

  it('should display interests correctly', () => {
    render(<UserCard {...defaultProps} />);

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument(); // Shows +1 for the third interest
  });

  it('should handle missing user data gracefully', () => {
    const incompleteUser = {
      userId: 'test-user-id',
      name: 'John Doe'
      // Missing other fields
    };

    render(<UserCard {...defaultProps} user={incompleteUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Not specified')).toBeInTheDocument(); // For profession
    expect(screen.getByText('Batch not specified')).toBeInTheDocument();
    expect(screen.getByText('0 connections')).toBeInTheDocument();
  });

  it('should disable buttons when loading', () => {
    render(<UserCard {...defaultProps} loading={true} />);

    const connectButton = screen.getByText('Connect');
    expect(connectButton).toBeDisabled();
  });

  it('should handle empty bio gracefully', () => {
    const userWithoutBio = { ...mockUser, bio: null };
    render(<UserCard {...defaultProps} user={userWithoutBio} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Bio section should be empty but still render
  });

  it('should handle empty interests gracefully', () => {
    const userWithoutInterests = { ...mockUser, interests: null };
    render(<UserCard {...defaultProps} user={userWithoutInterests} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Interests section should be empty but still render
  });
});
