import { Router } from "express";
import {
  completeLessonController,
  getCourseProgressController,
  continueLearningController,
  getAllProgressController,
} from "../controllers/progress.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/:lessonId/complete",
  authMiddleware,
  completeLessonController
);
router.get(
  "/course/:courseId",
  authMiddleware,
  getCourseProgressController
);
router.get(
  "/continue/:courseId",
  authMiddleware,
  continueLearningController
);
router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  getAllProgressController
);

export default router;