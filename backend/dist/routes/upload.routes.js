import { Router } from "express";
import { uploadVideoController } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const router = Router();
router.post("/video", authMiddleware, authorize("ADMIN"), upload.single("video"), uploadVideoController);
export default router;
