import { AppError } from "../utils/AppError.js";
import { prisma } from "../lib/prisma.js";
import * as optionRepository from "../repositories/option.repository.js";
export const createOption = async (data) => {
    const question = await prisma.question.findUnique({
        where: {
            id: data.questionId,
        },
    });
    if (!question) {
        throw new AppError("Savol topilmadi.", 404);
    }
    if (data.isCorrect) {
        await optionRepository.clearCorrectOption(data.questionId);
    }
    return optionRepository.createOption(data);
};
export const getOption = async (id) => {
    const option = await optionRepository.findOptionById(id);
    if (!option) {
        throw new AppError("Variant topilmadi.", 404);
    }
    return option;
};
export const getOptionsByQuestion = async (questionId) => {
    return optionRepository.findOptionsByQuestion(questionId);
};
export const updateOption = async (id, data) => {
    const option = await optionRepository.findOptionById(id);
    if (!option) {
        throw new AppError("Variant topilmadi.", 404);
    }
    if (data.isCorrect) {
        await optionRepository.clearCorrectOption(option.questionId);
    }
    return optionRepository.updateOption(id, data);
};
export const deleteOption = async (id) => {
    const option = await optionRepository.findOptionById(id);
    if (!option) {
        throw new AppError("Variant topilmadi.", 404);
    }
    await optionRepository.deleteOption(id);
};
