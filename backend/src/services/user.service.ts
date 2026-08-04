import * as userRepository from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
import type { UserQueryInput } from "../validators/user.validator.js";
import type {
  UpdateRoleInput,
  UpdateStatusInput,
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

export const updateRole = (
  userId: string,
  data: UpdateRoleInput
) => {
  return userRepository.updateUserRole(
    userId,
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