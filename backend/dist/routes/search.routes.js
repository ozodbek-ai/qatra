import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { globalSearchController } from "../controllers/search.controller.js";
const router = Router();
router.get("/", authMiddleware, authorize("ADMIN"), globalSearchController);
export default router;
