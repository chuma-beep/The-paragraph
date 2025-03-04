// describe('Authentication Error Flow', () => {
//   it('should display an error message for invalid login', () => {
//       // Visit the login page
//       cy.visit('http://localhost:3000/login');

//       // Enter invalid credentials
//       cy.get('[data-testid="email-input"]').type('wronguser');
//       cy.get('[data-testid="password-input"]').type('wrongpassword');

//       // Submit the form
//       cy.get('[data-testid="login-button"]').click();

//       // // Assert that the error message appears
//       // cy.get('[data-testid="error-message"]').should('contain', 'Could not authenticate user');

//       // Assert that the user is still on the login page and not redirected
//       cy.url().should('include', '/login');
//       cy.url().should('not.include', '/protected');
//   });
// });
describe('Authentication Error Flow', () => {
  it('should display an error message for invalid login', () => {
    cy.visit('/login');
    cy.get('input[name="username"]').type('invalidUser');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('be.visible').and('contain', 'Invalid username or password');
  });
});