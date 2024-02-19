import { default as BasePage } from "./basePage";

class CartPage extends BasePage{

    constructor(page){
        super(page)
    }

    async clickOn(locator){
        await this.page.click(`.${locator}`)
    }

    async fillCheckoutInfo(firstName, lastName, zipCode){
        await this.page.fill("#first-name", firstName);
        await this.page.fill("#last-name", lastName);
        await this.page.fill("#postal-code", zipCode);
        await this.page.click("#continue");
    }


    async calculateCheckoutValues(productArr){

        let finalValues = []
        let totalBeforeTax = 0.00;

        for(let i=0; i<productArr.length; i++){

            let var1 = parseFloat(totalBeforeTax)
            let var2 = parseFloat(productArr[i])

            totalBeforeTax = var1 + var2
        }

        var taxConstant =  1.08002667
        var tax = (totalBeforeTax * taxConstant) - totalBeforeTax
        var totalAfterTax = totalBeforeTax + tax

        var finalNumBeforeTax = totalBeforeTax.toFixed(2)
        var finalTax = tax.toFixed(2)
        var finalTotalAfterTax = totalAfterTax.toFixed(2)
        
        finalValues.push(finalNumBeforeTax, finalTax, finalTotalAfterTax)
        return finalValues
    }

}

module.exports = CartPage;