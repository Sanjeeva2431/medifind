import { PrescriptionPage } from '../pageObjects/PrescriptionPage.js';

export async function runPrescriptionTests(driver) {
    const rxPage = new PrescriptionPage(driver);
    const suiteName = 'Prescription (Rx) Upload & Verification';
    const testCases = [];

    // Test Case 1: Upload Doctor Prescription Image
    const start1 = Date.now();
    try {
        await rxPage.uploadPrescription('/storage/emulated/0/DCIM/rx_sample.jpg', 'Take 1 tablet daily after meals');
        testCases.push({
            id: 'TC-RX-001',
            suite: suiteName,
            name: 'Upload Doctor Prescription Image from Mobile Device',
            description: 'Patient attaches prescription image with notes for licensed pharmacist review',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-RX-001',
            suite: suiteName,
            name: 'Upload Doctor Prescription Image from Mobile Device',
            description: 'Patient attaches prescription image with notes for licensed pharmacist review',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    return testCases;
}
