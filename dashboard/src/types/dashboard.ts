export interface DashboardData {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    avatarUrl: string | null;
  };

  stats: {
    enrolledCourses: number;
    completedCourses: number;
    completedLessons: number;
    certificates: number;
    averageProgress: number;
  };

  loginDays: {
    date: string;
    dayIndex: number;
    day: string;
    loggedIn: boolean;
  }[];

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
    imageUrl: string | null;
    totalLessons: number;
    completedLessons: number;
    progress: number;
  }[];

  recommendedCourses: {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  price: number;
  duration: number | null;
  level: string;
  totalLessons: number;
  averageRating: number;
  enrollmentCount: number;
}[];
}