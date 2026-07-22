// MediFind Production Firestore Database Seeder
// Seeds all 8 collections with relational data & index constraints

import { MOCK_PHARMACIES, MOCK_MEDICINES, MOCK_ORDERS } from '../../js/data.js';

export const seedFirestore = (firestoreDb) => {
    console.log('===========================================================');
    console.log('🔥 [Firestore Seeder] Seeding 8 Production Collections...');
    console.log('===========================================================');

    // 1. Collection: Users
    const users = [
        { id: 'usr_1', name: 'Alex Johnson', email: 'alex@example.com', phone: '+91 98765 43210', role: 'customer', address: { street: 'Flat 402, Block B, Sector 18', city: 'Noida', zip: '201301', lat: 28.5355, lng: 77.3910 } },
        { id: 'usr_2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98111 22334', role: 'customer', address: { street: '42 Green Park', city: 'Delhi', zip: '110016', lat: 28.5500, lng: 77.2000 } },
        { id: 'usr_pharm_1', name: 'Dr. S. K. Gupta', email: 'apollo@example.com', phone: '+91 98765 12345', role: 'pharmacy', address: { street: 'Apollo Pharmacy 24/7, Sector 18', city: 'Noida', zip: '201301', lat: 28.5355, lng: 77.3910 } },
        { id: 'usr_driver_1', name: 'Rohan Verma', email: 'rohan@example.com', phone: '+91 98112 33445', role: 'delivery', address: { street: 'Delivery Hub 4', city: 'Noida', zip: '201301', lat: 28.5380, lng: 77.3880 } },
        { id: 'usr_admin_1', name: 'Super Admin', email: 'admin@medifind.com', phone: '+91 99999 00000', role: 'admin', address: { street: 'MediFind HQ', city: 'Noida', zip: '201301', lat: 28.5355, lng: 77.3910 } }
    ];
    users.forEach(u => firestoreDb.collections.Users.set(u.id, u));
    console.log(`✅ [1/8 Users] Populated ${users.length} documents.`);

    // 2. Collection: Pharmacies
    MOCK_PHARMACIES.forEach(p => firestoreDb.collections.Pharmacies.set(p.id, {
        ...p,
        owner_id: 'usr_pharm_1',
        location: { lat: p.lat, lng: p.lng }
    }));
    console.log(`✅ [2/8 Pharmacies] Populated ${MOCK_PHARMACIES.length} documents.`);

    // 3. Collection: Medicines (Relational: Belongs to 1 Pharmacy)
    MOCK_MEDICINES.forEach(m => {
        firestoreDb.collections.Medicines.set(m.id, {
            ...m,
            pharmacy_id: m.pharmacy_id || 'pharm_1' // Enforces medicine belongs to 1 pharmacy
        });
    });
    console.log(`✅ [3/8 Medicines] Populated ${MOCK_MEDICINES.length} documents (Every medicine linked to 1 pharmacy).`);

    // 4. Collection: DeliveryPartners
    const deliveryPartners = [
        { id: 'partner_1', user_id: 'usr_driver_1', name: 'Rohan Verma', phone: '+91 98112 33445', vehicle_details: 'Hero Splendor (KA-01-EQ-9982)', rating: 4.9, is_active: true, total_deliveries: 482, earnings_today: 850, current_location: { lat: 28.5380, lng: 77.3880 } },
        { id: 'partner_2', user_id: 'usr_driver_2', name: 'Vikram Patel', phone: '+91 98222 55667', vehicle_details: 'TVS NTORQ (UP-16-BD-1122)', rating: 4.7, is_active: true, total_deliveries: 310, earnings_today: 620, current_location: { lat: 28.5400, lng: 77.3950 } }
    ];
    deliveryPartners.forEach(dp => firestoreDb.collections.DeliveryPartners.set(dp.id, dp));
    console.log(`✅ [4/8 DeliveryPartners] Populated ${deliveryPartners.length} documents.`);

    // 5. Collection: Orders (Relational: Belongs to 1 Customer, Optional 1 Delivery Partner)
    MOCK_ORDERS.forEach(o => {
        firestoreDb.collections.Orders.set(o.id, {
            ...o,
            customer_id: 'usr_1', // Relational: Belongs to 1 customer
            pharmacy_id: o.pharmacy_id || 'pharm_1',
            delivery_partner_id: 'partner_1' // Relational: Optionally has 1 delivery partner
        });
    });
    console.log(`✅ [5/8 Orders] Populated ${MOCK_ORDERS.length} documents (Relational: linked to customer & optional delivery partner).`);

    // 6. Collection: Prescriptions
    const prescriptions = [
        {
            id: 'RX-901',
            user_id: 'usr_1',
            user_name: 'Alex Johnson',
            pharmacy_id: 'pharm_1',
            doctor_name: 'Dr. A. K. Sharma (MD)',
            image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300',
            status: 'Pending',
            extracted_items: [
                { name: 'Dolo 650mg Tablet', qty: 2, confidence: '98%' },
                { name: 'Becosules Z Capsule', qty: 1, confidence: '96%' }
            ],
            created_at: new Date().toISOString()
        }
    ];
    prescriptions.forEach(p => firestoreDb.collections.Prescriptions.set(p.id, p));
    console.log(`✅ [6/8 Prescriptions] Populated ${prescriptions.length} documents.`);

    // 7. Collection: Notifications
    const notifications = [
        {
            id: 'notif_1',
            user_id: 'usr_1',
            title: 'Order Dispatched ⚡',
            body: 'Your order ORD-89102 is out for delivery with Rohan Verma.',
            type: 'order_update',
            read: false,
            created_at: new Date().toISOString()
        },
        {
            id: 'notif_2',
            user_id: 'usr_1',
            title: 'Prescription Verification Approved ✅',
            body: 'Dr. Gupta from Apollo Pharmacy verified your prescription RX-901.',
            type: 'prescription_approved',
            read: true,
            created_at: new Date().toISOString()
        }
    ];
    notifications.forEach(n => firestoreDb.collections.Notifications.set(n.id, n));
    console.log(`✅ [7/8 Notifications] Populated ${notifications.length} documents.`);

    // 8. Collection: Reviews
    const reviews = [
        {
            id: 'rev_1',
            user_id: 'usr_1',
            user_name: 'Alex Johnson',
            pharmacy_id: 'pharm_1',
            rating: 5,
            comment: 'Super fast delivery in 12 mins! All genuine medicines delivered with sealed bill.',
            created_at: new Date().toISOString()
        },
        {
            id: 'rev_2',
            user_id: 'usr_2',
            user_name: 'Priya Sharma',
            pharmacy_id: 'pharm_2',
            rating: 4,
            comment: 'Good stock of emergency care and diabetes items.',
            created_at: new Date().toISOString()
        }
    ];
    reviews.forEach(r => firestoreDb.collections.Reviews.set(r.id, r));
    console.log(`✅ [8/8 Reviews] Populated ${reviews.length} documents.`);

    console.log('===========================================================');
    console.log('🎉 Firestore Database Seeding Completed Successfully!');
    console.log('===========================================================');
};
