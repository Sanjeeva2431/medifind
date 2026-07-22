import { BasePage } from './BasePage.js';

export class AuthPage extends BasePage {
    selectors = {
        emailInput: 'com.medifind.app:id/etEmail',
        passwordInput: 'com.medifind.app:id/etPassword',
        roleDropdown: 'com.medifind.app:id/spinnerRole',
        loginButton: 'com.medifind.app:id/btnLogin',
        registerTab: 'com.medifind.app:id/tabRegister',
        nameInput: 'com.medifind.app:id/etName',
        phoneInput: 'com.medifind.app:id/etPhone',
        submitRegisterBtn: 'com.medifind.app:id/btnRegister',
        userProfileHeader: 'com.medifind.app:id/tvUserProfile'
    };

    async login(email, password, role = 'patient') {
        await this.typeText(this.selectors.emailInput, email, `Enter user email: ${email}`);
        await this.typeText(this.selectors.passwordInput, password, 'Enter user password');
        await this.click(this.selectors.loginButton, `Click Login as ${role}`);
        return { status: 'SUCCESS', user: email, role };
    }

    async registerUser(name, email, password, phone, role = 'patient') {
        await this.click(this.selectors.registerTab, 'Switch to Register Tab');
        await this.typeText(this.selectors.nameInput, name, `Enter Name: ${name}`);
        await this.typeText(this.selectors.emailInput, email, `Enter Email: ${email}`);
        await this.typeText(this.selectors.passwordInput, password, 'Enter Password');
        await this.typeText(this.selectors.phoneInput, phone, `Enter Phone: ${phone}`);
        await this.click(this.selectors.submitRegisterBtn, 'Click Register');
        return { status: 'REGISTERED', email, role };
    }
}
