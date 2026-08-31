import { asyncHandler } from "../utils/asyncHandler.js";
import * as certificateService from "../services/certificate.service.js";

export const myCertificatesController =
asyncHandler(async (req, res) => {

  const data =
    await certificateService.getMyCertificates(
      req.user!.userId
    );

  res.json({

    success: true,

    data,

  });

});

export const verifyCertificateController =
asyncHandler(async (req, res) => {

  const data =
    await certificateService.verifyCertificate(
      req.params.certificateNo as string
    );

  res.json({

    success: true,

    data,

  });

});

export const certificatePdfController =
  asyncHandler(async (req, res) => {
    const certificateId =
      req.params.certificateId as string;

    const {
      certificate,
      pdfBuffer,
    } =
      await certificateService.generateCertificatePdf(
        req.user!.userId,
        certificateId
      );

    const safeFileName =
      `Qatra-Certificate-${certificate.certificateNo}.pdf`
        .replace(/[^a-zA-Z0-9._-]/g, "_");

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFileName}"`
    );

    res.setHeader(
      "Content-Length",
      pdfBuffer.length
    );

    res.send(pdfBuffer);
  });

  export const adminCertificateStatisticsController =
  asyncHandler(async (req, res) => {
    const data =
      await certificateService
        .getAdminCertificateStatistics();

    res.json({
      success: true,
      data,
    });
  });