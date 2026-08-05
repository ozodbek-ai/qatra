import { z } from "zod";
export const createCourseSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Kurs nomi kamida 3 ta belgidan iborat bo'lishi kerak.")
        .max(150, "Kurs nomi 150 ta belgidan oshmasligi kerak."),
    slug: z
        .string()
        .trim()
        .min(3)
        .max(160)
        .regex(/^[a-z0-9-]+$/, "Slug faqat kichik harflar, raqam va '-' dan iborat bo'lishi kerak."),
    description: z
        .string()
        .trim()
        .min(10, "Kurs tavsifi kamida 10 ta belgidan iborat bo'lishi kerak.")
        .max(5000, "Kurs tavsifi juda uzun."),
    imageUrl: z
        .string()
        .url("Image URL noto'g'ri.")
        .optional(),
    price: z
        .number()
        .min(0, "Narx manfiy bo'lishi mumkin emas."),
    category: z
        .string()
        .trim()
        .max(100)
        .optional(),
    duration: z
        .number()
        .int()
        .min(0)
        .optional(),
    level: z.enum([
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED",
    ]),
});
export const updateCourseSchema = createCourseSchema.partial();
export const publishCourseSchema = z.object({
    isPublished: z.boolean(),
});
export const courseIdSchema = z.object({
    id: z.string().cuid(),
});
export const courseSlugSchema = z.object({
    slug: z.string().min(3),
});
