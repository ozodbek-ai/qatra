import { Router } from "express";

import {
  getNotificationsController,
  getUnreadCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from "../controllers/notification.controller.js";

import { authMiddleware } from
  "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  getNotificationsController
);

router.get(
  "/unread-count",
  getUnreadCountController
);

router.patch(
  "/read-all",
  markAllNotificationsAsReadController
);

router.patch(
  "/:id/read",
  markNotificationAsReadController
);

export default router;