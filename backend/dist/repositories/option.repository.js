import { prisma } from "../lib/prisma.js";
export const createOption = (data) => {
    return prisma.option.create({
        data,
    });
};
export const findOptionById = (id) => {
    return prisma.option.findUnique({
        where: {
            id,
        },
    });
};
export const findOptionsByQuestion = (questionId) => {
    return prisma.option.findMany({
        where: {
            questionId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};
export const clearCorrectOption = (questionId) => {
    return prisma.option.updateMany({
        where: {
            questionId,
            isCorrect: true,
        },
        data: {
            isCorrect: false,
        },
    });
};
export const updateOption = (id, data) => {
    return prisma.option.update({
        where: {
            id,
        },
        data,
    });
};
export const deleteOption = (id) => {
    return prisma.option.delete({
        where: {
            id,
        },
    });
};
