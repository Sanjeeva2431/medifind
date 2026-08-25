// MediFind MongoDB Atlas Connection Integrator (Mongoose)
import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
        console.warn('⚠️ MONGO_URI not configured in environment variables.');
        return null;
    }
    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`🍃 Connected to MongoDB Atlas Cloud Database: ${conn.connection.host} (${conn.connection.name})`);
        return conn;
    } catch (err) {
        console.warn('⚠️ MongoDB Atlas Connection Warning:', err.message);
        return null;
    }
};
