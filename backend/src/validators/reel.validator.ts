import { z } from "zod";

export const createReelSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Reel sarlavhasi kamida 3 ta belgidan iborat bo'lishi kerak.")
    .max(200, "Reel sarlavhasi juda uzun."),

  description: z
    .string()
    .trim()
    .max(2000, "Reel tavsifi juda uzun.")
    .optional(),

  videoUrl: z
    .string()
    .trim()
    .min(1, "Reel videosi majburiy."),

  thumbnailUrl: z
    .string()
    .trim()
    .optional(),

  isPublished: z
    .boolean()
    .optional(),

  categoryId: z
    .string()
    .cuid("Kategoriya ID noto'g'ri."),
});
export const updateReelSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(3)
      .max(200)
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000)
      .optional(),

    videoUrl: z
      .string()
      .trim()
      .min(1)
      .optional(),

    thumbnailUrl: z
      .string()
      .trim()
      .optional(),

    isPublished: z
      .boolean()
      .optional(),

    categoryId: z
      .string()
      .cuid()
      .nullable()
      .optional(),
  });

  export const reelIdSchema = z.object({
  id: z.string().cuid(),
});


/*
|--------------------------------------------------------------------------
| Reel Comment
|--------------------------------------------------------------------------
*/

export const createReelCommentSchema =
  z.object({
    text: z
      .string()
      .trim()
      .min(
        1,
        "Izoh bo'sh bo'lishi mumkin emas."
      )
      .max(
        1000,
        "Izoh 1000 ta belgidan oshmasligi kerak."
      ),
  });


/*
|--------------------------------------------------------------------------
| Reel Category
|--------------------------------------------------------------------------
*/

export const createReelCategorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Kategoriya nomi kamida 2 ta belgidan iborat bo'lishi kerak."
      )
      .max(
        100,
        "Kategoriya nomi juda uzun."
      ),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Slug kamida 2 ta belgidan iborat bo'lishi kerak."
      )
      .max(100)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug faqat kichik harflar, raqamlar va '-' belgisidan iborat bo'lishi mumkin."
      ),

    description: z
      .string()
      .trim()
      .max(
        500,
        "Kategoriya tavsifi 500 ta belgidan oshmasligi kerak."
      )
      .optional(),

    imageUrl: z
      .string()
      .trim()
      .url("Kategoriya rasmi URL manzili noto'g'ri.")
      .optional(),
  });

export const updateReelCategorySchema =
  createReelCategorySchema.partial();


/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

export type CreateReelInput =
  z.infer<typeof createReelSchema>;

export type UpdateReelInput =
  z.infer<typeof updateReelSchema>;

export type CreateReelCommentInput =
  z.infer<
    typeof createReelCommentSchema
  >;

export type CreateReelCategoryInput =
  z.infer<
    typeof createReelCategorySchema
  >;

export type UpdateReelCategoryInput =
  z.infer<
    typeof updateReelCategorySchema
  >;