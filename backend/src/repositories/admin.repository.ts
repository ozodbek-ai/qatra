import { prisma } from "../lib/prisma.js";

export const countStudents = () => {
  return prisma.user.count({
    where: {
      role: "STUDENT",
    },
  });
};

export const countAdmins = () => {
  return prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });
};

export const countCourses = () => {
  return prisma.course.count();
};

export const countLessons = () => {
  return prisma.lesson.count();
};

export const countQuizzes = () => {
  return prisma.quiz.count();
};

export const countEnrollments = () => {
  return prisma.enrollment.count();
};

export const countCompletedLessons = () => {
  return prisma.lessonProgress.count({
    where: {
      completed: true,
    },
  });
};

export const countQuizAttempts = () => {
  return prisma.quizAttempt.count();
};

export const getAverageQuizScore = async () => {
  const result =
    await prisma.quizAttempt.aggregate({
      _avg: {
        percentage: true,
      },
    });

  return Math.round(
    result._avg.percentage ?? 0
  );
};

export const getLatestStudents = () => {
  return prisma.user.findMany({
    where: {
      role: "STUDENT",
    },

    select: {
      id: true,
      fullName: true,
      email: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 5,
  });
};