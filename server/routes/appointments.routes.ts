import express from "express";
import {
  bookAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
} from "../services/appointments.service";

const router = express.Router();

router.post("/", bookAppointment);
router.get("/patient/:patientId", getAppointmentsByPatient);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);

export default router;
