// MediFind Prescription Model & In-Memory Store Engine

export class PrescriptionStore {
    constructor() {
        this.prescriptions = new Map();
    }

    create(prescription) {
        this.prescriptions.set(prescription.id, prescription);
        return prescription;
    }

    findById(id) {
        return this.prescriptions.get(id) || null;
    }

    getAll() {
        return Array.from(this.prescriptions.values());
    }

    getByUser(userId) {
        return this.getAll().filter(p => p.user_id === userId);
    }

    getByStatus(status) {
        return this.getAll().filter(p => p.status === status);
    }

    updateStatus(id, status) {
        const p = this.findById(id);
        if (!p) return null;
        p.status = status;
        return p;
    }
}
