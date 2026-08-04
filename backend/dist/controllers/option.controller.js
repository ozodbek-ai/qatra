import { asyncHandler } from "../utils/asyncHandler.js";
import * as optionService from "../services/option.service.js";
import { createOptionSchema, updateOptionSchema, } from "../validators/option.validator.js";
export const createOptionController = asyncHandler(async (req, res) => {
    const data = createOptionSchema.parse(req.body);
    const option = await optionService.createOption(data);
    res.status(201).json({
        success: true,
        message: "Variant yaratildi.",
        data: option,
    });
});
export const getOptionController = asyncHandler(async (req, res) => {
    const option = await optionService.getOption(req.params.id);
    res.json({
        success: true,
        data: option,
    });
});
export const getOptionsByQuestionController = asyncHandler(async (req, res) => {
    const options = await optionService.getOptionsByQuestion(req.params.questionId);
    res.json({
        success: true,
        data: options,
    });
});
export const updateOptionController = asyncHandler(async (req, res) => {
    const data = updateOptionSchema.parse(req.body);
    const option = await optionService.updateOption(req.params.id, data);
    res.json({
        success: true,
        message: "Variant yangilandi.",
        data: option,
    });
});
export const deleteOptionController = asyncHandler(async (req, res) => {
    await optionService.deleteOption(req.params.id);
    res.json({
        success: true,
        message: "Variant o'chirildi.",
    });
});
