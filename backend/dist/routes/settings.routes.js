import { Router } from "express";
import { getSettingsController, updateSettingsController, } from "../controllers/settings.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const router = Router();
router.get("/", authMiddleware, authorize("ADMIN"), getSettingsController);
router.put("/", authMiddleware, authorize("ADMIN"), updateSettingsController);
export default router;
