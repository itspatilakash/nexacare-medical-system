import { Router } from "express";
import { authenticateToken, authorizeRoles } from "@/middleware/auth";
import type { AuthenticatedRequest } from "@/types";
import * as doctorsService from "@/services/doctors.service";

const router = Router();

router.get("/available", async (_req, res) => {
  const availableDoctors = await doctorsService.getAvailableDoctors();
  res.json(availableDoctors);
});

router.get(
  "/me/appointments",
  authenticateToken,
  authorizeRoles("DOCTOR"),
  async (req: AuthenticatedRequest, res) => {
    const doctorId = req.user!.id;
    const appointments = await doctorsService.getDoctorAppointments(doctorId);
    res.json(appointments);
  }
);

export default router;
