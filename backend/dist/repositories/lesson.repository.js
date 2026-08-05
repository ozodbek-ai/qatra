import { prisma } from "../lib/prisma.js";
export const createLesson = (data) => {
    return prisma.lesson.create({
        data,
    });
};
export const findLessonById = (id) => {
    return prisma.lesson.findUnique({
        where: {
            id,
        },
    });
};
export const findLessonsByCourse = (courseId) => {
    return prisma.lesson.findMany({
        where: {
            courseId,
            isPublished: true,
        },
        orderBy: {
            order: "asc",
        },
        include: {
            quiz: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
};
export const findLessonsByCourseOrdered = (courseId) => {
    return prisma.lesson.findMany({
        where: {
            courseId,
        },
        orderBy: {
            order: "asc",
        },
    });
};
export const updateLesson = (id, data) => {
    return prisma.lesson.update({
        where: {
            id,
        },
        data,
    });
};
export const deleteLesson = (id) => {
    return prisma.lesson.delete({
        where: {
            id,
        },
    });
};
export const countLessonsByCourse = (courseId) => {
    return prisma.lesson.count({
        where: {
            courseId,
        },
    });
};
