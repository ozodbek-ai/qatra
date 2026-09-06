import { prisma } from "../lib/prisma.js";

import type {
  NotificationType,
  Prisma,
} from "../generated/prisma/client.js";

/*
|--------------------------------------------------------------------------
| Create notification
|--------------------------------------------------------------------------
*/

export const createNotification = (
  data: {
    userId: string;

    type: NotificationType;

    title: string;

    message: string;

    link?: string;

    metadata?: Prisma.InputJsonValue;
  }
) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,

      type: data.type,

      title: data.title,

      message: data.message,

      link: data.link,

      metadata: data.metadata,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Get notifications
|--------------------------------------------------------------------------
*/

export const getNotifications = (
  userId: string
) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 50,
  });
};

/*
|--------------------------------------------------------------------------
| Get unread count
|--------------------------------------------------------------------------
*/

export const getUnreadCount = (
  userId: string
) => {
  return prisma.notification.count({
    where: {
      userId,

      isRead: false,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Mark one notification as read
|--------------------------------------------------------------------------
*/

export const markAsRead = (
  notificationId: string,
  userId: string
) => {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,

      userId,
    },

    data: {
      isRead: true,

      readAt: new Date(),
    },
  });
};

/*
|--------------------------------------------------------------------------
| Mark all notifications as read
|--------------------------------------------------------------------------
*/

export const markAllAsRead = (
  userId: string
) => {
  return prisma.notification.updateMany({
    where: {
      userId,

      isRead: false,
    },

    data: {
      isRead: true,

      readAt: new Date(),
    },
  });
};