export interface AdminDashboardResponse {
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