import { BasePage } from './BasePage.js';

export class FormsPage extends BasePage {
    selectors = {
        rxPatientName: 'com.medifind.app:id/et_patient_name',
        rxDoctorName: 'com.medifind.app:id/et_doctor_name',
        rxNotes: 'com.medifind.app:id/et_rx_notes',
        submitFormBtn: 'com.medifind.app:id/btn_submit_form'
    };

    async fillPrescriptionForm(name, doc, notes) {
        await this.sendKeys(this.selectors.rxPatientName, name);
        await this.sendKeys(this.selectors.rxDoctorName, doc);
        await this.sendKeys(this.selectors.rxNotes, notes);
        await this.click(this.selectors.submitFormBtn);
    }
}
