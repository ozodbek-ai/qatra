import { Router } from "express";
import { createQuizController, submitQuizController, getQuizResultController, } from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const router = Router();
router.post("/", authMiddleware, authorize("ADMIN"), createQuizController);
router.post("/:quizId/submit", authMiddleware, authorize("STUDENT", "ADMIN"), submitQuizController);
router.get("/:quizId/result", authMiddleware, authorize("STUDENT", "ADMIN"), getQuizResultController);
export default router;
