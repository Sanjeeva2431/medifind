// MediFind Medicine Routes

import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';

export const createMedicineRoutes = (medCtrl) => {
    const router = express.Router();
    router.get('/', medCtrl.getAll);
    router.get('/:id', medCtrl.getById);
    router.post('/', medCtrl.create);
    router.put('/:id', medCtrl.update);
    router.delete('/:id', medCtrl.delete);
    return router;
};
