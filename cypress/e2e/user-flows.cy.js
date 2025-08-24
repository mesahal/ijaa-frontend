describe('User Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Dashboard Flow', () => {
    it('should display user dashboard after login', () => {
      cy.login();
      
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="dashboard-title"]').should('contain', 'Dashboard');
      cy.get('[data-testid="user-name"]').should('contain', 'Test User');
    });

    it('should show recent activities', () => {
      cy.mockApi('GET', '**/dashboard/activities', {
        message: 'Activities retrieved successfully',
        data: [
          {
            id: 1,
            type: 'EVENT_JOINED',
            title: 'Alumni Meet 2024',
            timestamp: '2024-01-15T10:00:00Z'
          },
          {
            id: 2,
            type: 'PROFILE_UPDATED',
            title: 'Profile updated',
            timestamp: '2024-01-14T15:30:00Z'
          }
        ]
      });

      cy.login();
      
      cy.get('[data-testid="activity-item"]').should('have.length', 2);
      cy.get('[data-testid="activity-item"]').first().should('contain', 'Alumni Meet 2024');
    });

    it('should show upcoming events', () => {
      cy.mockApi('GET', '**/dashboard/upcoming-events', {
        message: 'Upcoming events retrieved successfully',
        data: [
          {
            id: 1,
            title: 'Alumni Meet 2024',
            startDate: '2024-02-15T18:00:00Z',
            location: 'Main Campus'
          }
        ]
      });

      cy.login();
      
      cy.get('[data-testid="upcoming-event"]').should('have.length', 1);
      cy.get('[data-testid="upcoming-event"]').first().should('contain', 'Alumni Meet 2024');
    });

    it('should show connection suggestions', () => {
      cy.mockApi('GET', '**/dashboard/suggestions', {
        message: 'Suggestions retrieved successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            profession: 'Software Engineer',
            batch: '2020'
          }
        ]
      });

      cy.login();
      
      cy.get('[data-testid="connection-suggestion"]').should('have.length', 1);
      cy.get('[data-testid="connection-suggestion"]').first().should('contain', 'John Doe');
    });
  });

  describe('Profile Management', () => {
    it('should display user profile', () => {
      cy.mockApi('GET', '**/profile', {
        message: 'Profile retrieved successfully',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          profession: 'Software Engineer',
          location: 'Dhaka, Bangladesh',
          bio: 'Alumni from 2020 batch',
          batch: '2020',
          connections: 25
        }
      });

      cy.login();
      cy.visit('/profile');
      
      cy.get('[data-testid="profile-name"]').should('contain', 'Test User');
      cy.get('[data-testid="profile-profession"]').should('contain', 'Software Engineer');
      cy.get('[data-testid="profile-location"]').should('contain', 'Dhaka, Bangladesh');
    });

    it('should allow editing profile', () => {
      cy.mockApi('GET', '**/profile', {
        message: 'Profile retrieved successfully',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          profession: 'Software Engineer',
          location: 'Dhaka, Bangladesh',
          bio: 'Alumni from 2020 batch'
        }
      });

      cy.mockApi('PUT', '**/profile', {
        message: 'Profile updated successfully',
        data: {
          name: 'Updated User',
          profession: 'Senior Software Engineer',
          location: 'Dhaka, Bangladesh',
          bio: 'Updated bio'
        }
      });

      cy.login();
      cy.visit('/profile');
      
      cy.get('[data-testid="edit-profile-button"]').click();
      
      cy.get('[data-testid="name-input"]').clear().type('Updated User');
      cy.get('[data-testid="profession-input"]').clear().type('Senior Software Engineer');
      cy.get('[data-testid="bio-input"]').clear().type('Updated bio');
      
      cy.get('[data-testid="save-profile-button"]').click();
      
      cy.get('[data-testid="success-message"]').should('contain', 'Profile updated successfully');
      cy.get('[data-testid="profile-name"]').should('contain', 'Updated User');
    });

    it('should handle profile update errors', () => {
      cy.mockApi('PUT', '**/profile', {
        message: 'Validation failed',
        errors: ['Name is required', 'Profession is required']
      }, 400);

      cy.login();
      cy.visit('/profile');
      
      cy.get('[data-testid="edit-profile-button"]').click();
      
      cy.get('[data-testid="name-input"]').clear();
      cy.get('[data-testid="profession-input"]').clear();
      
      cy.get('[data-testid="save-profile-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Name is required');
      cy.get('[data-testid="error-message"]').should('contain', 'Profession is required');
    });

    it('should upload profile picture', () => {
      cy.mockApi('POST', '**/profile/avatar', {
        message: 'Profile picture updated successfully'
      });

      cy.login();
      cy.visit('/profile');
      
      cy.get('[data-testid="edit-profile-button"]').click();
      
      cy.get('[data-testid="avatar-input"]').attachFile('profile-picture.jpg');
      
      cy.get('[data-testid="save-profile-button"]').click();
      
      cy.get('[data-testid="success-message"]').should('contain', 'Profile picture updated successfully');
    });
  });

  describe('Alumni Search', () => {
    it('should search for alumni by name', () => {
      cy.mockApi('GET', '**/search?query=john', {
        message: 'Search completed successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            profession: 'Software Engineer',
            location: 'Dhaka, Bangladesh',
            batch: '2020'
          }
        ]
      });

      cy.login();
      cy.visit('/search');
      
      cy.get('[data-testid="search-input"]').type('john');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="search-result"]').should('have.length', 1);
      cy.get('[data-testid="search-result"]').first().should('contain', 'John Doe');
    });

    it('should filter alumni by profession', () => {
      cy.mockApi('GET', '**/search?profession=engineer', {
        message: 'Search completed successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            profession: 'Software Engineer',
            location: 'Dhaka, Bangladesh',
            batch: '2020'
          },
          {
            id: 2,
            name: 'Jane Smith',
            profession: 'Civil Engineer',
            location: 'Chittagong, Bangladesh',
            batch: '2019'
          }
        ]
      });

      cy.login();
      cy.visit('/search');
      
      cy.get('[data-testid="profession-filter"]').select('engineer');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="search-result"]').should('have.length', 2);
    });

    it('should filter alumni by batch', () => {
      cy.mockApi('GET', '**/search?batch=2020', {
        message: 'Search completed successfully',
        data: [
          {
            id: 1,
            name: 'John Doe',
            profession: 'Software Engineer',
            location: 'Dhaka, Bangladesh',
            batch: '2020'
          }
        ]
      });

      cy.login();
      cy.visit('/search');
      
      cy.get('[data-testid="batch-filter"]').select('2020');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="search-result"]').should('have.length', 1);
    });

    it('should show no results for empty search', () => {
      cy.mockApi('GET', '**/search?query=nonexistent', {
        message: 'Search completed successfully',
        data: []
      });

      cy.login();
      cy.visit('/search');
      
      cy.get('[data-testid="search-input"]').type('nonexistent');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="no-results"]').should('contain', 'No alumni found');
    });

    it('should handle search errors', () => {
      cy.mockApi('GET', '**/search', {
        message: 'Search failed',
        code: '500'
      }, 500);

      cy.login();
      cy.visit('/search');
      
      cy.get('[data-testid="search-input"]').type('test');
      cy.get('[data-testid="search-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Search failed');
    });
  });

  describe('Events Management', () => {
    it('should display upcoming events', () => {
      cy.mockApi('GET', '**/events', {
        message: 'Events retrieved successfully',
        data: [
          {
            id: 1,
            title: 'Alumni Meet 2024',
            description: 'Annual alumni gathering',
            startDate: '2024-02-15T18:00:00Z',
            endDate: '2024-02-15T22:00:00Z',
            location: 'Main Campus',
            eventType: 'GATHERING',
            isOnline: false,
            maxParticipants: 100,
            currentParticipants: 50
          }
        ]
      });

      cy.login();
      cy.visit('/events');
      
      cy.get('[data-testid="event-card"]').should('have.length', 1);
      cy.get('[data-testid="event-title"]').should('contain', 'Alumni Meet 2024');
      cy.get('[data-testid="event-location"]').should('contain', 'Main Campus');
    });

    it('should register for an event', () => {
      cy.mockApi('POST', '**/events/1/register', {
        message: 'Successfully registered for event',
        data: {
          eventId: 1,
          userId: 'USER_123',
          registrationDate: '2024-01-15T10:00:00Z'
        }
      });

      cy.login();
      cy.visit('/events');
      
      cy.get('[data-testid="register-button"]').first().click();
      
      cy.get('[data-testid="success-message"]').should('contain', 'Successfully registered for event');
    });

    it('should show event details', () => {
      cy.mockApi('GET', '**/events/1', {
        message: 'Event details retrieved successfully',
        data: {
          id: 1,
          title: 'Alumni Meet 2024',
          description: 'Annual alumni gathering with networking opportunities',
          startDate: '2024-02-15T18:00:00Z',
          endDate: '2024-02-15T22:00:00Z',
          location: 'Main Campus',
          eventType: 'GATHERING',
          isOnline: false,
          maxParticipants: 100,
          currentParticipants: 50,
          organizerName: 'Alumni Association',
          organizerEmail: 'alumni@ijaa.com'
        }
      });

      cy.login();
      cy.visit('/events/1');
      
      cy.get('[data-testid="event-title"]').should('contain', 'Alumni Meet 2024');
      cy.get('[data-testid="event-description"]').should('contain', 'Annual alumni gathering');
      cy.get('[data-testid="event-location"]').should('contain', 'Main Campus');
      cy.get('[data-testid="event-organizer"]').should('contain', 'Alumni Association');
    });

    it('should handle event registration errors', () => {
      cy.mockApi('POST', '**/events/1/register', {
        message: 'Event is full',
        code: '400'
      }, 400);

      cy.login();
      cy.visit('/events');
      
      cy.get('[data-testid="register-button"]').first().click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Event is full');
    });
  });

  describe('Navigation and Routing', () => {
    it('should navigate between different pages', () => {
      cy.login();
      
      // Navigate to dashboard
      cy.get('[data-testid="dashboard-link"]').click();
      cy.url().should('include', '/dashboard');
      
      // Navigate to events
      cy.get('[data-testid="events-link"]').click();
      cy.url().should('include', '/events');
      
      // Navigate to search
      cy.get('[data-testid="search-link"]').click();
      cy.url().should('include', '/search');
      
      // Navigate to profile
      cy.get('[data-testid="profile-link"]').click();
      cy.url().should('include', '/profile');
    });

    it('should show active navigation state', () => {
      cy.login();
      
      cy.visit('/dashboard');
      cy.get('[data-testid="dashboard-link"]').should('have.class', 'active');
      
      cy.visit('/events');
      cy.get('[data-testid="events-link"]').should('have.class', 'active');
      
      cy.visit('/search');
      cy.get('[data-testid="search-link"]').should('have.class', 'active');
    });

    it('should redirect unauthenticated users to login', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/signin');
      
      cy.visit('/profile');
      cy.url().should('include', '/signin');
      
      cy.visit('/events');
      cy.url().should('include', '/signin');
    });
  });

  describe('Theme and UI', () => {
    it('should toggle between light and dark themes', () => {
      cy.login();
      
      // Check initial theme
      cy.get('body').should('not.have.class', 'dark');
      
      // Toggle to dark theme
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('body').should('have.class', 'dark');
      
      // Toggle back to light theme
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('body').should('not.have.class', 'dark');
    });

    it('should persist theme preference', () => {
      cy.login();
      
      // Set dark theme
      cy.get('[data-testid="theme-toggle"]').click();
      cy.get('body').should('have.class', 'dark');
      
      // Reload page
      cy.reload();
      
      // Should maintain dark theme
      cy.get('body').should('have.class', 'dark');
    });

    it('should show loading states', () => {
      cy.intercept('GET', '**/dashboard', (req) => {
        req.reply({ delay: 1000 });
      });

      cy.login();
      
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
      cy.get('[data-testid="loading-spinner"]').should('not.exist');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport(375, 667);
      cy.login();
      
      // Check mobile navigation
      cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
      cy.get('[data-testid="mobile-menu-button"]').click();
      cy.get('[data-testid="mobile-menu"]').should('be.visible');
      
      // Check mobile navigation links
      cy.get('[data-testid="mobile-dashboard-link"]').should('be.visible');
      cy.get('[data-testid="mobile-events-link"]').should('be.visible');
      cy.get('[data-testid="mobile-search-link"]').should('be.visible');
    });

    it('should work on tablet devices', () => {
      cy.viewport(768, 1024);
      cy.login();
      
      // Check tablet layout
      cy.get('[data-testid="dashboard-content"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
    });

    it('should work on desktop devices', () => {
      cy.viewport(1280, 720);
      cy.login();
      
      // Check desktop layout
      cy.get('[data-testid="navbar"]').should('be.visible');
      cy.get('[data-testid="main-content"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible for screen readers', () => {
      cy.login();
      
      cy.checkA11y();
      
      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused().should('exist');
    });

    it('should have proper ARIA labels', () => {
      cy.login();
      
      cy.get('[data-testid="theme-toggle"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="profile-menu"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="search-input"]').should('have.attr', 'aria-label');
    });

    it('should announce dynamic content changes', () => {
      cy.login();
      cy.visit('/search');
      
      cy.get('[data-testid="search-input"]').type('test');
      cy.get('[data-testid="search-button"]').click();
      
      // Should announce search results
      cy.get('[data-testid="search-results"]').should('have.attr', 'aria-live', 'polite');
    });
  });

  describe('Performance', () => {
    it('should load pages quickly', () => {
      cy.login();
      
      cy.visit('/dashboard');
      cy.testPerformance();
      
      cy.visit('/events');
      cy.testPerformance();
      
      cy.visit('/search');
      cy.testPerformance();
    });

    it('should handle rapid interactions', () => {
      cy.login();
      
      // Rapidly click navigation links
      cy.get('[data-testid="dashboard-link"]').click();
      cy.get('[data-testid="events-link"]').click();
      cy.get('[data-testid="search-link"]').click();
      cy.get('[data-testid="profile-link"]').click();
      
      // Should not crash or show errors
      cy.get('[data-testid="error-message"]').should('not.exist');
    });

    it('should not have memory leaks', () => {
      cy.login();
      
      // Navigate between pages multiple times
      for (let i = 0; i < 5; i++) {
        cy.visit('/dashboard');
        cy.visit('/events');
        cy.visit('/search');
        cy.visit('/profile');
      }
      
      cy.testMemoryLeaks();
    });
  });
});
