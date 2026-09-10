import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


export type Lesson = {
  id: string;

  title: string;

  description?: string | null;

  videoUrl?: string | null;

  order?: number;

  duration?: number | null;

  courseId?: string;

  quiz?: {
    id: string;
    title: string;
  } | null;

  course?: {
    id: string;

    title: string;

    slug: string;
  };
};


type ApiResponse<T> = {
  success: boolean;

  message?: string;

  data: T;
};


export async function getLessonById(
  id: string
): Promise<ApiResponse<Lesson>> {
  const token =
    await getAccessToken();

  const response =
    await fetch(
      `${API_URL}/lessons/${id}`,
      {
        method: "GET",

        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Darsni olishda xatolik yuz berdi."
    );
  }

  return result;
}

export async function getLessonsByCourse(
  courseId: string
): Promise<ApiResponse<Lesson[]>> {
  const token =
    await getAccessToken();

  const response =
    await fetch(
      `${API_URL}/lessons/course/${courseId}`,
      {
        method: "GET",

        headers: {
          "Content-Type":
            "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Darslarni olishda xatolik yuz berdi."
    );
  }

  return result;
}