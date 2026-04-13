// reusable login — call as cy.login() in any test
Cypress.Commands.add('login', (username = 'standard_user', password = 'secret_sauce') => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
});

// add product to cart by its test-id
Cypress.Commands.add('addToCart', (itemTestId) => {
  cy.get(`[data-test="add-to-cart-${itemTestId}"]`).click();
});

// check cart badge shows correct count (0 = badge hidden)
Cypress.Commands.add('verifyCartCount', (count) => {
  if (count === 0) {
    cy.get('.shopping_cart_badge').should('not.exist');
  } else {
    cy.get('.shopping_cart_badge').should('have.text', String(count));
  }
});
