import { prisma } from "../lib/prisma.js";
export const findProgress = (userId, lessonId) => {
    return prisma.lessonProgress.findUnique({
        where: {
            userId_lessonId: {
                userId,
                lessonId,
            },
        },
    });
};
export const createProgress = (userId, lessonId) => {
    return prisma.lessonProgress.create({
        data: {
            userId,
            lessonId,
            completed: true,
            completedAt: new Date(),
        },
    });
};
export const updateProgress = (userId, lessonId) => {
    return prisma.lessonProgress.update({
        where: {
            userId_lessonId: {
                userId,
                lessonId,
            },
        },
        data: {
            completed: true,
            completedAt: new Date(),
        },
    });
};
export const countCompletedLessons = (userId, lessonIds) => {
    return prisma.lessonProgress.count({
        where: {
            userId,
            lessonId: {
                in: lessonIds,
            },
            completed: true,
        },
    });
};
export const getCompletedLessonIds = (userId, lessonIds) => {
    return prisma.lessonProgress.findMany({
        where: {
            userId,
            lessonId: {
                in: lessonIds,
            },
            completed: true,
        },
        select: {
            lessonId: true,
        },
    });
};
