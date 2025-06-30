import express from "express";
import { getAllHospitals, registerHospital } from "../storage/hospitals";

const router = express.Router();

router.get("/", async (req, res) => {
  const hospitals = await getAllHospitals();
  res.json({ hospitals });
});

router.post("/", async (req, res) => {
  const hospital = await registerHospital(req.body);
  res.json({ hospital });
});

export default router;
