import { Router } from "express";
import {
  createQuestionController,
  getQuestionController,
  getQuestionsByQuizController,
  updateQuestionController,
  deleteQuestionController,
} from "../controllers/question.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createQuestionController
);
router.get(
  "/quiz/:quizId",
  authMiddleware,
  authorize("ADMIN"),
  getQuestionsByQuizController
);

router.get(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  getQuestionController
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  updateQuestionController
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteQuestionController
);

export default router;