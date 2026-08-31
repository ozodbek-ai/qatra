import { prisma } from "../lib/prisma.js";

export const getOverview = async () => {
  const [
    students,
    admins,
    courses,
    lessons,
    quizzes,
    enrollments,
    completedLessons,
    completedCourses,
    certificates,
    activeStudents,
    quizAttempts,
    passedQuizAttempts,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.course.count(),

    prisma.lesson.count(),

    prisma.quiz.count(),

    prisma.enrollment.count(),

    prisma.lessonProgress.count({
      where: {
        completed: true,
      },
    }),

    prisma.courseCompletion.count(),

    prisma.certificate.count(),

    prisma.user.count({
      where: {
        role: "STUDENT",
        isActive: true,
      },
    }),

    prisma.quizAttempt.count(),

    prisma.quizAttempt.count({
      where: {
        passed: true,
      },
    }),
  ]);

  return {
    students,
    admins,
    courses,
    lessons,
    quizzes,
    enrollments,
    completedLessons,
    completedCourses,
    certificates,
    activeStudents,
    quizAttempts,
    passedQuizAttempts,
  };
};

export const getQuizStatistics = async () => {
  const result =
    await prisma.quizAttempt.aggregate({
      _avg: {
        percentage: true,
      },
    });

  return {
    averageScore: Math.round(
      result._avg.percentage ?? 0
    ),
  };
};

export const getLatestStudents = () => {
  return prisma.user.findMany({
    where: {
      role: "STUDENT",
    },

    take: 5,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
};

export const getLatestEnrollments = () => {
  return prisma.enrollment.findMany({
    take: 5,

    orderBy: {
      enrolledAt: "desc",
    },

    select: {
      id: true,
      enrolledAt: true,

      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },

      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

export const getCourseStatistics = () => {
  return prisma.course.findMany({
    orderBy: {
      enrollments: {
        _count: "desc",
      },
    },

    take: 5,

    select: {
      id: true,
      title: true,

      _count: {
        select: {
          enrollments: true,
          completions: true,
          reviews: true,
        },
      },
    },
  });
};