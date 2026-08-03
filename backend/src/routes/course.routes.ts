import { Router } from "express";

import {
  getAllCoursesController,
  getCourseBySlugController,
  createCourseController,
  updateCourseController,
  deleteCourseController,
} from "../controllers/course.controller.js";

import { coursePlayerController } from "../controllers/player.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

// Barcha kurslar
router.get("/", getAllCoursesController);

// Course Player (/:slug dan OLDIN turishi shart)
router.get(
  "/:id/player",
  authMiddleware,
  coursePlayerController
);

// Bitta kurs (slug bo'yicha)
router.get("/:slug", getCourseBySlugController);

// Kurs yaratish
router.post(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  createCourseController
);

// Kursni yangilash
router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  updateCourseController
);

// Kursni o'chirish
router.delete(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  deleteCourseController
);

export default router;