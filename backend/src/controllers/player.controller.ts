import { asyncHandler } from "../utils/asyncHandler.js";
import * as playerService from "../services/player.service.js";


export const coursePlayerController =
asyncHandler(async (req, res) => {

  const data =
    await playerService.getCoursePlayer(
      req.user!.userId,
      req.params.id as string
    );


  res.json({
    success: true,
    data,
  });

});