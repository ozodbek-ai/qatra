import { asyncHandler } from "../utils/asyncHandler.js";
import * as dashboardService from "../services/dashboard.service.js";
export const dashboardController = asyncHandler(async (req, res) => {
    const data = await dashboardService.getDashboard(req.user.userId);
    res.json({
        success: true,
        data,
    });
});
