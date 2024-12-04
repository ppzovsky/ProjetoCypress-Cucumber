# Automação de Testes com Cucumber e Cypress

Este projeto implementa uma solução de automação de testes utilizando o Cypress e o Cucumber para estudo e aprendizado. O objetivo é proporcionar uma maneira fácil de escrever e executar testes de aceitação de forma legível e compreensível, integrando a abordagem BDD (Behavior Driven Development) com o Cypress. Os testes foram realizados em uma plataforma opensource que simula o envio de um formulário simples.

## Tecnologias Utilizadas

- **Cypress**: Framework de testes de ponta a ponta para a web.
- **Cucumber**: Framework BDD para descrever testes em uma linguagem natural, facilitando a comunicação entre equipes técnicas e não técnicas.
- **JavaScript**: Linguagem de programação utilizada para a automação.
- **Node.js**: Gerenciador de pacotes do JavaScript/TypeScript.

## Requisitos

Antes de começar, você precisa ter o Node.js instalado. Você pode verificar se tem o Node.js instalado executando o seguinte comando no terminal:

```bash
node -v
```

Caso não tenha o Node.js instalado, siga as instruções de instalação no [site oficial do Node.js](https://nodejs.org/).

## Instalação

Siga os passos abaixo para configurar o projeto no seu ambiente local:

1. Clone o repositório:

   ```bash
   git clone https://github.com/ppzovsky/ProjetoCypress-Cucumber.git
   ```

2. Navegue até a pasta do projeto:

   ```bash
   cd ProjetoCypress-Cucumber
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

- **`cypress/e2e/step_definitions/`**: Contém os arquivos que definem as etapas (steps) para os testes Cucumber.
- **`cypress/e2e/features/`**: Contém os arquivos `.feature`, onde os cenários de teste são escritos em Gherkin.
- **`cypress.config.js`**: Arquivo de configuração do Cypress.
- **`package.json`**: Contém as dependências e scripts do projeto.

## Como Executar os Testes

1. Para rodar os testes, basta executar o comando abaixo:

   ```bash
   npx cypress open
   ```

   Isso abrirá a interface gráfica do Cypress, onde você poderá selecionar os testes para rodar.

2. Você pode visualizar tanto os testes `.feature` do Cucumber quanto os arquivos `.cy.js` na interface.

3. Para rodar os testes no modo headless (sem a interface gráfica), execute:

   ```bash
   npx cypress run
   ```

## Contribuindo

Se você quiser contribuir com este projeto, fique à vontade para abrir um *pull request* ou uma *issue*. 

## Autor

João Pedro Soares de Brito
