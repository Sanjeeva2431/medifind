import { WebAdminPage } from '../pageObjects/WebAdminPage.js';

export async function runWebAdminTests(driver) {
    const adminPage = new WebAdminPage(driver);
    const suiteName = 'Web Admin Portal Analytics & Pharmacy Management';
    const testCases = [];

    // Test Case 1: Verify Revenue & Pharmacy Analytics
    const start1 = Date.now();
    try {
        await adminPage.verifyAdminDashboardStats();
        testCases.push({
            id: 'TC-WEB-ADM-001',
            suite: suiteName,
            name: 'Verify Admin Analytics & Revenue Dashboard',
            description: 'Verifies real-time revenue calculations, total orders, and active pharmacies',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-ADM-001',
            suite: suiteName,
            name: 'Verify Admin Analytics & Revenue Dashboard',
            description: 'Verifies real-time revenue calculations, total orders, and active pharmacies',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    return testCases;
}
