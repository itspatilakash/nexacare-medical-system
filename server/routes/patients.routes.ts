import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";
import * as appointmentsService from "../services/appointments.service";

const router = Router();

router.post(
  "/appointments",
  authenticateToken,
  authorizeRoles("PATIENT"),
  async (req: AuthenticatedRequest, res) => {
    const patientId = req.user!.id;
    const appointment = await appointmentsService.bookAppointment({
      ...req.body,
      patientId,
    });
    res.json(appointment);
  }
);

export default router;
