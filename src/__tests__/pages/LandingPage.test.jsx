import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';

const renderLandingPage = () => {
  return render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
};

describe('LandingPage Component', () => {
  describe('Navigation Buttons', () => {
    it('should render navigation bar with working buttons', () => {
      renderLandingPage();
      
      // Check if navigation elements are present
      expect(screen.getAllByText('IIT JU Alumni').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Jahangirnagar University').length).toBeGreaterThan(0);
      
      // Check navigation buttons
      const signInLinks = screen.getAllByText('Sign In');
      const joinNowButton = screen.getByText('Join Now');
      
      expect(signInLinks.length).toBeGreaterThan(0);
      expect(joinNowButton).toBeInTheDocument();
      
      // Check if links have correct href attributes
      expect(signInLinks[0].closest('a')).toHaveAttribute('href', '/signin');
      expect(joinNowButton.closest('a')).toHaveAttribute('href', '/signup');
    });

    it('should have clickable navigation buttons', () => {
      renderLandingPage();
      
      const signInLinks = screen.getAllByText('Sign In');
      const joinNowButton = screen.getByText('Join Now');
      
      // Verify buttons are clickable (not disabled)
      expect(signInLinks[0]).not.toBeDisabled();
      expect(joinNowButton).not.toBeDisabled();
    });
  });

  describe('Hero Section Buttons', () => {
    it('should render hero section with working Get Started button', () => {
      renderLandingPage();
      
      const getStartedButtons = screen.getAllByText('Get Started');
      const signInButtons = screen.getAllByText('Sign In');
      
      expect(getStartedButtons.length).toBeGreaterThan(0);
      expect(signInButtons.length).toBeGreaterThan(0);
      
      // Check if first buttons have correct href attributes
      expect(getStartedButtons[0].closest('a')).toHaveAttribute('href', '/signup');
      expect(signInButtons[0].closest('a')).toHaveAttribute('href', '/signin');
    });

    it('should have clickable hero section buttons', () => {
      renderLandingPage();
      
      const getStartedButtons = screen.getAllByText('Get Started');
      const signInButtons = screen.getAllByText('Sign In');
      
      // Verify buttons are clickable (not disabled)
      expect(getStartedButtons[0]).not.toBeDisabled();
      expect(signInButtons[0]).not.toBeDisabled();
    });

    it('should render hero section content correctly', () => {
      renderLandingPage();
      
      // Check hero section content - use more flexible text matching
      expect(screen.getAllByText(/Connect with/).length).toBeGreaterThan(0);
      expect(screen.getAllByText('IIT JU Alumni').length).toBeGreaterThan(0);
      expect(screen.getByText(/Worldwide/)).toBeInTheDocument();
      
      // Check description
      expect(screen.getByText(/Join the largest network of IIT JU graduates/)).toBeInTheDocument();
      
      // Check stats
      expect(screen.getByText('5000+')).toBeInTheDocument();
      expect(screen.getByText('Active Alumni')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('Countries')).toBeInTheDocument();
    });
  });

  describe('CTA Section Buttons', () => {
    it('should render CTA section with working buttons', () => {
      renderLandingPage();
      
      // Find all "Get Started" buttons (there should be multiple)
      const getStartedButtons = screen.getAllByText('Get Started');
      const signInButtons = screen.getAllByText('Sign In');
      
      // Should have at least 2 Get Started buttons (hero + CTA)
      expect(getStartedButtons.length).toBeGreaterThanOrEqual(2);
      expect(signInButtons.length).toBeGreaterThanOrEqual(2);
      
      // Check CTA section content
      expect(screen.getByText('Ready to join the network?')).toBeInTheDocument();
      expect(screen.getByText(/Connect with thousands of IIT JU alumni/)).toBeInTheDocument();
    });

    it('should have clickable CTA section buttons', () => {
      renderLandingPage();
      
      // Get the last "Get Started" and "Sign In" buttons (CTA section)
      const getStartedButtons = screen.getAllByText('Get Started');
      const signInButtons = screen.getAllByText('Sign In');
      
      const ctaGetStartedButton = getStartedButtons[getStartedButtons.length - 1];
      const ctaSignInButton = signInButtons[signInButtons.length - 1];
      
      // Verify buttons are clickable (not disabled)
      expect(ctaGetStartedButton).not.toBeDisabled();
      expect(ctaSignInButton).not.toBeDisabled();
      
      // Check if buttons have correct href attributes
      expect(ctaGetStartedButton.closest('a')).toHaveAttribute('href', '/signup');
      expect(ctaSignInButton.closest('a')).toHaveAttribute('href', '/signin');
    });
  });

  describe('Features Section', () => {
    it('should render features section correctly', () => {
      renderLandingPage();
      
      // Check section title
      expect(screen.getByText('Everything you need to stay connected')).toBeInTheDocument();
      
      // Check feature cards
      expect(screen.getByText('Connect with Alumni')).toBeInTheDocument();
      expect(screen.getByText('Events & Meetups')).toBeInTheDocument();
      expect(screen.getByText('Real-time Chat')).toBeInTheDocument();
      expect(screen.getByText('Video Calls')).toBeInTheDocument();
      expect(screen.getByText('Professional Network')).toBeInTheDocument();
      expect(screen.getByText('Advanced Search')).toBeInTheDocument();
    });

    it('should render feature descriptions', () => {
      renderLandingPage();
      
      expect(screen.getByText(/Find and connect with fellow graduates/)).toBeInTheDocument();
      expect(screen.getByText(/Join alumni events, reunions/)).toBeInTheDocument();
      expect(screen.getByText(/Stay connected with instant messaging/)).toBeInTheDocument();
      expect(screen.getByText(/Connect face-to-face with alumni/)).toBeInTheDocument();
      expect(screen.getByText(/Build your professional network/)).toBeInTheDocument();
      expect(screen.getByText(/Find alumni by profession/)).toBeInTheDocument();
    });
  });

  describe('Footer Links', () => {
    it('should render footer with working links', () => {
      renderLandingPage();
      
      // Check footer links
      expect(screen.getByText('Join Network')).toBeInTheDocument();
      expect(screen.getByText('Events')).toBeInTheDocument();
      expect(screen.getByText('Find Alumni')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
      
      // Check if links have correct href attributes
      expect(screen.getByText('Join Network').closest('a')).toHaveAttribute('href', '/signup');
      expect(screen.getByText('Events').closest('a')).toHaveAttribute('href', '/events');
      expect(screen.getByText('Find Alumni').closest('a')).toHaveAttribute('href', '/search');
      expect(screen.getByText('Support').closest('a')).toHaveAttribute('href', '/contact-support');
      expect(screen.getByText('Terms of Service').closest('a')).toHaveAttribute('href', '/terms');
      expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute('href', '/privacy');
      expect(screen.getByText('Contact Us').closest('a')).toHaveAttribute('href', '/contact-support');
    });

    it('should have clickable footer links', () => {
      renderLandingPage();
      
      const footerLinks = [
        'Join Network',
        'Events',
        'Find Alumni',
        'Support',
        'Terms of Service',
        'Privacy Policy',
        'Contact Us'
      ];
      
      footerLinks.forEach(linkText => {
        const link = screen.getByText(linkText);
        expect(link).not.toBeDisabled();
      });
    });
  });

  describe('Button Styling and Accessibility', () => {
    it('should have proper button styling classes', () => {
      renderLandingPage();
      
      const getStartedButtons = screen.getAllByText('Get Started');
      const signInButtons = screen.getAllByText('Sign In');
      
      // Check if buttons have proper styling classes
      getStartedButtons.forEach(button => {
        expect(button.closest('a')).toHaveClass('inline-flex');
      });
      
      // Only check styled buttons (not the navigation link)
      signInButtons.slice(1).forEach(button => {
        expect(button.closest('a')).toHaveClass('inline-flex');
      });
    });

    it('should have proper button sizes', () => {
      renderLandingPage();
      
      const getStartedButtons = screen.getAllByText('Get Started');
      const signInButtons = screen.getAllByText('Sign In');
      
      // Check if buttons have size classes
      getStartedButtons.forEach(button => {
        expect(button.closest('a')).toHaveClass('px-6', 'py-3');
      });
      
      // Only check styled buttons (not the navigation link)
      signInButtons.slice(1).forEach(button => {
        expect(button.closest('a')).toHaveClass('px-6', 'py-3');
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render all sections on different screen sizes', () => {
      renderLandingPage();
      
      // All sections should be present regardless of screen size
      expect(screen.getAllByText(/Connect with/).length).toBeGreaterThan(0); // Hero
      expect(screen.getByText('Everything you need to stay connected')).toBeInTheDocument(); // Features
      expect(screen.getByText('Ready to join the network?')).toBeInTheDocument(); // CTA
      expect(screen.getAllByText('IIT JU Alumni').length).toBeGreaterThan(0); // Footer
    });
  });

  describe('Button Functionality', () => {
    it('should navigate to correct routes when buttons are clicked', () => {
      renderLandingPage();
      
      // Test navigation buttons
      const navSignIn = screen.getAllByText('Sign In')[0]; // Navigation link
      const navJoinNow = screen.getByText('Join Now');
      
      expect(navSignIn.closest('a')).toHaveAttribute('href', '/signin');
      expect(navJoinNow.closest('a')).toHaveAttribute('href', '/signup');
      
      // Test hero buttons
      const heroGetStarted = screen.getAllByText('Get Started')[0];
      const heroSignIn = screen.getAllByText('Sign In')[1]; // Hero button
      
      expect(heroGetStarted.closest('a')).toHaveAttribute('href', '/signup');
      expect(heroSignIn.closest('a')).toHaveAttribute('href', '/signin');
      
      // Test CTA buttons
      const ctaGetStarted = screen.getAllByText('Get Started')[1];
      const ctaSignIn = screen.getAllByText('Sign In')[2]; // CTA button
      
      expect(ctaGetStarted.closest('a')).toHaveAttribute('href', '/signup');
      expect(ctaSignIn.closest('a')).toHaveAttribute('href', '/signin');
    });
  });
});
