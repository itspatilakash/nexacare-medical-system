import express from "express";
import { getPatientByPhone, registerPatient } from "../storage/patients";

const router = express.Router();

router.get("/:phone", async (req, res) => {
  const patient = await getPatientByPhone(req.params.phone);
  res.json({ patient });
});

router.post("/", async (req, res) => {
  const patient = await registerPatient(req.body);
  res.json({ patient });
});

export default router;
