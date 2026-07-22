import { WebSearchPage } from '../pageObjects/WebSearchPage.js';

export async function runWebSearchTests(driver) {
    const searchPage = new WebSearchPage(driver);
    const suiteName = 'Web Medicine Search & Stock Inventory Discovery';
    const testCases = [];

    // Test Case 1: Search by Medicine Name
    const start1 = Date.now();
    try {
        await searchPage.searchMedicine('Ibuprofen');
        testCases.push({
            id: 'TC-WEB-SRCH-001',
            suite: suiteName,
            name: 'Search Medicine by Name (Ibuprofen)',
            description: 'Queries live stock across nearby pharmacies in web UI',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-SRCH-001',
            suite: suiteName,
            name: 'Search Medicine by Name (Ibuprofen)',
            description: 'Queries live stock across nearby pharmacies in web UI',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: Filter by Category (Pain Relief)
    const start2 = Date.now();
    try {
        await searchPage.filterByCategory('Pain Relief');
        testCases.push({
            id: 'TC-WEB-SRCH-002',
            suite: suiteName,
            name: 'Filter Medicines by Category (Pain Relief)',
            description: 'Applies category chips to filter available medicines',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-SRCH-002',
            suite: suiteName,
            name: 'Filter Medicines by Category (Pain Relief)',
            description: 'Applies category chips to filter available medicines',
            status: 'FAIL',
            durationMs: Date.now() - start2,
            error: err.message
        });
    }

    // Test Case 3: Add Item to Web Cart
    const start3 = Date.now();
    try {
        await searchPage.addMedicineToCart('Ibuprofen 400mg');
        testCases.push({
            id: 'TC-WEB-SRCH-003',
            suite: suiteName,
            name: 'Add Available Medicine to Shopping Cart',
            description: 'Adds item to local cart state & updates badge counter',
            status: 'PASS',
            durationMs: Date.now() - start3,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-SRCH-003',
            suite: suiteName,
            name: 'Add Available Medicine to Shopping Cart',
            description: 'Adds item to local cart state & updates badge counter',
            status: 'FAIL',
            durationMs: Date.now() - start3,
            error: err.message
        });
    }

    return testCases;
}
