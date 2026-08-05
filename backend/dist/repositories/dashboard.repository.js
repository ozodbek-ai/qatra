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
            avatarUrl: true,
        },
    });
};
export const getEnrollments = (userId) => {
    return prisma.enrollment.findMany({
        where: {
            userId,
        },
        include: {
            course: {
                include: {
                    lessons: {
                        orderBy: {
                            order: "asc",
                        },
                    },
                    completions: {
                        where: {
                            userId,
                        },
                    },
                    reviews: {
                        select: {
                            rating: true,
                        },
                    },
                },
            },
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
export const countCertificates = (userId) => {
    return prisma.certificate.count({
        where: {
            userId,
        },
    });
};
export const getLastViewedLesson = (userId) => {
    return prisma.lessonProgress.findFirst({
        where: {
            userId,
        },
        include: {
            lesson: {
                include: {
                    course: true,
                },
            },
        },
        orderBy: {
            lastViewedAt: "desc",
        },
    });
};
