import { Router } from "express";
import { completeLessonController, getCourseProgressController, continueLearningController } from "../controllers/progress.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/:lessonId/complete", authMiddleware, completeLessonController);
router.get("/course/:courseId", authMiddleware, getCourseProgressController);
router.get("/continue/:courseId", authMiddleware, continueLearningController);
export default router;
