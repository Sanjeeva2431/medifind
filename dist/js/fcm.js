// MediFind Firebase Cloud Messaging (FCM) Push Notification Engine
// Supports Web Push & In-App Alerts for Customer, Pharmacy, Delivery Partner, and Admin roles

export class FcmService {
    constructor(app) {
        this.app = app;
        this.fcmToken = 'fcm_token_medifind_live_' + Math.floor(Math.random() * 1000000);
        this.permissionGranted = false;
        this.initFcm();
    }

    async initFcm() {
        if ('Notification' in window) {
            try {
                if (Notification.permission === 'granted') {
                    this.permissionGranted = true;
                } else if (Notification.permission !== 'denied') {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        this.permissionGranted = true;
                    }
                }
            } catch (e) {
                console.log('FCM Web Push Init: Browser operating in sound/toast notification mode.');
            }
        }
    }

    // Generic FCM Push Dispatcher
    dispatchPushNotification(title, body, roleTarget = 'customer', icon = 'fa-bell') {
        // 1. Trigger System Web Push Notification if permission granted
        if (this.permissionGranted && 'Notification' in window) {
            try {
                new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    tag: 'medifind-fcm'
                });
            } catch (e) {
                // Fallback
            }
        }

        // 2. Add to app state notifications array
        this.app.state.notifications.unshift({
            id: `fcm_${Date.now()}`,
            title: `[FCM ${roleTarget.toUpperCase()}] ${title}`,
            body,
            time: 'Just now',
            read: false
        });

        // 3. Show App Toast
        this.app.showToast(`🔔 ${title}: ${body}`);
        this.app.render();
    }

    // 🧑‍🦱 CUSTOMER FCM TRIGGERS
    notifyOrderPlaced(orderId) {
        this.dispatchPushNotification(
            '🎉 Order Placed Successfully!',
            `Order ${orderId} placed with 15-min express delivery fulfillment.`,
            'customer'
        );
    }

    notifyOrderAccepted(orderId) {
        this.dispatchPushNotification(
            '✅ Order Accepted by Pharmacy',
            `Pharmacy has accepted order ${orderId} and is preparing your medicines.`,
            'customer'
        );
    }

    notifyOutForDelivery(orderId, driverName = 'Rohan Verma') {
        this.dispatchPushNotification(
            '🛵 Out For Delivery!',
            `Driver ${driverName} is on the way with your medicines for order ${orderId}.`,
            'customer'
        );
    }

    notifyDelivered(orderId) {
        this.dispatchPushNotification(
            '🏠 Order Delivered!',
            `Order ${orderId} delivered successfully. Stay healthy!`,
            'customer'
        );
    }

    // 🏬 PHARMACY FCM TRIGGERS
    notifyPharmacyNewOrder(orderId, amount) {
        this.dispatchPushNotification(
            '🔔 New Order Received!',
            `New customer order ${orderId} received (₹${amount.toFixed(2)}). Please prepare items.`,
            'pharmacy'
        );
    }

    notifyPharmacyLowStock(medName, stockQty) {
        this.dispatchPushNotification(
            '⚠️ Low Stock Alert!',
            `Medicine "${medName}" is low in stock (${stockQty} units remaining). Restock soon!`,
            'pharmacy'
        );
    }

    // 🛵 DELIVERY PARTNER FCM TRIGGERS
    notifyDeliveryNewAssignment(orderId, shopName) {
        this.dispatchPushNotification(
            '🛵 New Express Delivery Assignment!',
            `New order ${orderId} assigned for pickup at ${shopName}.`,
            'delivery'
        );
    }

    // 🛡️ ADMIN FCM TRIGGERS
    notifyAdminSystemAlert(alertMessage) {
        this.dispatchPushNotification(
            '🛡️ Admin System Compliance Alert',
            alertMessage,
            'admin'
        );
    }
}
