import * as dashboardRepository from "../repositories/dashboard.repository.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";
export const getDashboard = async (userId) => {
    const user = await dashboardRepository.getUserById(userId);
    if (!user) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }
    const [enrollments, completedLessons, certificates, lastViewedLesson,] = await Promise.all([
        dashboardRepository.getEnrollments(userId),
        dashboardRepository.countCompletedLessons(userId),
        dashboardRepository.countCertificates(userId),
        dashboardRepository.getLastViewedLesson(userId),
    ]);
    const completedCourses = enrollments.filter((item) => item.course.completions.length > 0).length;
    const averageProgress = enrollments.length === 0
        ? 0
        : Math.round(enrollments.reduce((sum, enrollment) => {
            const totalLessons = enrollment.course.lessons.length;
            if (totalLessons === 0) {
                return sum;
            }
            return (sum +
                (enrollment.course.completions
                    .length > 0
                    ? 100
                    : 0));
        }, 0) / enrollments.length);
    logger.info({
        message: "Dashboard loaded",
        userId,
        enrolledCourses: enrollments.length,
    });
    return {
        user,
        stats: {
            enrolledCourses: enrollments.length,
            completedCourses,
            completedLessons,
            certificates,
            averageProgress,
        },
        continueLearning: lastViewedLesson
            ? {
                courseId: lastViewedLesson.lesson
                    .course.id,
                courseTitle: lastViewedLesson.lesson
                    .course.title,
                lessonId: lastViewedLesson.lesson
                    .id,
                lessonTitle: lastViewedLesson.lesson
                    .title,
            }
            : null,
        recentCourses: enrollments.map((item) => ({
            id: item.course.id,
            title: item.course.title,
            slug: item.course.slug,
            imageUrl: item.course.imageUrl,
            totalLessons: item.course.lessons.length,
        })),
    };
};
