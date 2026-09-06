import type {
  NotificationType,
  Prisma,
} from "../generated/prisma/client.js";

import * as notificationRepository from
  "../repositories/notification.repository.js";

import { AppError } from "../utils/AppError.js";

import { io } from "../socket/socket.js";

/*
|--------------------------------------------------------------------------
| Create notification
|--------------------------------------------------------------------------
*/

export const createNotification = async (
  data: {
    userId: string;

    type: NotificationType;

    title: string;

    message: string;

    link?: string;

    metadata?: Prisma.InputJsonValue;
  }
) => {
  /*
   * Avval notification database'ga saqlanadi.
   */
  const notification =
    await notificationRepository.createNotification(
      data
    );

  /*
   * Keyin user online bo'lsa,
   * real-time notification yuboriladi.
   *
   * Har bir user:
   *
   * user:${userId}
   *
   * room'iga ulanadi.
   */
  if (io) {
    io.to(
      `user:${data.userId}`
    ).emit(
      "notification:new",
      notification
    );
  }

  return notification;
};

/*
|--------------------------------------------------------------------------
| Get notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = async (
  userId: string
) => {
  return notificationRepository.getNotifications(
    userId
  );
};

/*
|--------------------------------------------------------------------------
| Get unread count
|--------------------------------------------------------------------------
*/

export const getUnreadCount = async (
  userId: string
) => {
  return notificationRepository.getUnreadCount(
    userId
  );
};

/*
|--------------------------------------------------------------------------
| Mark one as read
|--------------------------------------------------------------------------
*/

export const markAsRead = async (
  userId: string,
  notificationId: string
) => {
  const result =
    await notificationRepository.markAsRead(
      notificationId,
      userId
    );

  /*
   * updateMany ishlatilgani uchun
   * count = 0 bo'lishi mumkin.
   *
   * Bu notification mavjud emasligini
   * yoki boshqa userniki ekanligini bildiradi.
   */
  if (result.count === 0) {
    throw new AppError(
      "Notification topilmadi.",
      404
    );
  }

  return result;
};

/*
|--------------------------------------------------------------------------
| Mark all as read
|--------------------------------------------------------------------------
*/

export const markAllAsRead = async (
  userId: string
) => {
  return notificationRepository.markAllAsRead(
    userId
  );
};