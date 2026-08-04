import { asyncHandler } from "../utils/asyncHandler.js";
import * as certificateService from "../services/certificate.service.js";
export const myCertificatesController = asyncHandler(async (req, res) => {
    const data = await certificateService.getMyCertificates(req.user.userId);
    res.json({
        success: true,
        data,
    });
});
export const verifyCertificateController = asyncHandler(async (req, res) => {
    const data = await certificateService.verifyCertificate(req.params.certificateNo);
    res.json({
        success: true,
        data,
    });
});
