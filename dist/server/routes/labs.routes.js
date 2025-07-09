// server/routes/labs.routes.ts
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import { getLabReportsForLab } from "../services/lab.service";
import { createLabReport } from "../storage";
const router = Router();
router.post('/reports', authenticateToken, authorizeRoles('lab'), async (req, res) => {
    try {
        const report = req.body; // Validate via Zod optionally
        const created = await createLabReport({
            ...report,
            labId: req.user.id,
        });
        res.status(201).json({ success: true, report: created });
    }
    catch (err) {
        console.error('Upload lab report error:', err);
        res.status(500).json({ message: 'Failed to upload report' });
    }
});
router.get("/me/reports", authenticateToken, authorizeRoles("lab"), async (req, res) => {
    try {
        const labId = req.user.id;
        const reports = await getLabReportsForLab(labId);
        res.json(reports);
    }
    catch (err) {
        console.error("Get lab reports error:", err);
        res.status(500).json({ message: "Failed to fetch lab reports" });
    }
});
export default router;
