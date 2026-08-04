import { prisma } from "../lib/prisma.js";
export const searchCourses = (query) => {
    return prisma.course.findMany({
        where: {
            title: {
                contains: query,
                mode: "insensitive",
            },
        },
        take: 5,
        select: {
            id: true,
            title: true,
            slug: true,
        },
    });
};
export const searchLessons = (query) => {
    return prisma.lesson.findMany({
        where: {
            title: {
                contains: query,
                mode: "insensitive",
            },
        },
        take: 5,
        select: {
            id: true,
            title: true,
            courseId: true,
        },
    });
};
export const searchStudents = (query) => {
    return prisma.user.findMany({
        where: {
            role: "STUDENT",
            OR: [
                {
                    fullName: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
        },
        take: 5,
        select: {
            id: true,
            fullName: true,
            email: true,
        },
    });
};
export const searchQuizzes = (query) => {
    return prisma.quiz.findMany({
        where: {
            lesson: {
                title: {
                    contains: query,
                    mode: "insensitive",
                },
            },
        },
        include: {
            lesson: {
                select: {
                    title: true,
                },
            },
        },
        take: 5,
    });
};
