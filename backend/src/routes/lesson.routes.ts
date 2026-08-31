import { Router } from "express";

import {
  createLessonController,
  getLessonsByCourseController,
  getLessonByIdController,
  updateLessonController,
  deleteLessonController,
  getAdminLessonsController,
  publishLessonController,
  getAllAdminLessonsController,
} from "../controllers/lesson.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public / Authenticated Student
|--------------------------------------------------------------------------
*/

router.get(
  "/course/:courseId",
  authMiddleware,
  getLessonsByCourseController
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
|
| ADMIN + SUPER_ADMIN:
| - darslarni ko'rish
| - dars yaratish
| - video joylash
| - darsni tahrirlash
| - publish qilish
|
| SUPER_ADMIN:
| - darsni o'chirish
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/all",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAllAdminLessonsController
);

router.get(
  "/admin/course/:courseId",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAdminLessonsController
);

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("video"),
  createLessonController
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("video"),
  updateLessonController
);

router.patch(
  "/:id/publish",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  publishLessonController
);

/*
 * Darsni o'chirish faqat SUPER_ADMIN uchun.
 */
router.delete(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  deleteLessonController
);

/*
|--------------------------------------------------------------------------
| Student / Authenticated User
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authMiddleware,
  getLessonByIdController
);

export default router;