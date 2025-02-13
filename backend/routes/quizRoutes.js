import express from "express";
import { 
    getQuizzesForUser, 
    getTeacherQuizzes, 
    getQuizQuestions, 
    submitAnswer 
} from "../controllers/quizController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Routes voor leerlingen (zien alleen quizzen die relevant zijn voor hun richting)
router.get("/student", authMiddleware, getQuizzesForUser);

// 🔹 Routes voor leerkrachten (zien enkel hun eigen quizzen)
router.get("/teacher", authMiddleware, getTeacherQuizzes);

// 🔹 Quizvragen ophalen
router.get("/:quizId/questions", authMiddleware, getQuizQuestions);

// 🔹 Antwoord indienen voor een vraag
router.post("/:quizId/answer", authMiddleware, submitAnswer);

export default router;
