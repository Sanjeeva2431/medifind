// MediFind Order Model

export class OrderStore {
    constructor() {
        this.orders = new Map();
    }

    create(order) {
        this.orders.set(order.id, order);
        return order;
    }

    findById(id) {
        return this.orders.get(id) || null;
    }

    getAll() {
        return Array.from(this.orders.values());
    }

    getByUser(userId) {
        return this.getAll().filter(o => o.user_id === userId);
    }

    getByPharmacy(pharmacyId) {
        return this.getAll().filter(o => o.pharmacy_id === pharmacyId);
    }

    updateStatus(id, status, step) {
        const order = this.findById(id);
        if (!order) return null;
        order.order_status = status;
        if (step) order.tracking_step = step;
        return order;
    }
}
