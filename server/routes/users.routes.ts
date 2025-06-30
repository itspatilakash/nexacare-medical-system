import express from "express";
import { getUserByPhone, getUserById } from "../storage/users";

const router = express.Router();

router.get("/phone/:phone", async (req, res) => {
  const user = await getUserByPhone(req.params.phone);
  res.json({ user });
});

router.get("/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json({ user });
});

export default router;
