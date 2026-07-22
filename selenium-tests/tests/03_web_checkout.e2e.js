import { WebCheckoutPage } from '../pageObjects/WebCheckoutPage.js';

export async function runWebCheckoutTests(driver) {
    const checkoutPage = new WebCheckoutPage(driver);
    const suiteName = 'Web Cart & Order Checkout Gateway';
    const testCases = [];

    // Test Case 1: Open Cart Modal & Review Items
    const start1 = Date.now();
    try {
        await checkoutPage.openCartAndCheckout();
        testCases.push({
            id: 'TC-WEB-CHK-001',
            suite: suiteName,
            name: 'Open Shopping Cart Modal & Verify Bill Summary',
            description: 'Displays subtotal, delivery charges, and total amount',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-CHK-001',
            suite: suiteName,
            name: 'Open Shopping Cart Modal & Verify Bill Summary',
            description: 'Displays subtotal, delivery charges, and total amount',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: Complete Checkout via Cash on Delivery
    const start2 = Date.now();
    try {
        await checkoutPage.completeCheckout('456 Market Street, Apt 12', 'COD');
        testCases.push({
            id: 'TC-WEB-CHK-002',
            suite: suiteName,
            name: 'Submit Order with Cash on Delivery (COD)',
            description: 'Verifies backend REST order creation & Socket notification',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-CHK-002',
            suite: suiteName,
            name: 'Submit Order with Cash on Delivery (COD)',
            description: 'Verifies backend REST order creation & Socket notification',
            status: 'FAIL',
            durationMs: Date.now() - start2,
            error: err.message
        });
    }

    return testCases;
}
