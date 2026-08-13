import { asyncHandler } from "../utils/asyncHandler.js";

import * as settingsService
  from "../services/settings.service.js";

import {
  updateSettingsSchema,
} from "../validators/settings.validator.js";

export const getSettingsController =
  asyncHandler(async (req, res) => {
    const settings =
      await settingsService.getSettings();

    res.json({
      success: true,
      data: settings,
    });
  });

export const updateSettingsController =
  asyncHandler(async (req, res) => {
    const data =
      updateSettingsSchema.parse(req.body);

    const settings =
      await settingsService.updateSettings(
        data
      );

    res.json({
      success: true,
      message:
        "Sozlamalar muvaffaqiyatli saqlandi.",
      data: settings,
    });
  });