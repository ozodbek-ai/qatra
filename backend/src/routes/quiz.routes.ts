import { Router } from "express";

import {
  createQuizController,
  submitQuizController,
  getQuizResultController,
  getQuizController,
  getAllQuizzesController,
  getAdminQuizController,
} from "../controllers/quiz.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Create Quiz
|--------------------------------------------------------------------------
|
| ADMIN + SUPER_ADMIN quiz yaratishi mumkin.
|
*/

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  createQuizController
);

/*
|--------------------------------------------------------------------------
| Submit Quiz
|--------------------------------------------------------------------------
|
| Faqat STUDENT quiz topshiradi.
|
*/

router.post(
  "/:quizId/submit",
  authMiddleware,
  authorize("STUDENT"),
  submitQuizController
);

/*
|--------------------------------------------------------------------------
| Quiz Result
|--------------------------------------------------------------------------
|
| STUDENT o'z natijasini ko'radi.
| ADMIN + SUPER_ADMIN admin tomonidan
| quiz natijasini ko'rishi mumkin.
|
*/

router.get(
  "/:quizId/result",
  authMiddleware,
  authorize(
    "STUDENT",
    "ADMIN",
    "SUPER_ADMIN"
  ),
  getQuizResultController
);

/*
|--------------------------------------------------------------------------
| Admin Quiz List
|--------------------------------------------------------------------------
|
| ADMIN + SUPER_ADMIN barcha quizlarni
| boshqarish ro'yxatida ko'rishi mumkin.
|
*/

router.get(
  "/admin",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAllQuizzesController
);

/*
|--------------------------------------------------------------------------
| Admin Quiz Details
|--------------------------------------------------------------------------
|
| ADMIN + SUPER_ADMIN quizni ko'rishi
| va boshqarishi mumkin.
|
*/

router.get(
  "/admin/:quizId",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAdminQuizController
);

/*
|--------------------------------------------------------------------------
| Quiz Details
|--------------------------------------------------------------------------
|
| STUDENT + ADMIN + SUPER_ADMIN
|
*/

router.get(
  "/:quizId",
  authMiddleware,
  authorize(
    "STUDENT",
    "ADMIN",
    "SUPER_ADMIN"
  ),
  getQuizController
);

export default router;