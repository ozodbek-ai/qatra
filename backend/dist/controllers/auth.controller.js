import { logger } from "../lib/logger.js";
import { login, register, } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, registerSchema, } from "../validators/auth.validator.js";
export const registerController = asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const user = await register(data);
    logger.info({
        message: "User registered",
        userId: user.id,
        email: user.email,
    });
    res.status(201).json({
        success: true,
        message: "Foydalanuvchi muvaffaqiyatli yaratildi.",
        data: user,
    });
});
export const loginController = asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const result = await login(data);
    logger.info({
        message: "User logged in",
        userId: result.user.id,
    });
    res.status(200).json({
        success: true,
        message: "Muvaffaqiyatli tizimga kirildi.",
        data: result,
    });
});
export const meController = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        data: req.user,
    });
});
export const adminController = asyncHandler(async (_req, res) => {
    logger.debug("Admin endpoint accessed");
    res.json({
        success: true,
        message: "Admin paneliga xush kelibsiz.",
    });
});
