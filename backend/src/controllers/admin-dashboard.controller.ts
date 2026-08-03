import { asyncHandler } from "../utils/asyncHandler.js";
import * as adminDashboardService from "../services/admin-dashboard.service.js";

export const adminDashboardController =
  asyncHandler(async (req, res) => {

    const data =
      await adminDashboardService.getDashboardOverview();

    res.json({
      success: true,
      data,
    });

  });