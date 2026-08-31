import { comparePassword, hashPassword } from "../lib/bcrypt.js";
import { generateAccessToken } from "../lib/jwt.js";
import {
  createUser,
  findUserByEmail,
} from "../repositories/auth.repository.js";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";
import crypto from "node:crypto";

import {
  createPasswordResetToken,
  findPasswordResetToken,
  invalidateUserPasswordResetTokens,
  markPasswordResetTokenUsed,
  updateUserPassword,
} from "../repositories/auth.repository.js";

import { sendPasswordResetEmail } from "./email.service.js";

import type {
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../validators/auth.validator.js";

import { env } from "../config/env.js";

import type {
  LoginInput,
  RegisterInput,
} from "../validators/auth.validator.js";

import { createUserActivity } from "../repositories/activity.repository.js";

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
  
  await createUserActivity(
user.id,
"LOGIN"
);
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
export const forgotPassword = async (
  data: ForgotPasswordInput,
) => {
  const user =
    await findUserByEmail(data.email);

  /*
   * Email mavjud yoki mavjud emasligini
   * tashqariga oshkor qilmaymiz.
   */
  if (!user) {
    return;
  }

  await invalidateUserPasswordResetTokens(
    user.id,
  );

  const rawToken =
    crypto.randomBytes(32).toString("hex");

  const tokenHash =
    crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

  const expiresAt =
    new Date(
      Date.now() + 15 * 60 * 1000,
    );

  await createPasswordResetToken({
    userId: user.id,
    tokenHash,
    expiresAt,
  });

  const resetUrl =
    `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  await sendPasswordResetEmail(
    user.email,
    resetUrl,
  );
};

export const resetPassword = async (
  data: ResetPasswordInput,
) => {
  const tokenHash =
    crypto
      .createHash("sha256")
      .update(data.token)
      .digest("hex");

  const resetToken =
    await findPasswordResetToken(
      tokenHash,
    );

  if (!resetToken) {
    throw new AppError(
      "Parolni tiklash havolasi noto'g'ri.",
      400,
    );
  }

  if (resetToken.usedAt) {
    throw new AppError(
      "Parolni tiklash havolasi allaqachon ishlatilgan.",
      400,
    );
  }

  if (
    resetToken.expiresAt.getTime() <
    Date.now()
  ) {
    throw new AppError(
      "Parolni tiklash havolasining muddati tugagan.",
      400,
    );
  }

  const hashedPassword =
    await hashPassword(
      data.password,
    );

  await updateUserPassword(
    resetToken.userId,
    hashedPassword,
  );

  await markPasswordResetTokenUsed(
    resetToken.id,
  );

  await invalidateUserPasswordResetTokens(
    resetToken.userId,
  );
};