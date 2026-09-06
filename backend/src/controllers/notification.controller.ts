import { asyncHandler } from "../utils/asyncHandler.js";

import * as notificationService from
  "../services/notification.service.js";


/*
|--------------------------------------------------------------------------
| Get notifications
|--------------------------------------------------------------------------
*/

export const getNotificationsController =
  asyncHandler(async (req, res) => {
    const data =
      await notificationService.getNotifications(
        req.user!.userId
      );

    res.json({
      success: true,
      data,
    });
  });


/*
|--------------------------------------------------------------------------
| Get unread count
|--------------------------------------------------------------------------
*/

export const getUnreadCountController =
  asyncHandler(async (req, res) => {
    const count =
      await notificationService.getUnreadCount(
        req.user!.userId
      );

    res.json({
      success: true,
      data: {
        count,
      },
    });
  });


/*
|--------------------------------------------------------------------------
| Mark notification as read
|--------------------------------------------------------------------------
*/

export const markNotificationAsReadController =
  asyncHandler(async (req, res) => {
    const data =
      await notificationService.markAsRead(
        req.user!.userId,
        req.params.id as string
      );

    res.json({
      success: true,
      data,
    });
  });


/*
|--------------------------------------------------------------------------
| Mark all notifications as read
|--------------------------------------------------------------------------
*/

export const markAllNotificationsAsReadController =
  asyncHandler(async (req, res) => {
    const data =
      await notificationService.markAllAsRead(
        req.user!.userId
      );

    res.json({
      success: true,
      data,
    });
  });