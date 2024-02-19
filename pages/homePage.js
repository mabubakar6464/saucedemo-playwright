import { default as BasePage } from "./basePage";

class HomePage extends BasePage{

    constructor(page){
        super(page)
    }

async addToCart(product){
    await this.page.click(`#add-to-cart-${product}`)
}

async removeFromCart(product){
    await this.page.click(`#remove-${product}`)
}

async viewProduct(imageName){
    await this.page.click(`img[data-test=inventory-item-sauce-labs-${imageName}]`)
}

}

module.exports = HomePage;