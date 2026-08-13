import * as studentRepository from "../repositories/student.repository.js";
import { AppError } from "../utils/AppError.js";
import { getPagination, } from "../utils/pagination.js";
export const getStudents = async (query) => {
    const { page, limit, skip, take, } = getPagination(query);
    const search = query.search?.trim();
    const students = await studentRepository.findStudents(skip, take, search);
    const total = await studentRepository.countStudents(search);
    return {
        items: students.map((student) => ({
            id: student.id,
            fullName: student.fullName,
            email: student.email,
            joinedAt: student.createdAt,
            enrolledCourses: student.enrollments.length,
            quizAttempts: student.quizAttempts.length,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
export const getStudentById = async (id) => {
    const student = await studentRepository.findStudentById(id);
    if (!student) {
        throw new AppError("Student topilmadi.", 404);
    }
    if (student.role !== "STUDENT") {
        throw new AppError("Bu foydalanuvchi student emas.", 400);
    }
    return {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        role: student.role,
        isActive: student.isActive,
        createdAt: student.createdAt,
        lastLoginAt: student.lastLoginAt,
        enrollments: student.enrollments.map((enrollment) => ({
            id: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            course: {
                id: enrollment.course.id,
                title: enrollment.course.title,
                slug: enrollment.course.slug,
                imageUrl: enrollment.course.imageUrl,
                isPublished: enrollment.course.isPublished,
            },
        })),
        lessonProgress: student.lessonProgress.map((progress) => ({
            id: progress.id,
            lessonId: progress.lessonId,
            completed: progress.completed,
            completedAt: progress.completedAt,
            lastViewedAt: progress.lastViewedAt,
            lesson: {
                id: progress.lesson.id,
                title: progress.lesson.title,
                courseId: progress.lesson.courseId,
            },
        })),
        quizAttempts: student.quizAttempts.map((attempt) => ({
            id: attempt.id,
            quizId: attempt.quizId,
            score: attempt.score,
            total: attempt.total,
            percentage: attempt.percentage,
            passed: attempt.passed,
            createdAt: attempt.createdAt,
            quiz: {
                id: attempt.quiz.id,
                title: attempt.quiz.title,
            },
        })),
    };
};
