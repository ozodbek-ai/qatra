import { Router } from "express";
import {
  createQuizController,
  submitQuizController,
  getQuizResultController,
  getQuizController,
  getAllQuizzesController,
  getAdminQuizController,
} from "../controllers/quiz.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createQuizController
);

router.post(
  "/:quizId/submit",
  authMiddleware,
  authorize("STUDENT"),
  submitQuizController
);
router.get(
  "/:quizId/result",
  authMiddleware,
  authorize("STUDENT", "ADMIN"),
  getQuizResultController
);
router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  getAllQuizzesController
);
router.get(
  "/admin/:quizId",
  authMiddleware,
  authorize("ADMIN"),
  getAdminQuizController
);
router.get(
  "/:quizId",
  authMiddleware,
  authorize("STUDENT", "ADMIN"),
  getQuizController
);

export default router;