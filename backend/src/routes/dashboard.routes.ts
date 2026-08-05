import { Router } from "express";

import { dashboardController } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  dashboardController
);

export default router;