import { MOCK_MEDICINES } from './data.js';

export class SocketClient {
    constructor(app) {
        this.app = app;
        this.socket = null;
        this.init();
    }

    init() {
        if (typeof io !== 'undefined') {
            this.socket = io('http://localhost:5000');

            this.socket.on('connect', () => {
                console.log('[Websocket] Connected to MediFind Socket.IO server:', this.socket.id);
            });

            this.socket.on('order_created', (newOrder) => {
                const currentUser = this.app.authService ? this.app.authService.getUser() : null;
                const currentRole = this.app.state.currentRole;

                if (currentRole === 'admin' || currentRole === 'pharmacy' || (currentUser && newOrder.user_id === currentUser.id)) {
                    this.app.showToast(`⚡ New Order Received: ${newOrder.id}`);
                    const existing = (this.app.state.orders || []).find(o => o.id === newOrder.id);
                    if (!existing) {
                        this.app.state.orders.unshift(newOrder);
                        if (currentRole === 'customer') {
                            this.app.saveOrdersToStorage();
                        }
                    }
                    this.app.render();
                }
            });

            this.socket.on('order_status_updated', (data) => {
                const currentUser = this.app.authService ? this.app.authService.getUser() : null;
                const currentRole = this.app.state.currentRole;

                const order = (this.app.state.orders || []).find(o => o.id === data.id);
                if (order) {
                    order.order_status = data.status;
                    if (data.tracking_step) order.tracking_step = data.tracking_step;
                    if (currentRole === 'admin' || currentRole === 'pharmacy' || (currentUser && order.user_id === currentUser.id)) {
                        this.app.showToast(`Order ${data.id} Status: ${data.status}`);
                        this.app.render();
                    }
                }
            });

            this.socket.on('medicine_updated', (data) => {
                console.log('[Socket.IO] Realtime medicine update received:', data);
                if (this.app && this.app.state && this.app.state.medicines) {
                    const med = this.app.state.medicines.find(m => m.id === data.id);
                    if (med) {
                        if (data.price !== undefined) med.price = data.price;
                        if (data.stock !== undefined) med.stock = data.stock;
                        if (data.medicine) Object.assign(med, data.medicine);
                    } else if (data.medicine) {
                        this.app.state.medicines.unshift(data.medicine);
                    }
                    const mockMed = MOCK_MEDICINES.find(m => m.id === data.id);
                    if (mockMed) {
                        if (data.price !== undefined) mockMed.price = data.price;
                        if (data.stock !== undefined) mockMed.stock = data.stock;
                    }
                    if (typeof this.app.saveMedicinesToStorage === 'function') {
                        this.app.saveMedicinesToStorage();
                    }
                    this.app.render();
                }
            });

            this.socket.on('medicine_added', (newMed) => {
                console.log('[Socket.IO] Realtime medicine added:', newMed);
                if (this.app && this.app.state && this.app.state.medicines) {
                    const exists = this.app.state.medicines.some(m => m.id === newMed.id);
                    if (!exists) {
                        this.app.state.medicines.unshift(newMed);
                        if (typeof this.app.saveMedicinesToStorage === 'function') {
                            this.app.saveMedicinesToStorage();
                        }
                        this.app.render();
                    }
                }
            });

            this.socket.on('medicine_deleted', (data) => {
                console.log('[Socket.IO] Realtime medicine deleted:', data);
                if (this.app && this.app.state && this.app.state.medicines) {
                    this.app.state.medicines = this.app.state.medicines.filter(m => m.id !== data.id);
                    if (typeof this.app.saveMedicinesToStorage === 'function') {
                        this.app.saveMedicinesToStorage();
                    }
                    this.app.render();
                }
            });
        }
    }
}
