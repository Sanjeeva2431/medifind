// MediFind Prescription Controller (Upload, List, Approve/Reject Status Updates)

export const prescriptionController = (prescriptionStore) => ({
    getAll: (req, res) => {
        const { status, user_id } = req.query;
        let list = prescriptionStore.getAll();
        if (status) list = list.filter(p => p.status === status);
        if (user_id) list = list.filter(p => p.user_id === user_id);
        return res.json({ success: true, count: list.length, prescriptions: list });
    },

    getById: (req, res) => {
        const p = prescriptionStore.findById(req.params.id);
        if (!p) return res.status(404).json({ success: false, message: 'Prescription not found' });
        return res.json({ success: true, prescription: p });
    },

    upload: (req, res) => {
        const { user_id, user_name, items, doctor_name } = req.body;
        const newPrescription = {
            id: `RX-${Math.floor(100 + Math.random() * 900)}`,
            user_id: user_id || (req.user ? req.user.id : 'usr_1'),
            user_name: user_name || 'Alex Johnson',
            doctor_name: doctor_name || 'Dr. A. K. Sharma',
            status: 'Pending',
            created_at: new Date().toISOString(),
            items: items || [
                { name: 'Dolo 650mg Tablet', qty: 2, confidence: '98%' },
                { name: 'Becosules Z Capsule', qty: 1, confidence: '96%' }
            ]
        };

        prescriptionStore.create(newPrescription);
        return res.status(201).json({ success: true, message: 'Prescription uploaded for pharmacy verification', prescription: newPrescription });
    },

    updateStatus: (req, res) => {
        const { status } = req.body;
        const updated = prescriptionStore.updateStatus(req.params.id, status);
        if (!updated) return res.status(404).json({ success: false, message: 'Prescription not found' });
        return res.json({ success: true, message: `Prescription status updated to ${status}`, prescription: updated });
    }
});
