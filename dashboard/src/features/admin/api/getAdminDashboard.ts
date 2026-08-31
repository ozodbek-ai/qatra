import { api } from "@/lib/axios";

export interface AdminDashboardStudent {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AdminDashboardEnrollment {
  id: string;
  enrolledAt: string;

  user: {
    id: string;
    fullName: string;
    email: string;
  };

  course: {
    id: string;
    title: string;
  };
}

export interface AdminDashboardCourse {
  id: string;
  title: string;

  _count: {
    enrollments: number;
    completions: number;
    reviews: number;
  };
}

export interface AdminDashboardData {
  overview: {
    students: number;
    activeStudents: number;
    admins: number;
    courses: number;
    lessons: number;
    quizzes: number;
    enrollments: number;
    completedLessons: number;
    completedCourses: number;
    certificates: number;
  };

  quiz: {
    attempts: number;
    passedAttempts: number;
    averageScore: number;
    passRate: number;
  };

  completion: {
    completedCourses: number;
    completionRate: number;
  };

  latestStudents: AdminDashboardStudent[];

  latestEnrollments: AdminDashboardEnrollment[];

  popularCourses: AdminDashboardCourse[];
}

export const getAdminDashboard =
  async (): Promise<AdminDashboardData> => {
    const response = await api.get<{
      success: boolean;
      data: AdminDashboardData;
    }>("/admin/dashboard");

    return response.data.data;
  };