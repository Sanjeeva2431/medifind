import { WebBasePage } from './WebBasePage.js';

export class WebAuthPage extends WebBasePage {
    selectors = {
        loginTabBtn: '#loginTab',
        registerTabBtn: '#registerTab',
        emailInput: '#inputEmail',
        passwordInput: '#inputPassword',
        roleSelect: '#selectRole',
        submitLoginBtn: '#btnLoginSubmit',
        nameInput: '#inputName',
        phoneInput: '#inputPhone',
        submitRegisterBtn: '#btnRegisterSubmit',
        userProfileBadge: '#userProfileBadge'
    };

    async login(email, password, role = 'patient') {
        await this.navigateTo('/');
        await this.click(this.selectors.loginTabBtn, 'Click Login Tab');
        await this.typeText(this.selectors.emailInput, email, `Enter User Email: ${email}`);
        await this.typeText(this.selectors.passwordInput, password, 'Enter Password');
        await this.click(this.selectors.submitLoginBtn, `Submit Login as ${role}`);
        return { status: 'SUCCESS', email, role };
    }

    async registerUser(name, email, password, phone, role = 'patient') {
        await this.navigateTo('/');
        await this.click(this.selectors.registerTabBtn, 'Click Register Tab');
        await this.typeText(this.selectors.nameInput, name, `Enter Full Name: ${name}`);
        await this.typeText(this.selectors.emailInput, email, `Enter Email: ${email}`);
        await this.typeText(this.selectors.passwordInput, password, 'Enter Password');
        await this.typeText(this.selectors.phoneInput, phone, `Enter Phone Number: ${phone}`);
        await this.click(this.selectors.submitRegisterBtn, 'Submit Registration Form');
        return { status: 'REGISTERED', email, role };
    }
}
