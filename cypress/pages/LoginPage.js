// Page Object - Login (selectors + actions in one place)

class LoginPage {
  // selectors — if UI changes, update only here
  get usernameInput() { return '[data-test="username"]'; }
  get passwordInput() { return '[data-test="password"]'; }
  get loginButton()   { return '[data-test="login-button"]'; }
  get errorMessage()  { return '[data-test="error"]'; }

  visit() {
    cy.visit('/');
  }

  login(username, password) {
    cy.get(this.usernameInput).clear().type(username);
    cy.get(this.passwordInput).clear().type(password);
    cy.get(this.loginButton).click();
  }

  verifyError(message) {
    cy.get(this.errorMessage).should('be.visible').and('contain', message);
  }

  verifyLoginFormVisible() {
    cy.get(this.usernameInput).should('be.visible');
    cy.get(this.passwordInput).should('be.visible');
    cy.get(this.loginButton).should('be.visible');
  }
}

export default new LoginPage();
