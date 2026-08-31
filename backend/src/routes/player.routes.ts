import { Router } from "express";
import { authorize } from "../middlewares/authorize.middleware.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  coursePlayerController,
  markLessonAsViewedController,
  addLessonViewDurationController,
  completeLessonController,
} from "../controllers/player.controller.js";

const router = Router();

router.get(
  "/:id",
  authMiddleware,
  authorize("STUDENT"),
  coursePlayerController
);

router.post(
  "/lessons/:lessonId/view",
  authMiddleware,
  authorize("STUDENT"),
  markLessonAsViewedController
);

router.post(
  "/lessons/view-duration",
  authMiddleware,
  authorize("STUDENT"),
  addLessonViewDurationController
);

router.post(
  "/lessons/:lessonId/complete",
  authMiddleware,
  authorize("STUDENT"),
  completeLessonController
);

export default router;