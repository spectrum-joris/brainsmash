import express from "express";
import { createQuiz } from "../controllers/createQuizController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createQuiz);

export default router;
