import * as adminDashboardRepository from "../repositories/admin-dashboard.repository.js";

export const getDashboardOverview = async () => {
  const [
    overview,
    quiz,
    latestStudents,
    latestEnrollments,
    courseStatistics,
  ] = await Promise.all([
    adminDashboardRepository.getOverview(),

    adminDashboardRepository.getQuizStatistics(),

    adminDashboardRepository.getLatestStudents(),

    adminDashboardRepository.getLatestEnrollments(),

    adminDashboardRepository.getCourseStatistics(),
  ]);

  const completionRate =
    overview.enrollments === 0
      ? 0
      : Math.round(
          (overview.completedCourses /
            overview.enrollments) *
            100
        );

  const quizPassRate =
    overview.quizAttempts === 0
      ? 0
      : Math.round(
          (overview.passedQuizAttempts /
            overview.quizAttempts) *
            100
        );

  return {
    overview: {
      students:
        overview.students,

      activeStudents:
        overview.activeStudents,

      admins:
        overview.admins,

      courses:
        overview.courses,

      lessons:
        overview.lessons,

      quizzes:
        overview.quizzes,

      enrollments:
        overview.enrollments,

      completedLessons:
        overview.completedLessons,

      completedCourses:
        overview.completedCourses,

      certificates:
        overview.certificates,
    },

    quiz: {
      attempts:
        overview.quizAttempts,

      passedAttempts:
        overview.passedQuizAttempts,

      averageScore:
        quiz.averageScore,

      passRate:
        quizPassRate,
    },

    completion: {
      completedCourses:
        overview.completedCourses,

      completionRate,
    },

    latestStudents,

    latestEnrollments,

    popularCourses:
      courseStatistics,
  };
};