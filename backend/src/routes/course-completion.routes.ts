import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCompletedCoursesController } from "../controllers/course-completion.controller.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getCompletedCoursesController
);

export default router;