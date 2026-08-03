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
    quizAttempts,
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

    prisma.quizAttempt.findMany({
      select: {
        score: true,
        total: true,
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
    quizAttempts,
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
      createdAt: true,
    },
  });
};