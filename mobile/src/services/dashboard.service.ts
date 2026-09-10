import { API_URL } from "@/constants/api";

import {
  getAccessToken,
} from "@/services/storage.service";


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};


export type DashboardUser = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  avatarUrl: string | null;
};


export type DashboardStats = {
  enrolledCourses: number;
  completedCourses: number;
  completedLessons: number;
  certificates: number;
  averageProgress: number;
};


export type ContinueLearning = {
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
} | null;


export type RecommendedCourse = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
};


export type RecentCourse = {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  totalLessons: number;
  completedLessons: number;
  progress: number;
};


export type DashboardData = {
  user: DashboardUser;

  stats: DashboardStats;

  loginDays: number;

  continueLearning: ContinueLearning;

  recommendedCourses: RecommendedCourse[];

  recentCourses: RecentCourse[];
};


export async function getDashboard(): Promise<
  ApiResponse<DashboardData>
> {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_URL}/dashboard`,
    {
      method: "GET",

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Dashboard ma'lumotlarini olishda xatolik yuz berdi."
    );
  }

  return result;
}