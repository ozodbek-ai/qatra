import { prisma } from "../config/prisma";
import type { RegisterInput } from "../validators/auth.validator";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  data: RegisterInput & {
    password: string;
  }
) => {
  return prisma.user.create({
    data,
  });
};