const { test, expect } = require('@playwright/test');
import LoginPage from '../../pages/loginPage';
import HomePage from '../../pages/homePage';
import CartPage from '../../pages/cartPage';
const testData = require('../../data/testData.json')

import { burgerMenuBtn } from '../../page_objects/login.js';
import { continueShoppingButton, inventoryItem, inventoryItemPrice, productSortContainer, checkoutButton, checkoutTitle, checkoutError, subtotalLabel, taxLabel, totalLabel, finishButton, completeHeader, backToProductsButton, shoppingCartLink } from '../../page_objects/cart.js';
const homePO = require('../../page_objects/home.js')

test.describe('SauceDemo - Happy Path', () => {

  let login, home, cart;

    test.beforeEach('fresh page and login before each test', async({page}) => {
      test.setTimeout(testData.timeout);
      login = new LoginPage(page);
      home = new HomePage(page);
      cart = new CartPage(page);
      await login.open(testData.url)
      await login.login(testData.username, testData.password)
      login.isVisible(burgerMenuBtn)
    });

    //showcasing playwright test steps feature here
    test('validating homepage assets - existence', async () => {

      await test.step('header items exist', async () => {
        home.isVisible(homePO.burgerMenuBtn)
        home.isVisible(homePO.homeLogo)
        home.isVisible(homePO.shoppingCartLink)
      });

      await test.step('footer items exist', async () => {
        home.isVisible(homePO.footerCopy)
        home.containsText(homePO.footerCopy, "All Rights Reserved")
        home.isVisible(homePO.socialTwitter)
        home.isVisible(homePO.socialFacebook)
        home.isVisible(homePO.socialLinkedin)
      });

      await test.step('hamburger menu items exist', async () => {
        home.click(homePO.burgerMenuBtn)
        home.isVisible(homePO.inventorySidebarLink)
        home.isVisible(homePO.aboutSidebarLink)
        home.isVisible(homePO.logoutSidebarLink)
        home.isVisible(homePO.resetSidebarLink)
      });
      
      await test.step('filter dropdown exists', async () => {
        home.isVisible(homePO.productSortContainer)
      });

  });

  test('validating single product details - Sauce Labs Backpack', async () => {
    await test.step('product name', async () => {
      home.containsTextForNth(homePO.inventoryItemName, "Sauce Labs Backpack", 0)
    });
    await test.step('product description', async () => {
      home.containsTextForNth(homePO.inventoryItemDesc, "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.", 0)
    });
    await test.step('product price', async () => {
      home.containsTextForNth(homePO.inventoryItemPrice, testData.backpack_price, 0)
    });
  });


  test('validating homepage assets - functionality', async ({page}) => {

    await test.step('Menu - All Items returns to homepage functionality - one level deep into item view', async () => {
      await home.viewProduct("backpack-img")
      home.click(homePO.burgerMenuBtn)
      console.log("burger", home.findLocator(homePO.burgerMenuBtn))
      home.click(homePO.inventorySidebarLink)
      home.isVisible(homePO.productSortContainer)
    });

    await test.step('Menu - All Items return to homepage functionality - one level deep into shopping cart', async () => {
      home.click(homePO.shoppingCartLink)
      home.click(homePO.burgerMenuBtn)
      home.click(homePO.inventorySidebarLink)
      home.isVisible(homePO.productSortContainer)
      await page.goBack()
    });

    await test.step('About', async () => {
      home.click(homePO.burgerMenuBtn)
      home.click(homePO.aboutSidebarLink)
      //home.haveURL(testData.about_page_url)
      await page.goBack()
    });

    await test.step('Logout', async () => {
      home.click(homePO.burgerMenuBtn)
      home.click(homePO.logoutSidebarLink)
      //login.isVisible(username)

    //relog
    await login.login(testData.username, testData.password)
      home.isVisible(homePO.burgerMenuBtn)
    });

    await test.step('Reset App State', async () => {
      await home.addToCart("sauce-labs-bike-light")
      await home.addToCart("sauce-labs-fleece-jacket")
      home.isNotEmptyText(homePO.shoppingCartBadge)

      home.click(homePO.burgerMenuBtn)
      home.click(homePO.resetSidebarLink)

      home.isNotVisible(homePO.shoppingCartBadge)
      //home.isEmptyText(homePO.shoppingCartBadge)
    });

  });

  test('product tests - products & cart badge', async () => {

    await test.step('add product to cart', async () => {
      await home.addToCart("sauce-labs-bike-light")
      home.haveText(homePO.shoppingCartBadge, "1")

      await home.addToCart("sauce-labs-fleece-jacket")
      home.haveText(homePO.shoppingCartBadge, "2")
   });

   await test.step('remove product from cart', async () => {
      await home.removeFromCart("sauce-labs-bike-light")
      await home.removeFromCart("sauce-labs-fleece-jacket")
      home.isNotVisible(homePO.shoppingCartBadge)
  });
    
});

test('product tests - sorting products', async () => {

  await test.step('Name (Z to A) sort', async () => {
    home.click(homePO.productSortContainer)
    home.selectOption(homePO.productSortContainer, testData.dropdown_za)
    home.containsTextForNth(homePO.inventoryItem, "Test.allTheThings() T-Shirt (Red)", 0)
    home.containsTextForNth(homePO.inventoryItem, "Sauce Labs Backpack", 5)
  });

  await test.step('Name (A to Z) sort', async () => {

    home.click(homePO.productSortContainer)
    home.selectOption(homePO.productSortContainer, testData.dropdown_az)
    home.containsTextForNth(homePO.inventoryItem, "Sauce Labs Backpack", 0)
    home.containsTextForNth(homePO.inventoryItem, "Test.allTheThings() T-Shirt (Red)", 5)

  });

  await test.step('Price (low to high) sort', async () => {
    home.click(homePO.productSortContainer)
    home.selectOption(homePO.productSortContainer, testData.dropdown_lohi)
    home.containsTextForNth(homePO.inventoryItem, "Sauce Labs Onesie", 0)
    home.containsTextForNth(homePO.inventoryItem, "Sauce Labs Fleece Jacket", 5)

  });

  await test.step('Price (high to low) sort', async () => {
    home.click(homePO.productSortContainer)
    home.selectOption(homePO.productSortContainer, testData.dropdown_hilo)
    home.containsTextForNth(homePO.inventoryItem, "Sauce Labs Fleece Jacket", 0)
    home.containsTextForNth(homePO.inventoryItem, "Sauce Labs Onesie", 5)

  });
  
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
    page.isVisible(productSortContainer)
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
