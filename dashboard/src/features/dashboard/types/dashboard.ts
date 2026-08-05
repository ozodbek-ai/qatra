export interface DashboardResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  };

  stats: {
    enrolledCourses: number;
    completedCourses: number;
    completedLessons: number;
    certificates: number;
    averageProgress: number;
  };

  continueLearning: {
    courseId: string;
    courseTitle: string;
    lessonId: string;
    lessonTitle: string;
  } | null;

  recentCourses: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    totalLessons: number;
  }[];
}