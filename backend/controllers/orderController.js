// MediFind Order Controller & Real-Time Socket Emission Integrator

export const orderController = (orderStore, io) => ({
    getAll: (req, res) => {
        const { user_id, pharmacy_id } = req.query;
        let list = orderStore.getAll();
        if (user_id) list = list.filter(o => o.user_id === user_id);
        if (pharmacy_id) list = list.filter(o => o.pharmacy_id === pharmacy_id);
        return res.json({ success: true, count: list.length, orders: list });
    },

    getById: (req, res) => {
        const order = orderStore.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        return res.json({ success: true, order });
    },

    create: (req, res) => {
        const { items, delivery_address, payment_method, pharmacy_id } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart items required' });
        }

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const tax = subtotal * 0.05;
        const deliveryFee = subtotal > 200 ? 0 : 25;
        const total = subtotal + tax + deliveryFee;

        const newOrder = {
            id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
            user_id: req.user ? req.user.id : 'usr_1',
            customer_name: 'Alex Johnson',
            customer_phone: '+91 98765 43210',
            customer_address: delivery_address || 'Sector 18, Noida',
            pharmacy_id: pharmacy_id || 'pharm_1',
            pharmacy_name: 'Apollo Pharmacy 24/7',
            items,
            subtotal,
            tax,
            delivery_fee: deliveryFee,
            total_amount: total,
            payment_method: payment_method || 'UPI',
            payment_status: 'Paid',
            order_status: 'Order Placed',
            tracking_step: 1,
            created_at: new Date().toISOString(),
            delivery_partner: {
                id: 'partner_1',
                name: 'Rohan Verma',
                phone: '+91 98112 33445',
                vehicle: 'Hero Splendor (KA-01-EQ-9982)',
                rating: 4.9,
                otp: '8912'
            }
        };

        orderStore.create(newOrder);

        // Emit Socket.IO event to all connected clients
        if (io) {
            io.emit('order_created', newOrder);
        }

        return res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
    },

    updateStatus: (req, res) => {
        const { status, tracking_step } = req.body;
        const updated = orderStore.updateStatus(req.params.id, status, tracking_step);
        if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });

        if (io) {
            io.emit('order_status_updated', { id: updated.id, status: updated.order_status, tracking_step: updated.tracking_step });
        }

        return res.json({ success: true, message: 'Order status updated', order: updated });
    }
});
