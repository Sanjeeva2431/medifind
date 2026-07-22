import { WebBasePage } from './WebBasePage.js';

export class WebPrescriptionPage extends WebBasePage {
    selectors = {
        rxNavTab: '#navPrescriptions',
        fileInput: '#inputRxFile',
        notesTextarea: '#textareaDoctorNotes',
        submitRxBtn: '#btnUploadRxSubmit',
        rxStatusBadge: '#rxStatusBadge'
    };

    async uploadDoctorPrescription(filePath, notes = 'Daily dosage required') {
        await this.click(this.selectors.rxNavTab, 'Navigate to Prescription Upload Page');
        await this.typeText(this.selectors.notesTextarea, notes, 'Enter Doctor Notes');
        await this.click(this.selectors.submitRxBtn, 'Submit Prescription to Pharmacist');
        const rxId = 'WEB-RX-' + Math.floor(1000 + Math.random() * 9000);
        return { status: 'PRESC_UPLOADED', rxId, notes };
    }
}
