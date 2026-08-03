import * as adminDashboardRepository from "../repositories/admin-dashboard.repository.js";

export const getDashboardOverview = async () => {

  const overview =
    await adminDashboardRepository.getOverview();

  const latestStudents =
    await adminDashboardRepository.getLatestStudents();

  let averageScore = 0;

  if (overview.quizAttempts.length > 0) {

    const totalPercentage =
      overview.quizAttempts.reduce(
        (sum, item) => {

          if (item.total === 0) {
            return sum;
          }

          return (
            sum +
            (item.score / item.total) * 100
          );

        },
        0
      );

    averageScore = Math.round(
      totalPercentage /
      overview.quizAttempts.length
    );
  }

  return {

    overview: {

      students: overview.students,

      admins: overview.admins,

      courses: overview.courses,

      lessons: overview.lessons,

      quizzes: overview.quizzes,

      enrollments: overview.enrollments,

      completedLessons:
        overview.completedLessons,

    },

    quiz: {

      attempts:
        overview.quizAttempts.length,

      averageScore,

    },

    latestStudents,

  };

};