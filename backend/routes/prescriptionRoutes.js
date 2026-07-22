// MediFind Prescription API Routes

import express from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';

export const createPrescriptionRoutes = (prescriptionCtrl) => {
    const router = express.Router();
    router.get('/', verifyToken, prescriptionCtrl.getAll);
    router.get('/:id', verifyToken, prescriptionCtrl.getById);
    router.post('/upload', verifyToken, prescriptionCtrl.upload);
    router.put('/:id/status', verifyToken, requireRole(['pharmacy', 'admin']), prescriptionCtrl.updateStatus);
    return router;
};
