import express from "express";
import { getLabsByHospital, registerLab } from "../storage/labs";

const router = express.Router();

router.get("/hospital/:hospitalId", async (req, res) => {
  const labs = await getLabsByHospital(req.params.hospitalId);
  res.json({ labs });
});

router.post("/", async (req, res) => {
  const lab = await registerLab(req.body);
  res.json({ lab });
});

export default router;
