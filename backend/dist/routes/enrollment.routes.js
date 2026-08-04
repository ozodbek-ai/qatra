import { Router } from "express";
import { enrollController, myCoursesController, } from "../controllers/enrollment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();
router.post("/", authMiddleware, enrollController);
router.get("/my-courses", authMiddleware, myCoursesController);
export default router;
