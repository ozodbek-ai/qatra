import { prisma } from "../lib/prisma.js";
export const createEnrollment = (userId, courseId) => {
    return prisma.enrollment.create({
        data: {
            userId,
            courseId,
        },
    });
};
export const findEnrollment = (userId, courseId) => {
    return prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
};
export const getUserEnrollments = (userId) => {
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
export const hasEnrollment = (userId, courseId) => {
    return prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
};
