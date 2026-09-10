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
| ENROLL TO COURSE
|--------------------------------------------------------------------------
*/

export type Enrollment = {
  id: string;
  userId?: string;
  courseId?: string;
  enrolledAt: string;
};


export async function enrollToCourse(
  courseId: string
): Promise<ApiResponse<Enrollment>> {
  const response = await fetch(
    `${API_URL}/enrollments`,
    {
      method: "POST",

      headers: await getHeaders(),

      body: JSON.stringify({
        courseId,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Kursga yozilishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| MY COURSES
|--------------------------------------------------------------------------
|
| Backend response:
|
| {
|   id: enrollmentId,
|   enrolledAt,
|   course: {
|     id,
|     title,
|     slug,
|     ...
|   }
| }
|
*/

export type MyCourseReview = {
  rating: number;
};


export type MyCourseCompletion = {
  id: string;
  completedAt: string;
};


export type EnrolledCourse = {
  id: string;

  title: string;

  slug: string;

  description?: string | null;

  imageUrl?: string | null;

  price?: number;

  level?: string | null;

  isPublished?: boolean;

  totalLessons: number;

  completedLessons: number;

  progress: number;

  completions: MyCourseCompletion[];

  reviews: MyCourseReview[];
};


export type MyCourse = {
  id: string;

  enrolledAt: string;

  course: EnrolledCourse;
};


export async function getMyCourses(): Promise<
  ApiResponse<MyCourse[]>
> {
  const response = await fetch(
    `${API_URL}/enrollments/my-courses`,
    {
      method: "GET",

      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Mening kurslarimni olishda xatolik yuz berdi."
    );
  }

  return result;
}
