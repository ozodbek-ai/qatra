import { asyncHandler } from "../utils/asyncHandler.js";
import * as questionService from "../services/question.service.js";
import { createQuestionSchema } from "../validators/question.validator.js";
import { updateQuestionSchema } from "../validators/question.validator.js";
export const createQuestionController = asyncHandler(async (req, res) => {
    const data = createQuestionSchema.parse(req.body);
    const question = await questionService.createQuestion(data);
    res.status(201).json({
        success: true,
        message: "Savol muvaffaqiyatli yaratildi.",
        data: question,
    });
});
export const getQuestionController = asyncHandler(async (req, res) => {
    const question = await questionService.getQuestion(req.params.id);
    res.json({
        success: true,
        data: question,
    });
});
export const getQuestionsByQuizController = asyncHandler(async (req, res) => {
    const questions = await questionService.getQuestionsByQuiz(req.params.quizId);
    res.json({
        success: true,
        data: questions,
    });
});
export const updateQuestionController = asyncHandler(async (req, res) => {
    const data = updateQuestionSchema.parse(req.body);
    const question = await questionService.updateQuestion(req.params.id, data);
    res.json({
        success: true,
        message: "Savol yangilandi.",
        data: question,
    });
});
export const deleteQuestionController = asyncHandler(async (req, res) => {
    await questionService.deleteQuestion(req.params.id);
    res.json({
        success: true,
        message: "Savol o'chirildi.",
    });
});
