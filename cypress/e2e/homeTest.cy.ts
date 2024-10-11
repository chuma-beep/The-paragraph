describe('Home Page', () => {
  it('should load successfully', () => {
    cy.visit('http://localhost:3000');


// Wait for a specific element to appear
   cy.get('[data-testid="Home"]', { timeout: 10000 }).should('be.visible');

  });
});
