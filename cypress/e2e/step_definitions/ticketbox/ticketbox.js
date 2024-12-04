import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';
import massa from '../../../fixtures/example.json'

Given("que preencho meus dados pessoais", function () {
  cy.visit(massa.url);
  cy.preencheDadosPessoais(massa.firstName, massa.lastName, massa.email);
});

And('que escolho a quantidade, a opcao e como eu conheci o evento', () => {
  cy.escolheOpcaoDeTicket('1','#general', '#friend');
});

When('confirmo meus tickets', () => {
  cy.confirmaTickets();
});

Then('a compra é realizada com sucesso', () => {
  cy.visit(massa.url);
});
