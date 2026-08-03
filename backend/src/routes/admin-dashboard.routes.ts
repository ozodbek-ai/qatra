import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { adminDashboardController } from "../controllers/admin-dashboard.controller.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  adminDashboardController
);

export default router;