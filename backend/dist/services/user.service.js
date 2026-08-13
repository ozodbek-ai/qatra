import * as userRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
import { comparePassword, hashPassword, } from "../lib/bcrypt.js";
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
export const getMyProfile = async (userId) => {
    const user = await userRepository.getMyProfile(userId);
    if (!user) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }
    return user;
};
export const updateMyProfile = async (userId, data) => {
    const user = await userRepository.getMyProfile(userId);
    if (!user) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }
    return userRepository.updateMyProfile(userId, {
        fullName: data.fullName,
    });
};
export const updateMyAvatar = async (userId, avatarUrl) => {
    const user = await userRepository.getMyProfile(userId);
    if (!user) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }
    return userRepository.updateMyProfile(userId, {
        avatarUrl,
    });
};
export const changePassword = async (userId, data) => {
    const user = await userRepository.findUserByIdForPassword(userId);
    if (!user) {
        throw new AppError("Foydalanuvchi topilmadi.", 404);
    }
    const isCurrentPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw new AppError("Joriy parol noto'g'ri.", 400);
    }
    if (data.currentPassword ===
        data.newPassword) {
        throw new AppError("Yangi parol joriy paroldan farq qilishi kerak.", 400);
    }
    const hashedPassword = await hashPassword(data.newPassword);
    await userRepository.updatePassword(userId, hashedPassword);
    return null;
};
