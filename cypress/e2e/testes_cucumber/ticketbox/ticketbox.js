import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import massa from '../../../fixtures/massa.json'

Given("que preencho meus dados pessoais com {string}, {string} e {string}", function (nome, sobrenome, email) {
  cy.visit(massa.url);
  cy.preencheDadosPessoais(nome, sobrenome, email);
});

And('que escolho a quantidade {string}, a opcao {string} e como eu conheci o evento {string}', function (ticketQuantity, ticketType, howKnowEvent) {
  cy.escolheOpcaoDeTicket(ticketQuantity, ticketType, howKnowEvent);
});

When('confirmo meus tickets', () => {
  cy.confirmaTickets();
});

When('cancelo meus tickets', () => {
  cy.get('#agree').check();
  cy.get('.reset').click();
});

Then('a compra é realizada com sucesso', () => {
  cy.get('.success').should('contain', 'Ticket(s) successfully ordered.');
});

Then('a tela inicial reseta todos os campos', () => {
  cy.get('#first-name').should('have.value', '');
  cy.get('#last-name').should('have.value', '');
  cy.get('#email').should('have.value', '');
  cy.get('#ticket-quantity').should('have.value', '1');
  cy.get('fieldset > p').should('not.contain', "Teste").and('not.contain', "da Silva");
  })
