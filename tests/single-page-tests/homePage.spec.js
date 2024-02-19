const { test } = require('@playwright/test');
const LoginPage = require('../../pages/loginPage').default;
const HomePage = require('../../pages/homePage');
const testData = require('../../data/testData.json');
const { burgerMenuBtn } = require('../../page_objects/login.js')
const homePO = require('../../page_objects/home.js')

test.describe('SauceDemo - Login Page', () => {

  let login, home;

    test.beforeEach('fresh page and login before each test', async({page}) => {
      test.setTimeout(testData.timeout);
      login = new LoginPage(page);
      home = new HomePage(page);
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

    // await test.step('product image', async () => {
    //   home.isVisible(homePO.productImgSauceLabsBackpack)
    // });
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


});
