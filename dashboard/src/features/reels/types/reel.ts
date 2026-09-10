import type {
  ReelCategory,
} from "./category";

export type {
  ReelCategory,
} from "./category";

export interface ReelUser {
  id: string;

  fullName: string;

  avatarUrl: string | null;
}

export interface Reel {
  id: string;

  title: string;

  description: string | null;

  videoUrl: string;

  thumbnailUrl: string | null;

  isPublished: boolean;

  categoryId: string | null;

  category: ReelCategory | null;

  createdAt: string;

  updatedAt: string;

  likeCount: number;

  commentCount: number;

  likedByMe: boolean;
}

export interface ReelComment {
  id: string;

  text: string;

  createdAt: string;

  updatedAt: string;

  user: ReelUser;
}