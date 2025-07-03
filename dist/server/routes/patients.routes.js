// server/routes/patients.routes.ts
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import * as appointmentsService from "../services/appointments.service";
const router = Router();
router.post("/appointments", authenticateToken, authorizeRoles("PATIENT"), async (req, res) => {
    try {
        const patientId = req.user.id;
        const appointment = await appointmentsService.bookAppointment({
            ...req.body,
            patientId,
        });
        res.status(201).json(appointment);
    }
    catch (err) {
        console.error("Book appointment error:", err);
        res.status(500).json({ message: "Failed to book appointment" });
    }
});
export default router;
