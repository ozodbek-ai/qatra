import * as userRepository from "../repositories/user.repository.js";

import { AppError } from "../utils/AppError.js";

import {
  comparePassword,
  hashPassword,
} from "../lib/bcrypt.js";

import type {
  UserQueryInput,
  UpdateRoleInput,
  UpdateStatusInput,
  ChangePasswordInput,
} from "../validators/user.validator.js";

export const getUsers = async (
  query: UserQueryInput
) => {

  const result =
    await userRepository.getUsers(
      query
    );

  return {

    ...result,

    users:
      result.users.map(user => ({

        id: user.id,

        fullName: user.fullName,

        email: user.email,

        role: user.role,

        isActive: user.isActive,

        emailVerified:
          user.emailVerified,

        enrolledCourses:
          user.enrollments.length,

        certificates:
          user.certificates.length,

        createdAt:
          user.createdAt,

      })),

  };

};

export const getUserById = async (
  userId: string
) => {
  const user =
    await userRepository.getUserById(
      userId
    );

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  return user;
};

export const updateRole = async (
  targetUserId: string,
  data: UpdateRoleInput,
  currentUserId: string
) => {
  const currentUser =
    await userRepository.getUserRoleById(
      currentUserId
    );

  if (!currentUser) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  if (
    currentUser.role !==
    "SUPER_ADMIN"
  ) {
    throw new AppError(
      "Faqat bosh admin foydalanuvchilar rolini o'zgartira oladi.",
      403
    );
  }

  if (
    targetUserId ===
    currentUserId
  ) {
    throw new AppError(
      "O'z rolingizni o'zgartira olmaysiz.",
      400
    );
  }

  const targetUser =
    await userRepository.getUserRoleById(
      targetUserId
    );

  if (!targetUser) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }


  return userRepository.updateUserRole(
    targetUserId,
    data.role
  );
};

export const updateStatus = (
  userId: string,
  data: UpdateStatusInput
) => {
  return userRepository.updateUserStatus(
    userId,
    data.isActive
  );
};
export const getMyProfile = async (
  userId: string
) => {
  const user =
    await userRepository.getMyProfile(
      userId
    );

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  return user;
};

export const updateMyProfile = async (
  userId: string,
  data: {
    fullName: string;
  }
) => {
  const user =
    await userRepository.getMyProfile(
      userId
    );

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  return userRepository.updateMyProfile(
    userId,
    {
      fullName: data.fullName,
    }
  );
};

export const updateMyAvatar = async (
  userId: string,
  avatarUrl: string
) => {
  const user =
    await userRepository.getMyProfile(
      userId
    );

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  return userRepository.updateMyProfile(
    userId,
    {
      avatarUrl,
    }
  );
};


export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  const user =
    await userRepository.findUserByIdForPassword(
      userId
    );

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  const isCurrentPasswordValid =
    await comparePassword(
      data.currentPassword,
      user.password
    );

  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Joriy parol noto'g'ri.",
      400
    );
  }

  if (
    data.currentPassword ===
    data.newPassword
  ) {
    throw new AppError(
      "Yangi parol joriy paroldan farq qilishi kerak.",
      400
    );
  }

  const hashedPassword =
    await hashPassword(data.newPassword);

  await userRepository.updatePassword(
    userId,
    hashedPassword
  );

  return null;
};

export const getUserActivityStats = async (
  userId: string
) => {
  const user =
    await userRepository.getUserRoleById(userId);

  if (!user) {
    throw new AppError(
      "Foydalanuvchi topilmadi.",
      404
    );
  }

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);

  const day = startOfWeek.getDay();

  const daysFromMonday =
    day === 0 ? 6 : day - 1;

  startOfWeek.setDate(
    startOfWeek.getDate() - daysFromMonday
  );

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  return userRepository.getUserActivityStats(
    userId,
    startOfToday,
    startOfWeek,
    startOfMonth
  );
};