import { z } from "zod";
export const updateSettingsSchema = z.object({
    platformName: z
        .string()
        .trim()
        .min(1, "Platforma nomi majburiy.")
        .max(100),
    description: z
        .string()
        .trim()
        .min(1, "Platforma tavsifi majburiy.")
        .max(500),
    logoUrl: z
        .string()
        .url()
        .nullable()
        .optional(),
    supportEmail: z
        .string()
        .email("Email noto'g'ri.")
        .nullable()
        .optional(),
    defaultQuizPassPercentage: z
        .number()
        .int()
        .min(1)
        .max(100),
});
