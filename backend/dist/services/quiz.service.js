import * as quizRepository from "../repositories/quiz.repository.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
export const createQuiz = async (data) => {
    const lesson = await prisma.lesson.findUnique({
        where: {
            id: data.lessonId,
        },
    });
    if (!lesson) {
        throw new AppError("Dars topilmadi.", 404);
    }
    const existingQuiz = await quizRepository.findQuizByLesson(data.lessonId);
    if (existingQuiz) {
        throw new AppError("Bu dars uchun quiz allaqachon mavjud.", 400);
    }
    return quizRepository.createQuiz(data);
};
export const submitQuiz = async (userId, quizId, data) => {
    const quiz = await quizRepository.findQuizWithQuestions(quizId);
    if (!quiz) {
        throw new AppError("Quiz topilmadi.", 404);
    }
    const existingAttempt = await quizRepository.findQuizAttempt(userId, quizId);
    if (existingAttempt) {
        throw new AppError("Siz bu quizni allaqachon topshirgansiz.", 400);
    }
    let score = 0;
    for (const answer of data.answers) {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        if (!question) {
            continue;
        }
        const correctOption = question.options.find((option) => option.isCorrect);
        if (correctOption &&
            correctOption.id === answer.optionId) {
            score++;
        }
    }
    const total = quiz.questions.length;
    const percentage = total === 0
        ? 0
        : Math.round((score / total) * 100);
    const passed = percentage >= quiz.passPercentage;
    await quizRepository.createQuizAttempt(userId, quizId, score, total, percentage, passed);
    return {
        score,
        total,
        percentage,
        passed,
    };
};
export const getQuizResult = async (userId, quizId) => {
    const attempt = await quizRepository.findQuizAttempt(userId, quizId);
    if (!attempt) {
        throw new AppError("Quiz hali topshirilmagan.", 404);
    }
    return {
        score: attempt.score,
        total: attempt.total,
        percentage: attempt.percentage,
        passed: attempt.passed,
        submittedAt: attempt.createdAt,
    };
};
