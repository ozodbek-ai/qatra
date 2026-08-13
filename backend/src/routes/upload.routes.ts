import { Router } from "express";

import {
  uploadVideoController,
  updateMyAvatarController,
} from "../controllers/upload.controller.js";

import {
  upload,
  uploadAvatarFile,
} from "../middlewares/upload.middleware.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import { authorize } from "../middlewares/authorize.middleware.js";


const router = Router();


router.post(
  "/video",
  authMiddleware,
  authorize("ADMIN"),
  upload.single("video"),
  uploadVideoController
);


router.post(
  "/profile/avatar",
  authMiddleware,
  uploadAvatarFile.single("avatar"),
  updateMyAvatarController
);


export default router;