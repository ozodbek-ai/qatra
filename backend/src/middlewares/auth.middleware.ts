import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../generated/prisma/enums";
import { verifyAccessToken } from "../lib/jwt";
import { AppError } from "../utils/AppError";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log("1. Middleware boshlandi");

  const authHeader = req.headers.authorization;
  console.log("2. Header:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("3. Header topilmadi");
    throw new AppError("Token topilmadi.", 401);
  }

  const token = authHeader.split(" ")[1];
  console.log("4. Token:", token);

  try {
    const payload = verifyAccessToken(token) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    console.log("5. Payload:", payload);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    console.log("6. next() chaqirilyapti");

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    throw new AppError("Token noto'g'ri yoki eskirgan.", 401);
  }
};