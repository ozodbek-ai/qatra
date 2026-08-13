import { prisma } from "../lib/prisma.js";
export const createQuiz = (data) => {
    return prisma.quiz.create({
        data,
    });
};
export const findQuizByLesson = (lessonId) => {
    return prisma.quiz.findUnique({
        where: {
            lessonId,
        },
    });
};
// Submit uchun ishlatiladi.
// Bu yerda tartibni o'zgartirmaymiz.
export const findQuizWithQuestions = (quizId) => {
    return prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            lesson: {
                select: {
                    courseId: true,
                },
            },
            questions: {
                include: {
                    options: true,
                },
            },
        },
    });
};
export const createQuizAttempt = (userId, quizId, score, total, percentage, passed) => {
    return prisma.quizAttempt.create({
        data: {
            userId,
            quizId,
            score,
            total,
            percentage,
            passed,
        },
    });
};
export const findQuizAttempt = (userId, quizId) => {
    return prisma.quizAttempt.findFirst({
        where: {
            userId,
            quizId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
// Studentga quizni ko'rsatish uchun
export const findQuizById = (quizId) => {
    return prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            lesson: {
                select: {
                    id: true,
                    title: true,
                    course: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
            },
            questions: {
                include: {
                    options: {
                        select: {
                            id: true,
                            text: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
};
export const getAllQuizzes = async (skip, take, search) => {
    const where = search
        ? {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    lesson: {
                        title: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    lesson: {
                        course: {
                            title: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            ],
        }
        : {};
    const [quizzes, total] = await prisma.$transaction([
        prisma.quiz.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                lesson: {
                    select: {
                        id: true,
                        title: true,
                        course: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                    },
                },
            },
        }),
        prisma.quiz.count({
            where,
        }),
    ]);
    return {
        quizzes,
        total,
    };
};
