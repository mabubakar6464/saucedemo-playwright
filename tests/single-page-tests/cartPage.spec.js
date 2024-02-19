import { test, expect } from '@playwright/test';
import LoginPage from '../../pages/loginPage';
import HomePage from '../../pages/homePage';
import CartPage from '../../pages/cartPage';
import { timeout, url, username, password, bike_light_price, fleece_price, order_thanks } from '../../data/testData.json';
import { burgerMenuBtn } from '../../page_objects/login.js';
import { continueShoppingButton, inventoryItem, inventoryItemPrice, productSortContainer, checkoutButton, checkoutTitle, checkoutError, subtotalLabel, taxLabel, totalLabel, finishButton, completeHeader, backToProductsButton } from '../../page_objects/cart.js';
import { shoppingCartBadge, productSortContainer as _productSortContainer } from '../../page_objects/home.js';

test.describe('SauceDemo - Login Page', () => {

  let login, home, cart;

  test.beforeEach('fresh page and login before each test', async({page}) => {
    test.setTimeout(timeout);
    login = new LoginPage(page);
    home = new HomePage(page);
    cart = new CartPage(page);
    await login.open(url)
    await login.login(username, password)
    login.isVisible(burgerMenuBtn)
});

    test('cart page validations', async ({ page }) => {

      await test.step('add products to cart', async () => {
        await home.addToCart("sauce-labs-bike-light")
        home.haveText(shoppingCartBadge, "1")
        await home.addToCart("sauce-labs-fleece-jacket")
        await home.haveText(shoppingCartBadge, "2")
     });
      
      await test.step('navigating to cart page', async () => {
        await cart.clickOn('shopping_cart_link')
        cart.isVisible(continueShoppingButton)
        //await expect(page.locator('[id="continue-shopping"]')).toBeVisible()
        
      });

      await test.step('validating cart content & price', async () => {
        cart.containsTextForNth(inventoryItem, "Sauce Labs Bike Light", 0)
        cart.containsTextForNth(inventoryItemPrice, bike_light_price, 0)
        cart.containsTextForNth(inventoryItem, "Sauce Labs Fleece Jacket", 1)
        cart.containsTextForNth(inventoryItemPrice, fleece_price, 1)
      });

      await test.step('navigating back to homepage - continue shopping', async () => {
        cart.click(continueShoppingButton)
        page.isVisible(_productSortContainer)
      });

    });

    test('cart checkout page validations', async ({ page }) => {

      await test.step('add products to cart', async () => {
        await home.addToCart("sauce-labs-bike-light")
        home.haveText(shoppingCartBadge, "1")
        
        await home.addToCart("sauce-labs-fleece-jacket")
        home.haveText(shoppingCartBadge, "2")
     });
      
      await test.step('navigating to cart page', async () => {
        await cart.clickOn('shopping_cart_link')
        cart.isVisible(continueShoppingButton)
      });

      await test.step('validating cart content & price', async () => {
        cart.containsTextForNth(inventoryItem, "Sauce Labs Bike Light", 0)
        cart.containsTextForNth(inventoryItemPrice, bike_light_price, 0)
        cart.containsTextForNth(inventoryItem, "Sauce Labs Fleece Jacket", 1)
        cart.containsTextForNth(inventoryItemPrice, fleece_price, 1)
      });

      await test.step('clicking checkout', async () => {
        cart.click(checkoutButton)
        cart.isVisible(checkoutTitle)
        cart.containsText(checkoutTitle, "Checkout: Your Information")
      });

      await test.step('missing checkout info - first name', async () => {
        await cart.fillCheckoutInfo("", "Custard", "70007")
        cart.containsText(checkoutError, "Error: First Name is required")
      });

      await test.step('missing checkout info - last name', async () => {
        await cart.fillCheckoutInfo("Andy", "", "70007") 
        cart.containsText(checkoutError, "Error: Last Name is required")
      });

      await test.step('missing checkout info - zipcode', async () => {
        await cart.fillCheckoutInfo("Andy", "Custard", "") 
        cart.containsText(checkoutError, "Error: Postal Code is required")
      });

      await test.step('filling checkout info', async () => {
        await cart.fillCheckoutInfo("Andy", "Custard", "70007") 
      });

      await test.step('validating checkout:overview page', async () => {
        
        let finalValues = await cart.calculateCheckoutValues([bike_light_price, fleece_price])
        console.log("ARRAY: "+ finalValues)
        cart.containsText(subtotalLabel, finalValues[0])
        cart.containsText(taxLabel, finalValues[1])
        cart.containsText(totalLabel, finalValues[2])
      });

      await test.step('finish the purchase', async () => {
        cart.click(finishButton)

        await expect(page.locator(completeHeader)).toContainText(order_thanks)
        await expect(page.locator(backToProductsButton)).toBeVisible()

        await page.locator(backToProductsButton).click()
        await expect(page.locator(productSortContainer)).toBeVisible()

      });

    });

});
