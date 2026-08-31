import { api } from "@/lib/axios";

export interface CreateReviewData {
  courseId: string;
  rating: number;
  comment?: string;
}

export const createReview = async (
  data: CreateReviewData
) => {
  const response = await api.post(
    "/reviews",
    data
  );

  return response.data.data;
};