import { api } from "@/lib/axios";

export interface AdminDashboardData {
  overview: {
    students: number;
    admins: number;
    courses: number;
    lessons: number;
    quizzes: number;
    enrollments: number;
    completedLessons: number;
  };

  quiz: {
    attempts: number;
    averageScore: number;
  };

  latestStudents: {
    id: string;
    fullName: string;
    email: string;
    createdAt: string;
  }[];
}

export const getAdminDashboard =
  async (): Promise<AdminDashboardData> => {
    const response = await api.get<{
      success: boolean;
      data: AdminDashboardData;
    }>("/admin/dashboard");

    return response.data.data;
  };