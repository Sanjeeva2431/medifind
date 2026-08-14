// MediFind Realtime Sync Engine (Firebase onSnapshot Listeners & Socket.IO Event Streams)
// Enables Zero Page Refresh Realtime Stock Updates, Order Status Updates, GPS Tracking, and Notifications

export class RealtimeEngine {
    constructor(app) {
        this.app = app;
        this.socket = null;
        this.activeListeners = [];
        this.initSocketConnection();
    }

    initSocketConnection() {
        if (typeof io !== 'undefined') {
            try {
                this.socket = io('http://localhost:5000', { autoConnect: true, reconnection: true });
                this.bindSocketEvents();
            } catch (e) {
                console.log('Socket.IO init fallback: operating in memory-broadcast mode');
            }
        }
    }

    bindSocketEvents() {
        if (!this.socket) return;

        // 1. Realtime Stock Updates Listener
        this.socket.on('stock_update', (data) => {
            console.log('⚡ Realtime Stock Update Received:', data);
            const med = this.app.state.medicines.find(m => m.id === data.medId);
            if (med) {
                med.stock = data.newStock;
                this.app.showToast(`⚡ Stock Update: ${med.name} is now ${med.stock} units`);
                this.app.render(); // Zero page refresh UI re-render
            }
        });

        // 2. Realtime Order Status Updates Listener
        this.socket.on('order_status_update', (data) => {
            console.log('⚡ Realtime Order Status Update Received:', data);
            const order = this.app.state.orders.find(o => o.id === data.orderId);
            if (order) {
                order.order_status = data.status;
                if (data.step) order.tracking_step = data.step;
                this.app.showToast(`📦 Order ${order.id} status updated to "${data.status}"`);
                this.app.render(); // Zero page refresh UI re-render
            }
        });

        // 3. Realtime Delivery GPS Tracking Listener
        this.socket.on('driver_location_update', (data) => {
            console.log('⚡ Realtime Delivery Location Update:', data);
            if (this.app.customerModule) {
                this.app.customerModule.driverLivePos = { lat: data.lat, lng: data.lng, progress: data.progress };
                this.app.render();
            }
        });

        // 4. Realtime Notifications Listener
        this.socket.on('notification_received', (data) => {
            console.log('⚡ Realtime Notification Received:', data);
            this.app.state.notifications.unshift({
                id: `n_${Date.now()}`,
                title: data.title,
                body: data.body,
                time: 'Just now',
                read: false
            });
            this.app.showToast(`🔔 ${data.title}: ${data.body}`);
            this.app.render();
        });
    }

    // FIREBASE ONSNAPSHOT LISTENERS SIMULATOR & SUBSCRIPTIONS
    subscribeStockUpdates(medId, callback) {
        console.log(`📡 Listening for realtime stock changes on medicine ${medId}...`);
        const interval = setInterval(() => {
            const med = this.app.state.medicines.find(m => m.id === medId);
            if (med && callback) callback(med.stock);
        }, 10000);
        this.activeListeners.push(interval);
    }

    subscribeOrderUpdates(orderId, callback) {
        console.log(`📡 Listening for realtime order status updates on order ${orderId}...`);
        const interval = setInterval(() => {
            const order = this.app.state.orders.find(o => o.id === orderId);
            if (order && callback) callback(order.order_status, order.tracking_step);
        }, 8000);
        this.activeListeners.push(interval);
    }

    // EMITTERS FOR REALTIME BROADCASTING WITHOUT PAGE REFRESH
    broadcastStockUpdate(medId, newStock) {
        if (this.socket) {
            this.socket.emit('stock_update', { medId, newStock });
        }
        // Local state mutation & reactive zero-refresh render
        const med = this.app.state.medicines.find(m => m.id === medId);
        if (med) {
            med.stock = parseInt(newStock) || 0;
            this.app.render();
        }
    }

    broadcastOrderUpdate(orderId, status, step) {
        if (this.socket) {
            this.socket.emit('order_status_update', { orderId, status, step });
        }
        const order = this.app.state.orders.find(o => o.id === orderId);
        if (order) {
            order.order_status = status;
            if (step) order.tracking_step = step;
            this.app.render();
        }
    }

    broadcastNotification(title, body) {
        if (this.socket) {
            this.socket.emit('notification_received', { title, body });
        }
        this.app.state.notifications.unshift({
            id: `n_${Date.now()}`,
            title,
            body,
            time: 'Just now',
            read: false
        });
        this.app.showToast(`🔔 ${title}: ${body}`);
        this.app.render();
    }
}
