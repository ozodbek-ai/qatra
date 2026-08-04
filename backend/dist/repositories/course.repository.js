import { prisma } from "../lib/prisma.js";
export const createCourse = (data) => {
    return prisma.course.create({
        data,
    });
};
export const findAllPublishedCourses = () => {
    return prisma.course.findMany({
        where: {
            isPublished: true,
        },
        include: {
            reviews: {
                select: {
                    rating: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const findCourseBySlug = (slug) => {
    return prisma.course.findUnique({
        where: {
            slug,
        },
    });
};
export const updateCourse = (id, data) => {
    return prisma.course.update({
        where: {
            id,
        },
        data,
    });
};
export const deleteCourse = (id) => {
    return prisma.course.delete({
        where: {
            id,
        },
    });
};
export const findCourseForPublish = (courseId) => {
    return prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            lessons: {
                include: {
                    quiz: {
                        include: {
                            questions: true,
                        },
                    },
                },
            },
        },
    });
};
export const updatePublishStatus = (courseId, isPublished) => {
    return prisma.course.update({
        where: {
            id: courseId,
        },
        data: {
            isPublished,
        },
    });
};
