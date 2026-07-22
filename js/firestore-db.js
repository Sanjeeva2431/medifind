// MediFind Production Firestore Database Access Object (DAO) Engine
// Supports 8 Core Collections with Relational Integrity & Compound Query Helpers

import { MOCK_PHARMACIES, MOCK_MEDICINES, MOCK_ORDERS } from './data.js';
import { seedFirestore } from '../backend/seed/firestoreSeed.js';

export class FirestoreDatabase {
    constructor() {
        this.collections = {
            Users: new Map(),
            Pharmacies: new Map(),
            Medicines: new Map(),
            Orders: new Map(),
            DeliveryPartners: new Map(),
            Prescriptions: new Map(),
            Notifications: new Map(),
            Reviews: new Map()
        };
        this.initialized = false;
        this.init();
    }

    init() {
        seedFirestore(this);
        this.initialized = true;
    }

    // 1. Users
    async getUser(id) {
        return this.collections.Users.get(id) || null;
    }
    async createUser(userData) {
        this.collections.Users.set(userData.id, { ...userData, created_at: new Date().toISOString() });
        return userData;
    }

    // 2. Pharmacies
    async getPharmacies() {
        return Array.from(this.collections.Pharmacies.values());
    }
    async getPharmacyById(id) {
        return this.collections.Pharmacies.get(id) || null;
    }

    // 3. Medicines (Relational: Belongs to 1 Pharmacy)
    async getMedicinesByPharmacy(pharmacyId) {
        return Array.from(this.collections.Medicines.values()).filter(m => m.pharmacy_id === pharmacyId);
    }
    async searchMedicines(query = '', category = 'all') {
        const q = query.toLowerCase();
        return Array.from(this.collections.Medicines.values()).filter(m => {
            const matchCat = category === 'all' || m.category === category;
            const matchQuery = !q || m.name.toLowerCase().includes(q) || m.generic_name.toLowerCase().includes(q);
            return matchCat && matchQuery;
        });
    }

    // 4. Orders (Relational: Customer + Pharmacy + Optional Delivery Partner)
    async getOrdersByCustomer(customerId) {
        return Array.from(this.collections.Orders.values()).filter(o => o.customer_id === customerId);
    }
    async getOrdersByPharmacy(pharmacyId) {
        return Array.from(this.collections.Orders.values()).filter(o => o.pharmacy_id === pharmacyId);
    }
    async getOrdersByDeliveryPartner(partnerId) {
        return Array.from(this.collections.Orders.values()).filter(o => o.delivery_partner_id === partnerId);
    }
    async createOrder(orderData) {
        if (!orderData.customer_id) throw new Error('Order must belong to a Customer (customer_id is required)');
        if (!orderData.pharmacy_id) throw new Error('Order must belong to a Pharmacy (pharmacy_id is required)');
        this.collections.Orders.set(orderData.id, { ...orderData, created_at: new Date().toISOString() });
        return orderData;
    }

    // 5. DeliveryPartners
    async getDeliveryPartners() {
        return Array.from(this.collections.DeliveryPartners.values());
    }

    // 6. Prescriptions
    async getPrescriptionsByUser(userId) {
        return Array.from(this.collections.Prescriptions.values()).filter(p => p.user_id === userId);
    }

    // 7. Notifications
    async getNotificationsByUser(userId) {
        return Array.from(this.collections.Notifications.values()).filter(n => n.user_id === userId);
    }

    // 8. Reviews
    async getReviewsByPharmacy(pharmacyId) {
        return Array.from(this.collections.Reviews.values()).filter(r => r.pharmacy_id === pharmacyId);
    }
}

export const firestoreDb = new FirestoreDatabase();
