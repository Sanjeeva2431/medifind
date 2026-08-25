// MediFind Pharmacy Controller
import { PharmacyMongo } from '../models/mongoSchemas.js';

export const pharmacyController = (pharmacyStore) => ({
    getAll: (req, res) => {
        const list = pharmacyStore.getAll();
        return res.json({ success: true, count: list.length, pharmacies: list });
    },

    getById: (req, res) => {
        const pharmacy = pharmacyStore.findById(req.params.id);
        if (!pharmacy) return res.status(404).json({ success: false, message: 'Pharmacy not found' });
        return res.json({ success: true, pharmacy });
    },

    create: async (req, res) => {
        const { shop_name, owner_name, license_number, address, phone } = req.body;
        if (!shop_name || !license_number) {
            return res.status(400).json({ success: false, message: 'Shop name and license number required' });
        }

        const newPharmacy = {
            id: `pharm_${Date.now()}`,
            shop_name,
            owner_name: owner_name || 'Verified Owner',
            license_number,
            address: address || 'Main City Road',
            phone: phone || '+91 98765 00000',
            rating: 4.8,
            reviews_count: 1,
            status: 'open',
            distance: '1.0 km',
            delivery_time: '15-20 mins',
            delivery_available: true,
            license_verified: true,
            logo: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=80'
        };

        pharmacyStore.create(newPharmacy);
        try {
            await PharmacyMongo.create(newPharmacy);
        } catch (e) {
            console.warn('[PharmacyMongo Create Error]:', e.message);
        }
        return res.status(201).json({ success: true, message: 'Pharmacy registered successfully', pharmacy: newPharmacy });
    },

    update: async (req, res) => {
        const updated = pharmacyStore.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Pharmacy not found' });

        try {
            await PharmacyMongo.updateOne({ id: req.params.id }, { $set: updated }, { upsert: true });
        } catch (e) {
            console.warn('[PharmacyMongo Update Error]:', e.message);
        }
        return res.json({ success: true, message: 'Pharmacy updated', pharmacy: updated });
    },

    delete: async (req, res) => {
        const success = pharmacyStore.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Pharmacy not found' });

        try {
            await PharmacyMongo.deleteOne({ id: req.params.id });
        } catch (e) {
            console.warn('[PharmacyMongo Delete Error]:', e.message);
        }
        return res.json({ success: true, message: 'Pharmacy deleted' });
    }
});
