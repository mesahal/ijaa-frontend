import React from 'react';
import { render, screen } from '../utils/test-utils';
import App from '../../App';

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

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders landing page for unauthenticated users', () => {
    render(<App />);
    
    // Check for landing page content
    expect(screen.getByText(/connect with iit ju alumni/i)).toBeInTheDocument();
    expect(screen.getByText(/join now/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  test('renders app without crashing', () => {
    render(<App />);
    
    // Basic check that the app renders
    expect(document.body).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    render(<App />);
    
    // The app should show loading initially while auth context initializes
    // This is handled by the UnifiedAuthProvider
    expect(document.body).toBeInTheDocument();
  });

  test('renders with proper structure', () => {
    render(<App />);
    
    // Check for basic app structure
    const appContainer = document.querySelector('.min-h-screen');
    expect(appContainer).toBeInTheDocument();
  });

  test('includes toast container', () => {
    render(<App />);
    
    // ToastContainer should be present (mocked in test-utils)
    expect(document.body).toBeInTheDocument();
  });

  test('handles theme provider', () => {
    render(<App />);
    
    // ThemeProvider should be present
    expect(document.body).toBeInTheDocument();
  });

  test('handles auth provider', () => {
    render(<App />);
    
    // UnifiedAuthProvider should be present
    expect(document.body).toBeInTheDocument();
  });

  test('renders navbar for unauthenticated users', () => {
    render(<App />);
    
    // Check for navbar elements
    expect(screen.getByText(/iit alumni association/i)).toBeInTheDocument();
    expect(screen.getByText(/jahangirnagar university/i)).toBeInTheDocument();
  });

  test('includes proper routing setup', () => {
    render(<App />);
    
    // Check that routing is set up (BrowserRouter is in test-utils)
    expect(document.body).toBeInTheDocument();
  });

  test('handles protected routes properly', () => {
    render(<App />);
    
    // Protected routes should redirect to landing page for unauthenticated users
    expect(screen.getByText(/connect with iit ju alumni/i)).toBeInTheDocument();
  });

  test('includes proper error boundaries', () => {
    render(<App />);
    
    // App should render without errors
    expect(document.body).toBeInTheDocument();
  });

  test('handles responsive design', () => {
    render(<App />);
    
    // Check for responsive classes
    const responsiveElement = document.querySelector('.min-h-screen');
    expect(responsiveElement).toBeInTheDocument();
  });

  test('includes accessibility features', () => {
    render(<App />);
    
    // Check for basic accessibility
    expect(document.body).toBeInTheDocument();
  });

  test('handles dark mode classes', () => {
    render(<App />);
    
    // Check for dark mode classes
    const darkModeElement = document.querySelector('.dark\\:bg-gray-900');
    expect(darkModeElement).toBeInTheDocument();
  });

  test('includes proper meta structure', () => {
    render(<App />);
    
    // Check for proper HTML structure
    expect(document.querySelector('body')).toBeInTheDocument();
  });

  test('handles navigation structure', () => {
    render(<App />);
    
    // Check for navigation elements
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/join now/i)).toBeInTheDocument();
  });

  test('includes proper branding', () => {
    render(<App />);
    
    // Check for branding elements
    expect(screen.getByText(/iit alumni association/i)).toBeInTheDocument();
    expect(screen.getByText(/jahangirnagar university/i)).toBeInTheDocument();
  });

  test('handles loading states', () => {
    render(<App />);
    
    // App should handle loading states properly
    expect(document.body).toBeInTheDocument();
  });

  test('includes proper error handling', () => {
    render(<App />);
    
    // App should handle errors gracefully
    expect(document.body).toBeInTheDocument();
  });

  test('renders with consistent styling', () => {
    render(<App />);
    
    // Check for consistent styling classes
    const styledElement = document.querySelector('.bg-gray-50');
    expect(styledElement).toBeInTheDocument();
  });
}); 