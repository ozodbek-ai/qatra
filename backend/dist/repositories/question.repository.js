import { prisma } from "../lib/prisma.js";
export const createQuestion = (data) => {
    return prisma.question.create({
        data: {
            quizId: data.quizId,
            question: data.question,
            options: {
                create: data.options,
            },
        },
        include: {
            options: true,
        },
    });
};
export const findQuestionById = (id) => {
    return prisma.question.findUnique({
        where: {
            id,
        },
        include: {
            options: true,
        },
    });
};
export const findQuestionsByQuiz = (quizId) => {
    return prisma.question.findMany({
        where: {
            quizId,
        },
        include: {
            options: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
export const updateQuestion = (id, question) => {
    return prisma.question.update({
        where: {
            id,
        },
        data: {
            question,
        },
        include: {
            options: true,
        },
    });
};
export const deleteQuestion = (id) => {
    return prisma.question.delete({
        where: {
            id,
        },
    });
};
