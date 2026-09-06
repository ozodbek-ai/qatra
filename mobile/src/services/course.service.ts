import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


export type Course = {
  id: string;

  title: string;

  slug: string;

  description?: string | null;

  thumbnailUrl?: string | null;

  imageUrl?: string | null;

  isPublished?: boolean;

  isActive?: boolean;

  createdAt?: string;

  updatedAt?: string;

  _count?: {
    lessons: number;
    enrollments?: number;
    reviews?: number;
  };
};


export type CourseLesson = {
  id: string;

  title: string;

  description?: string | null;

  videoUrl?: string | null;

  order?: number;

  duration?: number | null;
};


type ApiResponse<T> = {
  success: boolean;

  message?: string;

  data: T;
};


/**
 * Barcha published kurslarni olish
 */
export async function getCourses(): Promise<
  ApiResponse<Course[]>
> {
  const token =
    await getAccessToken();

  const response =
    await fetch(
      `${API_URL}/courses`,
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
        "Kurslarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/**
 * Bitta kursni slug orqali olish
 */
export async function getCourseBySlug(
  slug: string
) {
  const token =
    await getAccessToken();

  const response =
    await fetch(
      `${API_URL}/courses/${slug}`,
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
        "Kursni olishda xatolik yuz berdi."
    );
  }

  return result as ApiResponse<
    Course & {
      lessons?: CourseLesson[];
    }
  >;
}