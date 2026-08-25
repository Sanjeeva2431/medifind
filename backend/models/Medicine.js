import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const PERSIST_FILE = path.join(DATA_DIR, 'medicines_persistent.json');

export class MedicineStore {
    constructor() {
        this.medicines = new Map();
        this.ensureDataDir();
    }

    ensureDataDir() {
        try {
            if (!fs.existsSync(DATA_DIR)) {
                fs.mkdirSync(DATA_DIR, { recursive: true });
            }
        } catch (e) {
            console.warn('[MedicineStore] Error creating data directory:', e);
        }
    }

    persist() {
        try {
            this.ensureDataDir();
            const data = JSON.stringify(Array.from(this.medicines.values()), null, 2);
            fs.writeFileSync(PERSIST_FILE, data, 'utf8');
        } catch (e) {
            console.warn('[MedicineStore] Error persisting medicines:', e);
        }
    }

    loadPersisted() {
        try {
            if (fs.existsSync(PERSIST_FILE)) {
                const raw = fs.readFileSync(PERSIST_FILE, 'utf8');
                const list = JSON.parse(raw);
                if (Array.isArray(list) && list.length > 0) {
                    this.medicines.clear();
                    list.forEach(m => this.medicines.set(m.id, m));
                    console.log(`[MedicineStore] Loaded ${list.length} persisted medicines from disk.`);
                    return true;
                }
            }
        } catch (e) {
            console.warn('[MedicineStore] Error loading persisted medicines:', e);
        }
        return false;
    }

    create(med) {
        this.medicines.set(med.id, med);
        this.persist();
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
        if (updates.price !== undefined) med.price = parseFloat(updates.price);
        if (updates.stock !== undefined) med.stock = parseInt(updates.stock);
        Object.assign(med, updates);
        this.persist();
        return med;
    }

    delete(id) {
        const res = this.medicines.delete(id);
        if (res) this.persist();
        return res;
    }
}
