import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {

  // Logger
  logger.error({
    method: req.method,
    url: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });

  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Zod validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Prisma unique constraint
  if (
    err instanceof Prisma.PrismaClientKnownRequestError
  ) {

    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message:
          "Bu ma'lumot allaqachon mavjud.",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message:
          "Ma'lumot topilmadi.",
      });
    }

  }

  // Unknown error
  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });

}