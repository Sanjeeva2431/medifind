import { TrackingPage } from '../pageObjects/TrackingPage.js';

export async function runTrackingTests(driver) {
    const trackingPage = new TrackingPage(driver);
    const suiteName = 'Real-Time Order Tracking & Live GPS';
    const testCases = [];

    // Test Case 1: Active Order Live Map View
    const start1 = Date.now();
    try {
        await trackingPage.openOrderTracking('ORD-984210');
        testCases.push({
            id: 'TC-TRK-001',
            suite: suiteName,
            name: 'Launch Real-Time Delivery Tracking Screen',
            description: 'Verifies live map initialization and driver route display',
            status: 'PASS',
            durationMs: Date.now() - start1,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-TRK-001',
            suite: suiteName,
            name: 'Launch Real-Time Delivery Tracking Screen',
            description: 'Verifies live map initialization and driver route display',
            status: 'FAIL',
            durationMs: Date.now() - start1,
            error: err.message
        });
    }

    // Test Case 2: WebSocket Driver Location Updates
    const start2 = Date.now();
    try {
        await trackingPage.verifyOrderStatusUpdates();
        testCases.push({
            id: 'TC-TRK-002',
            suite: suiteName,
            name: 'Receive Live Driver Location Updates over WebSocket',
            description: 'Validates instant socket updates for driver movement',
            status: 'PASS',
            durationMs: Date.now() - start2,
            error: null
        });
    } catch (err) {
        testCases.push({
            id: 'TC-TRK-002',
            suite: suiteName,
            name: 'Receive Live Driver Location Updates over WebSocket',
            description: 'Validates instant socket updates for driver movement',
            status: 'FAIL',
            durationMs: Date.now() - start2,
            error: err.message
        });
    }

    return testCases;
}
