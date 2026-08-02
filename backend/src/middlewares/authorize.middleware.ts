import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums";
import { AppError } from "../utils/AppError";

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {

    console.log("AUTHORIZE:", req.user);

    if (!req.user) {
      throw new AppError("Autentifikatsiya talab qilinadi.", 401);
    }

    if (!roles.includes(req.user.role)) {
      console.log("ROLE:", req.user.role);
      throw new AppError("Sizda bu amalni bajarishga ruxsat yo'q.", 403);
    }

    next();
  };