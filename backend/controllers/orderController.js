// MediFind Order Controller & Real-Time Socket Emission Integrator
import { supabaseAdmin } from '../config/supabaseClient.js';
import { OrderMongo } from '../models/mongoSchemas.js';

const THIRTY_MINS_MS = 30 * 60 * 1000;

export const updateOrderTimeStatus = (order, io) => {
    if (!order || order.order_status === 'Cancelled' || order.order_status === 'Delivered') {
        return order;
    }
    const createdAtMs = new Date(order.created_at || Date.now()).getTime();
    const elapsedMs = Date.now() - createdAtMs;

    let updated = false;

    if (elapsedMs >= THIRTY_MINS_MS) {
        order.order_status = 'Delivered';
        order.tracking_step = 4;
        order.payment_status = 'Paid';
        updated = true;
    } else if (elapsedMs >= 15 * 60 * 1000 && order.tracking_step < 3) {
        order.order_status = 'Out for Delivery';
        order.tracking_step = 3;
        updated = true;
    } else if (elapsedMs >= 5 * 60 * 1000 && order.tracking_step < 2) {
        order.order_status = 'Preparing';
        order.tracking_step = 2;
        updated = true;
    }

    if (updated) {
        try {
            OrderMongo.updateOne({ id: order.id }, {
                $set: {
                    order_status: order.order_status,
                    tracking_step: order.tracking_step,
                    payment_status: order.payment_status
                }
            }).catch(err => console.warn('MongoDB Auto-Delivery Update Error:', err.message));

            if (supabaseAdmin) {
                supabaseAdmin.from('orders').update({
                    order_status: order.order_status,
                    tracking_step: order.tracking_step,
                    payment_status: order.payment_status
                }).eq('id', order.id).then(({ error }) => {
                    if (error) console.error('Supabase Auto-Delivery Update Error:', error.message);
                });
            }
        } catch (e) {
            console.error('Database Sync Error:', e);
        }

        if (io) {
            io.emit('order_status_updated', {
                id: order.id,
                status: order.order_status,
                tracking_step: order.tracking_step
            });
        }
    }
    return order;
};

export const orderController = (orderStore, io) => {
    // Periodic background delivery state evaluator (runs every 10 seconds)
    setInterval(() => {
        try {
            const orders = orderStore.getAll();
            for (const order of orders) {
                updateOrderTimeStatus(order, io);
            }
        } catch (err) {
            console.error('Auto-delivery background evaluation error:', err);
        }
    }, 10000);

    return {
        getAll: async (req, res) => {
            const { user_id, pharmacy_id } = req.query;
            let list = orderStore.getAll();

            // Fetch all orders from MongoDB Atlas Cloud DB
            try {
                const mongoOrders = await OrderMongo.find().lean();
                if (Array.isArray(mongoOrders) && mongoOrders.length > 0) {
                    const localIds = new Set(list.map(o => o.id));
                    for (const mo of mongoOrders) {
                        if (!localIds.has(mo.id)) {
                            orderStore.create(mo);
                            list.push(mo);
                        }
                    }
                }
            } catch (mErr) {
                console.warn('[getAll MongoDB Atlas warning]:', mErr.message);
            }

            // Evaluate dynamic 30-minute status for all orders
            list.forEach(o => updateOrderTimeStatus(o, io));

            // Admin & Platform Live Orders Stream (Returns all orders)
            const isAdminCall = true;
            if (!isAdminCall && req.user) {
                list = list.filter(o => 
                    o.user_id === req.user.id || 
                    (o.customer_email && req.user.email && o.customer_email.toLowerCase() === req.user.email.toLowerCase())
                );
            } else if (user_id) {
                list = list.filter(o => o.user_id === user_id);
            }
            if (pharmacy_id) list = list.filter(o => o.pharmacy_id === pharmacy_id);

            return res.json({ success: true, count: list.length, orders: list });
        },

        getById: (req, res) => {
            const order = orderStore.findById(req.params.id);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
            // Security Isolation: Non-admin users can only view their own order
            if (req.user && req.user.role !== 'admin' && order.user_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Unauthorized: Cannot access orders of another user' });
            }
            updateOrderTimeStatus(order, io);
            return res.json({ success: true, order });
        },

        create: async (req, res) => {
            const { items, delivery_address, payment_method, pharmacy_id } = req.body;
            if (!items || items.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart items required' });
            }

            // Enforce 15 km Radius Delivery Serviceability Rule
            const addressText = (delivery_address || req.body.customer_address || '').toLowerCase();
            if (addressText) {
                if (addressText.includes('noida') || addressText.includes('delhi') || addressText.includes('mumbai') || addressText.includes('bengaluru') || addressText.includes('hyderabad') || addressText.includes('kolkata') || addressText.includes('pune') || addressText.includes('jaipur')) {
                    return res.status(400).json({ success: false, message: 'The location is currently not serviceable' });
                }
            }

            let calcDistKm = 1.0;
            if (req.body.user_lat && req.body.user_lng) {
                const STORE_LAT = 13.043913;
                const STORE_LNG = 80.074262;
                const uLat = parseFloat(req.body.user_lat);
                const uLng = parseFloat(req.body.user_lng);
                if (!isNaN(uLat) && !isNaN(uLng)) {
                    const R = 6371;
                    const dLat = (STORE_LAT - uLat) * (Math.PI / 180);
                    const dLon = (STORE_LNG - uLng) * (Math.PI / 180);
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(uLat * (Math.PI / 180)) * Math.cos(STORE_LAT * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    calcDistKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    if (calcDistKm > 15.0) {
                        return res.status(400).json({ success: false, message: 'The location is currently not serviceable' });
                    }
                }
            }

            const subtotal = req.body.subtotal !== undefined ? parseFloat(req.body.subtotal) : items.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (parseInt(i.quantity) || 1), 0);
            const tax = req.body.tax !== undefined ? parseFloat(req.body.tax) : parseFloat((subtotal * 0.05).toFixed(2));
            const calculatedDeliveryFee = parseFloat((calcDistKm * 10).toFixed(2));
            const deliveryFee = req.body.delivery_fee !== undefined ? parseFloat(req.body.delivery_fee) : calculatedDeliveryFee;
            const discount = parseFloat(req.body.discount) || 0;
            const calculatedTotal = parseFloat(Math.max(0, subtotal + tax + deliveryFee - discount).toFixed(2));
            const total_amount = req.body.total_amount !== undefined ? parseFloat(req.body.total_amount) : calculatedTotal;

            const paymentMethod = payment_method || 'UPI';
            const paymentStatus = req.body.payment_status || (paymentMethod === 'COD' ? 'Pending COD' : 'Paid');

            const newOrder = {
                id: req.body.id || `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
                user_id: req.body.user_id || (req.user ? req.user.id : 'usr_1'),
                customer_id: req.body.customer_id || req.body.user_id || (req.user ? req.user.id : 'usr_1'),
                customer_name: req.body.customer_name || (req.user && req.user.name ? req.user.name : 'Alex Johnson'),
                customer_email: req.body.customer_email || (req.user && req.user.email ? req.user.email : 'user@medifind.com'),
                customer_phone: req.body.customer_phone || (req.user && req.user.phone ? req.user.phone : '+91 98765 43210'),
                customer_address: delivery_address || req.body.customer_address || 'Sector 18, Noida',
                pharmacy_id: pharmacy_id || 'pharm_1',
                pharmacy_name: req.body.pharmacy_name || 'Apollo Pharmacy 24/7',
                items,
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax,
                delivery_fee: deliveryFee,
                discount,
                total_amount,
                payment_method: paymentMethod,
                payment_status: paymentStatus,
                order_status: req.body.order_status || 'Order Placed',
                tracking_step: req.body.tracking_step || 1,
                created_at: req.body.created_at || new Date().toISOString(),
                delivery_partner: req.body.delivery_partner || {
                    id: 'partner_1',
                    name: 'Rohan Verma',
                    phone: '+91 98112 33445',
                    vehicle: 'Hero Splendor (KA-01-EQ-9982)',
                    rating: 4.9,
                    otp: '8912'
                }
            };

            orderStore.create(newOrder);

            // Persist order to MongoDB Atlas
            try {
                await OrderMongo.findOneAndUpdate({ id: newOrder.id }, { $set: newOrder }, { upsert: true, new: true });
                console.log(`🍃 [MongoDB Atlas] Successfully persisted Order ${newOrder.id} (${newOrder.customer_name}) to cloud database.`);
            } catch (err) {
                console.error('[MongoDB Order Insert Error]:', err.message);
            }

            // Also persist order to Supabase table if configured
            try {
                if (supabaseAdmin) {
                    await supabaseAdmin.from('orders').insert([{
                        id: newOrder.id,
                        user_id: newOrder.user_id,
                        user_name: newOrder.customer_name,
                        pharmacy_id: newOrder.pharmacy_id,
                        pharmacy_name: newOrder.pharmacy_name,
                        items: newOrder.items,
                        subtotal: newOrder.subtotal,
                        delivery_fee: newOrder.delivery_fee,
                        discount: 0,
                        total_amount: newOrder.total_amount,
                        payment_method: newOrder.payment_method,
                        payment_status: newOrder.payment_status,
                        order_status: newOrder.order_status,
                        tracking_step: newOrder.tracking_step,
                        delivery_address: newOrder.customer_address,
                        driver_name: newOrder.delivery_partner.name,
                        driver_phone: newOrder.delivery_partner.phone,
                        created_at: newOrder.created_at
                    }]);
                }
            } catch (err) {
                console.error('Supabase Order Insert Error:', err.message);
            }

            // Emit Socket.IO event to all connected clients
            if (io) {
                io.emit('order_created', newOrder);
            }

            return res.status(201).json({ success: true, message: 'Order created successfully', order: newOrder });
        },

        updateStatus: async (req, res) => {
            const { status, tracking_step } = req.body;
            const updated = orderStore.updateStatus(req.params.id, status, tracking_step);
            if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });

            try {
                await OrderMongo.updateOne({ id: req.params.id }, {
                    $set: {
                        order_status: status,
                        tracking_step: tracking_step || updated.tracking_step
                    }
                });
            } catch (err) {
                console.error('[MongoDB Order Status Update Error]:', err.message);
            }

            try {
                if (supabaseAdmin) {
                    const updatePayload = { order_status: status };
                    if (tracking_step) updatePayload.tracking_step = tracking_step;
                    await supabaseAdmin.from('orders').update(updatePayload).eq('id', req.params.id);
                }
            } catch (err) {
                console.error('Supabase Order Update Error:', err.message);
            }

            if (io) {
                io.emit('order_status_updated', { id: updated.id, status: updated.order_status, tracking_step: updated.tracking_step });
            }

            return res.json({ success: true, message: 'Order status updated', order: updated });
        },

        cancel: async (req, res) => {
            const order = orderStore.findById(req.params.id);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

            if (req.user && req.user.role !== 'admin' && order.user_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
            }

            const updated = orderStore.updateStatus(req.params.id, 'Cancelled', 0);
            try {
                await OrderMongo.updateOne({ id: req.params.id }, {
                    $set: { order_status: 'Cancelled', tracking_step: 0 }
                });
            } catch (err) {
                console.error('[MongoDB Order Cancellation Sync Error]:', err.message);
            }
            try {
                if (supabaseAdmin) {
                    await supabaseAdmin.from('orders').update({ order_status: 'Cancelled' }).eq('id', req.params.id);
                }
            } catch (err) {
                console.error('Supabase Order Cancel Error:', err.message);
            }

            if (io) {
                io.emit('order_status_updated', { id: updated.id, status: 'Cancelled', tracking_step: 0 });
            }

            return res.json({ success: true, message: 'Order cancelled successfully', order: updated });
        },

        resetOrders: async (req, res) => {
            try {
                orderStore.orders = new Map();
                await OrderMongo.deleteMany({});
                if (supabaseAdmin) {
                    try {
                        await supabaseAdmin.from('orders').delete().neq('id', 'dummy_never_match');
                    } catch (e) {}
                }
                if (io) {
                    io.emit('orders_reset', { success: true });
                }
                console.log('🧹 [Order Controller] Wiped all orders and reset revenue to ₹0.');
                return res.json({ success: true, message: 'All platform orders and revenue reset cleanly.' });
            } catch (err) {
                console.error('[Reset Orders Error]:', err.message);
                return res.status(500).json({ success: false, message: err.message });
            }
        }
    };
};
