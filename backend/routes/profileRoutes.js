import express from "express";
import { getProfile } from "../controllers/profileController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getProfile);

export default router;
