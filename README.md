## saucedemo-playwright
- Playwright + js on saucelabs test domain for CPH 2024

## Install
- git clone https://github.com/mabubakar6464/saucedemo-playwright.git
- npm install
- npm init playwright@latest

## Run tests
- npx playwright test
- npm run test

    ### View run results - basic HTML reporter
    - npm run reports

## Base playwright config & "CI" playwright.yml
- Runs each test on Chrome, Firefox, Webkit (safari), and Microsoft Edge
- Runs /tests folder
- Uses Page Object Model



## Observations

### Standard User
- For the standard_user, there's no validation for minimum cart quantity or cost; checkout can be completed with no items at no cost.
- No alphanumeric validation is enforced during checkout for the standard_user; words can be used in the zipcode field, and special characters like #'s can be used in the first and last name fields.
- I haven't been able to reproduce the error "Epic sadface: You can only access '/inventory-item.html' when you are logged in," perhaps by clicking on "About," waiting, and then attempting to return to the previous page.
- The dropdown arrow on the product filter for the standard_user changes the cursor but isn't actually interactable.
### Problem User
- For the Problem_User, several products link to the wrong items, some products can't be removed after being added (backpack, bike light, onesie), and others can't be added at all (bolt t-shirt, fleece jacket, red t-shirt). When trying to checkout, the Last Name field cannot be filled, preventing further progress. Additionally, filtering options on the homepage don't work, and the "About" link leads to a 404 page.
### Error User
- For the Error_User, sorting is broken, with a relevant notification appearing when attempted. The Last Name field at checkout cannot be entered, but the user can still proceed to the next page, although the transaction cannot be completed. Several items cannot be added or removed.
### Visual User
- Several icons are misaligned or tilted (hamburger icon, shopping cart icon, add to cart button for fleece jacket, checkout button), prices are inconsistent, text alignment for t-shirt names varies, and the image for the first product when sorted by any method is a dog image instead of the correct product image.