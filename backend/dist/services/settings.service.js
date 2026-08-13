import * as settingsRepository from "../repositories/settings.repository.js";
const DEFAULT_SETTINGS = {
    platformName: "Qatra",
    description: "Learning Management System",
    logoUrl: null,
    supportEmail: null,
    defaultQuizPassPercentage: 70,
};
export const getSettings = async () => {
    let settings = await settingsRepository.getSettings();
    if (!settings) {
        settings =
            await settingsRepository.createSettings(DEFAULT_SETTINGS);
    }
    return settings;
};
export const updateSettings = async (data) => {
    const settings = await settingsRepository.getSettings();
    if (!settings) {
        return settingsRepository.createSettings(data);
    }
    return settingsRepository.updateSettings(settings.id, data);
};
