import * as chatRepository from "../repositories/chat.repository.js";

import { AppError } from "../utils/AppError.js";

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

export const getUsers = (
  userId: string,
  search?: string
) => {
  return chatRepository.findUsers(
    userId,
    search
  );
};

/*
|--------------------------------------------------------------------------
| Conversations
|--------------------------------------------------------------------------
*/

export const getConversations = async (
  userId: string
) => {
  const conversations =
    await chatRepository.getConversations(
      userId
    );

  const result = await Promise.all(
    conversations.map(
      async (conversation) => {
        const currentMember =
          conversation.members.find(
            (member) =>
              member.userId === userId
          );

        const otherMember =
          conversation.members.find(
            (member) =>
              member.userId !== userId
          );

        const unreadCount =
          await chatRepository.getUnreadMessageCount(
            conversation.id,
            userId,
            currentMember?.lastReadAt ?? null
          );

        return {
          id: conversation.id,

          createdAt:
            conversation.createdAt,

          updatedAt:
            conversation.updatedAt,

          otherUser:
            otherMember?.user ?? null,

          lastMessage:
            conversation.messages[0] ?? null,

          unreadCount,

          lastReadAt:
            currentMember?.lastReadAt ?? null,
        };
      }
    )
  );

  return result;
};

export const createConversation = async (
  userId: string,
  otherUserId: string
) => {
  if (userId === otherUserId) {
    throw new AppError(
      "O'zingiz bilan suhbat boshlay olmaysiz.",
      400
    );
  }

  const conversation =
    await chatRepository.findConversationBetweenUsers(
      userId,
      otherUserId
    );

  if (conversation) {
    return conversation;
  }

  return chatRepository.createConversation(
    userId,
    otherUserId
  );
};

/*
|--------------------------------------------------------------------------
| Messages
|--------------------------------------------------------------------------
*/

export const getMessages = async (
  userId: string,
  conversationId: string
) => {
  const conversation =
    await chatRepository.findUserConversation(
      conversationId,
      userId
    );

  if (!conversation) {
    throw new AppError(
      "Bu suhbatga kirish huquqingiz yo'q.",
      403
    );
  }

  return chatRepository.getMessages(
    conversationId
  );
};

export const sendMessage = async (
  userId: string,
  conversationId: string,
  data: {
    text?: string;
    reelId?: string;
  }
) => {
  const conversation =
    await chatRepository.findUserConversation(
      conversationId,
      userId
    );

  if (!conversation) {
    throw new AppError(
      "Bu suhbatga kirish huquqingiz yo'q.",
      403
    );
  }

  if (
    !data.text?.trim() &&
    !data.reelId
  ) {
    throw new AppError(
      "Xabar matni yoki Reel yuborilishi kerak.",
      400
    );
  }

  return chatRepository.createMessage({
    conversationId,

    senderId: userId,

    text: data.text?.trim(),

    reelId: data.reelId,
  });
};

/*
|--------------------------------------------------------------------------
| Read status
|--------------------------------------------------------------------------
*/

export const markAsRead = async (
  userId: string,
  conversationId: string
) => {
  const conversation =
    await chatRepository.findUserConversation(
      conversationId,
      userId
    );

  if (!conversation) {
    throw new AppError(
      "Bu suhbatga kirish huquqingiz yo'q.",
      403
    );
  }

  return chatRepository.markConversationAsRead(
    conversationId,
    userId
  );
};