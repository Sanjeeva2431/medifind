// MediFind Pharmacy Routes

import express from 'express';

export const createPharmacyRoutes = (pharmCtrl) => {
    const router = express.Router();
    router.get('/', pharmCtrl.getAll);
    router.get('/:id', pharmCtrl.getById);
    router.post('/', pharmCtrl.create);
    router.put('/:id', pharmCtrl.update);
    router.delete('/:id', pharmCtrl.delete);
    return router;
};
