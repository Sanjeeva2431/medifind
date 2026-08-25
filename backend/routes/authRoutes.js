// MediFind Auth Routes

import express from 'express';
import { verifyToken } from '../middlewares/auth.js';

export const createAuthRoutes = (authCtrl) => {
    const router = express.Router();
    router.post('/register', authCtrl.register);
    router.post('/verify-otp', authCtrl.verifyOtp);
    router.post('/resend-otp', authCtrl.resendOtp);
    router.post('/login', authCtrl.login);
    router.post('/google', authCtrl.googleAuth);
    router.get('/profile', verifyToken, authCtrl.getProfile);
    router.put('/profile', verifyToken, authCtrl.updateProfile);
    router.get('/me', verifyToken, authCtrl.getMe);
    router.get('/users', authCtrl.getUsers);
    return router;
};
