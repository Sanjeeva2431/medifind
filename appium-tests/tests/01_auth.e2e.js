import { AuthPage } from '../pageObjects/AuthPage.js';

export async function runAuthTests(driver) {
    const authPage = new AuthPage(driver);
    const suiteName = 'Authentication & Registration Module';
    const testCases = [];

    // Test Case 1: Patient Login with Valid Credentials
    const start1 = Date.now();
    try {
        const result = await authPage.login('patient@medifind.com', 'password123', 'patient');
        testCases.push({
            id: 'TC-AUTH-001',
            suite: suiteName,
            name: 'Verify Patient Mobile Login with Valid Credentials',
            description: 'Patient enters valid email and password to access dashboard',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-AUTH-001',
            suite: suiteName,
            name: 'Verify Patient Mobile Login with Valid Credentials',
            description: 'Patient enters valid email and password to access dashboard',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: New Customer Account Registration
    const start2 = Date.now();
    try {
        const randomEmail = `user${Math.floor(Math.random() * 10000)}@medifind.com`;
        await authPage.registerUser('Alex Vance', randomEmail, 'SecurePass123!', '+19876543210', 'patient');
        testCases.push({
            id: 'TC-AUTH-002',
            suite: suiteName,
            name: 'Verify New Patient Account Registration Flow',
            description: 'Registers a new patient with mobile phone validation',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-AUTH-002',
            suite: suiteName,
            name: 'Verify New Patient Account Registration Flow',
            description: 'Registers a new patient with mobile phone validation',
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
            id: 'TC-AUTH-003',
            suite: suiteName,
            name: 'Verify Pharmacist Portal Login',
            description: 'Pharmacist logs in to manage medicine inventory',
            status: 'PASS',
            durationMs: Date.now() - start3,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-AUTH-003',
            suite: suiteName,
            name: 'Verify Pharmacist Portal Login',
            description: 'Pharmacist logs in to manage medicine inventory',
            status: 'FAIL',
            durationMs: Date.now() - start3,
            error: err.message
        });
    }

    return testCases;
}
