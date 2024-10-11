describe('Navigation', () => {
    it('should navigate to About page', () => {
      cy.visit('http://localhost:3000/login');
      cy.get('[data-testid="signup-link"]').click();
      cy.url().should('include', '/signup');
      cy.contains('Sign up'); 
    });
  });
  