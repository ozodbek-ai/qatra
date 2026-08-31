import { z } from "zod";

export const createReelCategorySchema =
  z.object({
    name: z
      .string()
      .min(2, "Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak.")
      .max(100),

    slug: z
      .string()
      .min(2)
      .max(100)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug faqat kichik harflar, raqamlar va '-' belgilaridan iborat bo'lishi kerak."
      ),

    description: z
      .string()
      .max(500)
      .optional(),

    imageUrl: z
      .string()
      .url()
      .optional()
      .or(z.literal("")),
  });

export const updateReelCategorySchema =
  createReelCategorySchema.partial();

export type CreateReelCategoryInput =
  z.infer<
    typeof createReelCategorySchema
  >;

export type UpdateReelCategoryInput =
  z.infer<
    typeof updateReelCategorySchema
  >;