import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  myCertificatesController,
  verifyCertificateController,
} from "../controllers/certificate.controller.js";

const router = Router();

router.get(
  "/me",
  authMiddleware,
  myCertificatesController
);

router.get(
  "/verify/:certificateNo",
  verifyCertificateController
);

export default router;