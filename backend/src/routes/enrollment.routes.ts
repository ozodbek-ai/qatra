import { Router } from "express";

import {
  enrollController,
  myCoursesController,
  getAllEnrollmentsController,
} from "../controllers/enrollment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

/*
  Student routes
*/

router.post(
  "/",
  authMiddleware,
  enrollController
);

router.get(
  "/my-courses",
  authMiddleware,
  myCoursesController
);

/*
  Admin routes
*/

router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  getAllEnrollmentsController
);

export default router;