import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import * as courseRepository from "../repositories/course.repository.js";
export const getCourses = async () => {
    return prisma.course.findMany({
        where: {
            isPublished: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const createCourse = async (data) => {
    return courseRepository.createCourse(data);
};
export const getAllCourses = () => {
    return courseRepository.findAllPublishedCourses();
};
export const getCourseBySlug = async (slug) => {
    const course = await courseRepository.findCourseBySlug(slug);
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    return course;
};
export const updateCourse = async (id, data) => {
    const course = await prisma.course.findUnique({
        where: { id },
    });
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    return courseRepository.updateCourse(id, data);
};
export const deleteCourse = async (id) => {
    const course = await prisma.course.findUnique({
        where: {
            id,
        },
    });
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    await courseRepository.deleteCourse(id);
};
export const publishCourse = async (courseId, data) => {
    const course = await courseRepository.findCourseForPublish(courseId);
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    // Unpublish qilishga doimo ruxsat
    if (!data.isPublished) {
        return courseRepository.updatePublishStatus(courseId, false);
    }
    if (course.lessons.length === 0) {
        throw new AppError("Kursda kamida bitta dars bo'lishi kerak.", 400);
    }
    // Har bir darsda video bo'lishi kerak
    for (const lesson of course.lessons) {
        if (!lesson.videoUrl) {
            throw new AppError(`"${lesson.title}" darsida video mavjud emas.`, 400);
        }
    }
    // Kursdagi quizlarni ajratib olamiz
    const quizzes = course.lessons
        .map((lesson) => lesson.quiz)
        .filter((quiz) => quiz !== null);
    // Kamida bitta quiz bo'lishi kerak
    if (quizzes.length === 0) {
        throw new AppError("Kursda kamida bitta quiz bo'lishi kerak.", 400);
    }
    // Har bir quizda kamida bitta savol bo'lishi kerak
    for (const quiz of quizzes) {
        if (quiz.questions.length === 0) {
            throw new AppError("Quizda kamida bitta savol bo'lishi kerak.", 400);
        }
    }
    return courseRepository.updatePublishStatus(courseId, true);
};
