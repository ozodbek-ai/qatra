import { prisma } from "../lib/prisma.js";
export const findStudents = (skip, take, search) => {
    return prisma.user.findMany({
        where: {
            role: "STUDENT",
            ...(search
                ? {
                    OR: [
                        {
                            fullName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },
        skip,
        take,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            createdAt: true,
            enrollments: true,
            quizAttempts: true,
        },
    });
};
export const findStudentById = (id) => {
    return prisma.user.findUnique({
        where: {
            id,
        },
        include: {
            enrollments: {
                include: {
                    course: true,
                },
            },
            lessonProgress: {
                include: {
                    lesson: true,
                },
            },
            quizAttempts: {
                include: {
                    quiz: true,
                },
            },
        },
    });
};
export const countStudents = (search) => {
    return prisma.user.count({
        where: {
            role: "STUDENT",
            ...(search
                ? {
                    OR: [
                        {
                            fullName: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    ],
                }
                : {}),
        },
    });
};
