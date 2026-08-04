import { prisma } from "../lib/prisma.js";
export const getUsers = async (query) => {
    const { page, limit, search, role, isActive, } = query;
    const where = {
        ...(search && {
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
        }),
        ...(role && {
            role,
        }),
        ...(typeof isActive === "boolean" && {
            isActive,
        }),
    };
    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                enrollments: true,
                certificates: true,
            },
        }),
        prisma.user.count({
            where,
        }),
    ]);
    return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};
export const getUserById = (userId) => {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            enrollments: {
                include: {
                    course: true,
                },
            },
            certificates: {
                include: {
                    course: true,
                },
            },
            quizAttempts: true,
            lessonProgress: true,
        },
    });
};
export const updateUserRole = (userId, role) => {
    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role,
        },
    });
};
export const updateUserStatus = (userId, isActive) => {
    return prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive,
        },
    });
};
