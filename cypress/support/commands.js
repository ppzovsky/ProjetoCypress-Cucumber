Cypress.Commands.add('abreSite', (url) => {
    cy.visit(url);
  });

Cypress.Commands.add('preencheDadosPessoais', (firstName, lastName, email) => {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cy.get('#first-name').type(firstName);
    cy.get('#last-name').type(lastName);
    cy.get('#email').type(email);
    cy.get('fieldset > p').should('contain', firstName).and('contain', lastName);
    cy.screenshot('dadospessoais'+timestamp+'.png');
});

Cypress.Commands.add('escolheOpcaoDeTicket', (ticketQuantity, ticketType, discoveryMethod) => {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cy.get('#ticket-quantity').select(ticketQuantity);
    cy.get(ticketType).check();
    cy.get(discoveryMethod).check();
    cy.screenshot('opcaodeTicket'+timestamp+'.png');
})

Cypress.Commands.add('confirmaTickets', () => {
    let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cy.get('#agree').check();
    cy.get('[type="submit"]').click();
    cy.get('.success').should('contain', 'Ticket(s) successfully ordered.');
    cy.screenshot('confirmatickets'+timestamp+'.png');
})

Cypress.Commands.add('cancelaTickets', (firstName, lastName) => {
  let timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  cy.get('#agree').check();
  cy.screenshot('resetarinfos'+timestamp+'.png');
  cy.get('.reset').click();
  cy.get('#first-name').should('have.value', '');
  cy.get('#last-name').should('have.value', '');
  cy.get('#email').should('have.value', '');
  cy.get('#ticket-quantity').should('have.value', '1');
  cy.get('fieldset > p').should('not.contain', firstName).and('not.contain', lastName);
  cy.screenshot('limpoupagina'+timestamp+'.png');
})