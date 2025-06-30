import express from "express";
import { getReceptionistsByHospital, registerReceptionist } from "../storage/receptionists";

const router = express.Router();

router.get("/hospital/:hospitalId", async (req, res) => {
  const staff = await getReceptionistsByHospital(req.params.hospitalId);
  res.json({ staff });
});

router.post("/", async (req, res) => {
  const receptionist = await registerReceptionist(req.body);
  res.json({ receptionist });
});

export default router;
