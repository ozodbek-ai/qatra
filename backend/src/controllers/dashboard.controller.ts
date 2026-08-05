import type { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler.js";
import * as dashboardService from "../services/dashboard.service.js";
import { logger } from "../lib/logger.js";

export const dashboardController =
  asyncHandler(async (req: Request, res: Response) => {
    const data =
      await dashboardService.getDashboard(
        req.user!.userId
      );

    logger.info({
      message: "Dashboard requested",
      userId: req.user!.userId,
    });

    res.status(200).json({
      success: true,
      data,
    });
  });