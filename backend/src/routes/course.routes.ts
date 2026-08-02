import { Router } from "express";

import {
  getAllCoursesController,
  getCourseBySlugController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
} from "../controllers/course.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getAllCoursesController);

router.get("/:slug", getCourseBySlugController);

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createCourseController
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  updateCourseController
);
router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteCourseController
);

export default router;
