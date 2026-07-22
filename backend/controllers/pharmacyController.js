// MediFind Pharmacy Controller

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

    create: (req, res) => {
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
        return res.status(201).json({ success: true, message: 'Pharmacy registered successfully', pharmacy: newPharmacy });
    }
});
