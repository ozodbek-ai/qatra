import {
  REEL_CATEGORY_API_URL,
} from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";

export type ReelCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;

  _count?: {
    reels: number;
  };
};

export type Reel = {
  id: string;

  title: string;

  description?: string | null;

  videoUrl?: string | null;

  thumbnailUrl?: string | null;

  createdAt?: string;

  updatedAt?: string;

  likeCount: number;

  commentCount: number;

  likedByMe: boolean;

  category?: ReelCategory;
};

type CategoryReelsData = {
  category: ReelCategory;
  reels: Reel[];
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export async function getCategories(): Promise<
  ApiResponse<ReelCategory[]>
> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error(
      "Foydalanuvchi tizimga kirmagan."
    );
  }

  const response = await fetch(
    REEL_CATEGORY_API_URL,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export async function getCategoryReels(
  slug: string
): Promise<ApiResponse<CategoryReelsData>> {
  const token = await getAccessToken();

  if (!token) {
    throw new Error(
      "Foydalanuvchi tizimga kirmagan."
    );
  }

  const response = await fetch(
    `${REEL_CATEGORY_API_URL}/${slug}/reels`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Darslarni olishda xatolik yuz berdi."
    );
  }

  return result as ApiResponse<CategoryReelsData>;
}