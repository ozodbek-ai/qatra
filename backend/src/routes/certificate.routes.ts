import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  myCertificatesController,
  verifyCertificateController,
  certificatePdfController,
  adminCertificateStatisticsController
} from "../controllers/certificate.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get(
  "/verify/:certificateNo",
  verifyCertificateController
);

router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN"),
  adminCertificateStatisticsController
);

router.get(
  "/me",
  authMiddleware,
  myCertificatesController
);

router.get(
  "/:certificateId/pdf",
  authMiddleware,
  certificatePdfController
);

export default router;