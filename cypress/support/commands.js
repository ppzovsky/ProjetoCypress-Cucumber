Cypress.Commands.add('abreSite', (url) => {
    cy.visit(url);
  });

Cypress.Commands.add('preencheDadosPessoais', (firstName, lastName, email) => {
    cy.get('#first-name').type(firstName);
    cy.get('#last-name').type(lastName);
    cy.get('#email').type(email);
    cy.get('fieldset > p').should('contain', firstName).and('contain', lastName);
});

Cypress.Commands.add('escolheOpcaoDeTicket', (ticketQuantity, ticketType, discoveryMethod) => {
    cy.get('#ticket-quantity').select(ticketQuantity);
    cy.get(ticketType).check();
    cy.get(discoveryMethod).check();
})

Cypress.Commands.add('confirmaTickets', () => {
    cy.get('#agree').check();
    cy.get('[type="submit"]').click();
    cy.get('.success').should('contain', 'Ticket(s) successfully ordered.');
})

Cypress.Commands.add('cancelaTickets', (firstName, lastName) => {
  cy.get('#agree').check();
  cy.get('.reset').click();
  cy.get('#first-name').should('have.value', '');
  cy.get('#last-name').should('have.value', '');
  cy.get('#email').should('have.value', '');
  cy.get('#ticket-quantity').should('have.value', '1');
  cy.get('fieldset > p').should('not.contain', firstName).and('not.contain', lastName);
})