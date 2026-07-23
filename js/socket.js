// MediFind Socket.IO Frontend WebSockets Listener

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
                this.app.showToast(`⚡ New Order Received: ${newOrder.id}`);
                this.app.render();
            });

            this.socket.on('order_status_updated', (data) => {
                this.app.showToast(`Order ${data.id} Status: ${data.status}`);
                const order = this.app.state.orders.find(o => o.id === data.id);
                if (order) {
                    order.order_status = data.status;
                    if (data.tracking_step) order.tracking_step = data.tracking_step;
                }
                this.app.render();
            });
        }
    }
}
