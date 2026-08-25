// MediFind MongoDB Data Synchronization & Bulk Migration Engine
import { UserMongo, PharmacyMongo, MedicineMongo, OrderMongo, PrescriptionMongo } from '../models/mongoSchemas.js';

export const syncAllDataToMongo = async (userStore, pharmacyStore, medicineStore, orderStore, prescriptionStore) => {
    try {
        console.log('🍃 [MongoDB Sync] Initiating full data migration & sync to MongoDB Atlas...');

        // 1. Sync Users
        const users = userStore.getAll();
        for (const u of users) {
            await UserMongo.updateOne({ id: u.id }, { $set: u }, { upsert: true });
        }
        const mongoUsers = await UserMongo.find({}).lean();
        for (const mu of mongoUsers) {
            if (!userStore.findById(mu.id)) {
                userStore.create(mu);
            }
        }

        // 2. Sync Pharmacies
        const pharmacies = pharmacyStore.getAll();
        for (const p of pharmacies) {
            await PharmacyMongo.updateOne({ id: p.id }, { $set: p }, { upsert: true });
        }
        const mongoPharmacies = await PharmacyMongo.find({}).lean();
        for (const mp of mongoPharmacies) {
            if (!pharmacyStore.findById(mp.id)) {
                pharmacyStore.create(mp);
            }
        }

        // 3. Sync Medicines
        const medicines = medicineStore.getAll();
        for (const m of medicines) {
            await MedicineMongo.updateOne({ id: m.id }, { $set: m }, { upsert: true });
        }
        const mongoMedicines = await MedicineMongo.find({}).lean();
        for (const mm of mongoMedicines) {
            if (!medicineStore.findById(mm.id)) {
                medicineStore.create(mm);
            }
        }

        // 4. Sync Orders
        const orders = orderStore.getAll();
        for (const o of orders) {
            await OrderMongo.updateOne({ id: o.id }, { $set: o }, { upsert: true });
        }
        const mongoOrders = await OrderMongo.find({}).lean();
        for (const mo of mongoOrders) {
            if (!orderStore.findById(mo.id)) {
                orderStore.create(mo);
            }
        }

        // 5. Sync Prescriptions
        const prescriptions = prescriptionStore.getAll();
        for (const pr of prescriptions) {
            await PrescriptionMongo.updateOne({ id: pr.id }, { $set: pr }, { upsert: true });
        }
        const mongoPrescriptions = await PrescriptionMongo.find({}).lean();
        for (const mpr of mongoPrescriptions) {
            if (!prescriptionStore.findById(mpr.id)) {
                prescriptionStore.create(mpr);
            }
        }

        console.log(`✅ [MongoDB Sync Success] MongoDB Atlas populated with ${mongoUsers.length} Users, ${mongoPharmacies.length} Pharmacies, ${mongoMedicines.length} Medicines, ${mongoOrders.length} Orders, ${mongoPrescriptions.length} Prescriptions.`);
    } catch (err) {
        console.warn('⚠️ [MongoDB Sync Exception]:', err.message);
    }
};
