// server/routes/reception.routes.ts
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
const router = Router();
router.get("/walkins", authenticateToken, authorizeRoles("RECEPTIONIST"), async (req, res) => {
    try {
        const receptionistId = req.user.id;
        // TODO: Replace this placeholder with actual walk-in logic
        res.json([]);
    }
    catch (err) {
        console.error("Get walk-ins error:", err);
        res.status(500).json({ message: "Failed to fetch walk-ins" });
    }
});
export default router;
