import express from "express";
import { getDoctorsByHospital, registerDoctor } from "../storage/doctors";

const router = express.Router();

router.get("/hospital/:hospitalId", async (req, res) => {
  const doctors = await getDoctorsByHospital(req.params.hospitalId);
  res.json({ doctors });
});

router.post("/", async (req, res) => {
  const doctor = await registerDoctor(req.body);
  res.json({ doctor });
});

export default router;
