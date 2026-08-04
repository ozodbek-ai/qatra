import { prisma } from "../lib/prisma.js";
export const getUserById = (userId) => {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
        },
    });
};
export const getEnrollments = (userId) => {
    return prisma.enrollment.findMany({
        where: {
            userId,
        },
        include: {
            course: true,
        },
        orderBy: {
            enrolledAt: "desc",
        },
    });
};
export const countCompletedLessons = (userId) => {
    return prisma.lessonProgress.count({
        where: {
            userId,
            completed: true,
        },
    });
};
