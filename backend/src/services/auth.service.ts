import { comparePassword, hashPassword } from "../lib/bcrypt.js";
import { generateAccessToken } from "../lib/jwt.js";
import {
  createUser,
  findUserByEmail,
} from "../repositories/auth.repository.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

import type {
  LoginInput,
  RegisterInput,
} from "../validators/auth.validator.js";

export const register = async (
  data: RegisterInput
) => {
  const existingUser =
    await findUserByEmail(data.email);

  if (existingUser) {
    logger.warn({
      message: "Registration failed",
      email: data.email,
      reason: "Email already exists",
    });

    throw new AppError(
      "Bu email allaqachon ro'yxatdan o'tgan.",
      409
    );
  }

  const hashedPassword =
    await hashPassword(data.password);

  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  logger.info({
    message: "User registered",
    userId: user.id,
    email: user.email,
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};

export const login = async (
  data: LoginInput
) => {
  const user =
    await findUserByEmail(data.email);

  if (!user) {
    logger.warn({
      message: "Login failed",
      email: data.email,
      reason: "User not found",
    });

    throw new AppError(
      "Email yoki parol noto'g'ri.",
      401
    );
  }

  const isPasswordValid =
    await comparePassword(
      data.password,
      user.password
    );

  if (!isPasswordValid) {
    logger.warn({
      message: "Login failed",
      userId: user.id,
      reason: "Wrong password",
    });

    throw new AppError(
      "Email yoki parol noto'g'ri.",
      401
    );
  }

  const accessToken =
    generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

  logger.info({
    message: "User logged in",
    userId: user.id,
  });

  return {
    accessToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};