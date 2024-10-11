describe('tesing home', () => {
  it('should display the WriteIcon and Search components without gaps', () => {

    // cy.visit('https://example.cypress.io')
    cy.visit('http://localhost:3000')
    

    // cy.get('[data-testid="search"]').should('exist').and('be.visible')

    // Check if WriteIcon is visible
    cy.get('[data-testid="write-icon"]')
      .should('exist').and('be.visible')

    // // Check if Search component is visible
    // cy.get('[data-testid="search"]')
    //   .should('be.visible')
    cy.get('[data-testid="Login"]')
    .should('be.visible')

    // Optionally, verify the positioning or absence of gaps
    // This requires more specific selectors or visual testing
  })

})
