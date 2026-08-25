// MediFind User Model (Customer, Pharmacy Owner, Delivery Partner, Admin)

export const UserSchemaDef = {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['customer', 'pharmacy', 'delivery', 'admin'], default: 'customer' },
    address: { type: String, default: '' },
    house_number: { type: String, default: '' },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    profile_image: { type: String, default: '' },
    created_at: { type: Date, default: Date.now }
};

export class UserStore {
    constructor() {
        this.users = new Map();
        this.pendingUsers = new Map();

        // Seed Only System Admin Account
        this.create({
            id: 'usr_admin',
            name: 'System Admin',
            email: 'admin@medifind.com',
            password: 'admin123',
            phone: '+91 99999 00000',
            role: 'admin',
            address: 'MediFind HQ',
            isVerified: true
        });
    }

    create(user) {
        user.isVerified = true;
        this.users.set(user.id, user);
        return user;
    }

    findByEmail(email) {
        if (!email) return null;
        for (let u of this.users.values()) {
            if (u.email.toLowerCase() === email.toLowerCase()) return u;
        }
        return null;
    }

    findById(id) {
        return this.users.get(id) || null;
    }

    update(id, updates) {
        const user = this.users.get(id);
        if (!user) return null;
        Object.assign(user, updates);
        return user;
    }

    getAll() {
        return Array.from(this.users.values());
    }

    // Pending User & OTP Management
    savePendingRegistration(email, data) {
        const cleanEmail = email.toLowerCase();
        this.pendingUsers.set(cleanEmail, {
            ...data,
            email: cleanEmail,
            isVerified: false,
            createdAt: Date.now()
        });
        return this.pendingUsers.get(cleanEmail);
    }

    findPendingRegistration(email) {
        if (!email) return null;
        return this.pendingUsers.get(email.toLowerCase()) || null;
    }

    removePendingRegistration(email) {
        if (!email) return false;
        return this.pendingUsers.delete(email.toLowerCase());
    }
}

