import { Router } from "express";
import {
  registerController,
  loginController,
  meController,
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { adminController } from "../controllers/auth.controller.js";


const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post(
  "/forgot-password",
  forgotPasswordController,
);

router.post(
  "/reset-password",
  resetPasswordController,
);
router.get("/me", authMiddleware, meController);
router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  adminController
);

export default router;