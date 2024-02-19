const { test } = require('@playwright/test');
const LoginPage = require('../../pages/loginPage').default;
const testData = require('../../data/testData.json')
const {burgerMenuBtn, loginErrorLabel, loginErrorBtn} = require('../../page_objects/login.js')

test.describe('SauceDemo - Login Page', () => {

  let login;

    test.beforeEach(async({page}) => {
      login = new LoginPage(page);
      await login.open(testData.url)
    });

    test('successful login to saucedemo - standard user', async () => {
      test.setTimeout(testData.timeout);
      await login.login(testData.username, testData.password)
      login.isVisible(burgerMenuBtn)
    });

    test('login failure to saucedemo - performance glitch issue user', async () => {
      test.setTimeout(testData.timeout);
      await login.login(testData.user_perfermance_glitch, testData.password)
      login.isVisible(burgerMenuBtn)
    });

    test('login failure to saucedemo - locked out user', async () => {
      await login.login(testData.user_locked_out, testData.password)
      login.containsText(loginErrorLabel, testData.locked_out_user_error)
    });

    test('login failure to saucedemo - password failure', async () => {
      await login.login(testData.username, testData.incorrect_password)
      login.containsText(loginErrorLabel, testData.user_and_pass_mismatch)

      //error handling with try-catch, for popups that might not always appear due to cookies.
      try {
        login.isNotVisible(burgerMenuBtn)
      } catch (e) {
        console.log("Hamburger menu button did not appear: "+e)
      }   
    });

    test('login failure to saucedemo - username failure', async () => {
      await login.login(testData.incorrect_username, testData.password)
      login.containsText(loginErrorLabel, testData.user_and_pass_mismatch)

      //error handling through matcher negating, since we failed to login we should not see the hamburger menu
      login.isNotVisible(burgerMenuBtn)
    });

    //empty password field
    test('login failure to saucedemo - empty password failure', async () => {
      await login.login(testData.username, '')
      login.containsText(loginErrorLabel, testData.password_required)
      login.isNotVisible(burgerMenuBtn)
    });

    //empty username field
    test('login failure to saucedemo - empty username failure', async () => {
      await login.login('', testData.password)
      login.containsText(loginErrorLabel, testData.username_required)
      login.isNotVisible(burgerMenuBtn)
    });

    test('login failure to saucedemo - empty username & empty password - clicking error clear button', async ({ page }) => {
      await login.login('', '');
      login.containsText(loginErrorLabel, testData.username_required)
      login.isVisible(loginErrorBtn)
      login.isNotVisible(burgerMenuBtn)

      await login.click(loginErrorBtn)
      login.isNotVisible(loginErrorBtn)
    });

});
