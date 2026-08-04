import { Router } from "express";
import { statisticsController } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const router = Router();
router.get("/statistics", authMiddleware, authorize("ADMIN"), statisticsController);
export default router;
