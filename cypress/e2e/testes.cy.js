import massa from '../fixtures/massa.json'
import '../support/commands' 

describe('Testes Compra de Tickets', () => {
  beforeEach(() => {
    cy.abreSite(massa.url);
  });
  it('Compra de 1 ticket do tipo General Admission usando a opção Friend', () => {
    cy.preencheDadosPessoais(massa.firstName, massa.lastName, massa.email);
    cy.escolheOpcaoDeTicket('1','#general', '#friend');
    cy.confirmaTickets();
    cy.visit(massa.url);
  })
  it('Compra de 2 ticket do tipo VIP usando a opção Publication', () => {
    cy.preencheDadosPessoais(massa.firstName, massa.lastName, massa.email);
    cy.escolheOpcaoDeTicket('2','#vip', '#publication');
    cy.confirmaTickets();
  })
  it('Compra de 3 ticket do tipo VIP usando a opção Social Media', () => {
    cy.preencheDadosPessoais(massa.firstName, massa.lastName, massa.email);
    cy.escolheOpcaoDeTicket('3','#vip', '#social-media');
    cy.confirmaTickets();
  })
  it('Compra de 4 ticket do tipo General Admission usando a opção Publication', () => {
    cy.preencheDadosPessoais(massa.firstName, massa.lastName, massa.email);
    cy.escolheOpcaoDeTicket('4','#general', '#publication');
    cy.confirmaTickets();
  })
  it('Validar Funcionamento do Botao Reset', () => {
    cy.preencheDadosPessoais(massa.firstName, massa.lastName, massa.email);
    cy.escolheOpcaoDeTicket('4','#general', '#publication');
    cy.cancelaTickets(massa.firstName, massa.lastName);
  })
})