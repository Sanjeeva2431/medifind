import { MedicineSearchPage } from '../pageObjects/MedicineSearchPage.js';

export async function runSearchTests(driver) {
    const searchPage = new MedicineSearchPage(driver);
    const suiteName = 'Medicine Inventory Search & Discovery';
    const testCases = [];

    // Test Case 1: Search by Medicine Name
    const start1 = Date.now();
    try {
        await searchPage.searchMedicine('Paracetamol');
        testCases.push({
            id: 'TC-SRCH-001',
            suite: suiteName,
            name: 'Search Medicine by Name (Paracetamol)',
            description: 'Queries live stock across nearby pharmacies',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-SRCH-001',
            suite: suiteName,
            name: 'Search Medicine by Name (Paracetamol)',
            description: 'Queries live stock across nearby pharmacies',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: Filter by Category (Antibiotics)
    const start2 = Date.now();
    try {
        await searchPage.filterByCategory('Antibiotics');
        testCases.push({
            id: 'TC-SRCH-002',
            suite: suiteName,
            name: 'Filter Medicines by Category (Antibiotics)',
            description: 'Applies filter chips to view prescription medicines',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-SRCH-002',
            suite: suiteName,
            name: 'Filter Medicines by Category (Antibiotics)',
            description: 'Applies filter chips to view prescription medicines',
            status: 'FAIL',
            durationMs: Date.now() - start2,
            error: err.message
        });
    }

    // Test Case 3: Add to Cart from Search Results
    const start3 = Date.now();
    try {
        await searchPage.selectMedicineAndAddToCart('Amoxicillin 500mg');
        testCases.push({
            id: 'TC-SRCH-003',
            suite: suiteName,
            name: 'Select Medicine & Add to Cart',
            description: 'Adds in-stock medicine from Apollo Pharmacy to cart',
            status: 'PASS',
            durationMs: Date.now() - start3,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-SRCH-003',
            suite: suiteName,
            name: 'Select Medicine & Add to Cart',
            description: 'Adds in-stock medicine from Apollo Pharmacy to cart',
            status: 'FAIL',
            durationMs: Date.now() - start3,
            error: null
        });
    }

    return testCases;
}
