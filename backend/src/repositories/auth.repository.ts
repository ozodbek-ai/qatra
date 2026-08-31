import { prisma } from "../config/prisma.js";

import type {
  RegisterInput,
} from "../validators/auth.validator.js";

export const findUserByEmail = async (
  email: string,
) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  data: RegisterInput & {
    password: string;
  },
) => {
  return prisma.user.create({
    data,
  });
};

export const createPasswordResetToken = async (
  data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  },
) => {
  return prisma.passwordResetToken.create({
    data,
  });
};

export const findPasswordResetToken = async (
  tokenHash: string,
) => {
  return prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      user: true,
    },
  });
};

export const invalidateUserPasswordResetTokens =
  async (userId: string) => {
    await prisma.passwordResetToken.updateMany({
      where: {
        userId,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });
  };

export const markPasswordResetTokenUsed =
  async (tokenId: string) => {
    return prisma.passwordResetToken.update({
      where: {
        id: tokenId,
      },
      data: {
        usedAt: new Date(),
      },
    });
  };

export const updateUserPassword = async (
  userId: string,
  password: string,
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
};