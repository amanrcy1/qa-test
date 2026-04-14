import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

describe('Shopping Cart', () => {

  let users, checkout; // loaded from fixtures

  before(() => {
    cy.fixture('users').then((data) => { users = data; });
    cy.fixture('checkout').then((data) => { checkout = data; });
  });

  // login before each test so we start on inventory page
  beforeEach(() => {
    // Set auth cookie directly to skip slow UI login
    cy.setCookie('session-username', users.validUser.username);
    cy.visit('/inventory.html', {
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true,
    });
    InventoryPage.verifyOnInventoryPage();
  });

  it('should add an item to cart', () => {
    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.verifyCartCount(1);
  });

  it('should add multiple items to cart', () => {
    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.addToCart('sauce-labs-bike-light');
    InventoryPage.verifyCartCount(2);
  });

  it('should remove an item from cart', () => {
    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.removeFromCart('sauce-labs-backpack');
    InventoryPage.verifyCartCount(0); // badge disappears
  });

  it('should show items in cart page', () => {
    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.goToCart();

    CartPage.verifyOnCartPage();
    CartPage.verifyItemCount(1);
    CartPage.verifyItemInCart('Sauce Labs Backpack');
  });

  // full flow: add → cart → checkout info → overview → finish
  it('should complete full checkout flow', () => {
    InventoryPage.addToCart('sauce-labs-backpack');
    InventoryPage.goToCart();
    CartPage.checkout();

    const info = checkout.validCheckout;
    CheckoutPage.fillInfo(info.firstName, info.lastName, info.postalCode);
    CheckoutPage.finish();
    CheckoutPage.verifyOrderComplete();
  });
});
