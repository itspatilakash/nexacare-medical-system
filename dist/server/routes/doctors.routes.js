// server/routes/doctors.routes.ts
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import * as doctorsService from "../services/doctors.service";
const router = Router();
router.get("/available", async (_req, res) => {
    try {
        const availableDoctors = await doctorsService.getAvailableDoctors();
        res.json(availableDoctors);
    }
    catch (err) {
        console.error("Get available doctors error:", err);
        res.status(500).json({ message: "Failed to fetch available doctors" });
    }
});
router.get("/me/appointments", authenticateToken, authorizeRoles("DOCTOR"), async (req, res) => {
    try {
        const doctorId = req.user.id;
        const appointments = await doctorsService.getDoctorAppointments(doctorId);
        res.json(appointments);
    }
    catch (err) {
        console.error("Get doctor appointments error:", err);
        res.status(500).json({ message: "Failed to fetch doctor appointments" });
    }
});
export default router;
