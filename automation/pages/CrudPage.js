import { BasePage } from './BasePage.js';

export class CrudPage extends BasePage {
    selectors = {
        addMedicineBtn: 'com.medifind.app:id/btn_add_medicine',
        medNameInput: 'com.medifind.app:id/et_med_name',
        medPriceInput: 'com.medifind.app:id/et_med_price',
        saveMedBtn: 'com.medifind.app:id/btn_save_med',
        deleteMedBtn: 'com.medifind.app:id/btn_delete_med'
    };

    async createMedicine(name, price) {
        await this.click(this.selectors.addMedicineBtn);
        await this.sendKeys(this.selectors.medNameInput, name);
        await this.sendKeys(this.selectors.medPriceInput, price);
        await this.click(this.selectors.saveMedBtn);
    }
}
