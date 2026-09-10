import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


export type NotificationType =
  | "CHAT_MESSAGE"
  | string;


export type Notification = {
  id: string;

  userId: string;

  type: NotificationType;

  title: string;

  message: string;

  link?: string | null;

  metadata?: unknown;

  isRead: boolean;

  readAt?: string | null;

  createdAt: string;
};


type ApiResponse<T> = {
  success: boolean;

  message?: string;

  data: T;
};


async function getHeaders() {
  const token =
    await getAccessToken();

  return {
    "Content-Type":
      "application/json",

    ...(token
      ? {
          Authorization:
            `Bearer ${token}`,
        }
      : {}),
  };
}


/*
|--------------------------------------------------------------------------
| GET NOTIFICATIONS
|--------------------------------------------------------------------------
*/

export async function getNotifications(): Promise<
  ApiResponse<Notification[]>
> {
  const response =
    await fetch(
      `${API_URL}/notifications`,
      {
        method: "GET",

        headers:
          await getHeaders(),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Notificationlarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| GET UNREAD COUNT
|--------------------------------------------------------------------------
*/

export async function getUnreadNotificationCount(): Promise<
  ApiResponse<{
    count: number;
  }>
> {
  const response =
    await fetch(
      `${API_URL}/notifications/unread-count`,
      {
        method: "GET",

        headers:
          await getHeaders(),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "O'qilmagan notificationlar sonini olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| MARK ONE AS READ
|--------------------------------------------------------------------------
*/

export async function markNotificationAsRead(
  notificationId: string
): Promise<
  ApiResponse<unknown>
> {
  const response =
    await fetch(
      `${API_URL}/notifications/${notificationId}/read`,
      {
        method: "PATCH",

        headers:
          await getHeaders(),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Notificationni o'qilgan deb belgilashda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| MARK ALL AS READ
|--------------------------------------------------------------------------
*/

export async function markAllNotificationsAsRead(): Promise<
  ApiResponse<unknown>
> {
  const response =
    await fetch(
      `${API_URL}/notifications/read-all`,
      {
        method: "PATCH",

        headers:
          await getHeaders(),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Notificationlarni o'qilgan deb belgilashda xatolik yuz berdi."
    );
  }

  return result;
}