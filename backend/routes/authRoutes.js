import express from "express";
import { register, login, getUserRole } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/role", authMiddleware, getUserRole);

export default router;
