// Page Object - Inventory (product listing page after login)

class InventoryPage {
  get inventoryList()   { return '.inventory_list'; }
  get cartBadge()       { return '.shopping_cart_badge'; }
  get cartLink()        { return '.shopping_cart_link'; }
  get sortDropdown()    { return '[data-test="product-sort-container"]'; }

  // itemId matches the product's data-test suffix, e.g. "sauce-labs-backpack"
  addToCart(itemId) {
    cy.get(`[data-test="add-to-cart-${itemId}"]`).click();
  }

  removeFromCart(itemId) {
    cy.get(`[data-test="remove-${itemId}"]`).click();
  }

  goToCart() {
    cy.get(this.cartLink).click();
  }

  // value: "az", "za", "lohi", "hilo"
  sortBy(value) {
    cy.get(this.sortDropdown).select(value);
  }

  verifyOnInventoryPage() {
    cy.url().should('include', '/inventory.html');
    cy.get(this.inventoryList).should('be.visible');
  }

  verifyCartCount(count) {
    if (count === 0) {
      cy.get(this.cartBadge).should('not.exist');
    } else {
      cy.get(this.cartBadge).should('have.text', String(count));
    }
  }
}

export default new InventoryPage();
