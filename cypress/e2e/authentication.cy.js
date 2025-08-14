describe('Authentication Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('User Registration', () => {
    it('should successfully register a new user', () => {
      cy.mockApi('POST', '**/signup', {
        message: 'Registration successful',
        data: {
          token: 'mock-jwt-token',
          user: {
            email: 'newuser@example.com',
            name: 'New User',
            userId: 'USER_456'
          }
        }
      });

      cy.visit('/signup');
      
      // Fill out registration form
      cy.get('[data-testid="name-input"]').type('New User');
      cy.get('[data-testid="email-input"]').type('newuser@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      
      // Submit form
      cy.get('[data-testid="signup-button"]').click();
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-name"]').should('contain', 'New User');
    });

    it('should show validation errors for invalid registration data', () => {
      cy.visit('/signup');
      
      // Try to submit empty form
      cy.get('[data-testid="signup-button"]').click();
      
      // Should show validation errors
      cy.get('[data-testid="error-message"]').should('contain', 'Name is required');
      cy.get('[data-testid="error-message"]').should('contain', 'Email is required');
      cy.get('[data-testid="error-message"]').should('contain', 'Password is required');
    });

    it('should show error for password mismatch', () => {
      cy.visit('/signup');
      
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('differentpassword');
      
      cy.get('[data-testid="signup-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Passwords do not match');
    });

    it('should show error for weak password', () => {
      cy.visit('/signup');
      
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="confirm-password-input"]').type('123');
      
      cy.get('[data-testid="signup-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Password must be at least 8 characters');
    });

    it('should show error for invalid email format', () => {
      cy.visit('/signup');
      
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      
      cy.get('[data-testid="signup-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Please enter a valid email');
    });

    it('should handle server error during registration', () => {
      cy.mockApi('POST', '**/signup', {
        message: 'Email already exists',
        code: '409'
      }, 409);

      cy.visit('/signup');
      
      cy.get('[data-testid="name-input"]').type('Test User');
      cy.get('[data-testid="email-input"]').type('existing@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="confirm-password-input"]').type('password123');
      
      cy.get('[data-testid="signup-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Email already exists');
    });
  });

  describe('User Login', () => {
    it('should successfully log in existing user', () => {
      cy.mockApi('POST', '**/signin', {
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token',
          user: {
            email: 'test@example.com',
            name: 'Test User',
            userId: 'USER_123'
          }
        }
      });

      cy.visit('/signin');
      
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signin-button"]').click();
      
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-name"]').should('contain', 'Test User');
    });

    it('should show error for invalid credentials', () => {
      cy.mockApi('POST', '**/signin', {
        message: 'Invalid credentials',
        code: '401'
      }, 401);

      cy.visit('/signin');
      
      cy.get('[data-testid="email-input"]').type('wrong@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="signin-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/signin');
      
      cy.get('[data-testid="signin-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Email is required');
      cy.get('[data-testid="error-message"]').should('contain', 'Password is required');
    });

    it('should handle network errors during login', () => {
      cy.intercept('POST', '**/signin', { forceNetworkError: true });

      cy.visit('/signin');
      
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signin-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Network error');
    });

    it('should remember user session after page reload', () => {
      cy.mockApi('POST', '**/signin', {
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token',
          user: {
            email: 'test@example.com',
            name: 'Test User',
            userId: 'USER_123'
          }
        }
      });

      cy.visit('/signin');
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="signin-button"]').click();
      
      cy.url().should('include', '/dashboard');
      
      // Reload page
      cy.reload();
      
      // Should still be logged in
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-name"]').should('contain', 'Test User');
    });
  });

  describe('User Logout', () => {
    it('should successfully log out user', () => {
      // First login
      cy.login();
      
      // Click logout button
      cy.get('[data-testid="profile-menu"]').click();
      cy.get('[data-testid="signout-button"]').click();
      
      // Should redirect to landing page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Should not show user-specific content
      cy.get('[data-testid="user-name"]').should('not.exist');
    });

    it('should clear user session after logout', () => {
      cy.login();
      
      cy.get('[data-testid="profile-menu"]').click();
      cy.get('[data-testid="signout-button"]').click();
      
      // Try to access protected route
      cy.visit('/dashboard');
      
      // Should redirect to login
      cy.url().should('include', '/signin');
    });
  });

  describe('Password Reset', () => {
    it('should successfully request password reset', () => {
      cy.mockApi('POST', '**/forgot-password', {
        message: 'Password reset email sent',
        code: '200'
      });

      cy.visit('/forgot-password');
      
      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="success-message"]').should('contain', 'Password reset email sent');
    });

    it('should show error for non-existent email', () => {
      cy.mockApi('POST', '**/forgot-password', {
        message: 'Email not found',
        code: '404'
      }, 404);

      cy.visit('/forgot-password');
      
      cy.get('[data-testid="email-input"]').type('nonexistent@example.com');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Email not found');
    });

    it('should successfully reset password with valid token', () => {
      cy.mockApi('POST', '**/reset-password', {
        message: 'Password reset successful',
        code: '200'
      });

      cy.visit('/reset-password?token=valid-token');
      
      cy.get('[data-testid="password-input"]').type('newpassword123');
      cy.get('[data-testid="confirm-password-input"]').type('newpassword123');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="success-message"]').should('contain', 'Password reset successful');
    });

    it('should show error for invalid reset token', () => {
      cy.mockApi('POST', '**/reset-password', {
        message: 'Invalid or expired token',
        code: '400'
      }, 400);

      cy.visit('/reset-password?token=invalid-token');
      
      cy.get('[data-testid="password-input"]').type('newpassword123');
      cy.get('[data-testid="confirm-password-input"]').type('newpassword123');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid or expired token');
    });
  });

  describe('Admin Authentication', () => {
    it('should successfully log in admin user', () => {
      cy.mockApi('POST', '**/admin/signin', {
        message: 'Admin login successful',
        data: {
          token: 'mock-admin-jwt-token',
          admin: {
            email: 'admin@ijaa.com',
            name: 'Admin User',
            adminId: 1,
            role: 'ADMIN'
          }
        }
      });

      cy.visit('/admin/login');
      
      cy.get('[data-testid="admin-email-input"]').type('admin@ijaa.com');
      cy.get('[data-testid="admin-password-input"]').type('admin123');
      cy.get('[data-testid="admin-signin-button"]').click();
      
      cy.url().should('include', '/admin/dashboard');
      cy.get('[data-testid="admin-name"]').should('contain', 'Admin User');
    });

    it('should show error for invalid admin credentials', () => {
      cy.mockApi('POST', '**/admin/signin', {
        message: 'Invalid admin credentials',
        code: '401'
      }, 401);

      cy.visit('/admin/login');
      
      cy.get('[data-testid="admin-email-input"]').type('wrong@example.com');
      cy.get('[data-testid="admin-password-input"]').type('wrongpassword');
      cy.get('[data-testid="admin-signin-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('contain', 'Invalid admin credentials');
    });

    it('should redirect admin to dashboard if already logged in', () => {
      cy.adminLogin();
      
      cy.visit('/admin/login');
      
      cy.url().should('include', '/admin/dashboard');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible for screen readers', () => {
      cy.visit('/signin');
      
      cy.checkA11y();
      
      // Test keyboard navigation
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-testid', 'email-input');
      
      cy.tab();
      cy.focused().should('have.attr', 'data-testid', 'password-input');
      
      cy.tab();
      cy.focused().should('have.attr', 'data-testid', 'signin-button');
    });

    it('should have proper form labels', () => {
      cy.visit('/signup');
      
      cy.get('[data-testid="name-input"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="email-input"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="password-input"]').should('have.attr', 'aria-label');
    });

    it('should show error messages to screen readers', () => {
      cy.visit('/signin');
      
      cy.get('[data-testid="signin-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('have.attr', 'role', 'alert');
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile devices', () => {
      cy.viewport(375, 667);
      cy.visit('/signin');
      
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="signin-button"]').should('be.visible');
    });

    it('should work on tablet devices', () => {
      cy.viewport(768, 1024);
      cy.visit('/signin');
      
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="signin-button"]').should('be.visible');
    });

    it('should work on desktop devices', () => {
      cy.viewport(1280, 720);
      cy.visit('/signin');
      
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="signin-button"]').should('be.visible');
    });
  });

  describe('Performance', () => {
    it('should load authentication pages quickly', () => {
      cy.visit('/signin');
      cy.testPerformance();
    });

    it('should handle rapid form submissions', () => {
      cy.visit('/signin');
      
      // Rapidly click submit button
      cy.get('[data-testid="signin-button"]').click();
      cy.get('[data-testid="signin-button"]').click();
      cy.get('[data-testid="signin-button"]').click();
      
      // Should not crash or show multiple error messages
      cy.get('[data-testid="error-message"]').should('have.length.at.most', 1);
    });
  });
});
