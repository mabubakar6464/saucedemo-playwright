import { default as BasePage } from "./basePage";
const {username, password, loginBtn} = require('../page_objects/login.js')

class LoginPage extends BasePage{

    constructor(page){
        super(page)
    }

    async login(user, pass){
        await this.page.fill(username, user);
        await this.page.fill(password, pass);
        await this.page.click(loginBtn);
    }

}

export default LoginPage;