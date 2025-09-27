import React from 'react';
import { render, screen, fireEvent, waitFor  } from '../../../utils/test-utils';
import { useAuth } from '../../hooks/useAuth';
import SignIn from '../../pages/SignIn';
import { MemoryRouter } from 'react-router-dom';

// Mock the UnifiedAuthContext
jest.mock('../../context/UnifiedAuthContext');

const mockUseUnifiedAuth = useUnifiedAuth;

describe('SignIn', () => {
  const mockSignIn = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUnifiedAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: false,
      user: null
    });
  });

  test('renders sign in form', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('handles form submission with valid data', async () => {
    mockSignIn.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows error message on failed login', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during submission', async () => {
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test('renders forgot password link', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test('renders sign up link', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('handles password visibility toggle', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('validates minimum password length', async () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  test('clears error messages when user starts typing', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    fireEvent.change(usernameInput, { target: { value: 'newuser' } });

    expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
  });

  test('handles keyboard submission', async () => {
    mockSignIn.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      });
    });
  });

  test('prevents form submission when loading', async () => {
    mockUseAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: true,
      user: null
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    expect(submitButton).toBeDisabled();
  });

  test('redirects authenticated users', () => {
    mockUseAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: false,
      user: { username: 'testuser' }
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Should redirect to dashboard
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument();
  });
}); 