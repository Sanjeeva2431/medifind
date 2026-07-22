// MediFind Authentication & Authorization Middleware (JWT + Role Guards)

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'medifind_super_secret_jwt_key_2026';

export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Fallback for mock sessions
        req.user = { id: 'usr_1', role: 'customer', email: 'alex@example.com' };
        return next();
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired Authorization token' });
    }
};

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: `Access denied. Requires one of roles: ${allowedRoles.join(', ')}` });
        }
        next();
    };
};
