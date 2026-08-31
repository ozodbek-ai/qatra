import { Router } from "express";

import {
  acceptChallenge,
  createChallenge,
  declineChallenge,
  deleteChallenge,
  getChallengeProgress,
  getMyChallenges,
} from "../controllers/challenge.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";


const router = Router();


/* =========================================
   AUTHENTICATION
========================================= */

router.use(authMiddleware);


/* =========================================
   GET MY CHALLENGES

   GET /api/v1/challenges
========================================= */

router.get(
  "/",
  getMyChallenges
);


/* =========================================
   CREATE CHALLENGE

   POST /api/v1/challenges
========================================= */

router.post(
  "/",
  createChallenge
);


/* =========================================
   GET CHALLENGE PROGRESS

   GET /api/v1/challenges/:challengeId/progress
========================================= */

router.get(
  "/:challengeId/progress",
  getChallengeProgress
);


/* =========================================
   ACCEPT CHALLENGE

   PATCH /api/v1/challenges/:challengeId/accept
========================================= */

router.patch(
  "/:challengeId/accept",
  acceptChallenge
);


/* =========================================
   DECLINE CHALLENGE

   PATCH /api/v1/challenges/:challengeId/decline
========================================= */

router.patch(
  "/:challengeId/decline",
  declineChallenge
);


/* =========================================
   DELETE CHALLENGE

   DELETE /api/v1/challenges/:challengeId
========================================= */

router.delete(
  "/:challengeId",
  deleteChallenge
);


export default router;