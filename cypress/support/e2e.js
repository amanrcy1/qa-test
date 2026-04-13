import './commands'; // load custom commands before every test

// prevent tests from failing due to app's own JS errors
Cypress.on('uncaught:exception', () => {
  return false;
});
