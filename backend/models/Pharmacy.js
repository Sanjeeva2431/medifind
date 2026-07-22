// MediFind Pharmacy Model

export class PharmacyStore {
    constructor() {
        this.pharmacies = new Map();
    }

    create(pharmacy) {
        this.pharmacies.set(pharmacy.id, pharmacy);
        return pharmacy;
    }

    findById(id) {
        return this.pharmacies.get(id) || null;
    }

    getAll() {
        return Array.from(this.pharmacies.values());
    }

    update(id, updates) {
        const p = this.findById(id);
        if (!p) return null;
        Object.assign(p, updates);
        return p;
    }
}
