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

export type ReelCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};


export type Reel = {
  id: string;

  title: string;

  description?: string | null;

  videoUrl: string;

  thumbnailUrl?: string | null;

  isPublished: boolean;

  createdAt: string;

  updatedAt?: string;

  category?: ReelCategory | null;

  likeCount: number;

  commentCount: number;

  likedByMe: boolean;
};


export type ReelLikeResult = {
  liked: boolean;
  likeCount: number;
};


export type ReelCommentUser = {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
};


export type ReelComment = {
  id: string;

  text: string;

  createdAt: string;

  userId?: string;

  reelId?: string;

  user: ReelCommentUser;
};


/*
|--------------------------------------------------------------------------
| GET PUBLISHED REELS
|--------------------------------------------------------------------------
*/

export async function getReels(): Promise<
  ApiResponse<Reel[]>
> {
  const response = await fetch(
    `${API_URL}/reels`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Reelslarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| GET REEL BY ID
|--------------------------------------------------------------------------
*/

export async function getReelById(
  reelId: string
): Promise<ApiResponse<Reel>> {
  const response = await fetch(
    `${API_URL}/reels/${reelId}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Reelni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| GET CATEGORIES
|--------------------------------------------------------------------------
*/

export async function getReelCategories(): Promise<
  ApiResponse<ReelCategory[]>
> {
  const response = await fetch(
    `${API_URL}/reels/categories`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Kategoriyalarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| GET CATEGORY REELS
|--------------------------------------------------------------------------
|
| Backend:
|
| GET /reels/categories/:slug
|
| Response:
|
| {
|   success: true,
|   data: {
|     category: {...},
|     reels: [...]
|   }
| }
|
*/

export type CategoryReelsData = {
  category: ReelCategory;
  reels: Reel[];
};


export async function getCategoryReels(
  slug: string
): Promise<ApiResponse<CategoryReelsData>> {
  const response = await fetch(
    `${API_URL}/reels/categories/${slug}`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Kategoriya reelslarini olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| LIKE / UNLIKE
|--------------------------------------------------------------------------
*/

export async function toggleReelLike(
  reelId: string
): Promise<ApiResponse<ReelLikeResult>> {
  const response = await fetch(
    `${API_URL}/reels/${reelId}/like`,
    {
      method: "POST",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Like qilishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| GET COMMENTS
|--------------------------------------------------------------------------
*/

export async function getReelComments(
  reelId: string
): Promise<ApiResponse<ReelComment[]>> {
  const response = await fetch(
    `${API_URL}/reels/${reelId}/comments`,
    {
      method: "GET",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Izohlarni olishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| CREATE COMMENT
|--------------------------------------------------------------------------
|
| Backend payload:
|
| {
|   text: "..."
| }
|
*/

export async function createReelComment(
  reelId: string,
  text: string
): Promise<ApiResponse<ReelComment>> {
  const response = await fetch(
    `${API_URL}/reels/${reelId}/comments`,
    {
      method: "POST",
      headers: await getHeaders(),

      body: JSON.stringify({
        text,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Izoh yuborishda xatolik yuz berdi."
    );
  }

  return result;
}


/*
|--------------------------------------------------------------------------
| DELETE COMMENT
|--------------------------------------------------------------------------
*/

export async function deleteReelComment(
  reelId: string,
  commentId: string
): Promise<ApiResponse<null>> {
  const response = await fetch(
    `${API_URL}/reels/${reelId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: await getHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Izohni o'chirishda xatolik yuz berdi."
    );
  }

  return result;
}