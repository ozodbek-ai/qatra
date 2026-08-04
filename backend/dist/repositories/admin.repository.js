import { prisma } from "../lib/prisma.js";
export const countUsers = () => {
    return prisma.user.count();
};
export const countCourses = () => {
    return prisma.course.count();
};
export const countLessons = () => {
    return prisma.lesson.count();
};
export const countEnrollments = () => {
    return prisma.enrollment.count();
};
export const countCompletedLessons = () => {
    return prisma.lessonProgress.count({
        where: {
            completed: true,
        },
    });
};
