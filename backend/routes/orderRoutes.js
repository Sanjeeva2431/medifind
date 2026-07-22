// MediFind Order Routes

import express from 'express';
import { verifyToken } from '../middlewares/auth.js';

export const createOrderRoutes = (orderCtrl) => {
    const router = express.Router();
    router.get('/', verifyToken, orderCtrl.getAll);
    router.get('/:id', verifyToken, orderCtrl.getById);
    router.post('/', verifyToken, orderCtrl.create);
    router.put('/:id/status', verifyToken, orderCtrl.updateStatus);
    return router;
};
