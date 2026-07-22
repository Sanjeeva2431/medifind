// MediFind Authentication Controller

import { generateToken } from '../middlewares/auth.js';

export const authController = (userStore) => ({
    register: (req, res) => {
        const { name, email, password, phone, role, address } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        }

        const existing = userStore.findByEmail(email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already registered.' });
        }

        const newUser = {
            id: `usr_${Date.now()}`,
            name,
            email,
            password, // In production, bcrypt hash password
            phone: phone || '+91 98765 43210',
            role: role || 'customer',
            address: address || 'Sector 18, Noida'
        };

        userStore.create(newUser);
        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
        });
    },

    login: (req, res) => {
        const { email, password } = req.body;
        const user = userStore.findByEmail(email);

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }

        const token = generateToken(user);
        return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    },

    getProfile: (req, res) => {
        const user = userStore.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, user });
    }
});
