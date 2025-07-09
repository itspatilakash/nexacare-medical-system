// server/routes/hospitals.routes.ts
import { Router } from 'express';
import { createHospital, getAllHospitals } from '../services/hospitals.service';
import { insertHospitalSchema } from '../../shared/schema';
import { approveLab, approveDoctor } from '../services/hospitals.service';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
const router = Router();
// GET /hospitals - List all hospitals
router.get('/', async (_req, res) => {
    try {
        const hospitals = await getAllHospitals();
        res.json({ hospitals });
    }
    catch (err) {
        console.error('Fetch hospitals error:', err);
        res.status(500).json({ message: 'Failed to fetch hospitals' });
    }
});
// POST /hospitals - Register a new hospital
router.post('/', async (req, res) => {
    try {
        const data = insertHospitalSchema.parse(req.body);
        const hospital = await createHospital(data);
        res.status(201).json({ hospital });
    }
    catch (err) {
        console.error('Register hospital error:', err);
        res.status(400).json({ message: 'Invalid data', error: err });
    }
});
router.post('/approve/doctor/:id', authenticateToken, authorizeRoles('hospital'), async (req, res) => {
    try {
        const approved = await approveDoctor(Number(req.params.id));
        res.json({ success: true, approved });
    }
    catch (err) {
        console.error('Approve doctor error:', err);
        res.status(500).json({ message: 'Failed to approve doctor' });
    }
});
router.post('/approve/lab/:id', authenticateToken, authorizeRoles('hospital'), async (req, res) => {
    try {
        const approved = await approveLab(Number(req.params.id));
        res.json({ success: true, approved });
    }
    catch (err) {
        console.error('Approve lab error:', err);
        res.status(500).json({ message: 'Failed to approve lab' });
    }
});
export default router;
