// MediFind Medicine Routes

import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';

export const createMedicineRoutes = (medCtrl) => {
    const router = express.Router();
    router.get('/', medCtrl.getAll);
    router.get('/:id', medCtrl.getById);
    router.post('/', verifyToken, requireRole(['pharmacy', 'admin']), medCtrl.create);
    router.put('/:id', verifyToken, requireRole(['pharmacy', 'admin']), medCtrl.update);
    router.delete('/:id', verifyToken, requireRole(['pharmacy', 'admin']), medCtrl.delete);
    return router;
};
