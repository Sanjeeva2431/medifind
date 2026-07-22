import { WebBasePage } from './WebBasePage.js';

export class WebTrackingPage extends WebBasePage {
    selectors = {
        trackingNavTab: '#navLiveTracking',
        orderInput: '#inputTrackOrderId',
        trackOrderBtn: '#btnTrackOrderSubmit',
        socketStatusIndicator: '#socketConnectionStatus',
        driverMapCanvas: '#leafletMapCanvas',
        driverMarkerIcon: '.leaflet-marker-icon'
    };

    async openLiveOrderTracking(orderId) {
        await this.click(this.selectors.trackingNavTab, 'Open Live Order Tracking Portal');
        await this.typeText(this.selectors.orderInput, orderId, `Enter Order ID: ${orderId}`);
        await this.click(this.selectors.trackOrderBtn, 'Start Socket Live Tracking');
        return { status: 'SOCKET_CONNECTED', orderId, trackingActive: true };
    }
}
