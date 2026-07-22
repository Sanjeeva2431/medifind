// MediFind User Model (Customer, Pharmacy Owner, Delivery Partner, Admin)

export const UserSchemaDef = {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['customer', 'pharmacy', 'delivery', 'admin'], default: 'customer' },
    address: { type: String, default: '' },
    profile_image: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    created_at: { type: Date, default: Date.now }
};

export class UserStore {
    constructor() {
        this.users = new Map();
    }

    create(user) {
        this.users.set(user.id, user);
        return user;
    }

    findByEmail(email) {
        for (let u of this.users.values()) {
            if (u.email.toLowerCase() === email.toLowerCase()) return u;
        }
        return null;
    }

    findById(id) {
        return this.users.get(id) || null;
    }

    getAll() {
        return Array.from(this.users.values());
    }
}
