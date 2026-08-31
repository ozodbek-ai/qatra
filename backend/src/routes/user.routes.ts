import { Router } from "express";

import {
  getUsersController,
  getUserController,
  updateUserRoleController,
  updateUserStatusController,
  getUserActivityStatsController,
} from "../controllers/user.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

/*
 * Foydalanuvchilar bilan ishlash uchun
 * tizimga kirgan bo‘lish talab qilinadi.
 */
router.use(authMiddleware);

/*
 * Foydalanuvchilar ro‘yxatini ko‘rish
 * ADMIN va SUPER_ADMIN uchun ochiq.
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

/*
 * Bitta foydalanuvchini ko‘rish
 * ADMIN va SUPER_ADMIN uchun ochiq.
 */
router.get(
  "/:id",
  authorize("ADMIN", "SUPER_ADMIN"),
  getUserController
);

/*
 * Foydalanuvchi rolini o‘zgartirish
 * FAQAT SUPER_ADMIN uchun.
 */
router.patch(
  "/:id/role",
  authorize("SUPER_ADMIN"),
  updateUserRoleController
);

/*
 * Foydalanuvchini aktiv/deaktiv qilish.
 * Hozircha ADMIN va SUPER_ADMIN uchun.
 */
router.patch(
  "/:id/status",
  authorize("ADMIN", "SUPER_ADMIN"),
  updateUserStatusController
);

export default router;