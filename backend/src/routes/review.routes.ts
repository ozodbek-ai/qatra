import { Router } from "express";
import {
  createReviewController,
  getCourseReviewsController,
  updateReviewController,
  deleteReviewController,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/course/:courseId",
  getCourseReviewsController
);

router.post(
  "/",
  authMiddleware,
  createReviewController
);

router.put(
  "/:courseId",
  authMiddleware,
  updateReviewController
);

router.delete(
  "/:courseId",
  authMiddleware,
  deleteReviewController
);

export default router;