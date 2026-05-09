import express from "express";
const router = express.Router();
import authController from "../controllers/authController.js";
import { verifyRecaptcha } from "../middleware/recaptcha.js";

router.post("/register", verifyRecaptcha, authController.register);

export default router;
