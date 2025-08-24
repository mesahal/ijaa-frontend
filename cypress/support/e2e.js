// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // for uncaught exceptions
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Accessibility testing
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});

// Custom command for login
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.visit('/signin');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="signin-button"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command for admin login
Cypress.Commands.add('adminLogin', (email = 'admin@ijaa.com', password = 'admin123') => {
  cy.visit('/admin/login');
  cy.get('[data-testid="admin-email-input"]').type(email);
  cy.get('[data-testid="admin-password-input"]').type(password);
  cy.get('[data-testid="admin-signin-button"]').click();
  cy.url().should('include', '/admin/dashboard');
});

// Custom command for responsive testing
Cypress.Commands.add('testResponsive', (viewport, callback) => {
  cy.viewport(viewport.width, viewport.height);
  callback();
});

// Custom command for API mocking
Cypress.Commands.add('mockApi', (method, url, response, statusCode = 200) => {
  cy.intercept(method, url, {
    statusCode,
    body: response,
  }).as(`${method.toLowerCase()}-${url.replace(/[^a-zA-Z0-9]/g, '')}`);
});

// Custom command for localStorage
Cypress.Commands.add('setLocalStorage', (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
});

// Custom command for sessionStorage
Cypress.Commands.add('setSessionStorage', (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
});

// Custom command for theme testing
Cypress.Commands.add('toggleTheme', () => {
  cy.get('[data-testid="theme-toggle"]').click();
});

// Custom command for waiting for loading states
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid="loading-spinner"]', { timeout: 10000 }).should('not.exist');
});

// Custom command for form validation testing
Cypress.Commands.add('testFormValidation', (formData, expectedErrors) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.get(`[data-testid="${field}-input"]`).clear().type(value);
  });
  
  cy.get('[data-testid="submit-button"]').click();
  
  expectedErrors.forEach(error => {
    cy.get('[data-testid="error-message"]').should('contain', error);
  });
});
