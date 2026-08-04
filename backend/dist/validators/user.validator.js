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
export const userQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    role: z.enum([
        "ADMIN",
        "STUDENT",
    ]).optional(),
    isActive: z.coerce.boolean().optional(),
});
