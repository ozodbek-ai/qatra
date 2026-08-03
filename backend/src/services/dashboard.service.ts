import * as dashboardRepository from "../repositories/dashboard.repository.js";
import { AppError } from "../utils/AppError.js";

export const getDashboard = async (userId: string) => {
  const user = await dashboardRepository.getUserById(userId);

  if (!user) {
    throw new AppError("Foydalanuvchi topilmadi.", 404);
  }

  const enrollments =
    await dashboardRepository.getEnrollments(userId);

  const completedLessons =
    await dashboardRepository.countCompletedLessons(userId);

  return {
    user,
    stats: {
      enrolledCourses: enrollments.length,
      completedLessons,
    },
    recentCourses: enrollments.map((item) => ({
      id: item.course.id,
      title: item.course.title,
      slug: item.course.slug,
      imageUrl: item.course.imageUrl,
    })),
  };
};