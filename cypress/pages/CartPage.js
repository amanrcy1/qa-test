// Page Object - Cart (view items before checkout)

class CartPage {
  get cartItems()       { return '.cart_item'; }
  get itemName()        { return '.inventory_item_name'; }
  get checkoutButton()  { return '[data-test="checkout"]'; }
  get continueButton()  { return '[data-test="continue-shopping"]'; }

  checkout() {
    cy.get(this.checkoutButton).click();
  }

  continueShopping() {
    cy.get(this.continueButton).click();
  }

  verifyOnCartPage() {
    cy.url().should('include', '/cart.html');
  }

  verifyItemCount(count) {
    cy.get(this.cartItems).should('have.length', count);
  }

  verifyItemInCart(name) {
    cy.get(this.itemName).should('contain', name);
  }
}

export default new CartPage();
