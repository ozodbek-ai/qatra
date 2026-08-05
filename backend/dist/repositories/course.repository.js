import { prisma } from "../lib/prisma.js";
export const createCourse = (data) => {
    return prisma.course.create({
        data,
    });
};
export const findCourseById = (id) => {
    return prisma.course.findUnique({
        where: {
            id,
        },
    });
};
export const findCourseBySlug = (slug) => {
    return prisma.course.findUnique({
        where: {
            slug,
        },
        include: {
            lessons: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    order: "asc",
                },
                include: {
                    quiz: {
                        select: {
                            id: true,
                        },
                    },
                },
            },
            reviews: {
                include: {
                    user: {
                        select: {
                            fullName: true,
                            avatarUrl: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    lessons: true,
                    enrollments: true,
                    reviews: true,
                },
            },
        },
    });
};
export const findCourseByTitle = (title) => {
    return prisma.course.findFirst({
        where: {
            title,
        },
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
            _count: {
                select: {
                    enrollments: true,
                    lessons: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
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
export const countPublishedCourses = () => {
    return prisma.course.count({
        where: {
            isPublished: true,
        },
    });
};
export const countAllCourses = () => {
    return prisma.course.count();
};
export const findPublishedCourseById = (id) => {
    return prisma.course.findFirst({
        where: {
            id,
            isPublished: true,
        },
    });
};
