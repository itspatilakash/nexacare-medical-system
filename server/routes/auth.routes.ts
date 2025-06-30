import express from "express";
import { sendOtp, verifyOtp, registerUser, login } from "../services/auth.service";

const router = express.Router();

router.post("/otp/send", sendOtp);
router.post("/otp/verify", verifyOtp);
router.post("/register", registerUser);
router.post("/login", login);

export default router;
