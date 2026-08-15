import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type { UserRole } from "../generated/prisma/enums.js";

import { verifyAccessToken } from "../lib/jwt.js";

export const optionalAuthMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization;

  // Token bo'lmasa — guest sifatida davom etadi
  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  const token =
    authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const payload =
      verifyAccessToken(token) as {
        userId: string;
        email: string;
        role: UserRole;
      };

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    // Token noto'g'ri bo'lsa ham
    // public kurs sahifasini guest sifatida ochamiz.
  }

  next();
};