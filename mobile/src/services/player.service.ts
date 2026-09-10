import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};


async function getHeaders() {
  const token =
    await getAccessToken();

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}


/*
|--------------------------------------------------------------------------
| LESSON VIEW
|--------------------------------------------------------------------------
*/

export type LessonViewData = {
  lessonId: string;
  activityId: string;
};


export async function markLessonAsViewed(
  lessonId: string
): Promise<ApiResponse<LessonViewData>> {
  const response = await fetch(
    `${API_URL}/player/lessons/${lessonId}/view`,
    {
      method: "POST",

      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Dars ko'rilganini saqlashda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| LESSON VIEW DURATION
|--------------------------------------------------------------------------
*/

export type LessonViewDurationData = {
  activityId: string;
  durationSeconds: number;
};


export async function addLessonViewDuration(
  activityId: string,
  durationSeconds: number
): Promise<ApiResponse<LessonViewDurationData>> {
  const response = await fetch(
    `${API_URL}/player/lessons/view-duration`,
    {
      method: "POST",

      headers: await getHeaders(),

      body: JSON.stringify({
        activityId,
        durationSeconds,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Dars ko'rish vaqtini saqlashda xatolik yuz berdi."
    );
  }

  return result;
}