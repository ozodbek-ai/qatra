import * as dashboardRepository from "../repositories/dashboard.repository.js";
import * as userRepository from "../repositories/user.repository.js";

import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

export const getDashboard = async (
  userId: string
) => {
  const user =
    await dashboardRepository.getUserById(
      userId
    );

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

const [
  enrollments,
  completedLessons,
  certificates,
  recommendedCourses,
] = await Promise.all([
  dashboardRepository.getEnrollments(
    userId
  ),

  dashboardRepository.countCompletedLessons(
    userId
  ),

  dashboardRepository.countCertificates(
    userId
  ),

  dashboardRepository.getRecommendedCourses(
    userId,
    6
  ),
]);

  /*
   * ==========================================
   * SANALAR
   * ==========================================
   */

  const now = new Date();

  /*
   * Bugunning boshlanishi.
   */
  const startOfToday = new Date(now);

  startOfToday.setHours(
    0,
    0,
    0,
    0
  );

  /*
   * Haftaning boshlanishi — Dushanba.
   *
   * JavaScript:
   * 0 = Yakshanba
   * 1 = Dushanba
   * ...
   * 6 = Shanba
   */

  const dayOfWeek =
    now.getDay();

  const daysFromMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1;

  const startOfWeek =
    new Date(startOfToday);

  startOfWeek.setDate(
    startOfToday.getDate() -
      daysFromMonday
  );

  /*
   * Oyning boshlanishi.
   */

  const startOfMonth =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

  /*
   * ==========================================
   * HAFTALIK LOGIN STATISTIKASI
   * ==========================================
   */

  const activityStats =
    await userRepository.getUserActivityStats(
      userId,
      startOfToday,
      startOfWeek,
      startOfMonth
    );

  /*
   * ==========================================
   * YAKUNLANGAN KURSLAR
   * ==========================================
   */

  const completedCourses =
    enrollments.filter(
      (item) =>
        item.course.completions.length > 0
    ).length;

  /*
   * ==========================================
   * O'RTACHA PROGRESS
   * ==========================================
   */

  const courseProgresses =
    enrollments.map((enrollment) => {
      const lessons =
        enrollment.course.lessons;

      if (lessons.length === 0) {
        return 0;
      }

      const completedCount =
        lessons.filter(
          (lesson) =>
            lesson.progress.length > 0
        ).length;

      return Math.round(
        (completedCount /
          lessons.length) *
          100
      );
    });

  const averageProgress =
    courseProgresses.length === 0
      ? 0
      : Math.round(
          courseProgresses.reduce(
            (sum, progress) =>
              sum + progress,
            0
          ) /
            courseProgresses.length
        );

  /*
   * ==========================================
   * CONTINUE LEARNING
   * ==========================================
   */

  let continueLearning:
    | {
        courseId: string;
        courseTitle: string;
        lessonId: string;
        lessonTitle: string;
      }
    | null = null;

  /*
   * Oxirgi ko'rilgan dars.
   */

  const lastViewedLesson =
    await dashboardRepository.getLastViewedLesson(
      userId
    );

  if (
    lastViewedLesson &&
    !lastViewedLesson.completed
  ) {
    const course =
      enrollments.find(
        (enrollment) =>
          enrollment.course.id ===
          lastViewedLesson.lesson.courseId
      );

    if (course) {
      continueLearning = {
        courseId:
          course.course.id,

        courseTitle:
          course.course.title,

        lessonId:
          lastViewedLesson.lesson.id,

        lessonTitle:
          lastViewedLesson.lesson.title,
      };
    }
  }

  /*
   * Agar oxirgi ko'rilgan dars tugagan
   * bo'lsa, keyingi tugallanmagan dars.
   */

  if (!continueLearning) {
    for (const enrollment of enrollments) {
      const nextLesson =
        await dashboardRepository.getNextLessonForCourse(
          userId,
          enrollment.course.id
        );

      if (nextLesson) {
        continueLearning = {
          courseId:
            enrollment.course.id,

          courseTitle:
            enrollment.course.title,

          lessonId:
            nextLesson.id,

          lessonTitle:
            nextLesson.title,
        };

        break;
      }
    }
  }

  /*
   * ==========================================
   * LOG
   * ==========================================
   */

  logger.info({
    message: "Dashboard loaded",

    userId,

    enrolledCourses:
      enrollments.length,

    completedCourses,

    completedLessons,

    certificates,

    averageProgress,

    loginDays:
      activityStats.loginDays,

    continueLearning,
  });

  /*
   * ==========================================
   * RESPONSE
   * ==========================================
   */

  return {
    user,

    stats: {
      enrolledCourses:
        enrollments.length,

      completedCourses,

      completedLessons,

      certificates,

      averageProgress,
    },

    /*
     * Student dashboard uchun
     * haftalik login indikator.
     */

    loginDays:
      activityStats.loginDays,

    continueLearning,
    recommendedCourses,

    recentCourses:
      enrollments.map((item) => {
        const lessons =
          item.course.lessons;

        const completedCount =
          lessons.filter(
            (lesson) =>
              lesson.progress.length > 0
          ).length;

        const progress =
          lessons.length === 0
            ? 0
            : Math.round(
                (completedCount /
                  lessons.length) *
                  100
              );

        return {
          id: item.course.id,

          title:
            item.course.title,

          slug:
            item.course.slug,

          imageUrl:
            item.course.imageUrl,

          totalLessons:
            lessons.length,

          completedLessons:
            completedCount,

          progress,
        };
      }),
  };
};