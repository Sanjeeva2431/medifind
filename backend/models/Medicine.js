// MediFind Medicine Model

export class MedicineStore {
    constructor() {
        this.medicines = new Map();
    }

    create(med) {
        this.medicines.set(med.id, med);
        return med;
    }

    findById(id) {
        return this.medicines.get(id) || null;
    }

    getAll() {
        return Array.from(this.medicines.values());
    }

    getByPharmacy(pharmacyId) {
        return this.getAll().filter(m => m.pharmacy_id === pharmacyId);
    }

    search(query, category) {
        const q = query ? query.toLowerCase() : '';
        return this.getAll().filter(m => {
            const matchCat = !category || category === 'all' || m.category === category;
            const matchText = !q || m.name.toLowerCase().includes(q) || m.generic_name.toLowerCase().includes(q);
            return matchCat && matchText;
        });
    }

    update(id, updates) {
        const med = this.findById(id);
        if (!med) return null;
        Object.assign(med, updates);
        return med;
    }

    delete(id) {
        return this.medicines.delete(id);
    }
}
