import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};


export type CompletedCourse = {
  id: string;

  userId: string;

  courseId: string;

  completedAt: string;

  course: {
    id: string;

    title: string;

    slug: string;

    description?: string | null;

    thumbnailUrl?: string | null;

    imageUrl?: string | null;

    category?: string | null;
  };
};


export async function getCompletedCourses(): Promise<
  ApiResponse<CompletedCourse[]>
> {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/completions`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Tugatilgan kurslarni olishda xatolik yuz berdi."
    );
  }

  return result;
}