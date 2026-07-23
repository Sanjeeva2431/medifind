import { BasePage } from './BasePage.js';

export class RegistrationPage extends BasePage {
    selectors = {
        fullName: 'com.medifind.app:id/et_full_name',
        phone: 'com.medifind.app:id/et_phone',
        roleDropdown: 'com.medifind.app:id/spinner_role',
        submitReg: 'com.medifind.app:id/btn_register'
    };

    async registerUser(data) {
        await this.sendKeys(this.selectors.fullName, data.name);
        await this.sendKeys(this.selectors.phone, data.phone);
        await this.click(this.selectors.submitReg);
    }
}
