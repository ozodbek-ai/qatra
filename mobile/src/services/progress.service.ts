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
  const token = await getAccessToken();

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
| COMPLETE LESSON
|--------------------------------------------------------------------------
*/

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
  const response = await fetch(
    `${API_URL}/progress/${lessonId}/complete`,
    {
      method: "POST",

      headers: await getHeaders(),
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


/*
|--------------------------------------------------------------------------
| COURSE PROGRESS
|--------------------------------------------------------------------------
*/

export type CourseProgress = {
  courseId: string;

  courseTitle: string;

  completedLessons: number;

  totalLessons: number;

  progress: number;
};


export async function getCourseProgress(
  courseId: string
): Promise<ApiResponse<CourseProgress>> {
  const response = await fetch(
    `${API_URL}/progress/course/${courseId}`,
    {
      method: "GET",

      headers: await getHeaders(),
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


/*
|--------------------------------------------------------------------------
| CONTINUE LEARNING
|--------------------------------------------------------------------------
|
| Backend:
|
| {
|   courseId,
|   courseTitle,
|   nextLesson
| }
|
*/

export type NextLesson = {
  id: string;

  title: string;

  description?: string | null;

  videoUrl?: string | null;

  order?: number;

  duration?: number | null;

  courseId?: string;
};


export type ContinueLearningResponse = {
  courseId: string;

  courseTitle: string;

  nextLesson: NextLesson | null;
};


export async function continueLearning(
  courseId: string
): Promise<ApiResponse<ContinueLearningResponse>> {
  const response = await fetch(
    `${API_URL}/progress/continue/${courseId}`,
    {
      method: "GET",

      headers: await getHeaders(),
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