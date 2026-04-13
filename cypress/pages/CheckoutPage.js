// Page Object - Checkout (fill info → review → finish)

class CheckoutPage {
  get firstNameInput()  { return '[data-test="firstName"]'; }
  get lastNameInput()   { return '[data-test="lastName"]'; }
  get postalCodeInput() { return '[data-test="postalCode"]'; }
  get continueButton()  { return '[data-test="continue"]'; }
  get finishButton()    { return '[data-test="finish"]'; }
  get completeHeader()  { return '.complete-header'; }
  get errorMessage()    { return '[data-test="error"]'; }

  // fills shipping info and clicks continue to overview
  fillInfo(firstName, lastName, postalCode) {
    if (firstName) cy.get(this.firstNameInput).type(firstName);
    if (lastName) cy.get(this.lastNameInput).type(lastName);
    if (postalCode) cy.get(this.postalCodeInput).type(postalCode);
    cy.get(this.continueButton).click();
  }

  finish() {
    cy.get(this.finishButton).click();
  }

  verifyOrderComplete() {
    cy.get(this.completeHeader).should('contain', 'Thank you for your order');
  }

  verifyError(message) {
    cy.get(this.errorMessage).should('be.visible').and('contain', message);
  }
}

export default new CheckoutPage();
