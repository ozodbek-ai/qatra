import { Router } from "express";

import {
  getUsersController,
  getUserController,
  updateUserRoleController,
  updateUserStatusController,
  getUserActivityStatsController,
  getMyProfileController,
  updateMyProfileController,
  updateMyAvatarController,
  changePasswordController,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/authorize.middleware.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(authMiddleware);


/*
|--------------------------------------------------------------------------
| CURRENT USER PROFILE
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  getMyProfileController
);

router.put(
  "/me",
  updateMyProfileController
);

router.put(
  "/me/avatar",
  upload.single("avatar"),
  updateMyAvatarController
);

router.put(
  "/me/password",
  changePasswordController
);


/*
|--------------------------------------------------------------------------
| ADMIN USERS
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authorize("ADMIN", "SUPER_ADMIN"),
  getUsersController
);

router.get(
  "/:id/activity-stats",
  authorize("ADMIN", "SUPER_ADMIN"),
  getUserActivityStatsController
);

router.get(
  "/:id",
  authorize("ADMIN", "SUPER_ADMIN"),
  getUserController
);

router.patch(
  "/:id/role",
  authorize("SUPER_ADMIN"),
  updateUserRoleController
);

router.patch(
  "/:id/status",
  authorize("ADMIN", "SUPER_ADMIN"),
  updateUserStatusController
);

export default router;