import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};


export type LessonProgress = {
  id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string | null;
  lastViewedAt?: string | null;
};


export async function completeLesson(
  lessonId: string
): Promise<ApiResponse<LessonProgress>> {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/progress/${lessonId}/complete`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Darsni yakunlashda xatolik yuz berdi."
    );
  }

  return result;
}


export async function getCourseProgress(
  courseId: string
) {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/progress/course/${courseId}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Kurs progressini olishda xatolik yuz berdi."
    );
  }

  return result;
}


export async function continueLearning(
  courseId: string
) {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/progress/continue/${courseId}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization:
                `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Keyingi darsni olishda xatolik yuz berdi."
    );
  }

  return result;
}