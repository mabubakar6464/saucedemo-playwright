import { expect } from '@playwright/test'

class BasePage {
    constructor(page) {
        this.page = page
    }

    async open(url) {
        return await this.page.goto(url)
    }

    async haveURL(url) {
        const [] = await Promise.all([
            this.page.waitForNavigation(),
        ])
        console.log("url", this.page.url())
        return expect(this.page.url()).toContain(url)
        //return await expect(this.page).toHaveURL(url)
    }

    async findLocator(selector) {
        return await this.page.locator(selector)
    }

    async isVisible(selector) {
        let element = await this.page.locator(selector)
        return await expect(element).toBeVisible()
    } 

    async isNotVisible(selector) {
        let element = await this.page.locator(selector)
        return await expect(element).not.toBeVisible()
    }

    async containsText(selector, text) {
        let element = await this.page.locator(selector)
        return await expect(element).toContainText(text)
    }

    async haveText(selector, text) {
        let element = await this.page.locator(selector)
        return await expect(element).toHaveText(text)
    }

    async isEmptyText(selector) {
        let element = await this.page.locator(selector)
        return await expect(element).toBeEmpty()
    }

    async isNotEmptyText(selector) {
        let element = await this.page.locator(selector)
        return await expect(element).not.toBeEmpty()
    }

    async click(selector) {
        let element = await this.page.locator(selector)
        return await element.click()
    }

    async selectOption(selector, value) {
        let element = await this.page.locator(selector)
        return await element.selectOption({value: value})
    }

    async containsTextForNth(selector, text, nthIndex) {
        let element = await this.page.locator(selector).nth(nthIndex)
        return await expect(element).toContainText(text)
    }
}
export default BasePage