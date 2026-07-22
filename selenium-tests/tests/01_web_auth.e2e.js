import { WebAuthPage } from '../pageObjects/WebAuthPage.js';

export async function runWebAuthTests(driver) {
    const authPage = new WebAuthPage(driver);
    const suiteName = 'Web Authentication & User Onboarding Module';
    const testCases = [];

    // Test Case 1: Patient Web Login
    const start1 = Date.now();
    try {
        await authPage.login('patient@medifind.com', 'password123', 'patient');
        testCases.push({
            id: 'TC-WEB-AUTH-001',
            suite: suiteName,
            name: 'Verify Patient Web Login with Valid Credentials',
            description: 'Patient logs into MediFind web portal successfully',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-AUTH-001',
            suite: suiteName,
            name: 'Verify Patient Web Login with Valid Credentials',
            description: 'Patient logs into MediFind web portal successfully',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: New Web User Registration
    const start2 = Date.now();
    try {
        const randomEmail = `webuser${Math.floor(Math.random() * 10000)}@medifind.com`;
        await authPage.registerUser('Sarah Connor', randomEmail, 'SecurePass123!', '+15550192834', 'patient');
        testCases.push({
            id: 'TC-WEB-AUTH-002',
            suite: suiteName,
            name: 'Verify New Patient Registration on Web Portal',
            description: 'Registers a new patient account with validation',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-AUTH-002',
            suite: suiteName,
            name: 'Verify New Patient Registration on Web Portal',
            description: 'Registers a new patient account with validation',
            status: 'FAIL',
            durationMs: Date.now() - start2,
            error: err.message
        });
    }

    // Test Case 3: Pharmacist Login
    const start3 = Date.now();
    try {
        await authPage.login('pharmacy@medifind.com', 'pharmacy123', 'pharmacist');
        testCases.push({
            id: 'TC-WEB-AUTH-003',
            suite: suiteName,
            name: 'Verify Pharmacist Portal Web Login',
            description: 'Pharmacist logs in to update inventory & approve prescriptions',
            status: 'PASS',
            durationMs: Date.now() - start3,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-AUTH-003',
            suite: suiteName,
            name: 'Verify Pharmacist Portal Web Login',
            description: 'Pharmacist logs in to update inventory & approve prescriptions',
            status: 'FAIL',
            durationMs: Date.now() - start3,
            error: err.message
        });
    }

    return testCases;
}
