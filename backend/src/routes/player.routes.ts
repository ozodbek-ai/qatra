import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { coursePlayerController } from "../controllers/player.controller.js";


const router = Router();


router.get(
  "/courses/:id/player",
  authMiddleware,
  coursePlayerController
);


export default router;