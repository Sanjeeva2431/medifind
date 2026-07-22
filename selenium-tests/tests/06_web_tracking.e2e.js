import { WebTrackingPage } from '../pageObjects/WebTrackingPage.js';

export async function runWebTrackingTests(driver) {
    const trackingPage = new WebTrackingPage(driver);
    const suiteName = 'Web Real-Time Order Tracking & Socket.IO GPS';
    const testCases = [];

    // Test Case 1: Connect to Real-Time Socket Order Tracking
    const start1 = Date.now();
    try {
        await trackingPage.openLiveOrderTracking('WEB-ORD-849102');
        testCases.push({
            id: 'TC-WEB-TRK-001',
            suite: suiteName,
            name: 'Establish Socket.IO Connection & Render Live Driver Map',
            description: 'Subscribes to order tracking socket channel and renders Leaflet GPS map',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-WEB-TRK-001',
            suite: suiteName,
            name: 'Establish Socket.IO Connection & Render Live Driver Map',
            description: 'Subscribes to order tracking socket channel and renders Leaflet GPS map',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    return testCases;
}
