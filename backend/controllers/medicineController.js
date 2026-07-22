// MediFind Medicine Controller (Search, Catalog, Inventory CRUD)

export const medicineController = (medicineStore) => ({
    getAll: (req, res) => {
        const { category, search, pharmacy_id } = req.query;
        let list = medicineStore.getAll();

        if (pharmacy_id) {
            list = list.filter(m => m.pharmacy_id === pharmacy_id);
        }
        if (category && category !== 'all') {
            list = list.filter(m => m.category === category);
        }
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(m => m.name.toLowerCase().includes(q) || m.generic_name.toLowerCase().includes(q));
        }

        return res.json({ success: true, count: list.length, medicines: list });
    },

    getById: (req, res) => {
        const med = medicineStore.findById(req.params.id);
        if (!med) return res.status(404).json({ success: false, message: 'Medicine not found' });
        return res.json({ success: true, medicine: med });
    },

    create: (req, res) => {
        const { name, generic_name, category, price, stock, dosage, pharmacy_id, requires_prescription } = req.body;
        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        const newMed = {
            id: `med_${Date.now()}`,
            name,
            generic_name: generic_name || name,
            category: category || 'general',
            price: parseFloat(price),
            original_price: parseFloat(price) * 1.15,
            stock: parseInt(stock) || 50,
            dosage: dosage || 'Standard',
            pharmacy_id: pharmacy_id || 'pharm_1',
            pharmacy_name: 'Apollo Pharmacy 24/7',
            pharmacy_distance: '0.8 km',
            requires_prescription: !!requires_prescription,
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
            expiry_date: '2027-12-31',
            description: 'Genuine certified medicine.'
        };

        medicineStore.create(newMed);
        return res.status(201).json({ success: true, message: 'Medicine added to inventory', medicine: newMed });
    },

    update: (req, res) => {
        const updated = medicineStore.update(req.params.id, req.body);
        if (!updated) return res.status(404).json({ success: false, message: 'Medicine not found' });
        return res.json({ success: true, message: 'Medicine updated', medicine: updated });
    },

    delete: (req, res) => {
        const success = medicineStore.delete(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Medicine not found' });
        return res.json({ success: true, message: 'Medicine deleted' });
    }
});
