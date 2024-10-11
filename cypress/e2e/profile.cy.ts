describe('Profile Page', () => {
const userId = '1f0ec52c-947d-4598-871b-6ec6c90d26a1'

    beforeEach(() => {
      // You may want to set up a mock user session here if needed
    //   cy.visit('http://localhost:3000/profile');
    cy.visit(`http://localhost:3000/profile/${userId}`);
    });
  
    it('should load successfully and display the user name', () => {
    //  cy.wait('@getUserProfile')
    cy.get('[data-testid="user-name"]').should('exist'); // Adjust this selector based on your HTML
    });
  });
  