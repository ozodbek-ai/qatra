import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum([
    "ADMIN",
    "STUDENT",
  ]),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean(),
});

export type UpdateRoleInput =
  z.infer<typeof updateRoleSchema>;

export type UpdateStatusInput =
  z.infer<typeof updateStatusSchema>;


export const userQuerySchema = z.object({
  page: z.coerce
    .number()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .optional(),

  role: z
    .enum([
      "ADMIN",
      "STUDENT",
    ])
    .optional(),

  isActive: z.coerce
    .boolean()
    .optional(),
});

export type UserQueryInput =
  z.infer<typeof userQuerySchema>;


export const updateProfileSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Ism kamida 2 ta belgidan iborat bo'lishi kerak."
      )
      .max(100),
  });

export type UpdateProfileInput =
  z.infer<typeof updateProfileSchema>;


export const changePasswordSchema =
  z
    .object({
      currentPassword: z
        .string()
        .min(
          8,
          "Joriy parol kamida 8 ta belgidan iborat bo'lishi kerak."
        ),

      newPassword: z
        .string()
        .min(
          8,
          "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak."
        )
        .max(100),

      confirmPassword: z
        .string()
        .min(
          8,
          "Parolni tasdiqlash maydoni to'ldirilishi kerak."
        ),
    })
    .refine(
      (data) =>
        data.newPassword ===
        data.confirmPassword,
      {
        message:
          "Yangi parollar bir xil emas.",
        path: ["confirmPassword"],
      }
    );

export type ChangePasswordInput =
  z.infer<typeof changePasswordSchema>;