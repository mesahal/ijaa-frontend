import React from 'react';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import App from '../../App';
import { mockUser, mockAdmin } from '../utils/test-utils';

// Mock all API calls
jest.mock('../../utils/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock the contexts
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn()
  })
}));

jest.mock('../../context/AdminAuthContext', () => ({
  useAdminAuth: () => ({
    admin: null,
    loading: false,
    signIn: jest.fn(),
    signOut: jest.fn()
  })
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    isDark: false,
    toggleTheme: jest.fn()
  })
}));

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders landing page for unauthenticated users', () => {
    render(<App />);
    
    expect(screen.getByText(/connect with iit ju alumni/i)).toBeInTheDocument();
    expect(screen.getByText(/join now/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  test('navigates to sign in page', () => {
    render(<App />);
    
    const signInLink = screen.getByText(/sign in/i);
    fireEvent.click(signInLink);
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test('navigates to sign up page', () => {
    render(<App />);
    
    const joinNowLink = screen.getByText(/join now/i);
    fireEvent.click(joinNowLink);
    
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });

  test('shows 404 page for invalid routes', () => {
    // Mock window.location to simulate invalid route
    delete window.location;
    window.location = { pathname: '/invalid-route' };
    
    render(<App />);
    
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  test('renders dashboard for authenticated users', () => {
    // Mock authenticated user
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('renders admin dashboard for admin users', () => {
    // Mock authenticated admin
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    jest.doMock('../../context/AdminAuthContext', () => ({
      useAdminAuth: () => ({
        admin: mockAdmin,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  test('shows loading state while authentication is loading', () => {
    // Mock loading state
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: true,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    // Should show loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('navigates to events page', () => {
    // Mock authenticated user
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    const eventsLink = screen.getByText(/events/i);
    fireEvent.click(eventsLink);
    
    expect(screen.getByText(/discover and manage alumni events/i)).toBeInTheDocument();
  });

  test('navigates to search page', () => {
    // Mock authenticated user
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    const searchLink = screen.getByText(/search/i);
    fireEvent.click(searchLink);
    
    expect(screen.getByText(/find alumni/i)).toBeInTheDocument();
  });

  test('navigates to profile page', () => {
    // Mock authenticated user
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    // Click on profile dropdown
    const profileButton = screen.getByText(mockUser.name);
    fireEvent.click(profileButton);
    
    const viewProfileLink = screen.getByText(/view profile/i);
    fireEvent.click(viewProfileLink);
    
    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  test('handles theme toggle', () => {
    const mockToggleTheme = jest.fn();
    
    jest.doMock('../../context/ThemeContext', () => ({
      useTheme: () => ({
        isDark: false,
        toggleTheme: mockToggleTheme
      })
    }));
    
    render(<App />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(themeToggle);
    
    expect(mockToggleTheme).toHaveBeenCalled();
  });

  test('shows notifications link', () => {
    // Mock authenticated user
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signOut: jest.fn()
      })
    }));
    
    render(<App />);
    
    const notificationsLink = screen.getByRole('link', { name: /notifications/i });
    expect(notificationsLink).toBeInTheDocument();
  });

  test('handles sign out', () => {
    const mockSignOut = jest.fn();
    
    // Mock authenticated user
    jest.doMock('../../context/AuthContext', () => ({
      useAuth: () => ({
        user: mockUser,
        loading: false,
        signIn: jest.fn(),
        signOut: mockSignOut
      })
    }));
    
    render(<App />);
    
    // Click on profile dropdown
    const profileButton = screen.getByText(mockUser.name);
    fireEvent.click(profileButton);
    
    const signOutButton = screen.getByText(/sign out/i);
    fireEvent.click(signOutButton);
    
    expect(mockSignOut).toHaveBeenCalled();
  });

  test('renders public pages without authentication', () => {
    render(<App />);
    
    // Test terms page
    const termsLink = screen.getByText(/terms/i);
    fireEvent.click(termsLink);
    
    expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
  });

  test('renders privacy policy page', () => {
    render(<App />);
    
    // Navigate to privacy page
    const privacyLink = screen.getByText(/privacy/i);
    fireEvent.click(privacyLink);
    
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
  });

  test('renders support page', () => {
    render(<App />);
    
    // Navigate to support page
    const supportLink = screen.getByText(/support/i);
    fireEvent.click(supportLink);
    
    expect(screen.getByText(/contact support/i)).toBeInTheDocument();
  });

  test('handles maintenance mode', () => {
    // Mock maintenance route
    delete window.location;
    window.location = { pathname: '/maintenance' };
    
    render(<App />);
    
    expect(screen.getByText(/maintenance/i)).toBeInTheDocument();
  });

  test('accessibility features are present', () => {
    render(<App />);
    
    // Check for proper ARIA labels
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
    
    // Check for proper navigation structure
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  test('responsive design works correctly', () => {
    render(<App />);
    
    // Test mobile menu button is present
    const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });
}); 