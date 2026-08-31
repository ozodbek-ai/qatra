import { Router } from "express";

import {
  createCourseController,
  deleteCourseController,
  getAllCoursesController,
  getCourseBySlugController,
  publishCourseController,
  updateCourseController,
  getAdminCoursesController,
  getAdminCourseByIdController,
  updateCourseActiveStatusController
} from "../controllers/course.controller.js";

import { optionalAuthMiddleware } from "../middlewares/optionalAuth.middleware.js";

import { coursePlayerController } from "../controllers/player.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

/*
 * Public Routes
 */

router.get(
  "/",
  getAllCoursesController
);

/*
 * Admin Routes
 *
 * ADMIN va SUPER_ADMIN kurslarni
 * ko'rishi mumkin.
 *
 * MUHIM:
 * /admin/list route /:slug dan OLDIN
 * turishi kerak.
 */

router.get(
  "/admin/list",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAdminCoursesController
);

router.get(
  "/admin/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAdminCourseByIdController
);

/*
 * Protected Course Player
 */

router.get(
  "/:id/player",
  authMiddleware,
  coursePlayerController
);

/*
 * Public Course Detail
 */

router.get(
  "/:slug",
  optionalAuthMiddleware,
  getCourseBySlugController
);

/*
 * Admin Course Management
 *
 * ADMIN + SUPER_ADMIN:
 * - kurs yaratish
 * - kursni tahrirlash
 * - kursni publish qilish
 */

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  createCourseController
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateCourseController
);

router.patch(
  "/:id/publish",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  publishCourseController
);

router.patch(
  "/:id/active",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  updateCourseActiveStatusController
);

/*
 * Course deletion
 *
 * FAQAT SUPER_ADMIN.
 *
 * Oddiy ADMIN kursni o'chira olmaydi.
 */

router.delete(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  deleteCourseController
);

export default router;