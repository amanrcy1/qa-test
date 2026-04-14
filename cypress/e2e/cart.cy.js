import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

describe('Shopping Cart', () => {

  let users, checkout;

  before(() => {
    cy.fixture('users').then((data) => { users = data; });
    cy.fixture('checkout').then((data) => { checkout = data; });
  });

  // Single login + test flow to minimize page loads in CI
  it('should add, remove items and verify cart', () => {
    LoginPage.visit();
    LoginPage.login(users.validUser.username, users.validUser.password);
    InventoryPage.verifyOnInventoryPage();

    // Add single item
    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.verifyCartCount(1);

    // Add second item
    InventoryPage.addToCart('sauce-labs-bike-light');
    InventoryPage.verifyCartCount(2);

    // Remove first item
    InventoryPage.removeFromCart('sauce-labs-backpack');
    InventoryPage.verifyCartCount(1);

    // Verify cart page
    InventoryPage.goToCart();
    CartPage.verifyOnCartPage();
    CartPage.verifyItemCount(1);
    CartPage.verifyItemInCart('Sauce Labs Bike Light');
  });

  it('should complete full checkout flow', () => {
    LoginPage.visit();
    LoginPage.login(users.validUser.username, users.validUser.password);
    InventoryPage.verifyOnInventoryPage();

    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.goToCart();
    CartPage.checkout();

    const info = checkout.validCheckout;
    CheckoutPage.fillInfo(info.firstName, info.lastName, info.postalCode);
    CheckoutPage.finish();
    CheckoutPage.verifyOrderComplete();
  });
});
