import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({

  NODE_ENV: z
    .enum([
      "development",
      "production",
      "test",
    ])
    .default("development"),

  PORT: z
    .string()
    .default("3000"),

  DATABASE_URL: z.string(),

  JWT_SECRET: z
    .string()
    .min(16),
    
  JWT_EXPIRES_IN: z
    .string()
    .default("7d"),

  CLOUDINARY_CLOUD_NAME:
    z.string(),

  CLOUDINARY_API_KEY:
    z.string(),

  CLOUDINARY_API_SECRET:
    z.string(),

  SMTP_HOST: z.string(),
SMTP_PORT: z.coerce.number().default(587),
SMTP_USER: z.string(),
SMTP_PASSWORD: z.string(),

FRONTEND_URL: z
  .string()
  .default("http://localhost:5173"),

});

export const env =
  envSchema.parse(process.env);