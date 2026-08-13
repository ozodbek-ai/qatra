import { Router } from "express";

import {
  changePasswordController,
} from "../controllers/user.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.put(
  "/password",
  authMiddleware,
  changePasswordController
);

export default router;