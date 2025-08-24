// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for waiting for network requests
Cypress.Commands.add('waitForNetworkIdle', (timeout = 5000) => {
  cy.wait(timeout);
});

// Custom command for testing keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', () => {
  cy.get('body').tab();
  cy.focused().should('exist');
});

// Custom command for testing screen reader compatibility
Cypress.Commands.add('testScreenReader', () => {
  cy.get('[role="button"], [role="link"], [role="menuitem"]').each(($el) => {
    cy.wrap($el).should('have.attr', 'aria-label').or('have.text');
  });
});

// Custom command for testing color contrast
Cypress.Commands.add('testColorContrast', () => {
  cy.get('body').then(($body) => {
    const computedStyle = window.getComputedStyle($body[0]);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    // Basic contrast check (simplified)
    expect(backgroundColor).to.not.equal(color);
  });
});

// Custom command for testing form accessibility
Cypress.Commands.add('testFormAccessibility', () => {
  cy.get('input, select, textarea').each(($input) => {
    const id = $input.attr('id');
    if (id) {
      cy.get(`label[for="${id}"]`).should('exist');
    }
  });
});

// Custom command for testing modal accessibility
Cypress.Commands.add('testModalAccessibility', () => {
  cy.get('[role="dialog"]').should('have.attr', 'aria-labelledby');
  cy.get('[role="dialog"]').should('have.attr', 'aria-describedby');
});

// Custom command for testing loading states
Cypress.Commands.add('testLoadingState', () => {
  cy.get('[data-testid="loading-spinner"]').should('be.visible');
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
});

// Custom command for testing error states
Cypress.Commands.add('testErrorState', (errorMessage) => {
  cy.get('[data-testid="error-message"]').should('contain', errorMessage);
});

// Custom command for testing success states
Cypress.Commands.add('testSuccessState', (successMessage) => {
  cy.get('[data-testid="success-message"]').should('contain', successMessage);
});

// Custom command for testing toast notifications
Cypress.Commands.add('testToastNotification', (message) => {
  cy.get('.Toastify__toast').should('contain', message);
});

// Custom command for testing responsive breakpoints
Cypress.Commands.add('testResponsiveBreakpoints', () => {
  const breakpoints = [
    { width: 320, height: 568, name: 'mobile' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 1280, height: 720, name: 'desktop' },
    { width: 1920, height: 1080, name: 'large-desktop' }
  ];
  
  breakpoints.forEach(breakpoint => {
    cy.viewport(breakpoint.width, breakpoint.height);
    cy.get('body').should('be.visible');
  });
});

// Custom command for testing performance
Cypress.Commands.add('testPerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0];
    
    expect(navigation.loadEventEnd - navigation.loadEventStart).to.be.lessThan(3000);
  });
});

// Custom command for testing memory leaks
Cypress.Commands.add('testMemoryLeaks', () => {
  cy.window().then((win) => {
    const initialMemory = win.performance.memory?.usedJSHeapSize || 0;
    
    // Perform some actions
    cy.get('button').click({ multiple: true });
    
    cy.window().then((win2) => {
      const finalMemory = win2.performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).to.be.lessThan(10 * 1024 * 1024);
    });
  });
});
