import { verifyAccessToken } from "../lib/jwt.js";
import { logger } from "../lib/logger.js";
import { AppError } from "../utils/AppError.js";
export const authMiddleware = (req, _res, next) => {
    logger.info("Auth middleware started");
    const authHeader = req.headers.authorization;
    logger.debug({
        authorization: authHeader,
    });
    if (!authHeader?.startsWith("Bearer ")) {
        logger.warn("Authorization header missing");
        throw new AppError("Token topilmadi.", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = verifyAccessToken(token);
        logger.debug({
            userId: payload.userId,
            role: payload.role,
        });
        req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        logger.error(error);
        throw new AppError("Token noto'g'ri yoki eskirgan.", 401);
    }
};
