import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { registerSchema } from "../validators/auth.validator";
import { register } from "../services/auth.service";
import { loginSchema } from "../validators/auth.validator";
import { login } from "../services/auth.service";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("BODY:", req.body);

    const data = registerSchema.parse(req.body);

    const user = await register(data);

    res.status(201).json({
      success: true,
      message: "Foydalanuvchi muvaffaqiyatli yaratildi.",
      data: user,
    });
  }
);
export const loginController = asyncHandler(
  async (req, res) => {
    const data = loginSchema.parse(req.body);

    const result = await login(data);

    res.status(200).json({
      success: true,
      message: "Muvaffaqiyatli tizimga kirildi.",
      data: result,
    });
  }
);

export const meController = asyncHandler(
  async (req, res) => {
    res.json({
      success: true,
      data: req.user,
    });
  }
);

export const adminController = asyncHandler(
  async (_req, res) => {
    res.json({
      success: true,
      message: "Admin paneliga xush kelibsiz.",
    });
  }
);