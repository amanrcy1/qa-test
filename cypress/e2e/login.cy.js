import LoginPage from '../pages/LoginPage';
import InventoryPage from '../pages/InventoryPage';

describe('Login Page', () => {

  let users; // loaded from fixtures/users.json

  before(() => {
    cy.fixture('users').then((data) => { users = data; });
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  it('should display the login form', () => {
    LoginPage.verifyLoginFormVisible();
  });

  it('should login with valid credentials', () => {
    LoginPage.login(users.validUser.username, users.validUser.password);
    InventoryPage.verifyOnInventoryPage(); // redirects to products page
  });

  it('should show error for invalid credentials', () => {
    LoginPage.login(users.invalidUser.username, users.invalidUser.password);
    LoginPage.verifyError('Username and password do not match');
  });

  it('should show error for locked out user', () => {
    LoginPage.login(users.lockedUser.username, users.lockedUser.password);
    LoginPage.verifyError('locked out');
  });

  it('should show error when username is empty', () => {
    cy.get(LoginPage.loginButton).click(); // submit without typing
    LoginPage.verifyError('Username is required');
  });
});
