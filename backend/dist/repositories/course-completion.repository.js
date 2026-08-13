import { prisma } from "../lib/prisma.js";
export const findCompletion = (userId, courseId) => {
    return prisma.courseCompletion.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
};
export const createCompletion = (userId, courseId) => {
    return prisma.courseCompletion.create({
        data: {
            userId,
            courseId,
        },
    });
};
export const getCompletedCourses = (userId) => {
    return prisma.courseCompletion.findMany({
        where: {
            userId,
        },
        include: {
            course: true,
        },
        orderBy: {
            completedAt: "desc",
        },
    });
};
export const getCourseQuizzes = (courseId) => {
    return prisma.quiz.findMany({
        where: {
            lesson: {
                courseId,
            },
        },
        select: {
            id: true,
        },
    });
};
export const getPassedQuizCount = async (userId, quizIds) => {
    const passedQuizzes = await prisma.quizAttempt.findMany({
        where: {
            userId,
            quizId: {
                in: quizIds,
            },
            passed: true,
        },
        select: {
            quizId: true,
        },
        distinct: ["quizId"],
    });
    return passedQuizzes.length;
};
