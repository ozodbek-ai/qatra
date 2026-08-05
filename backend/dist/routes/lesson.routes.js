import { Router } from "express";
import { createLessonController, getLessonsByCourseController, getLessonByIdController, updateLessonController, deleteLessonController, } from "../controllers/lesson.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
const router = Router();
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
router.get("/course/:courseId", getLessonsByCourseController);
/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
router.get("/:id", authMiddleware, getLessonByIdController);
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
router.post("/", authMiddleware, authorize("ADMIN"), upload.single("video"), createLessonController);
router.put("/:id", authMiddleware, authorize("ADMIN"), upload.single("video"), updateLessonController);
router.delete("/:id", authMiddleware, authorize("ADMIN"), deleteLessonController);
export default router;
