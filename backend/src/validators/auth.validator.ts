import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Ism kamida 3 ta belgidan iborat bo'lishi kerak.")
    .max(100),

  email: z
    .email("Email noto'g'ri formatda.")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak.")
    .max(100),
});

export const loginSchema = z.object({
  email: z
    .email("Email noto'g'ri.")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema =
  z.object({
    email: z
      .email("Email noto'g'ri.")
      .transform((email) =>
        email.toLowerCase(),
      ),
  });

export const resetPasswordSchema =
  z.object({
    token: z
      .string()
      .min(1, "Reset token mavjud emas."),

    password: z
      .string()
      .min(
        8,
        "Parol kamida 8 ta belgidan iborat bo'lishi kerak.",
      )
      .max(100),

    confirmPassword: z
      .string()
      .min(
        8,
        "Parolni tasdiqlash kerak.",
      ),
  })
  .refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      message: "Parollar bir xil emas.",
      path: ["confirmPassword"],
    },
  );

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;