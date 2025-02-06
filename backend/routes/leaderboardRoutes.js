import express from "express";
import { getLeaderboard, getUserRanking } from "../controllers/leaderboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getLeaderboard);
router.get("/ranking", authMiddleware, getUserRanking);

export default router;
