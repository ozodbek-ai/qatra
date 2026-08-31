import { Router } from "express";
import {
  getChatUsersController,
  getConversationsController,
  createConversationController,
  getMessagesController,
  sendMessageController,
  markConversationAsReadController,
} from "../controllers/chat.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/users",
  getChatUsersController
);

router.get(
  "/conversations",
  getConversationsController
);

router.post(
  "/conversations",
  createConversationController
);

router.get(
  "/conversations/:id/messages",
  getMessagesController
);

router.post(
  "/conversations/:id/messages",
  sendMessageController
);

router.post(
  "/conversations/:id/read",
  markConversationAsReadController
);

export default router;