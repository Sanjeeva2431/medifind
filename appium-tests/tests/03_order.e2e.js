import { OrderCheckoutPage } from '../pageObjects/OrderCheckoutPage.js';

export async function runOrderTests(driver) {
    const orderPage = new OrderCheckoutPage(driver);
    const suiteName = 'Cart Management & Order Checkout Flow';
    const testCases = [];

    // Test Case 1: Open Cart & Load Checkout Screen
    const start1 = Date.now();
    try {
        await orderPage.proceedToCheckout();
        testCases.push({
            id: 'TC-ORD-001',
            suite: suiteName,
            name: 'Navigate to Checkout & View Summary',
            description: 'Loads itemized bill, delivery fee, and tax breakdown',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-ORD-001',
            suite: suiteName,
            name: 'Navigate to Checkout & View Summary',
            description: 'Loads itemized bill, delivery fee, and tax breakdown',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: Complete Checkout with Cash on Delivery (COD)
    const start2 = Date.now();
    try {
        const orderResult = await orderPage.placeOrder('742 Evergreen Terrace, Springfield', 'COD');
        testCases.push({
            id: 'TC-ORD-002',
            suite: suiteName,
            name: 'Place Order via Cash on Delivery (COD)',
            description: 'Submits order request to nearest pharmacy with COD option',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-ORD-002',
            suite: suiteName,
            name: 'Place Order via Cash on Delivery (COD)',
            description: 'Submits order request to nearest pharmacy with COD option',
            status: 'FAIL',
            durationMs: Date.now() - start2,
            error: err.message
        });
    }

    // Test Case 3: Complete Checkout with Online Card Payment
    const start3 = Date.now();
    try {
        await orderPage.placeOrder('100 Main Street, Suite 4B', 'CARD');
        testCases.push({
            id: 'TC-ORD-003',
            suite: suiteName,
            name: 'Place Order via Online Payment Gateway',
            description: 'Verifies successful payment tokenization and order creation',
            status: 'PASS',
            durationMs: Date.now() - start3,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-ORD-003',
            suite: suiteName,
            name: 'Place Order via Online Payment Gateway',
            description: 'Verifies successful payment tokenization and order creation',
            status: 'FAIL',
            durationMs: Date.now() - start3,
            error: err.message
        });
    }

    return testCases;
}
