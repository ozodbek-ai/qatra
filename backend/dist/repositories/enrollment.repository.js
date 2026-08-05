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
export const findEnrollmentById = (id) => {
    return prisma.enrollment.findUnique({
        where: {
            id,
        },
    });
};
export const getUserEnrollments = (userId) => {
    return prisma.enrollment.findMany({
        where: {
            userId,
        },
        include: {
            course: {
                include: {
                    _count: {
                        select: {
                            lessons: true,
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
export const deleteEnrollment = (id) => {
    return prisma.enrollment.delete({
        where: {
            id,
        },
    });
};
export const countEnrollments = () => {
    return prisma.enrollment.count();
};
export const findEnrollmentByUserAndCourse = (userId, courseId) => {
    return prisma.enrollment.findUnique({
        where: {
            userId_courseId: {
                userId,
                courseId,
            },
        },
    });
};
