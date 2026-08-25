// MediFind Seed Script (Medicines, Pharmacies, Orders)
// User seeding is disabled — only real registered users are maintained.

import { MOCK_PHARMACIES, MOCK_MEDICINES, MOCK_ORDERS } from '../../js/data.js';

export const seedDatabase = (userStore, pharmacyStore, medicineStore, orderStore, prescriptionStore) => {
    console.log('[Seed Engine] Seeding MediFind catalog & pharmacy datasets...');

    // Seed Pharmacies
    MOCK_PHARMACIES.forEach(p => pharmacyStore.create(p));

    // Seed Medicines (Check if persisted disk file exists with modified prices)
    const hasLoadedPersisted = medicineStore.loadPersisted();
    if (!hasLoadedPersisted) {
        MOCK_MEDICINES.forEach(m => medicineStore.create(m));
    }

    // Seed Catalog Orders
    MOCK_ORDERS.forEach(o => orderStore.create(o));

    console.log(`[Seed Engine] Seeding complete! Populated ${medicineStore.getAll().length} medicines, ${pharmacyStore.getAll().length} pharmacies.`);
};
