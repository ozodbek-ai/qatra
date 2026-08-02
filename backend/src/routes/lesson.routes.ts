import { Router } from "express";
import { createLessonController } from "../controllers/lesson.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createLessonController
);

export default router;