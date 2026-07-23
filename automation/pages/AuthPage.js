import { BasePage } from './BasePage.js';

export class AuthPage extends BasePage {
    selectors = {
        emailInput: 'com.medifind.app:id/et_email',
        passwordInput: 'com.medifind.app:id/et_password',
        loginButton: 'com.medifind.app:id/btn_login',
        otpInput: 'com.medifind.app:id/et_otp',
        verifyOtpBtn: 'com.medifind.app:id/btn_verify_otp',
        biometricSwitch: 'com.medifind.app:id/switch_biometrics',
        logoutBtn: 'com.medifind.app:id/btn_logout',
        statusBanner: 'com.medifind.app:id/tv_status'
    };

    async login(email, password) {
        await this.sendKeys(this.selectors.emailInput, email);
        await this.sendKeys(this.selectors.passwordInput, password);
        await this.click(this.selectors.loginButton);
    }

    async enterOtp(otp) {
        await this.sendKeys(this.selectors.otpInput, otp);
        await this.click(this.selectors.verifyOtpBtn);
    }

    async logout() {
        await this.click(this.selectors.logoutBtn);
    }
}
