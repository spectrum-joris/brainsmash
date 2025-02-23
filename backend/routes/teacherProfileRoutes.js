import express from "express";
import { getTeacherProfile } from "../controllers/teacherProfileController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTeacherProfile);

export default router;
