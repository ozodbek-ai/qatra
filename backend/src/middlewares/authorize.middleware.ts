import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/AppError.js";
import { logger } from "../lib/logger.js";

export const authorize =
  (...roles: UserRole[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      logger.warn("Unauthorized request");

      throw new AppError(
        "Autentifikatsiya talab qilinadi.",
        401
      );
    }

    if (!roles.includes(req.user.role)) {
      logger.warn({
        message: "Access denied",
        userId: req.user.userId,
        role: req.user.role,
        allowedRoles: roles,
      });

      throw new AppError(
        "Sizda bu amalni bajarishga ruxsat yo'q.",
        403
      );
    }

    logger.debug({
      message: "Authorization successful",
      userId: req.user.userId,
      role: req.user.role,
    });

    next();
  };