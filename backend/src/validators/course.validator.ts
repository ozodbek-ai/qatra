import { z } from "zod";
export const createCourseSchema = z.object({
  title: z.string().min(
    3,
    "Kurs nomi kamida 3 ta belgidan iborat bo'lishi kerak."
  ),

  slug: z
    .string()
    .min(3)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug faqat kichik harflar, raqam va '-' dan iborat bo'lishi kerak."
    ),

  description: z.string().min(10),

  imageUrl: z.string().url().optional(),

  price: z.number().nonnegative(),

  level: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "ADVANCED",
  ]),
});