import { Router } from "express";
import {
  getStudentsController,
  getStudentController,
} from "../controllers/student.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  authorize("ADMIN"),
  getStudentsController
);

router.get(
  "/:id",
  authMiddleware,
  authorize("ADMIN"),
  getStudentController
);

export default router;