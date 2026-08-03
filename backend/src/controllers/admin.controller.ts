import { asyncHandler } from "../utils/asyncHandler.js";
import * as adminService from "../services/admin.service.js";

export const statisticsController = asyncHandler(
  async (_req, res) => {
    const data = await adminService.getStatistics();

    res.json({
      success: true,
      data,
    });
  }
);