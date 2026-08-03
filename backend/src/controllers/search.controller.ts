import { asyncHandler } from "../utils/asyncHandler.js";
import * as searchService from "../services/search.service.js";

export const globalSearchController =
asyncHandler(async (req, res) => {

  const q =
    String(req.query.q ?? "");

  const data =
    await searchService.globalSearch(q);

  res.json({
    success: true,
    data,
  });

});