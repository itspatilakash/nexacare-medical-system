// server/routes/patients.routes.ts
import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import * as appointmentsService from "../services/appointments.service";
import * as patientsService from "../services/patients.service";
import { insertPatientSchema } from "../../shared/schema";
const router = Router();
// POST /patients/appointments
router.post("/appointments", authenticateToken, authorizeRoles("PATIENT"), async (req, res) => {
    try {
        const appointment = await appointmentsService.bookAppointment(req.body, req.user);
        res.status(201).json(appointment);
    }
    catch (err) {
        console.error("Book appointment error:", err);
        res.status(500).json({ message: "Failed to book appointment" });
    }
});
// GET /patients/profile
router.get("/profile", authenticateToken, authorizeRoles("PATIENT"), async (req, res) => {
    try {
        const patient = await patientsService.getPatientByUserId(req.user.id);
        res.status(200).json(patient);
    }
    catch (err) {
        console.error("Fetch patient profile error:", err);
        res.status(500).json({ message: "Failed to fetch patient profile" });
    }
});
// PUT /patients/profile
router.put("/profile", authenticateToken, authorizeRoles("PATIENT"), async (req, res) => {
    try {
        const validatedData = insertPatientSchema.partial().parse(req.body);
        const updated = await patientsService.updatePatientByUserId(req.user.id, validatedData);
        res.status(200).json(updated);
    }
    catch (err) {
        console.error("Update patient profile error:", err);
        res.status(400).json({ message: "Invalid input", error: err });
    }
});
export default router;
