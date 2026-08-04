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
