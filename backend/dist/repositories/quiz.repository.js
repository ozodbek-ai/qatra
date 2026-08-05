import { prisma } from "../lib/prisma.js";
export const createQuiz = (data) => {
    return prisma.quiz.create({
        data,
    });
};
export const findQuizByLesson = (lessonId) => {
    return prisma.quiz.findUnique({
        where: {
            lessonId,
        },
    });
};
export const findQuizWithQuestions = (quizId) => {
    return prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            questions: {
                include: {
                    options: true,
                },
            },
        },
    });
};
export const createQuizAttempt = (userId, quizId, score, total, percentage, passed) => {
    return prisma.quizAttempt.create({
        data: {
            userId,
            quizId,
            score,
            total,
            percentage,
            passed,
        },
    });
};
export const findQuizAttempt = (userId, quizId) => {
    return prisma.quizAttempt.findFirst({
        where: {
            userId,
            quizId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const findQuizById = (quizId) => {
    return prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            questions: {
                include: {
                    options: {
                        select: {
                            id: true,
                            text: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
};
