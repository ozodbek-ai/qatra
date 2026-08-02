import { Router } from "express";
import {
  registerController,
  loginController,
  meController
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { adminController } from "../controllers/auth.controller";


const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);
router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  adminController
);

export default router;