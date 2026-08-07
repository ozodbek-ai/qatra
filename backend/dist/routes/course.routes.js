import { Router } from "express";
import { createCourseController, deleteCourseController, getAllCoursesController, getCourseBySlugController, publishCourseController, updateCourseController, getAdminCoursesController } from "../controllers/course.controller.js";
import { coursePlayerController } from "../controllers/player.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const router = Router();
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
router.get("/", getAllCoursesController);
/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
router.get("/:id/player", authMiddleware, coursePlayerController);
router.get("/:slug", getCourseBySlugController);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
router.post("/", authMiddleware, authorize("ADMIN"), createCourseController);
router.put("/:id", authMiddleware, authorize("ADMIN"), updateCourseController);
router.patch("/:id/publish", authMiddleware, authorize("ADMIN"), publishCourseController);
router.delete("/:id", authMiddleware, authorize("ADMIN"), deleteCourseController);
router.get("/admin/list", authMiddleware, authorize("ADMIN"), getAdminCoursesController);
export default router;
