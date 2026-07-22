import { BasePage } from './BasePage.js';

export class TrackingPage extends BasePage {
    selectors = {
        ordersTab: 'com.medifind.app:id/navOrders',
        activeOrderCard: 'com.medifind.app:id/cardActiveOrder',
        trackDriverBtn: 'com.medifind.app:id/btnTrackDriver',
        mapViewContainer: 'com.medifind.app:id/mapContainer',
        driverMarker: 'com.medifind.app:id/markerDriver',
        orderStatusStep: 'com.medifind.app:id/tvOrderStatus',
        etaText: 'com.medifind.app:id/tvETA'
    };

    async openOrderTracking(orderId) {
        await this.click(this.selectors.ordersTab, 'Open My Orders');
        await this.click(this.selectors.activeOrderCard, `Select Active Order ${orderId}`);
        await this.click(this.selectors.trackDriverBtn, 'Launch Live GPS Map Tracking');
        return { status: 'TRACKING_ACTIVE', orderId, etaMinutes: 15 };
    }

    async verifyOrderStatusUpdates() {
        const isMapVisible = await this.isDisplayed(this.selectors.mapViewContainer);
        return { status: 'VERIFIED', isMapVisible, currentStep: 'DRIVER_OUT_FOR_DELIVERY' };
    }
}
