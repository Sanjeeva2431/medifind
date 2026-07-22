// MediFind Real-Time Socket.IO Engine (Live GPS Delivery Tracking & Order Status Dispatch)

export const initSocketHandler = (io, orderStore) => {
    io.on('connection', (socket) => {
        console.log(`[Socket.IO] New client connected: ${socket.id}`);

        socket.on('join_order_room', (orderId) => {
            socket.join(`order_${orderId}`);
            console.log(`[Socket.IO] Client ${socket.id} joined room: order_${orderId}`);
        });

        socket.on('update_driver_location', (data) => {
            const { orderId, lat, lng, progress } = data;
            io.to(`order_${orderId}`).emit('driver_location_changed', { lat, lng, progress, timestamp: Date.now() });
        });

        socket.on('update_order_status', (data) => {
            const { orderId, status, step } = data;
            const updated = orderStore.updateStatus(orderId, status, step);
            if (updated) {
                io.emit('order_status_updated', { id: orderId, status, tracking_step: step });
                io.to(`order_${orderId}`).emit('order_status_updated', { id: orderId, status, tracking_step: step });
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        });
    });
};
