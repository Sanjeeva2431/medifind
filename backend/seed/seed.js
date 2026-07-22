// MediFind Seed Script (100+ Medicines, 20 Pharmacies, Users, Orders)

import { MOCK_PHARMACIES, MOCK_MEDICINES, MOCK_ORDERS } from '../../js/data.js';

export const seedDatabase = (userStore, pharmacyStore, medicineStore, orderStore, prescriptionStore) => {
    console.log('[Seed Engine] Seeding MediFind full-stack database...');

    // Seed Sample Users
    const sampleUsers = [
        { id: 'usr_1', name: 'Alex Johnson', email: 'alex@example.com', password: 'password123', role: 'customer', phone: '+91 98765 43210', address: 'Flat 402, Block B, Sector 18, Noida' },
        { id: 'usr_pharm_1', name: 'Dr. S. K. Gupta', email: 'apollo@example.com', password: 'password123', role: 'pharmacy', phone: '+91 98765 12345', address: 'Apollo Pharmacy, Sector 18' },
        { id: 'usr_driver_1', name: 'Rohan Verma', email: 'rohan@example.com', password: 'password123', role: 'delivery', phone: '+91 98112 33445', address: 'Delivery Hub 4' },
        { id: 'usr_admin_1', name: 'Super Admin', email: 'admin@medifind.com', password: 'adminpassword', role: 'admin', phone: '+91 99999 00000', address: 'MediFind HQ' }
    ];
    sampleUsers.forEach(u => userStore.create(u));

    // Seed Pharmacies
    MOCK_PHARMACIES.forEach(p => pharmacyStore.create(p));

    // Seed 100+ Medicines
    MOCK_MEDICINES.forEach(m => medicineStore.create(m));

    // Seed Orders
    MOCK_ORDERS.forEach(o => orderStore.create(o));

    // Seed Prescriptions
    if (prescriptionStore) {
        prescriptionStore.create({
            id: 'RX-901',
            user_id: 'usr_1',
            user_name: 'Alex Johnson',
            doctor_name: 'Dr. A. K. Sharma',
            status: 'Pending',
            created_at: new Date().toISOString(),
            items: [
                { name: 'Dolo 650mg Tablet', qty: 2, confidence: '98%' },
                { name: 'Becosules Z Capsule', qty: 1, confidence: '96%' }
            ]
        });
    }

    console.log(`[Seed Engine] Seeding complete! Populated ${medicineStore.getAll().length} medicines, ${pharmacyStore.getAll().length} pharmacies, ${userStore.getAll().length} users.`);
};
