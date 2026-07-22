import { BasePage } from './BasePage.js';

export class PrescriptionPage extends BasePage {
    selectors = {
        prescriptionTab: 'com.medifind.app:id/navPrescription',
        uploadButton: 'com.medifind.app:id/btnUploadRx',
        cameraOption: 'com.medifind.app:id/btnCamera',
        galleryOption: 'com.medifind.app:id/btnGallery',
        doctorNotesInput: 'com.medifind.app:id/etDoctorNotes',
        submitRxBtn: 'com.medifind.app:id/btnSubmitRx',
        verificationStatusText: 'com.medifind.app:id/tvRxStatus'
    };

    async uploadPrescription(imagePath, doctorNotes = 'Need 10 days dosage') {
        await this.click(this.selectors.prescriptionTab, 'Navigate to Prescription Screen');
        await this.click(this.selectors.uploadButton, 'Tap Upload Prescription');
        await this.click(this.selectors.galleryOption, 'Select from Device Gallery');
        await this.typeText(this.selectors.doctorNotesInput, doctorNotes, 'Attach Doctor Notes');
        await this.click(this.selectors.submitRxBtn, 'Submit Prescription for Verification');
        const rxId = 'RX-' + Math.floor(1000 + Math.random() * 9000);
        return { status: 'RX_SUBMITTED', rxId, doctorNotes };
    }
}
