import { AppError } from "../utils/AppError";
import { hashPassword } from "../lib/bcrypt";
import {
  createUser,
  findUserByEmail,
} from "../repositories/auth.repository";
import { comparePassword } from "../lib/bcrypt";
import { generateAccessToken } from "../lib/jwt";
import type { LoginInput } from "../validators/auth.validator";
import type { RegisterInput } from "../validators/auth.validator";

export const register = async (data: RegisterInput) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError("Bu email allaqachon ro'yxatdan o'tgan.", 409);
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await createUser({
    ...data,
    password: hashedPassword,
  });

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
};
export const login = async (data: LoginInput) => {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new AppError("Email yoki parol noto'g'ri.", 401);
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Email yoki parol noto'g'ri.", 401);
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
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