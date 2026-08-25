// MediFind MongoDB Mongoose Schemas & Models
import mongoose from 'mongoose';

const userMongoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: '+91 98765 43210' },
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
    isVerified: { type: Boolean, default: true },
    created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

const pharmacyMongoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    license_number: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    rating: { type: Number, default: 4.5 },
    open_time: { type: String, default: '08:00 AM' },
    close_time: { type: String, default: '10:00 PM' },
    is_open: { type: Boolean, default: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    distance: { type: String, default: '1.2 km' },
    created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

const medicineMongoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    generic_name: { type: String, default: '' },
    category: { type: String, default: 'general' },
    price: { type: Number, required: true },
    original_price: { type: Number, default: 0 },
    manufacturer: { type: String, default: '' },
    dosage: { type: String, default: '' },
    stock: { type: Number, default: 100 },
    expiry_date: { type: String, default: '' },
    description: { type: String, default: '' },
    side_effects: { type: String, default: '' },
    requires_prescription: { type: Boolean, default: false },
    image: { type: String, default: '' },
    pharmacy_id: { type: String, default: '' },
    pharmacy_name: { type: String, default: '' },
    pharmacy_distance: { type: String, default: '' },
    rating: { type: String, default: '4.5' },
    created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

const orderMongoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    customer_name: { type: String, default: '' },
    customer_email: { type: String, default: '' },
    customer_phone: { type: String, default: '' },
    customer_address: { type: String, default: '' },
    pharmacy_id: { type: String, default: '' },
    pharmacy_name: { type: String, default: '' },
    items: { type: Array, default: [] },
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    delivery_fee: { type: Number, default: 0 },
    total_amount: { type: Number, default: 0 },
    payment_method: { type: String, default: 'UPI' },
    payment_status: { type: String, default: 'Paid' },
    order_status: { type: String, default: 'Order Placed' },
    tracking_step: { type: Number, default: 1 },
    delivery_partner: { type: Object, default: null },
    created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

const prescriptionMongoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    user_name: { type: String, default: '' },
    file_url: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, default: 'Pending Verification' },
    created_at: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true, strict: false });

export const UserMongo = mongoose.models.User || mongoose.model('User', userMongoSchema);
export const PharmacyMongo = mongoose.models.Pharmacy || mongoose.model('Pharmacy', pharmacyMongoSchema);
export const MedicineMongo = mongoose.models.Medicine || mongoose.model('Medicine', medicineMongoSchema);
export const OrderMongo = mongoose.models.Order || mongoose.model('Order', orderMongoSchema);
export const PrescriptionMongo = mongoose.models.Prescription || mongoose.model('Prescription', prescriptionMongoSchema);
