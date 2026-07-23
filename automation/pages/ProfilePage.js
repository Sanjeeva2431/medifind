import { BasePage } from './BasePage.js';

export class ProfilePage extends BasePage {
    selectors = {
        nameField: 'com.medifind.app:id/et_profile_name',
        addressField: 'com.medifind.app:id/et_profile_address',
        saveBtn: 'com.medifind.app:id/btn_save_profile'
    };

    async updateProfile(name, address) {
        await this.sendKeys(this.selectors.nameField, name);
        await this.sendKeys(this.selectors.addressField, address);
        await this.click(this.selectors.saveBtn);
    }
}
