import { asyncHandler } from "../utils/asyncHandler.js";
import * as quizService from "../services/quiz.service.js";
import { createQuizSchema } from "../validators/quiz.validator.js";

export const createQuizController =
  asyncHandler(async (req, res) => {

    const data =
      createQuizSchema.parse(req.body);

    const quiz =
      await quizService.createQuiz(data);

    res.status(201).json({
      success: true,
      message:
        "Quiz muvaffaqiyatli yaratildi.",
      data: quiz,
    });

  });
  import { submitQuizSchema } from "../validators/quiz-submit.validator.js";

export const submitQuizController =
  asyncHandler(async (req, res) => {

    const data =
      submitQuizSchema.parse(req.body);

    const result =
      await quizService.submitQuiz(
        req.user!.userId,
        req.params.quizId as string,
        data
      );

    res.json({
      success: true,
      data: result,
    });

  });
  export const getQuizResultController =
  asyncHandler(async (req, res) => {

    const result =
      await quizService.getQuizResult(
        req.user!.userId,
        req.params.quizId as string
      );

    res.json({
      success: true,
      data: result,
    });

  });