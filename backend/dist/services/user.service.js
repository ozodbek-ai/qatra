import * as userRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
export const getUsers = async (query) => {
    const result = await userRepository.getUsers(query);
    return {
        ...result,
        users: result.users.map(user => ({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            enrolledCourses: user.enrollments.length,
            certificates: user.certificates.length,
            createdAt: user.createdAt,
        })),
    };
};
export const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);
    if (!user) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }
    return user;
};
export const updateRole = (userId, data) => {
    return userRepository.updateUserRole(userId, data.role);
};
export const updateStatus = (userId, data) => {
    return userRepository.updateUserStatus(userId, data.isActive);
};
