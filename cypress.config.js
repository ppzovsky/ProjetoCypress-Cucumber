const cucumber = require('cypress-cucumber-preprocessor').default;
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
    video: false,
    videosFolder: "cypress/evidences/videos",
    
    screenshotsFolder: "cypress/evidences/screenshots",
    specPattern: [
      'cypress/e2e/**/*.feature',
      'cypress/e2e/**/*.cy.js'
    ],
    "reporter": "mocha-junit-reporter",
    "reporterOptions": {
      "mochaFile": "results/junit-[hash].xml",
      "toConsole": true,
      "testCaseSwitchClassnameAndName": true
    }
  },
});
