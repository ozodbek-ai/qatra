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
| TYPES
|--------------------------------------------------------------------------
*/

export type ReviewUser = {
  id: string;
  fullName: string;
  avatar?: string | null;
  avatarUrl?: string | null;
};


export type Review = {
  id: string;

  rating: number;

  comment?: string | null;

  createdAt: string;

  updatedAt?: string;

  user: ReviewUser;
};


export type CreateReviewPayload = {
  courseId: string;

  rating: number;

  comment?: string;
};


export type UpdateReviewPayload = {
  rating: number;

  comment?: string;
};


/*
|--------------------------------------------------------------------------
| GET COURSE REVIEWS
|--------------------------------------------------------------------------
*/

export async function getCourseReviews(
  courseId: string
): Promise<ApiResponse<Review[]>> {

  const response = await fetch(
    `${API_URL}/reviews/course/${courseId}`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Reviewlarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| CREATE REVIEW
|--------------------------------------------------------------------------
*/

export async function createReview(
  payload: CreateReviewPayload
): Promise<ApiResponse<Review>> {

  const response = await fetch(
    `${API_URL}/reviews`,
    {
      method: "POST",

      headers: await getHeaders(),

      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Review yaratishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| UPDATE REVIEW
|--------------------------------------------------------------------------
*/

export async function updateReview(
  courseId: string,
  payload: UpdateReviewPayload
): Promise<ApiResponse<Review>> {

  const response = await fetch(
    `${API_URL}/reviews/${courseId}`,
    {
      method: "PUT",

      headers: await getHeaders(),

      body: JSON.stringify(payload),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Review yangilashda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| DELETE REVIEW
|--------------------------------------------------------------------------
*/

export async function deleteReview(
  courseId: string
): Promise<{
  success: boolean;
  message?: string;
}> {

  const response = await fetch(
    `${API_URL}/reviews/${courseId}`,
    {
      method: "DELETE",

      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Reviewni o'chirishda xatolik yuz berdi."
    );
  }

  return result;
}