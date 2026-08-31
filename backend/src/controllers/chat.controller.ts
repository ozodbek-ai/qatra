import { asyncHandler } from "../utils/asyncHandler.js";
import * as chatService from "../services/chat.service.js";
import { AppError } from "../utils/AppError.js";

export const getChatUsersController =
  asyncHandler(async (req, res): Promise<void> => {
    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : undefined;

    const data =
      await chatService.getUsers(
        req.user!.userId,
        search
      );

    res.json({
      success: true,
      data,
    });
  });

export const getConversationsController =
  asyncHandler(async (req, res) => {
    const data =
      await chatService.getConversations(
        req.user!.userId
      );

    res.json({
      success: true,
      data,
    });
  });

export const createConversationController =
  asyncHandler(async (req, res) => {
    const otherUserId =
      req.body?.otherUserId;

    if (
      typeof otherUserId !== "string" ||
      !otherUserId
    ) {
      throw new AppError(
        "otherUserId kiritilishi kerak.",
        400
      );
    }

    const data =
      await chatService.createConversation(
        req.user!.userId,
        otherUserId
      );

    res.status(201).json({
      success: true,
      data,
    });
  });

export const getMessagesController =
  asyncHandler(async (req, res) => {
    const data =
      await chatService.getMessages(
        req.user!.userId,
        req.params.id as string
      );

    res.json({
      success: true,
      data,
    });
  });

export const sendMessageController =
  asyncHandler(async (req, res) => {
    const data =
      await chatService.sendMessage(
        req.user!.userId,
        req.params.id as string,
        {
          text: req.body?.text,
          reelId: req.body?.reelId,
        }
      );

    res.status(201).json({
      success: true,
      data,
    });
  });

export const markConversationAsReadController =
  asyncHandler(async (req, res) => {
    await chatService.markAsRead(
      req.user!.userId,
      req.params.id as string
    );

    res.json({
      success: true,
      message: "Suhbat o'qilgan deb belgilandi.",
      data: null,
    });
  });