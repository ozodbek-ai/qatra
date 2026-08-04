import { prisma } from "../lib/prisma.js";
import * as enrollmentRepository from "../repositories/enrollment.repository.js";
import { AppError } from "../utils/AppError.js";
export const enroll = async (userId, courseId) => {
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
    });
    if (!course) {
        throw new AppError("Kurs topilmadi.", 404);
    }
    const enrollment = await enrollmentRepository.findEnrollment(userId, courseId);
    if (enrollment) {
        throw new AppError("Siz bu kursga allaqachon yozilgansiz.", 409);
    }
    return enrollmentRepository.createEnrollment(userId, courseId);
};
export const getMyCourses = (userId) => {
    return enrollmentRepository.getUserEnrollments(userId);
};
