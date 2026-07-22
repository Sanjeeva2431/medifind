// MediFind Auth Routes

import express from 'express';
import { verifyToken } from '../middlewares/auth.js';

export const createAuthRoutes = (authCtrl) => {
    const router = express.Router();
    router.post('/register', authCtrl.register);
    router.post('/login', authCtrl.login);
    router.get('/profile', verifyToken, authCtrl.getProfile);
    return router;
};
