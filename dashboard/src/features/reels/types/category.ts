export interface ReelCategory {
  id: string;

  name: string;

  slug: string;

  description: string | null;

  imageUrl: string | null;

  createdAt: string;

  updatedAt: string;

  _count?: {
    reels: number;
  };
}