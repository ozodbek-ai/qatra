import { prisma } from "../lib/prisma.js";
import * as courseCompletionService from "./course-completion.service.js";
import * as progressRepository from "../repositories/progress.repository.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import * as lessonRepository from "../repositories/lesson.repository.js";
import { AppError } from "../utils/AppError.js";
export const completeLesson = async (userId, lessonId) => {
    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId,
        },
    });
    if (!lesson) {
        throw new AppError("Dars topilmadi.", 404);
    }
    const enrollment = await enrollmentRepository.hasEnrollment(userId, lesson.courseId);
    if (!enrollment) {
        throw new AppError("Siz bu kursga yozilmagansiz.", 403);
    }
    const progress = await progressRepository.findProgress(userId, lessonId);
    let result;
    if (progress) {
        result = await progressRepository.updateProgress(userId, lessonId);
    }
    else {
        result = await progressRepository.createProgress(userId, lessonId);
    }
    // Kurs yakunlanganligini tekshirish
    await courseCompletionService.checkCourseCompletion(userId, lesson.courseId);
    return result;
};
export const getCourseProgress = async (userId, courseId) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            lessons: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    const lessonIds = course.lessons.map((lesson) => lesson.id);
    const completedLessons = await progressRepository.countCompletedLessons(userId, lessonIds);
    const totalLessons = course.lessons.length;
    const progress = totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);
    return {
        courseId: course.id,
        courseTitle: course.title,
        completedLessons,
        totalLessons,
        progress,
    };
};
export const continueLearning = async (userId, courseId) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
    });
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    const lessons = await lessonRepository.findLessonsByCourseOrdered(courseId);
    const lessonIds = lessons.map((lesson) => lesson.id);
    const completed = await progressRepository.getCompletedLessonIds(userId, lessonIds);
    const completedIds = new Set(completed.map((item) => item.lessonId));
    const nextLesson = lessons.find((lesson) => !completedIds.has(lesson.id));
    return {
        courseId,
        courseTitle: course.title,
        nextLesson: nextLesson ?? null,
    };
};
