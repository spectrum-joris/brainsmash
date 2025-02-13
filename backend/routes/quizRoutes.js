import express from "express";
import { getQuizzesForUser, getQuizQuestions, submitAnswer } from "../controllers/quizController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getQuizzesForUser);
router.get("/:quizId/questions", authMiddleware, getQuizQuestions);
router.post("/:quizId/answer", authMiddleware, submitAnswer);

export default router;
