import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export interface AdminLesson {
  id: string;
  title: string;
  description?: string | null;
  videoUrl?: string | null;
  duration: number;
  order: number;
  isPreview: boolean;
  isPublished: boolean;
  courseId: string;

  course: {
    id: string;
    title: string;
  };

  quiz?: {
    id: string;
    title: string;
  } | null;
}

export async function getAllLessons() {
  const response =
    await api.get<ApiResponse<AdminLesson[]>>(
      "/lessons/admin/all"
    );

  return response.data.data;
}